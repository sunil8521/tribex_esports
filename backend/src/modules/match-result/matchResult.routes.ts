import { Router, type RequestHandler } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireAdmin } from '../../middlewares/requireAdmin.js';
import * as ctrl from './matchResult.controller.js';

export const matchResultRouter: Router = Router();

// Admin: submit results for a match
matchResultRouter.post(
    '/:matchId/submit',
    requireAuth as RequestHandler, requireAdmin as RequestHandler,
    ctrl.submitResults
);

// Admin: finalize match (lock results)
matchResultRouter.post(
    '/:matchId/finalize',
    requireAuth as RequestHandler, requireAdmin as RequestHandler,
    ctrl.finalizeMatch
);

// Public: get results for a specific match
matchResultRouter.get('/matches/:matchId', ctrl.getMatchResults);

// Public: get aggregated leaderboard for a stage
matchResultRouter.get('/stages/:stageId/leaderboard', ctrl.getStageLeaderboard);
