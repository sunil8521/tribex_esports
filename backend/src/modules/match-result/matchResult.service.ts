import { ApiError } from '../../utils/apiError.js';
import { MatchResultModel } from './matchResult.model.js';
import { MatchModel } from '../match/match.model.js';
import { StageModel } from '../stage/stage.model.js';

/* ── BGMI placement points map (1st–12th) ──────────────────── */

const PLACEMENT_POINTS: Record<number, number> = {
    1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 4,
    7: 2, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1
};

function calcPlacementPoints(placement: number): number {
    return PLACEMENT_POINTS[placement] ?? 0;
}

/* ═══════════════════════════════════════════════════════════════
   submitResults — Admin submits all results for a match
   ═══════════════════════════════════════════════════════════════ */

export interface ResultEntry {
    userID?: string;
    teamID?: string;
    placement: number;
    kills: number;
    damageDealt?: number;
    survivalTime?: number;
    assists?: number;
    bonus?: number;
}

export async function submitResults(matchId: string, results: ResultEntry[]) {
    const match = await MatchModel.findById(matchId).lean();
    if (!match) throw new ApiError(404, 'Match not found');

    // Match must be in a completable state
    if (!['LIVE', 'RESULTS_PENDING', 'COMPLETED'].includes(match.state)) {
        throw new ApiError(400, `Cannot submit results: match state is ${match.state}`);
    }

    const docs = results.map((r) => {
        const placementPoints = calcPlacementPoints(r.placement);
        const killPoints = r.kills;
        const bonus = r.bonus ?? 0;

        return {
            matchID: matchId,
            stageID: match.stageID,
            tournamentID: match.tournamentID,
            ...(r.userID ? { userID: r.userID } : {}),
            ...(r.teamID ? { teamID: r.teamID } : {}),
            stats: {
                placement: r.placement,
                kills: r.kills,
                damageDealt: r.damageDealt,
                survivalTime: r.survivalTime,
                assists: r.assists
            },
            score: {
                placementPoints,
                killPoints,
                bonus,
                total: placementPoints + killPoints + bonus
            },
            state: 'SUBMITTED' as const
        };
    });

    // Upsert: if results already exist for this match, replace them
    await MatchResultModel.deleteMany({ matchID: matchId });
    const inserted = await MatchResultModel.insertMany(docs);

    // Update match state to RESULTS_PENDING (or COMPLETED if admin wants)
    await MatchModel.updateOne(
        { _id: matchId },
        { $set: { state: 'RESULTS_PENDING' } }
    );

    return { count: inserted.length, results: inserted };
}

/* ═══════════════════════════════════════════════════════════════
   finalizeMatch — Mark results as FINALIZED and match COMPLETED
   ═══════════════════════════════════════════════════════════════ */

export async function finalizeMatch(matchId: string) {
    const match = await MatchModel.findById(matchId);
    if (!match) throw new ApiError(404, 'Match not found');

    if (match.state !== 'RESULTS_PENDING') {
        throw new ApiError(400, `Cannot finalize: match state is ${match.state}`);
    }

    await MatchResultModel.updateMany(
        { matchID: matchId, state: 'SUBMITTED' },
        { $set: { state: 'FINALIZED' } }
    );

    match.state = 'COMPLETED';
    await match.save();

    return { message: 'Match finalized' };
}

/* ═══════════════════════════════════════════════════════════════
   getMatchResults — Results for a specific lobby
   ═══════════════════════════════════════════════════════════════ */

export async function getMatchResults(matchId: string) {
    return MatchResultModel.find({ matchID: matchId })
        .populate('userID', 'username userProfileImage')
        .populate('teamID', 'name tag')
        .sort({ 'score.total': -1 })
        .lean();
}

/* ═══════════════════════════════════════════════════════════════
   getStageLeaderboard — Aggregated across all lobbies in stage
   ═══════════════════════════════════════════════════════════════ */

export async function getStageLeaderboard(stageId: string) {
    const stage = await StageModel.findById(stageId).lean();
    if (!stage) throw new ApiError(404, 'Stage not found');

    const leaderboard = await MatchResultModel.aggregate([
        { $match: { stageID: stage._id } },
        {
            $group: {
                _id: {
                    teamID: '$teamID',
                    userID: '$userID'
                },
                matchesPlayed: { $sum: 1 },
                totalPoints: { $sum: '$score.total' },
                totalKills: { $sum: '$stats.kills' },
                bestPlacement: { $min: '$stats.placement' },
                matchScores: {
                    $push: {
                        matchID: '$matchID',
                        placement: '$stats.placement',
                        kills: '$stats.kills',
                        score: '$score.total'
                    }
                }
            }
        },
        { $sort: { totalPoints: -1, totalKills: -1 } },
        {
            $setWindowFields: {
                sortBy: { totalPoints: -1, totalKills: -1 },
                output: {
                    globalRank: { $rank: {} }
                }
            }
        }
    ]);

    return leaderboard;
}
