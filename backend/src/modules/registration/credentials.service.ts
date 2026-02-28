import { ApiError } from '../../utils/apiError.js';
import { decrypt } from '../../utils/crypto.js';
import { RegistrationModel } from './registration.model.js';
import { MatchModel } from '../match/match.model.js';
import { TeamModel } from '../team/team.model.js';

/**
 * Get room credentials for a match the user is registered in.
 * Security gates:
 *  1. User must have an active registration (CONFIRMED or CHECKED_IN)
 *  2. Credentials only revealed 15 minutes before matchStart
 */
export async function getMatchCredentials(userId: string, matchId: string) {
    /* 1 ─ Find the user's registration for this match */
    // Check direct registration OR team-based registration
    const userTeamIds = (
        await TeamModel.find({ 'members.userID': userId }).select('_id').lean()
    ).map((t) => t._id);

    const reg = await RegistrationModel.findOne({
        matchID: matchId,
        $or: [
            { userID: userId },
            ...(userTeamIds.length > 0 ? [{ teamID: { $in: userTeamIds } }] : [])
        ],
        status: { $in: ['CONFIRMED', 'CHECKED_IN', 'PLAYING'] }
    }).lean();

    if (!reg) {
        throw new ApiError(403, 'You are not registered for this match');
    }

    /* 2 ─ Get match (including roomCredentials which are select: false) */
    const match = await MatchModel.findById(matchId)
        .select('+roomCredentials.roomId +roomCredentials.password')
        .lean();

    if (!match) {
        throw new ApiError(404, 'Match not found');
    }

    /* 3 ─ Check timing — only 15 mins before match */
    const now = new Date();
    const revealAt = new Date(match.timeline.matchStart);
    revealAt.setMinutes(revealAt.getMinutes() - 15);

    if (now < revealAt) {
        return {
            status: 'WAITING',
            revealAt,
            slotNumber: reg.assignedSlot,
            serverTime: now
        };
    }

    /* 4 ─ Decrypt and return credentials */
    const roomId = match.roomCredentials?.roomId
        ? decrypt(match.roomCredentials.roomId)
        : null;
    const password = match.roomCredentials?.password
        ? decrypt(match.roomCredentials.password)
        : null;

    if (!roomId || !password) {
        return {
            status: 'NOT_SET',
            message: 'Room credentials have not been set by the admin yet',
            slotNumber: reg.assignedSlot,
            serverTime: now
        };
    }

    return {
        status: 'AVAILABLE',
        roomId,
        password,
        slotNumber: reg.assignedSlot,
        serverTime: now
    };
}
