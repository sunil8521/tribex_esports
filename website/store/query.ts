import { create } from "zustand";

/* ── Tournament filter state ────────────────────────────── */

interface TournamentFilters {
    page: number;
    status: string;
    game: string;
    mode: string;
    search: string;
}

interface TournamentFilterStore extends TournamentFilters {
    // Individual setters (auto-reset page to 1)
    setStatus: (status: string) => void;
    setGame: (game: string) => void;
    setMode: (mode: string) => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;

    // Reset all filters
    resetFilters: () => void;
}

const DEFAULTS: TournamentFilters = {
    page: 1,
    status: "all",
    game: "all",
    mode: "all",
    search: "",
};

export const useTournamentFilters = create<TournamentFilterStore>()((set) => ({
    ...DEFAULTS,

    // Changing a filter always resets page to 1
    setStatus: (status) => set({ status, page: 1 }),
    setGame: (game) => set({ game, page: 1 }),
    setMode: (mode) => set({ mode, page: 1 }),
    setSearch: (search) => set({ search }),
    setPage: (page) => set({ page }),

    resetFilters: () => set(DEFAULTS),
}));
