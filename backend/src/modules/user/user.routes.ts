import { Router, type Router as ExpressRouter } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import {
    updateBasicInfoHandler,
    updatePasswordHandler,
    updateAvatarHandler,
} from './user.controller.js';

export const userRouter: ExpressRouter = Router();

// All user routes require authentication
userRouter.use(requireAuth);

userRouter.patch('/profile', updateBasicInfoHandler);
userRouter.patch('/password', updatePasswordHandler);
userRouter.patch('/avatar', updateAvatarHandler);
