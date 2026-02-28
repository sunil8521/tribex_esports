import bcrypt from 'bcryptjs';
import { ApiError } from '@/utils/apiError.js';
import { UserModel } from '@/modules/user/user.model.js';
import type { UpdateBasicInfoInput, UpdatePasswordInput, UpdateAvatarInput } from './user.validation.js';

/**
 * Update username and/or email.
 */
export async function updateBasicInfo(userId: string, input: UpdateBasicInfoInput) {
    const update: Record<string, string> = {};

    if (input.username) {
        const existing = await UserModel.findOne({ username: input.username, _id: { $ne: userId } }).lean();
        if (existing) throw new ApiError(409, 'Username is already taken');
        update.username = input.username;
    }

    if (input.email) {
        const normalised = input.email.toLowerCase().trim();
        const existing = await UserModel.findOne({ email: normalised, _id: { $ne: userId } }).lean();
        if (existing) throw new ApiError(409, 'Email is already in use');
        update.email = normalised;
    }

    await UserModel.findByIdAndUpdate(userId, { $set: update }, { runValidators: true });
}

/**
 * Change password (requires current password verification).
 */
export async function updatePassword(userId: string, input: UpdatePasswordInput) {
    const user = await UserModel.findById(userId).select('+passwordHash').exec();
    if (!user) throw new ApiError(404, 'User not found');
    if (!user.passwordHash) throw new ApiError(400, 'Account uses Google sign-in, no password set');

    const isMatch = await user.comparePassword(input.currentPassword);
    if (!isMatch) throw new ApiError(400, 'Incorrect current password');

    user.passwordHash = await bcrypt.hash(input.newPassword, 12);
    await user.save();
}

/**
 * Update profile avatar to a DiceBear URL.
 */
export async function updateAvatar(userId: string, input: UpdateAvatarInput) {
    await UserModel.findByIdAndUpdate(userId, { $set: { userProfileImage: input.avatarUrl } });
    return { userProfileImage: input.avatarUrl };
}
