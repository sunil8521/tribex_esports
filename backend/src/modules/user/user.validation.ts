import { z } from 'zod';

export const updateBasicInfoSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(24, 'Username must be at most 24 characters')
        .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')
        .optional(),
    email: z.email('Invalid email format').optional(),
}).refine((data) => data.username || data.email, {
    message: 'At least one field (username or email) must be provided',
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const updateAvatarSchema = z.object({
    avatarUrl: z
        .string()
        .url('Must be a valid URL')
        .refine((url) => url.startsWith('https://api.dicebear.com/'), {
            message: 'Avatar must be a DiceBear URL',
        }),
});

export type UpdateBasicInfoInput = z.infer<typeof updateBasicInfoSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
