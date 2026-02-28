import mongoose from 'mongoose';
import { ApiError } from '../../utils/apiError.js';
import { RegistrationModel } from './registration.model.js';
import { TournamentModel } from '../tournament/tournament.model.js';
import { StageModel } from '../stage/stage.model.js';
import { MatchModel, type IParticipant } from '../match/match.model.js';
import { TeamModel } from '../team/team.model.js';
import { UserModel } from '../user/user.model.js';
import { createPaymentOrder } from '../payment/payment.service.js';

/* ═══════════════════════════════════════════════════════════════
   registerForTournament
   ─ Atomic lobby allocation: find first open lobby → claim slot
   ═══════════════════════════════════════════════════════════════ */

export async function registerForTournament(
    userId: string,
    tournamentId: string,
    teamId?: string
) {
    /* 1 ─ Validate tournament */
    const tournament = await TournamentModel.findById(tournamentId).lean();
    if (!tournament) throw new ApiError(404, 'Tournament not found');
    if (tournament.status !== 'REG_OPEN') {
        throw new ApiError(400, 'Registration is not open for this tournament');
    }

    /* 2 ─ Check for duplicate registration */
    const existing = await RegistrationModel.findOne({
        userID: userId,
        tournamentID: tournamentId,
        status: { $ne: 'CANCELLED' }
    }).lean();
    if (existing) throw new ApiError(409, 'You are already registered for this tournament');

    /* 3 ─ Determine participant type */
    const isSolo = tournament.mode === 'solo';
    let teamDoc = null;
    let captainId = userId;

    if (!isSolo) {
        if (!teamId) throw new ApiError(400, 'Team ID is required for duo/squad tournaments');
        teamDoc = await TeamModel.findById(teamId).lean();
        if (!teamDoc) throw new ApiError(404, 'Team not found');

        // Only the captain can register the team
        if (teamDoc.captainID.toString() !== userId) {
            throw new ApiError(403, 'Only the team captain can register');
        }

        // Check team size matches tournament mode
        const requiredSize = tournament.mode === 'duo' ? 2 : 4;
        if (teamDoc.members.length < requiredSize) {
            throw new ApiError(400, `Team must have at least ${requiredSize} members for ${tournament.mode} mode`);
        }

        // Check if team is already registered
        const teamReg = await RegistrationModel.findOne({
            teamID: teamId,
            tournamentID: tournamentId,
            status: { $ne: 'CANCELLED' }
        }).lean();
        if (teamReg) throw new ApiError(409, 'This team is already registered for this tournament');

        captainId = teamDoc.captainID.toString();
    }

    /* 4 ─ Find the qualifier stage */
    const qualStage = await StageModel.findOne({
        tournamentID: tournamentId,
        name: 'QUALIFIER'
    }).lean();
    if (!qualStage) throw new ApiError(500, 'Qualifier stage not configured for this tournament');

    /* 5 ─ Atomically claim a slot in the first available lobby */
    const isFree = tournament.entryFee.amount === 0;

    // Use a transaction for atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find first lobby with open slots
        const lobby = await MatchModel.findOneAndUpdate(
            {
                stageID: qualStage._id,
                state: { $in: ['REG_OPEN', 'SCHEDULED'] },
                $expr: { $lt: [{ $size: '$participants' }, '$maxSlots'] }
            },
            {
                // Atomically push participant — the update only succeeds if filter matches
                $push: {
                    participants: {
                        slotNumber: 0,  // We'll set the real slot below
                        registrationID: new mongoose.Types.ObjectId(), // placeholder, updated after reg creation
                        ...(isSolo
                            ? { userID: userId }
                            : { teamID: teamId, userID: userId }),
                        teamName: teamDoc?.name,
                        captainName: undefined,
                        checkIn: { status: false }
                    } as unknown as IParticipant
                }
            },
            {
                sort: { lobbyCode: 1 },  // Fill QUAL-01 first
                new: true,
                session
            }
        );

        if (!lobby) {
            throw new ApiError(400, 'No available lobby slots. All lobbies are full.');
        }

        // Calculate the actual slot number (position in array)
        const slotNumber = lobby.participants.length;

        // Fix the slot number on the participant we just pushed
        const lastParticipant = lobby.participants[lobby.participants.length - 1]!;
        lastParticipant.slotNumber = slotNumber;

        // Create the registration
        const [registration] = await RegistrationModel.create(
            [{
                tournamentID: tournamentId,
                matchID: lobby._id,
                stageID: qualStage._id,
                participantType: isSolo ? 'solo' : 'team',
                userID: userId,
                ...(teamId ? { teamID: teamId } : {}),
                captainID: captainId,
                status: isFree ? 'CONFIRMED' : 'PENDING_PAYMENT',
                assignedSlot: slotNumber,
                payment: {
                    amount: tournament.entryFee.amount,
                    status: isFree ? 'completed' : 'pending'
                },
                isAutoSeeded: false
            }],
            { session }
        ) as [InstanceType<typeof RegistrationModel>];

        // Update the participant's registrationID
        lastParticipant.registrationID = registration._id;

        // If lobby is now full, update state
        if (lobby.participants.length >= lobby.maxSlots) {
            lobby.state = 'FULL';
        }

        await lobby.save({ session });

        // Increment tournament registered count
        await TournamentModel.updateOne(
            { _id: tournamentId },
            { $inc: { registeredCount: 1 } },
            { session }
        );

        await session.commitTransaction();

        /* 6 ─ For paid tournaments, create a Cashfree payment order */
        let paymentSessionId: string | null = null;
        let orderId: string | null = null;

        if (!isFree) {
            const paymentResult = await createPaymentOrder(
                registration._id.toString(),
                userId,
                tournamentId,
                tournament.entryFee.amount
            );
            paymentSessionId = paymentResult.paymentSessionId;
            orderId = paymentResult.orderId;
        }

        return {
            registration: registration.toObject(),
            lobbyCode: lobby.lobbyCode,
            slotNumber,
            ...(paymentSessionId ? { paymentSessionId, orderId } : {})
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}

/* ═══════════════════════════════════════════════════════════════
   getMyRegistrations
   ═══════════════════════════════════════════════════════════════ */

export async function getMyRegistrations(userId: string) {
    return RegistrationModel.find({
        userID: userId,
        status: { $ne: 'CANCELLED' }
    })
        .populate('tournamentID', 'title game mode thumbnail status')
        .populate('matchID', 'lobbyCode state timeline')
        .sort({ createdAt: -1 })
        .lean();
}

/* ═══════════════════════════════════════════════════════════════
   cancelRegistration
   ═══════════════════════════════════════════════════════════════ */

export async function cancelRegistration(userId: string, registrationId: string) {
    const reg = await RegistrationModel.findById(registrationId);
    if (!reg) throw new ApiError(404, 'Registration not found');
    if (reg.userID.toString() !== userId) {
        throw new ApiError(403, 'Not your registration');
    }
    if (!['CONFIRMED', 'PENDING_PAYMENT'].includes(reg.status)) {
        throw new ApiError(400, 'Cannot cancel — registration is past the cancellation window');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Remove from match participants
        await MatchModel.updateOne(
            { _id: reg.matchID },
            {
                $pull: { participants: { registrationID: reg._id } },
                // If lobby was FULL, reopen it
                $set: { state: 'REG_OPEN' }
            },
            { session }
        );

        // Decrement tournament count
        await TournamentModel.updateOne(
            { _id: reg.tournamentID },
            { $inc: { registeredCount: -1 } },
            { session }
        );

        // Update registration status
        reg.status = 'CANCELLED';
        await reg.save({ session });

        await session.commitTransaction();
        return { message: 'Registration cancelled' };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}
