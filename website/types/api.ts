/* ── Shared types matching backend response shapes ────────── */

export type TournamentStatus =
  | 'CREATED'
  | 'REG_OPEN'
  | 'REG_CLOSED'
  | 'QUAL_RUNNING'
  | 'QUAL_COMPLETE'
  | 'SEMI_RUNNING'
  | 'SEMI_COMPLETE'
  | 'FINALS'
  | 'COMPLETED'
  | 'CANCELLED';

export type Game = 'BGMI' | 'FreeFire';
export type TournamentMode = 'solo' | 'duo' | 'squad';

export interface Tournament {
  _id: string;
  title: string;
  description: string;
  game: Game;
  mode: TournamentMode;
  eventCode: string;
  rules: string[];
  maxTeamSize: number;
  status: TournamentStatus;

  entryFee: {
    amount: number;
    currency: string;
  };

  prizePool: Array<{ rank: number; amount: number }>;

  registeredCount: number;
  maxParticipants: number;

  thumbnail?: {
    url?: string;
    public_id?: string;
  };

  schedule: {
    regOpens: string;
    regCloses: string;
    qualifierStart: string;
    semiStart?: string;
    finalStart?: string;
  };

  isVisible: boolean;
}

/* ── Stage ────────────────────────────────────────────────── */

export interface Stage {
  _id: string;
  tournamentID: string;
  name: 'QUALIFIER' | 'SEMI_FINAL' | 'FINAL';
  sequence: number;
  advanceConfig: {
    advancementType: 'PER_LOBBY' | 'GLOBAL';
    topNFromEachLobby?: number;
    totalAdvancing: number;
    minScoreThreshold?: number;
  };
  status: 'PENDING' | 'ALLOCATING' | 'IN_PROGRESS' | 'SCORING' | 'COMPLETE';
}

/* ── Match ────────────────────────────────────────────────── */

export type MatchState =
  | 'SCHEDULED'
  | 'REG_OPEN'
  | 'FULL'
  | 'LIVE'
  | 'RESULTS_PENDING'
  | 'COMPLETED'
  | 'ARCHIVED';

export interface Match {
  _id: string;
  tournamentID: string;
  stageID: string;
  lobbyCode: string;
  maxSlots: number;
  filledSlots: number;
  state: MatchState;
  timeline: {
    regStart: string;
    regEnd: string;
    matchStart: string;
    matchEnd?: string;
  };
}

export interface StageWithMatches extends Stage {
  matches: Match[];
}

/* ── Response wrappers ───────────────────────────────────── */

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: PaginationMeta;
}
