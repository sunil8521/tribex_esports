import { Router, type Router as ExpressRouter } from 'express';
import {
    getAllTournamentsHandler,
    getTournamentByIdHandler,
    getStagesMatchesHandler,
    createTournamentHandler
} from './tournament.controller.js';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { requireAdmin } from '@/middlewares/requireAdmin.js';

export const tournamentRouter: ExpressRouter = Router();

// Public: list tournaments with filters + pagination
tournamentRouter.get('/', getAllTournamentsHandler);

// Public: single tournament details
tournamentRouter.get('/:id', getTournamentByIdHandler);

// Public: stages with nested matches for a tournament
tournamentRouter.get('/:id/stages-matches', getStagesMatchesHandler);

// Admin only: create a new tournament (+ stages + matches)
tournamentRouter.post('/', requireAuth, requireAdmin, createTournamentHandler);
