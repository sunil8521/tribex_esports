'use client';

import { useState, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import type { PaginatedResponse, Tournament } from "@/types/api";

import TournamentCard from "@/components/TournamentCard";
import TournamentCardSkeleton from "@/components/TournamentCardSkeleton";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gamepad2, Search, Trophy, Users } from "lucide-react";

/* ── Constants ────────────────────────────────────────────── */

const PAGE_SIZE = 9;
const SELECT_ITEM_CLASS = "focus:bg-primary focus:text-white cursor-pointer";

const STATUS_OPTIONS = [
  { value: "all", label: "Any Status" },
  { value: "CREATED", label: "Upcoming" },
  { value: "REG_OPEN", label: "Registration Open" },
  { value: "REG_CLOSED", label: "Reg Closed" },
  { value: "QUAL_RUNNING,SEMI_RUNNING,FINALS", label: "Live Now" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

const GAME_OPTIONS = [
  { value: "all", label: "All Games" },
  { value: "BGMI", label: "BGMI" },
  { value: "FreeFire", label: "Free Fire" },
] as const;

const MODE_OPTIONS = [
  { value: "all", label: "Any Mode" },
  { value: "solo", label: "Solo" },
  { value: "duo", label: "Duo" },
  { value: "squad", label: "Squad" },
] as const;

/* ── Build API query string ──────────────────────────────── */

function buildQueryString(filters: {
  page: number;
  status: string;
  game: string;
  mode: string;
  search: string;
}): string {
  const qs = new URLSearchParams();
  qs.set("page", String(filters.page));
  qs.set("limit", String(PAGE_SIZE));
  if (filters.status !== "all") qs.set("status", filters.status);
  if (filters.game !== "all") qs.set("game", filters.game);
  if (filters.mode !== "all") qs.set("mode", filters.mode);
  if (filters.search.trim()) qs.set("search", filters.search.trim());
  return qs.toString();
}

/* ── Page Component ──────────────────────────────────────── */

export default function TournamentsPage() {
  /* Local filter state — resets when user navigates away */
  const [page, setPage] = useState(1);
  const [status, setStatusRaw] = useState("all");
  const [game, setGameRaw] = useState("all");
  const [mode, setModeRaw] = useState("all");
  const [search, setSearch] = useState("");

  /* Changing game/status/mode resets page to 1 */
  const setStatus = useCallback((v: string) => { setStatusRaw(v); setPage(1); }, []);
  const setGame = useCallback((v: string) => { setGameRaw(v); setPage(1); }, []);
  const setMode = useCallback((v: string) => { setModeRaw(v); setPage(1); }, []);

  /* Debounce search — wait 400ms after user stops typing */
  const debouncedSearch = useDebounce(search, 400);

  /* Build query params */
  const queryParams = { page, status, game, mode, search: debouncedSearch };

  /* React Query — cached, deduplicated, keeps stale data while refetching */
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["tournaments", queryParams],
    queryFn: () =>
      apiFetch<PaginatedResponse<Tournament[]>>(
        `/api/v1/tournaments?${buildQueryString(queryParams)}`
      ),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const tournaments = data?.data ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ── Render ──────────────────────────────────────────── */

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
          <p className="text-xl font-medium text-destructive">Failed to load tournaments</p>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header + Filters */}
        <div className="flex flex-col gap-6 border-b border-[rgba(255,255,255,0.06)] pb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tight">
                Tournaments
              </h1>
              <p className="text-muted-foreground text-sm mt-1 hidden md:block">
                Find your next battleground.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search tournament name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white placeholder:text-gray-600 focus-visible:border-primary/50 h-10 w-full transition-all"
              />
            </div>

            <div className="grid grid-cols-2 md:flex md:items-center gap-3">
              {/* Game filter */}
              <Select value={game} onValueChange={setGame}>
                <SelectTrigger className="w-full md:w-[140px] h-10 bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-gray-300 hover:text-white hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <Gamepad2 className="w-3.5 h-3.5 text-primary" />
                    <SelectValue placeholder="Game" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white">
                  {GAME_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} className={SELECT_ITEM_CLASS} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status filter */}
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-[160px] h-10 bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-gray-300 hover:text-white hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <Trophy className="w-3.5 h-3.5 text-[#ff1b6b]" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white">
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} className={SELECT_ITEM_CLASS} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mode filter */}
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="col-span-2 md:col-span-1 w-full md:w-[130px] h-10 bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-gray-300 hover:text-white hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <SelectValue placeholder="Mode" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white">
                  {MODE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} className={SELECT_ITEM_CLASS} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        <section className="min-h-[400px]">
          {isLoading ? (
            /* First load — show skeleton cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TournamentCardSkeleton key={i} />
              ))}
            </div>
          ) : tournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[rgba(255,255,255,0.06)] rounded-xl bg-[rgba(255,255,255,0.02)]">
              <Trophy className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No tournaments found</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                There are no tournaments matching your filters. Try a different search or filter.
              </p>
            </div>
          ) : (
            /* Cards with subtle dim when refetching */
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? "opacity-60" : "opacity-100"
                }`}
            >
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament._id} card={tournament} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={
                      !pagination.hasPrevPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-[rgba(255,255,255,0.04)] hover:text-primary"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((num) => (
                    <PaginationItem key={num}>
                      <PaginationLink
                        isActive={page === num}
                        onClick={() => handlePageChange(num)}
                        className={
                          page === num
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "cursor-pointer hover:bg-[rgba(255,255,255,0.04)] hover:text-primary"
                        }
                      >
                        {num}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      !pagination.hasNextPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-[rgba(255,255,255,0.04)] hover:text-primary"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
}
