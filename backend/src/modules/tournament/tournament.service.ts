import mongoose from 'mongoose';
import { TournamentModel, type Game, type TournamentMode, type TournamentStatus } from './tournament.model.js';
import { StageModel } from '../stage/stage.model.js';
import { MatchModel } from '../match/match.model.js';
import { ApiError } from '@/utils/apiError.js';
import type { CreateTournamentInput } from './tournament.validation.js';

/* ── Helpers ─────────────────────────────────────────────────── */

/** Parses a comma-separated query string into an array or returns a single value. */
function parseQueryField<T extends string>(value: string): T | { $in: T[] } {
    const parts = value.split(',').map(s => s.trim()) as T[];
    return parts.length > 1 ? { $in: parts } : parts[0]!;
}

/** Generate lobby code from stage name + match number. E.g. Q-01, SF-02, F-01 */
function generateLobbyCode(stageName: string, matchNumber: number): string {
    const prefix =
        stageName === 'QUALIFIER' ? 'Q' :
            stageName === 'SEMI_FINAL' ? 'SF' :
                'F';
    return `${prefix}-${String(matchNumber).padStart(2, '0')}`;
}

/* ── Types ───────────────────────────────────────────────────── */

export interface GetAllTournamentsQuery {
    page?: number | undefined;
    limit?: number | undefined;
    game?: string | undefined;
    status?: string | undefined;
    mode?: string | undefined;
    search?: string | undefined;
    isVisible?: string | undefined;
}

/* ── GET — List tournaments ──────────────────────────────────── */

export async function getAllTournaments(query: GetAllTournamentsQuery) {
    const page = Math.max(1, query.page ?? 1);

    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};

    // Default: only show visible tournaments (public API)
    filter.isVisible = true;

    // Admin override: can pass isVisible=false to see hidden ones
    if (query.isVisible === 'false') filter.isVisible = false;
    if (query.isVisible === 'all') delete filter.isVisible;

    // Text search on title
    if (query.search) {
        filter.title = { $regex: new RegExp(query.search.trim(), 'i') };
    }

    // Game filter (supports comma-separated: ?game=BGMI,FreeFire)
    if (query.game) {
        filter.game = parseQueryField<Game>(query.game);
    }

    // Status filter (supports comma-separated: ?status=REG_OPEN,QUAL_RUNNING)
    if (query.status) {
        filter.status = parseQueryField<TournamentStatus>(query.status);
    }

    // Mode filter (supports comma-separated: ?mode=solo,squad)
    if (query.mode) {
        filter.mode = parseQueryField<TournamentMode>(query.mode);
    }

    // Run query + count in parallel
    const [tournaments, total] = await Promise.all([
        TournamentModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select({
                _id: 1,
                title: 1,
                description: 1,
                game: 1,
                mode: 1,
                eventCode: 1,
                status: 1,
                entryFee: 1,
                prizePool: 1,
                maxParticipants: 1,
                registeredCount: 1,
                thumbnail: 1,
                schedule: 1,
                isVisible: 1
            })
            .lean(),

        TournamentModel.countDocuments(filter)
    ]);

    return {
        tournaments,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: skip + tournaments.length < total,
            hasPrevPage: page > 1
        }
    };
}

/* ── POST — Create tournament + stages + matches (admin, transactional) ── */

export async function createTournament(data: CreateTournamentInput) {
    const { stages, ...tournamentData } = data;

    // Strip undefined optional schedule fields (exactOptionalPropertyTypes compat)
    const schedule: Record<string, Date> = {
        regOpens: tournamentData.schedule.regOpens,
        regCloses: tournamentData.schedule.regCloses,
        qualifierStart: tournamentData.schedule.qualifierStart,
    };
    if (tournamentData.schedule.semiStart) schedule.semiStart = tournamentData.schedule.semiStart;
    if (tournamentData.schedule.finalStart) schedule.finalStart = tournamentData.schedule.finalStart;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1️⃣ Create Tournament
        const tournaments = await TournamentModel.create(
            [{
                ...tournamentData,
                schedule,
                thumbnail: {
                    url: 'https://dummyimage.com/600x400/000/fff',
                    public_id: 'placeholder'
                },
                status: 'CREATED',
                registeredCount: 0
            }],
            { session }
        );
        const tournament = tournaments[0]!;
        const tournamentID = tournament._id;

        // 2️⃣ Create Stages + Matches
        for (const stageData of stages) {
            // Strip undefined optional fields (exactOptionalPropertyTypes compat)
            const advanceConfig: Record<string, string | number> = {
                advancementType: stageData.advanceConfig.advancementType,
                totalAdvancing: stageData.advanceConfig.totalAdvancing,
            };
            if (stageData.advanceConfig.topNFromEachLobby != null) {
                advanceConfig.topNFromEachLobby = stageData.advanceConfig.topNFromEachLobby;
            }
            if (stageData.advanceConfig.minScoreThreshold != null) {
                advanceConfig.minScoreThreshold = stageData.advanceConfig.minScoreThreshold;
            }

            const createdStages = await StageModel.create(
                [{
                    tournamentID,
                    name: stageData.name,
                    sequence: stageData.sequence,
                    advanceConfig,
                    status: 'PENDING'
                }],
                { session }
            );
            const stageID = createdStages[0]!._id;

            // 3️⃣ Generate match documents for this stage
            const matchDocs = [];
            for (let i = 1; i <= stageData.matchCount; i++) {
                matchDocs.push({
                    tournamentID,
                    stageID,
                    lobbyCode: generateLobbyCode(stageData.name, i),
                    maxSlots: 12,
                    state: 'SCHEDULED',
                    participants: [],
                    timeline: {
                        regStart: schedule.regOpens,
                        regEnd: schedule.regCloses,
                        matchStart: schedule.qualifierStart
                    }
                });
            }

            await MatchModel.insertMany(matchDocs, { session });
        }

        await session.commitTransaction();

        return tournament.toObject();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

/* ── GET /:id — Single tournament ────────────────────────────── */

export async function getTournamentById(id: string) {
    const tournament = await TournamentModel.findById(id).lean();
    if (!tournament) {
        throw new ApiError(404, 'Tournament not found');
    }
    return tournament;
}

/* ── GET /:id/stages-matches — Stages with nested matches ───── */

export async function getTournamentStagesWithMatches(tournamentId: string) {
    // Verify tournament exists
    const exists = await TournamentModel.exists({ _id: tournamentId });
    if (!exists) {
        throw new ApiError(404, 'Tournament not found');
    }

    // Fetch stages ordered by sequence
    const stages = await StageModel.find({ tournamentID: tournamentId })
        .sort({ sequence: 1 })
        .lean();

    // Fetch all matches for this tournament in one query
    const allMatches = await MatchModel.find({ tournamentID: tournamentId })
        .sort({ lobbyCode: 1 })
        .lean();

    // Group matches by stageID
    const matchesByStage = new Map<string, typeof allMatches>();
    for (const match of allMatches) {
        const key = match.stageID.toString();
        const arr = matchesByStage.get(key) ?? [];
        arr.push(match);
        matchesByStage.set(key, arr);
    }

    // Assemble response
    return stages.map(stage => ({
        ...stage,
        matches: (matchesByStage.get(stage._id.toString()) ?? []).map(m => ({
            ...m,
            filledSlots: m.participants.length,
        })),
    }));
}
