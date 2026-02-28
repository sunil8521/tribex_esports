import type { Request, Response, RequestHandler } from 'express';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { ApiError } from '@/utils/apiError.js';
import { updateBasicInfo, updatePassword, updateAvatar } from './user.service.js';
import { updateBasicInfoSchema, updatePasswordSchema, updateAvatarSchema } from './user.validation.js';
import type { z } from 'zod';

function formatZodError(error: z.ZodError): string {
    return error.issues.map((e) => `${String(e.path.join('.'))}: ${e.message}`).join(', ');
}

/**
 * PATCH /api/v1/user/profile — update username/email
 */
export const updateBasicInfoHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) throw new ApiError(401, 'Not authenticated');

    const result = updateBasicInfoSchema.safeParse(req.body);
    if (!result.success) throw new ApiError(400, formatZodError(result.error));

    await updateBasicInfo(req.userId, result.data);

    res.json({ success: true, message: 'Profile updated successfully' });
});

/**
 * PATCH /api/v1/user/password — change password
 */
export const updatePasswordHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) throw new ApiError(401, 'Not authenticated');

    const result = updatePasswordSchema.safeParse(req.body);
    if (!result.success) throw new ApiError(400, formatZodError(result.error));

    await updatePassword(req.userId, result.data);

    res.json({ success: true, message: 'Password updated successfully' });
});

/**
 * PATCH /api/v1/user/avatar — select DiceBear avatar
 */
export const updateAvatarHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) throw new ApiError(401, 'Not authenticated');

    const result = updateAvatarSchema.safeParse(req.body);
    if (!result.success) throw new ApiError(400, formatZodError(result.error));

    const data = await updateAvatar(req.userId, result.data);

    res.json({ success: true, message: 'Avatar updated', data });
});
