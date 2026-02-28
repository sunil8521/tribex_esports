import mongoose from 'mongoose';
import { ApiError } from '../../utils/apiError.js';
import { AdvancementModel } from './advancement.model.js';
import { MatchResultModel } from '../match-result/matchResult.model.js';
import { MatchModel } from '../match/match.model.js';
import { StageModel } from '../stage/stage.model.js';
import { TournamentModel } from '../tournament/tournament.model.js';
import { RegistrationModel } from '../registration/registration.model.js';

/* ── Helpers ───────────────────────────────────────────────── */

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

/* ═══════════════════════════════════════════════════════════════
   processAdvancement
   ─ After all lobbies in a stage are COMPLETED, determine who
     qualifies for the next stage.
   ═══════════════════════════════════════════════════════════════ */

export async function processAdvancement(stageId: string) {
    const stage = await StageModel.findById(stageId).lean();
    if (!stage) throw new ApiError(404, 'Stage not found');

    // Verify all matches in this stage are COMPLETED
    const incompleteMatches = await MatchModel.countDocuments({
        stageID: stageId,
        state: { $ne: 'COMPLETED' }
    });
    if (incompleteMatches > 0) {
        throw new ApiError(400, `${incompleteMatches} match(es) are not yet completed in this stage`);
    }

    const tournament = await TournamentModel.findById(stage.tournamentID).lean();
    if (!tournament) throw new ApiError(404, 'Tournament not found');

    const isSolo = tournament.mode === 'solo';
    const config = stage.advanceConfig;

    // Clear any previous advancement records for this stage (in case of re-processing)
    await AdvancementModel.deleteMany({
        tournamentID: stage.tournamentID,
        'source.stageID': stageId
    });

    let advancements: Array<{
        participantID: string;
        matchID?: string;
        rankInMatch?: number;
        globalRank?: number;
        totalPoints: number;
        totalKills: number;
    }> = [];

    if (config.advancementType === 'PER_LOBBY') {
        /* ── Per-Lobby: Top N from each lobby ────────────────────── */
        const topN = config.topNFromEachLobby ?? 2;
        const lobbies = await MatchModel.find({ stageID: stageId }).lean();

        for (const lobby of lobbies) {
            const results = await MatchResultModel.find({ matchID: lobby._id })
                .sort({ 'score.total': -1 })
                .limit(topN)
                .lean();

            results.forEach((r, idx) => {
                const pid = isSolo
                    ? r.userID?.toString()
                    : r.teamID?.toString();
                if (!pid) return;

                advancements.push({
                    participantID: pid,
                    matchID: lobby._id.toString(),
                    rankInMatch: idx + 1,
                    totalPoints: r.score.total,
                    totalKills: r.stats.kills
                });
            });
        }
    } else {
        /* ── Global: Aggregate across all lobbies ─────────────────── */
        const participantIdField = isSolo ? '$userID' : '$teamID';

        const leaderboard = await MatchResultModel.aggregate([
            { $match: { stageID: stage._id } },
            {
                $group: {
                    _id: participantIdField,
                    totalPoints: { $sum: '$score.total' },
                    totalKills: { $sum: '$stats.kills' },
                    bestPlacement: { $min: '$stats.placement' }
                }
            },
            { $sort: { totalPoints: -1, totalKills: -1 } }
        ]);

        const top = leaderboard.slice(0, config.totalAdvancing);
        top.forEach((entry, idx) => {
            advancements.push({
                participantID: entry._id.toString(),
                globalRank: idx + 1,
                totalPoints: entry.totalPoints,
                totalKills: entry.totalKills
            });
        });
    }

    // Apply min score threshold if configured
    if (config.minScoreThreshold && config.minScoreThreshold > 0) {
        advancements = advancements.filter(
            (a) => a.totalPoints >= config.minScoreThreshold!
        );
    }

    // Cap at totalAdvancing
    advancements = advancements.slice(0, config.totalAdvancing);

    // Create Advancement records
    const docs = await AdvancementModel.insertMany(
        advancements.map((a) => ({
            tournamentID: stage.tournamentID,
            participantID: a.participantID,
            participantType: isSolo ? 'solo' : 'team',
            source: {
                stageID: stageId,
                ...(a.matchID ? { matchID: a.matchID } : {}),
                ...(a.rankInMatch ? { rankInMatch: a.rankInMatch } : {}),
                ...(a.globalRank ? { globalRank: a.globalRank } : {})
            },
            target: {},
            stats: {
                totalPoints: a.totalPoints,
                totalKills: a.totalKills
            },
            status: 'QUALIFIED'
        }))
    );

    // Update stage status
    await StageModel.updateOne(
        { _id: stageId },
        { $set: { status: 'COMPLETE' } }
    );

    return {
        qualified: docs.length,
        advancements: docs
    };
}

/* ═══════════════════════════════════════════════════════════════
   seedNextStage
   ─ Place qualified teams into next stage lobbies.
     Creates matches + registrations for the target stage.
   ═══════════════════════════════════════════════════════════════ */

export async function seedNextStage(
    tournamentId: string,
    sourceStageId: string,
    targetStageId: string
) {
    const tournament = await TournamentModel.findById(tournamentId).lean();
    if (!tournament) throw new ApiError(404, 'Tournament not found');

    const targetStage = await StageModel.findById(targetStageId).lean();
    if (!targetStage) throw new ApiError(404, 'Target stage not found');

    // Get qualified advancements from source stage
    const qualified = await AdvancementModel.find({
        tournamentID: tournamentId,
        'source.stageID': sourceStageId,
        status: 'QUALIFIED'
    }).sort({ 'stats.totalPoints': -1 }).lean();

    if (qualified.length === 0) {
        throw new ApiError(400, 'No qualified participants to seed');
    }

    const isSolo = tournament.mode === 'solo';

    // Determine stage label for lobby codes
    const stageLabel = targetStage.name === 'SEMI_FINAL' ? 'SEMI' : 'FINAL';

    // Chunk into lobbies of 12
    const chunks = chunkArray(qualified, 12);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Determine timeline for new stage matches
        const scheduleField = targetStage.name === 'SEMI_FINAL'
            ? tournament.schedule.semiStart
            : tournament.schedule.finalStart;

        if (!scheduleField) {
            throw new ApiError(400, `Schedule not configured for ${targetStage.name}`);
        }

        const regStart = new Date(scheduleField);
        regStart.setHours(regStart.getHours() - 2);
        const regEnd = new Date(scheduleField);
        regEnd.setMinutes(regEnd.getMinutes() - 30);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]!;
            const lobbyCode = `${stageLabel}-${String(i + 1).padStart(2, '0')}`;

            // Create match for this lobby
            const [match] = await MatchModel.create(
                [{
                    tournamentID: tournamentId,
                    stageID: targetStageId,
                    lobbyCode,
                    maxSlots: 12,
                    participants: [],
                    state: 'SCHEDULED',
                    timeline: {
                        regStart,
                        regEnd,
                        matchStart: scheduleField
                    }
                }],
                { session }
            ) as [InstanceType<typeof MatchModel>];

            // Create registrations and add participants
            for (let j = 0; j < chunk.length; j++) {
                const adv = chunk[j]!;
                const slotNumber = j + 1;

                const regData: Record<string, unknown> = {
                    tournamentID: tournamentId,
                    matchID: match._id,
                    stageID: targetStageId,
                    participantType: isSolo ? 'solo' : 'team',
                    status: 'CONFIRMED',
                    assignedSlot: slotNumber,
                    payment: { amount: 0, status: 'completed' },
                    isAutoSeeded: true
                };
                if (isSolo) regData.userID = adv.participantID;
                else regData.teamID = adv.participantID;

                const [reg] = await RegistrationModel.create(
                    [regData],
                    { session }
                ) as [InstanceType<typeof RegistrationModel>];

                // Add to match participants
                match.participants.push({
                    slotNumber,
                    registrationID: reg._id,
                    ...(isSolo
                        ? { userID: adv.participantID as any }
                        : { teamID: adv.participantID as any }),
                    checkIn: { status: false }
                });

                // Update advancement record with target
                await AdvancementModel.updateOne(
                    { _id: adv._id },
                    {
                        $set: {
                            'target.stageID': targetStageId,
                            'target.matchID': match._id,
                            'target.slotNumber': slotNumber,
                            status: 'SEEDED'
                        }
                    },
                    { session }
                );
            }

            await match.save({ session });
        }

        // Update target stage status
        await StageModel.updateOne(
            { _id: targetStageId },
            { $set: { status: 'ALLOCATING' } },
            { session }
        );

        await session.commitTransaction();

        return {
            seeded: qualified.length,
            lobbies: chunks.length,
            stage: targetStage.name
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}

/* ═══════════════════════════════════════════════════════════════
   getAdvancements — All advancement records for a tournament
   ═══════════════════════════════════════════════════════════════ */

export async function getAdvancements(tournamentId: string) {
    return AdvancementModel.find({ tournamentID: tournamentId })
        .sort({ 'stats.totalPoints': -1 })
        .lean();
}
