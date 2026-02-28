import { z } from 'zod';

export const signupSchema = z.object({
    email: z.email('Invalid email format'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(24, 'Username must be at most 24 characters')
        .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export const loginSchema = z.object({
    emailOrUsername: z.string().min(1, 'Email or username is required'),
    password: z.string().min(1, 'Password is required')
});

export const googleLoginSchema = z.object({
    idToken: z.string().min(1, 'idToken is required')
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    email: z.email('Invalid email')
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
