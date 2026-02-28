import type { Request, Response, RequestHandler } from 'express';
import { asyncHandler } from '@/utils/asyncHandler.js';
import {
    getAllTournaments,
    createTournament,
    getTournamentById,
    getTournamentStagesWithMatches
} from './tournament.service.js';
import {
    getAllTournamentsSchema,
    createTournamentSchema,
    tournamentIdParamSchema
} from './tournament.validation.js';
import { ApiError } from '@/utils/apiError.js';
import type { z } from 'zod';

function formatZodError(error: z.ZodError): string {
    return error.issues.map((e) => `${String(e.path.join('.'))}: ${e.message}`).join(', ');
}

/* ── GET / — List tournaments (public) ───────────────────────── */

export const getAllTournamentsHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const result = getAllTournamentsSchema.safeParse(req.query);
    if (!result.success) {
        throw new ApiError(400, formatZodError(result.error));
    }

    const data = await getAllTournaments(result.data);

    res.json({
        success: true,
        data: data.tournaments,
        pagination: data.pagination
    });
});

/* ── GET /:id — Single tournament (public) ───────────────────── */

export const getTournamentByIdHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const result = tournamentIdParamSchema.safeParse(req.params);
    if (!result.success) {
        throw new ApiError(400, formatZodError(result.error));
    }

    const tournament = await getTournamentById(result.data.id);

    res.json({
        success: true,
        data: tournament
    });
});

/* ── GET /:id/stages-matches — Stages with nested matches ──── */

export const getStagesMatchesHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const result = tournamentIdParamSchema.safeParse(req.params);
    if (!result.success) {
        throw new ApiError(400, formatZodError(result.error));
    }

    const stages = await getTournamentStagesWithMatches(result.data.id);

    res.json({
        success: true,
        data: stages
    });
});

/* ── POST / — Create tournament + stages + matches (admin only) ── */

export const createTournamentHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const result = createTournamentSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, formatZodError(result.error));
    }

    const tournament = await createTournament(result.data);

    res.status(201).json({
        success: true,
        message: 'Tournament + Stages + Matches created successfully',
        data: tournament
    });
});
