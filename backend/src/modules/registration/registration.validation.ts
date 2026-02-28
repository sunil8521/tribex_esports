import { z } from 'zod';

export const registerForTournamentSchema = z.object({
    params: z.object({
        tournamentId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid tournament ID')
    }),
    body: z.object({
        teamId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid team ID').optional()
    }).optional()
});

export const cancelRegistrationSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid registration ID')
    })
});

export const matchIdParamSchema = z.object({
    params: z.object({
        matchId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid match ID')
    })
});
