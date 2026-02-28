import type { RequestHandler } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './advancement.service.js';
import { z } from 'zod';

/* ── Validation ────────────────────────────────────────────── */

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

const processSchema = z.object({
    params: z.object({ stageId: objectId })
});

const seedSchema = z.object({
    params: z.object({
        stageId: objectId,
        targetStageId: objectId
    })
});

const tournamentIdSchema = z.object({
    params: z.object({ tournamentId: objectId })
});

/* ── Process Advancement (Admin) ───────────────────────────── */

export const processAdvancement: RequestHandler = asyncHandler(async (req, res) => {
    const { params } = processSchema.parse({ params: req.params });
    const result = await service.processAdvancement(params.stageId);
    res.json({ success: true, data: result });
});

/* ── Seed Next Stage (Admin) ───────────────────────────────── */

export const seedNextStage: RequestHandler = asyncHandler(async (req, res) => {
    const { params } = seedSchema.parse({ params: req.params });
    // tournamentId comes from query or body
    const tournamentId = z.string().regex(/^[a-f\d]{24}$/i).parse(
        req.query.tournamentId || req.body?.tournamentId
    );

    const result = await service.seedNextStage(
        tournamentId,
        params.stageId,
        params.targetStageId
    );
    res.json({ success: true, data: result });
});

/* ── Get Advancements (Public) ─────────────────────────────── */

export const getAdvancements: RequestHandler = asyncHandler(async (req, res) => {
    const { params } = tournamentIdSchema.parse({ params: req.params });
    const data = await service.getAdvancements(params.tournamentId);
    res.json({ success: true, data });
});
