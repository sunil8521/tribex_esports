import { Router, type Router as ExpressRouter } from 'express';
import { googleLoginHandler, loginHandler, logoutHandler, signupHandler, verifyEmailHandler, meHandler } from '@/modules/auth/auth.controller.js';
import { requireAuth } from '@/middlewares/auth.middleware.js';

export const authRouter: ExpressRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/login', loginHandler);

// Current session user
authRouter.get('/me', requireAuth, meHandler);

// Google Sign-In: frontend sends Google ID token
authRouter.post('/google', googleLoginHandler);

// No explicit refresh route: refresh happens inside `requireAuth` middleware when access token expires

authRouter.post('/logout', logoutHandler);
authRouter.get('/verify-email', verifyEmailHandler);
