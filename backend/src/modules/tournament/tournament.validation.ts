import { z } from 'zod';

/* ── List (GET) ─────────────────────────────────────────────── */

export const getAllTournamentsSchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    game: z.string().optional(),
    status: z.string().optional(),
    mode: z.string().optional(),
    search: z.string().optional(),
    isVisible: z.enum(['true', 'false']).optional()
});

export type GetAllTournamentsInput = z.infer<typeof getAllTournamentsSchema>;

/* ── Single tournament param ────────────────────────────────── */

export const tournamentIdParamSchema = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid tournament ID')
});

/* ── Create (POST) — Admin only ─────────────────────────────── */

const prizeEntrySchema = z.object({
    rank: z.number().int().min(1),
    amount: z.number().min(0)
});

const advanceConfigSchema = z.object({
    advancementType: z.enum(['PER_LOBBY', 'GLOBAL']),
    topNFromEachLobby: z.number().int().min(1).optional(),
    totalAdvancing: z.number().int().min(0),
    minScoreThreshold: z.number().min(0).optional()
});

const stageSchema = z.object({
    name: z.enum(['QUALIFIER', 'SEMI_FINAL', 'FINAL']),
    sequence: z.number().int().min(1).max(3),
    matchCount: z.number().int().min(1).max(50),
    advanceConfig: advanceConfigSchema
});

export const createTournamentSchema = z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),

    game: z.enum(['BGMI', 'FreeFire']),
    mode: z.enum(['solo', 'duo', 'squad']),

    rules: z.array(z.string().trim()).default([]),

    maxTeamSize: z.number().int().min(1).max(4),

    slotDistribution: z.object({
        qualifierLobbies: z.number().int().min(1),
        semiLobbies: z.number().int().min(0),
        finalLobbies: z.number().int().min(1)
    }),

    entryFee: z.object({
        amount: z.number().min(0),
        currency: z.string().trim().default('INR')
    }),

    prizePool: z.array(prizeEntrySchema).default([]),

    maxParticipants: z.number().int().min(1),

    schedule: z.object({
        regOpens: z.coerce.date(),
        regCloses: z.coerce.date(),
        qualifierStart: z.coerce.date(),
        semiStart: z.coerce.date().optional(),
        finalStart: z.coerce.date().optional()
    }),

    stages: z.array(stageSchema).min(1, 'At least one stage is required'),

    isVisible: z.boolean().default(true)
});

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
