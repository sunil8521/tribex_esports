import type { Request, Response, RequestHandler } from 'express';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { ApiError } from '@/utils/apiError.js';
import { login, signup, verifyEmail } from '@/modules/auth/auth.service.js';
import { UserModel } from '@/modules/user/user.model.js';
import { googleLogin } from '@/modules/auth/google.service.js';
import { signupSchema, loginSchema, googleLoginSchema, verifyEmailSchema } from '@/modules/auth/auth.validation.js';
import type { z } from 'zod';

function formatZodError(error: z.ZodError): string {
  return error.issues.map((e) => `${String(e.path.join('.'))}: ${e.message}`).join(', ');
}

export const signupHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, formatZodError(result.error));
  }

  const { email, username, password } = result.data;
  const out = await signup({ email, username, password });

  res.setAuthCookies(out.tokens);
  res.status(201).json({ success: true, message: 'Signup successful' });
});

export const loginHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, formatZodError(result.error));
  }

  const { emailOrUsername, password } = result.data;
  const out = await login({ emailOrUsername, password });

  res.setAuthCookies(out.tokens);
  res.json({ success: true, message: 'Login successful' });
});

export const googleLoginHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = googleLoginSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, formatZodError(result.error));
  }

  const { idToken } = result.data;
  const out = await googleLogin({ idToken });

  res.setAuthCookies(out.tokens);
  res.json({ success: true, message: 'Google login successful' });
});

export const logoutHandler: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  res.clearAuthCookies();
  res.json({ success: true, message: 'Logged out' });
});

export const meHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) throw new ApiError(401, 'Not authenticated');

  const user = await UserModel.findById(userId).lean();
  if (!user) throw new ApiError(401, 'Not authenticated');

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        userProfileImage: user.userProfileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

export const verifyEmailHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = verifyEmailSchema.safeParse({
    token: req.query.token,
    email: req.query.email
  });
  if (!result.success) {
    throw new ApiError(400, 'Invalid verification link');
  }

  const out = await verifyEmail(result.data);
  res.json({ success: true, message: 'Email verified', data: out });
});
