import { Router, type RequestHandler } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireAdmin } from '../../middlewares/requireAdmin.js';
import * as ctrl from './advancement.controller.js';

export const advancementRouter: Router = Router();

// Admin: process advancement (determine qualifiers after stage completes)
advancementRouter.post(
    '/stages/:stageId/process',
    requireAuth as RequestHandler, requireAdmin as RequestHandler,
    ctrl.processAdvancement
);

// Admin: seed next stage (create lobbies + assign qualified teams)
advancementRouter.post(
    '/stages/:stageId/seed/:targetStageId',
    requireAuth as RequestHandler, requireAdmin as RequestHandler,
    ctrl.seedNextStage
);

// Public: get all advancements for a tournament
advancementRouter.get(
    '/tournaments/:tournamentId',
    ctrl.getAdvancements
);
