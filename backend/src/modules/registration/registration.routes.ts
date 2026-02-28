import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import * as ctrl from './registration.controller.js';

export const registrationRouter: Router = Router();

// All registration routes require authentication
registrationRouter.use(requireAuth);

// Register for a tournament (auto-assigns lobby + slot)
registrationRouter.post('/tournaments/:tournamentId/register', ctrl.register);

// Get my registrations across all tournaments
registrationRouter.get('/me', ctrl.myRegistrations);

// Cancel a registration
registrationRouter.delete('/:id/cancel', ctrl.cancel);

// Get room credentials for a specific match
registrationRouter.get('/matches/:matchId/credentials', ctrl.getCredentials);
