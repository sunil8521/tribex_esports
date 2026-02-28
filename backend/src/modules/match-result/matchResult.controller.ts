import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './matchResult.service.js';
import {
    submitResultsSchema,
    matchIdParamSchema,
    stageIdParamSchema
} from './matchResult.validation.js';

/* ── Submit Results (Admin) ────────────────────────────────── */

export const submitResults: RequestHandler = asyncHandler(async (req, res) => {
    const { params, body } = submitResultsSchema.parse({
        params: req.params,
        body: req.body
    });

    const result = await service.submitResults(params.matchId, body.results as service.ResultEntry[]);
    res.status(201).json({ success: true, data: result });
});

/* ── Finalize Match (Admin) ────────────────────────────────── */

export const finalizeMatch: RequestHandler = asyncHandler(async (req, res) => {
    const { params } = matchIdParamSchema.parse({ params: req.params });
    const result = await service.finalizeMatch(params.matchId);
    res.json({ success: true, ...result });
});

/* ── Get Match Results (Public) ────────────────────────────── */

export const getMatchResults: RequestHandler = asyncHandler(async (req, res) => {
    const { params } = matchIdParamSchema.parse({ params: req.params });
    const results = await service.getMatchResults(params.matchId);
    res.json({ success: true, data: results });
});

/* ── Get Stage Leaderboard (Public) ────────────────────────── */

export const getStageLeaderboard: RequestHandler = asyncHandler(async (req, res) => {
    const { params } = stageIdParamSchema.parse({ params: req.params });
    const leaderboard = await service.getStageLeaderboard(params.stageId);
    res.json({ success: true, data: leaderboard });
});
