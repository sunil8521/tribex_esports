import { z } from 'zod';

const resultEntry = z.object({
    userID: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID').optional(),
    teamID: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid team ID').optional(),
    placement: z.number().int().min(1).max(12),
    kills: z.number().int().min(0),
    damageDealt: z.number().min(0).optional(),
    survivalTime: z.number().min(0).optional(),
    assists: z.number().int().min(0).optional(),
    bonus: z.number().optional()
}).refine(
    (d) => d.userID || d.teamID,
    { message: 'Either userID or teamID must be provided' }
);

export const submitResultsSchema = z.object({
    params: z.object({
        matchId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid match ID')
    }),
    body: z.object({
        results: z.array(resultEntry).min(1).max(12)
    })
});

export const matchIdParamSchema = z.object({
    params: z.object({
        matchId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid match ID')
    })
});

export const stageIdParamSchema = z.object({
    params: z.object({
        stageId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid stage ID')
    })
});
