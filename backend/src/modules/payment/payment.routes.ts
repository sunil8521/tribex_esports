import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import * as ctrl from './payment.controller.js';

export const paymentRouter: Router = Router();

// User: initiate payment for a registration
paymentRouter.post('/initiate', requireAuth, ctrl.initiatePayment);

// User: verify payment after checkout completes
paymentRouter.post('/verify', requireAuth, ctrl.verifyPayment);

// Cashfree: webhook callback (no auth — verified by signature)
paymentRouter.post('/webhook', ctrl.webhook);

// Cashfree: redirect callback after checkout
paymentRouter.get('/callback', ctrl.paymentCallback);
