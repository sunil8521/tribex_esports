'use client';

import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Sword, Clock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatDate12Hour } from "@/helpers/timeFormat";
import { useAuthStore } from "@/store/auth";
import type { StageWithMatches, SuccessResponse, MatchState } from "@/types/api";

/* ── Helpers ──────────────────────────────────────────────── */

const STAGE_LABEL: Record<string, string> = {
    QUALIFIER: "Qualifier",
    SEMI_FINAL: "Semi Final",
    FINAL: "Final",
};

function matchBadge(state: MatchState, isFull: boolean) {
    if (state === "LIVE") return { label: "Live", cls: "bg-[#ff1b6b]/10 text-[#ff1b6b] border-[#ff1b6b]/20" };
    if (state === "REG_OPEN" && !isFull) return { label: "Open", cls: "bg-green-500/10 text-green-500 border-green-500/20" };
    if (state === "COMPLETED") return { label: "Done", cls: "bg-gray-500/10 text-gray-500 border-gray-500/20" };
    return { label: isFull ? "Full" : "Locked", cls: "bg-[rgba(255,255,255,0.04)] text-gray-500 border-[rgba(255,255,255,0.06)]" };
}

/* ── Progress bar ─────────────────────────────────────────── */

const SlotProgress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-secondary ${className ?? ""}`}>
        <div
            className="h-full flex-1 transition-all bg-primary"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </div>
);

/* ── MatchesTab Component ─────────────────────────────────── */

export default function MatchesTab() {
    const { id: tournamentId } = useParams<{ id: string }>();
    const user = useAuthStore((s) => s.user);
    const isUserLoggedIn = !!user;
    const router = useRouter();

    const {
        data: stagesData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["tournament-stages", tournamentId],
        queryFn: () =>
            apiFetch<SuccessResponse<StageWithMatches[]>>(
                `/api/v1/tournaments/${tournamentId}/stages-matches`
            ),
        staleTime: 30_000,
    });

    const stages = stagesData?.data ?? [];

    const handleRegisterClick = (matchId: string) => {
        if (!isUserLoggedIn) {
            toast.error("Please log in to register for the tournament.");
            router.push("/login");
            return;
        }
        toast.info(`Registration flow not implemented yet (match: ${matchId}).`);
    };

    /* ── Loading / Error ───────────────────────────────────── */

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 py-6 text-sm">
                {error instanceof Error ? error.message : "Failed to load matches"}
            </div>
        );
    }

    /* ── Render stages & match cards ────────────────────────── */

    return (
        <div className="space-y-8">
            {stages.map((stage) => (
                <div key={stage._id} className="group relative">
                    <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Sword className="w-4 h-4 text-primary" />{" "}
                            {STAGE_LABEL[stage.name] ?? stage.name}
                        </h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {stage.matches.map((match) => {
                            const isMatchFull = match.filledSlots >= match.maxSlots;
                            const isOpen = match.state === "REG_OPEN" && !isMatchFull;
                            const badge = matchBadge(match.state, isMatchFull);

                            return (
                                <div
                                    key={match._id}
                                    className="bg-[#11111A] border border-[rgba(255,255,255,0.06)] hover:border-primary/40 rounded-xl p-4 transition-all hover:translate-y-[-2px] hover:shadow-lg"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-primary uppercase mb-1">
                                                {match.lobbyCode}
                                            </span>
                                            <span className="text-white font-bold text-lg">
                                                {STAGE_LABEL[stage.name] ?? stage.name}
                                            </span>
                                        </div>
                                        <Badge className={badge.cls}>{badge.label}</Badge>
                                    </div>

                                    <div className="space-y-2 mb-5">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Time
                                            </span>
                                            <span className="text-white">
                                                {formatDate12Hour(match.timeline.matchStart)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" /> Slots
                                            </span>
                                            <span className="text-white">
                                                {match.filledSlots}/{match.maxSlots}
                                            </span>
                                        </div>

                                        <SlotProgress
                                            value={(match.filledSlots / match.maxSlots) * 100}
                                            className="h-1 bg-[rgba(255,255,255,0.06)]"
                                        />
                                    </div>

                                    {isOpen ? (
                                        <Button
                                            onClick={() => handleRegisterClick(match._id)}
                                            size="sm"
                                            className="w-full bg-[rgba(255,255,255,0.04)] hover:bg-primary hover:text-white text-white border border-[rgba(255,255,255,0.06)]"
                                        >
                                            Join Slot
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            disabled
                                            className="w-full bg-transparent border border-[rgba(255,255,255,0.06)] text-gray-600"
                                        >
                                            {isMatchFull ? "Full" : match.state === "COMPLETED" ? "Done" : "Locked"}
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
