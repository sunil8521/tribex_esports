'use client';

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  Trophy,
  Shield,
  AlertCircle,
  ScrollText,
  ChevronRight,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoadingScreen from "@/components/LoadingScreen";
import { formatDate12Hour } from "@/helpers/timeFormat";
import { apiFetch } from "@/lib/api";
import type { Tournament, SuccessResponse } from "@/types/api";

/* Lazy-load MatchesTab — only downloaded when the Matches tab is clicked */
const MatchesTab = dynamic(() => import("@/components/sections/Matches"), {
  loading: () => (
    <div className="flex justify-center py-10">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
});




/* ── Helpers ──────────────────────────────────────────────── */

const MODE_LABEL: Record<string, string> = { solo: "Solo", duo: "Duo", squad: "Squad" };

function totalPrize(pool: Tournament["prizePool"]): number {
  return pool.reduce((sum, p) => sum + p.amount, 0);
}

/* ── Component ───────────────────────────────────────────── */

export default function TournamentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("overview");

  // TODO(auth): wire up real auth state
  const isUserLoggedIn = false;

  /* ── Data fetching ─────────────────────────────────────── */

  const {
    data: tournamentData,
    isLoading: tournamentLoading,
    isError: tournamentError,
    error: tournamentErr,
  } = useQuery({
    queryKey: ["tournament", id],
    queryFn: () => apiFetch<SuccessResponse<Tournament>>(`/api/v1/tournaments/${id}`),
    staleTime: 30_000,
  });

  const tournament = tournamentData?.data ?? null;

  /* ── Loading / Error ───────────────────────────────────── */

  if (tournamentLoading) return <LoadingScreen />;
  if (tournamentError || !tournament) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-red-500">
        {tournamentErr instanceof Error ? tournamentErr.message : "Error loading tournament"}
      </div>
    );
  }

  const isFull =
    tournament.registeredCount >= tournament.maxParticipants &&
    tournament.maxParticipants > 0;

  const percentFull =
    tournament.maxParticipants > 0
      ? Math.min(100, Math.round((tournament.registeredCount / tournament.maxParticipants) * 100))
      : 0;

  const prize = totalPrize(tournament.prizePool);

  const handleRegisterClick = (matchId: string) => {
    if (!isUserLoggedIn) {
      toast.error("Please log in to register for the tournament.");
      router.push("/login");
      return;
    }
    toast.info(`Registration flow not implemented yet (match: ${matchId}).`);
  };

  /* ── Render ────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background font-body pt-3 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto mb-8">
        <Link
          href="/tournaments"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Hero thumbnail */}
          <div className="lg:col-span-2 relative group rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-2xl bg-black">
            <div className="aspect-video w-full relative">
              <img
                src={
                  tournament.thumbnail?.url?.replace("/upload/", "/upload/f_auto,q_auto/") ||
                  "/placeholder.jpg"
                }
                alt="Tournament Cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex gap-2 mb-2">
                  <Badge className="bg-primary hover:bg-primary/90 text-white border-none">
                    {tournament.game}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-black/40 backdrop-blur border-[rgba(255,255,255,0.06)] text-white"
                  >
                    {MODE_LABEL[tournament.mode] ?? tournament.mode}
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-lg">
                  {tournament.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Sidebar info panel */}
          <div className="lg:col-span-1">
            <div className="h-full flex flex-col justify-between bg-[#0C0C11] backdrop-blur-sm border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-lg">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> Prize Pool
                    </span>
                    <span className="text-green-500 font-bold">
                      {prize > 0 ? `₹${prize.toLocaleString()}` : "TBD"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Entry Fee
                    </span>
                    <span className="text-white font-bold">
                      {tournament.entryFee.amount === 0
                        ? "FREE"
                        : `₹${tournament.entryFee.amount}`}
                    </span>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium uppercase text-muted-foreground">
                    <span>Overall Capacity</span>
                    <span className={isFull ? "text-red-500" : "text-primary"}>
                      {tournament.registeredCount} / {tournament.maxParticipants} Teams
                    </span>
                  </div>
                  <TournamentProgress
                    value={percentFull}
                    indicatorColor={isFull ? "bg-red-500" : "bg-primary"}
                  />
                </div>
              </div>

              {/* How to participate */}
              <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" /> How to Participate?
                </h4>
                <div className="space-y-3">
                  {[
                    <>Go to the <span className="text-white font-medium">Matches Tab</span> below.</>,
                    <>Select an open <span className="text-white font-medium">Qualifier Stage</span>.</>,
                    <>Click <span className="text-primary font-medium">Join Slot</span> and register your squad.</>,
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(255,255,255,0.06)] text-[10px] font-bold text-gray-300 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-gray-400">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-[#0C0C11] p-1 h-auto w-full md:w-auto flex overflow-x-auto justify-start gap-1 rounded-lg">
              {["overview", "matches", "teams"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-6 py-2 relative capitalize after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-[#ff1b6b] after:rounded-full after:transition-all data-[state=active]:after:w-full"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="hidden md:flex items-center text-xs text-muted-foreground bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.06)]">
              <Shield className="w-3 h-3 mr-2 text-green-500" /> Secure Payments & Anti-Cheat Enabled
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <TabsContent value="overview" className="space-y-8 mt-0 animate-in fade-in duration-500">
                <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <ScrollText className="w-5 h-5 mr-2 text-primary" /> Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {tournament.description}
                  </p>
                </div>

                <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-primary" /> Key Rules
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {(tournament.rules ?? []).map((rule, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300">
                        <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* Matches — lazy-loaded */}
              <TabsContent value="matches" className="space-y-8 mt-0 animate-in fade-in duration-500">
                <MatchesTab />
              </TabsContent>

              {/* Teams */}
              <TabsContent value="teams" className="mt-0 animate-in fade-in duration-500">
                <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-8 text-center text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Teams list will appear here once registration closes.</p>
                </div>
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Prize distribution table */}
              <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/20 to-transparent p-4 border-b border-[rgba(255,255,255,0.06)]">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#ff1b6b]" /> Prize Distribution
                  </h3>
                </div>
                <div className="p-2">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-2 text-left font-normal">Rank</th>
                        <th className="px-4 py-2 text-right font-normal">Prize</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.06)]">
                      {tournament.prizePool.map((p, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                        >
                          <td className="px-4 py-2.5 text-white font-medium">
                            {i === 0 ? (
                              <span className="text-[#ff1b6b]">🥇 1st</span>
                            ) : i === 1 ? (
                              <span className="text-gray-400">🥈 2nd</span>
                            ) : i === 2 ? (
                              <span className="text-orange-700">🥉 3rd</span>
                            ) : (
                              `#${p.rank}`
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right text-green-400 font-mono font-bold">
                            ₹{p.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tournament info */}
              <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Tournament Info
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Game Code</span>
                    <span className="text-white font-mono bg-[rgba(255,255,255,0.04)] px-2 py-0.5 rounded">
                      {tournament.eventCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Team Size</span>
                    <span className="text-white">{tournament.maxTeamSize} Players</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Mode</span>
                    <span className="text-white">{MODE_LABEL[tournament.mode] ?? tournament.mode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Starts</span>
                    <span className="text-white">{formatDate12Hour(tournament.schedule.qualifierStart)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

/* ── Shared progress bar ─────────────────────────────────── */

const TournamentProgress = ({
  value,
  className,
  indicatorColor = "bg-primary",
}: {
  value: number;
  className?: string;
  indicatorColor?: string;
}) => (
  <div className={`h-2.5 w-full overflow-hidden rounded-full bg-secondary ${className ?? ""}`}>
    <div
      className={`h-full flex-1 transition-all ${indicatorColor}`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
);
