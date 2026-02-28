'use client';

import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Crown,
  MapPin,
  Monitor,
  PlayCircle,
  RefreshCw,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate12Hour } from "@/helpers/timeFormat";

const TOURNAMENT_INFO = {
  id: "t1",
  title: "TribeX Pro Invitational S5",
  game: "BGMI",
  stage: "Semi-Finals",
  matches: [
    {
      id: "m1",
      matchNo: 1,
      group: "Group A",
      map: "Erangel",
      status: "live",
      slots: "20/20",
      startTime: "2025-10-25T18:00:00",
      scoreboard: [
        { team: "Team Soul", kills: 12, pts: 24, alive: true },
        { team: "GodLike", kills: 8, pts: 18, alive: true },
        { team: "Blind", kills: 5, pts: 15, alive: false },
        { team: "XSpark", kills: 14, pts: 14, alive: false },
      ],
    },
    {
      id: "m2",
      matchNo: 2,
      group: "Group B",
      map: "Miramar",
      status: "live",
      slots: "18/20",
      startTime: "2025-10-25T18:00:00",
      scoreboard: [
        { team: "Entity", kills: 10, pts: 20, alive: true },
        { team: "Global", kills: 2, pts: 4, alive: false },
      ],
    },
    {
      id: "m3",
      matchNo: 3,
      group: "Group A",
      map: "Sanhok",
      status: "upcoming",
      slots: "15/20",
      startTime: "2025-10-25T19:00:00",
      scoreboard: [],
    },
  ],
  overallLeaderboard: [
    { rank: 1, team: "Team Soul", totalPts: 145 },
    { rank: 2, team: "GodLike", totalPts: 132 },
    { rank: 3, team: "Blind", totalPts: 110 },
    { rank: 4, team: "Entity", totalPts: 98 },
    { rank: 5, team: "XSpark", totalPts: 95 },
  ],
};

export default function TournamentLiveDashboardPage() {
  const [activeMatchId, setActiveMatchId] = useState(
    TOURNAMENT_INFO.matches[0].id
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentMatch =
    TOURNAMENT_INFO.matches.find((m) => m.id === activeMatchId) ||
    TOURNAMENT_INFO.matches[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background font-body pt-3 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <Link
              href="/tournaments"
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-headline font-bold text-white uppercase tracking-tight">
                {TOURNAMENT_INFO.title}
              </h1>
              <Badge className="bg-primary animate-pulse border-none px-3">
                LIVE
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" /> {TOURNAMENT_INFO.stage}
            </p>
          </div>

          <div className="flex gap-4 text-sm bg-surface-2 border border-border-subtle p-3 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-white font-semibold">{currentMatch.map}</span>
            </div>
            <Separator orientation="vertical" className="h-5 bg-white/10" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-white font-semibold">{currentMatch.slots}</span> Slots
            </div>
            <Separator orientation="vertical" className="h-5 bg-white/10" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Monitor className="w-4 h-4 text-green-500" />
              <span className="uppercase font-bold text-white">{currentMatch.status}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeMatchId} onValueChange={setActiveMatchId} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-surface-2 border border-border-subtle p-1 h-auto flex-wrap justify-start gap-2">
                  {TOURNAMENT_INFO.matches.map((match) => (
                    <TabsTrigger
                      key={match.id}
                      value={match.id}
                      className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"
                    >
                      {match.group} - M#{match.matchNo}
                      {match.status === "live" && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className={isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {TOURNAMENT_INFO.matches.map((match) => (
                <TabsContent
                  key={match.id}
                  value={match.id}
                  className="mt-0 animate-in fade-in slide-in-from-left-4 duration-300"
                >
                  {match.status !== "upcoming" ? (
                    <div className="bg-surface-2 border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                      <div className="p-4 bg-surface-3 border-b border-border-subtle flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <Swords className="w-5 h-5 text-primary" /> Live Scoreboard
                        </h3>
                        <div className="text-xs text-muted-foreground uppercase font-mono">
                          ID: {match.id.toUpperCase()}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-muted-foreground uppercase bg-surface-3/50">
                            <tr>
                              <th className="px-6 py-3">Rank</th>
                              <th className="px-6 py-3">Team</th>
                              <th className="px-6 py-3 text-center">Status</th>
                              <th className="px-6 py-3 text-center">Kills</th>
                              <th className="px-6 py-3 text-right">Total Pts</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                            {match.scoreboard.map((team, idx) => (
                              <tr
                                key={idx}
                                className={`hover:bg-hover-overlay transition-colors ${
                                  team.team === "Team Soul"
                                    ? "bg-primary/5 border-l-2 border-primary"
                                    : ""
                                }`}
                              >
                                <td className="px-6 py-4 font-medium text-muted-foreground">#{idx + 1}</td>
                                <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback>{team.team[0]}</AvatarFallback>
                                  </Avatar>
                                  {team.team}
                                  {team.team === "Team Soul" && (
                                    <Badge className="text-[10px] h-4 px-1 ml-2 bg-primary">YOU</Badge>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {team.alive ? (
                                    <Badge
                                      variant="outline"
                                      className="text-green-500 border-green-500/30 bg-green-500/10"
                                    >
                                      Alive
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground/60 text-xs">Eliminated</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-primary font-bold">{team.kills}</td>
                                <td className="px-6 py-4 text-right font-black text-white text-lg">{team.pts}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-2 border border-border-subtle rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                      <div className="w-20 h-20 bg-surface-3 rounded-full flex items-center justify-center mb-6 relative">
                        <Clock className="w-10 h-10 text-primary" />
                        <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping opacity-20" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Match Starts Soon</h2>
                      <p className="text-muted-foreground mb-8 max-w-md">
                        Players are preparing. The lobby will open 15 minutes before the start time.
                      </p>

                      <div className="bg-surface-3 border border-border-subtle rounded-lg p-6 w-full max-w-sm">
                        <div className="flex justify-between text-sm mb-4">
                          <span className="text-muted-foreground">Start Time</span>
                          <span className="text-white font-mono">{formatDate12Hour(match.startTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-6">
                          <span className="text-muted-foreground">Your Slot</span>
                          <span className="text-primary font-bold">#15</span>
                        </div>
                        <Button className="w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all font-bold">
                          Join Room (Locked)
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface-2 border border-border-subtle rounded-xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-primary" /> Upcoming Matches
              </h3>
              <div className="space-y-3">
                {TOURNAMENT_INFO.matches
                  .filter((m) => m.status === "upcoming")
                  .map((match) => (
                    <div
                      key={match.id}
                      className="bg-surface-3 border border-border-subtle rounded-lg p-3 hover:border-primary/30 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-white">{match.group}</span>
                        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">M#{match.matchNo}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-muted-foreground">
                          <p>{match.map}</p>
                          <p className="mt-1">{formatDate12Hour(match.startTime)}</p>
                        </div>
                        <Button size="icon" className="h-6 w-6 rounded-full bg-white/10 hover:bg-primary text-white">
                          <PlayCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {TOURNAMENT_INFO.matches.filter((m) => m.status === "upcoming").length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No upcoming matches scheduled.</p>
                )}
              </div>
            </div>

            <div className="bg-surface-2 border border-border-subtle rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent border-b border-border-subtle">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-yellow-500" /> Overall Standings
                </h3>
              </div>
              <ScrollArea className="h-[300px]">
                <table className="w-full text-sm">
                  <thead className="bg-surface-3 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Team</th>
                      <th className="px-4 py-2 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {TOURNAMENT_INFO.overallLeaderboard.map((team) => (
                      <tr key={team.rank} className="hover:bg-hover-overlay">
                        <td className="px-4 py-3 font-mono text-muted-foreground">{team.rank}</td>
                        <td className="px-4 py-3 font-bold text-white">{team.team}</td>
                        <td className="px-4 py-3 text-right font-black text-yellow-500">{team.totalPts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
              <div className="p-2 border-t border-border-subtle text-center">
                <Button variant="link" className="text-xs text-muted-foreground hover:text-white h-auto py-1">
                  View Full Leaderboard
                </Button>
              </div>
            </div>

            <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" /> Need Help?
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Having trouble joining the room or reporting scores?
              </p>
              <Button className="w-full bg-surface-3 hover:bg-white/10 text-white border border-border-subtle">
                Contact Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
