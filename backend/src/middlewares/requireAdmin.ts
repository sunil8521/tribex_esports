import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';
import { UserModel } from '../modules/user/user.model.js';

/**
 * Middleware: requireAdmin
 * Must run AFTER requireAuth (which sets req.userId).
 * Checks that the authenticated user has role === 'admin'.
 */
export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
    const userId = req.userId;
    if (!userId) {
        return next(new ApiError(401, 'Not authenticated'));
    }

    const user = await UserModel.findById(userId).select('role').lean();
    if (!user) {
        return next(new ApiError(401, 'User not found'));
    }

    if (user.role !== 'admin') {
        return next(new ApiError(403, 'Admin access required'));
    }

    next();
}
