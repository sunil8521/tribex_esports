'use client';

import {
  Activity,
  ChevronRight,
  Gamepad2,
  MapPin,
  Radio,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ACTIVE_TOURNAMENTS = [
  {
    id: "t1",
    game: "BGMI",
    title: "TribeX Pro Invitational S5",
    stage: "Grand Finals - Match 3",
    map: "Erangel",
    teamsAlive: 12,
    totalTeams: 20,
    status: "live",
    viewers: "12.5k",
    image:
      "https://wallpapers.com/images/hd/bgmi-4k-gaming-cool-3d-boy-character-310321r0158a176-2.jpg",
  },
  {
    id: "t2",
    game: "Valorant",
    title: "Community Cup: Winter Split",
    stage: "Semi-Finals (Bo3)",
    map: "Ascent",
    score: "1 - 1",
    status: "live",
    viewers: "800",
    image: "https://variety.com/wp-content/uploads/2024/08/valorant.png",
  },
  {
    id: "t3",
    game: "Free Fire",
    title: "Survival Series 2025",
    stage: "Qualifier Group B",
    map: "Bermuda",
    teamsAlive: 4,
    totalTeams: 12,
    status: "live",
    viewers: "2.1k",
    image:
      "https://dl.dir.freefiremobile.com/common/web_event/hash/54f31449f5f91cf0cc223cc635cd5952jpg",
  },
];

export default function LiveTournamentsPage() {
  return (
    <div className="min-h-screen bg-background font-body pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-white uppercase tracking-tight">
            Live Tournaments
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {ACTIVE_TOURNAMENTS.map((match) => (
            <div
              key={match.id}
              className="group relative overflow-hidden rounded-xl border border-border-subtle bg-surface-2 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,27,107,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex flex-col md:flex-row items-stretch">
                <div className="relative w-full md:w-48 h-32 md:h-auto shrink-0 overflow-hidden">
                  <img
                    src={match.image}
                    alt={match.game}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent md:bg-gradient-to-t" />

                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-surface-3/80 backdrop-blur-md border-border-subtle text-white hover:bg-surface-3">
                      {match.game}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 p-5 flex flex-col justify-center gap-2 relative z-10">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary bg-primary/10 uppercase text-[10px] tracking-widest flex items-center gap-1.5 animate-pulse"
                    >
                      <Radio className="w-3 h-3" /> Live Now
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" /> {match.viewers} Watching
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors truncate">
                    {match.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-white font-medium bg-surface-3 px-2 py-0.5 rounded">
                      <Trophy className="w-3 h-3 text-yellow-500" /> {match.stage}
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {match.map}
                    </span>
                    {match.teamsAlive && (
                      <span className="hidden sm:flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-green-500" />
                        {match.teamsAlive}/{match.totalTeams} Alive
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border-subtle bg-surface-3/30 md:bg-transparent min-w-[200px]">
                  <Link href={`/leaderboard/${match.id}`}>
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
                      View Scoreboard <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>

                  <div className="mt-3 flex justify-center gap-3">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Updated 2s ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ACTIVE_TOURNAMENTS.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border-subtle rounded-xl bg-surface-2">
            <Gamepad2 className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No tournaments are live right now.
            </h3>
            <p className="text-sm text-muted-foreground/60">
              Check back later for upcoming matches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
