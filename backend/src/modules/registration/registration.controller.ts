import type { Request, Response, RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as regService from './registration.service.js';
import * as credService from './credentials.service.js';
import {
    registerForTournamentSchema,
    cancelRegistrationSchema,
    matchIdParamSchema
} from './registration.validation.js';

/* ── Register ──────────────────────────────────────────────── */

export const register:RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { params, body } = registerForTournamentSchema.parse({
        params: req.params,
        body: req.body
    });

    const result = await regService.registerForTournament(
        req.userId!,
        params.tournamentId,
        body?.teamId
    );

    res.status(201).json({
        success: true,
        message: `Registered! You are in lobby ${result.lobbyCode}, slot #${result.slotNumber}`,
        data: result
    });
});

/* ── My Registrations ──────────────────────────────────────── */

export const myRegistrations:RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const regs = await regService.getMyRegistrations(req.userId!);
    res.json({ success: true, data: regs });
});

/* ── Cancel ────────────────────────────────────────────────── */

export const cancel:RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { params } = cancelRegistrationSchema.parse({ params: req.params });
    const result = await regService.cancelRegistration(req.userId!, params.id);
    res.json({ success: true, ...result });
});

/* ── Match Credentials ─────────────────────────────────────── */

export const getCredentials:RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { params } = matchIdParamSchema.parse({ params: req.params });
    const result = await credService.getMatchCredentials(req.userId!, params.matchId);
    res.json({ success: true, data: result });
});
