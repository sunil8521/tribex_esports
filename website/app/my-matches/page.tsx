'use client';

import { Calendar, ChevronRight, Crosshair, Crown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MY_MATCH_HISTORY = [
  {
    id: "m1",
    tournament: "TribeX Pro Invitational S5",
    matchNo: 3,
    map: "Erangel",
    date: "2025-10-20",
    rank: 4,
    kills: 8,
    points: 12,
    status: "Completed",
    game: "BGMI",
  },
  {
    id: "m2",
    tournament: "Community Cup: Winter Split",
    matchNo: 1,
    map: "Ascent",
    date: "2025-10-15",
    rank: 1,
    kills: 22,
    points: 13,
    status: "Won",
    game: "Valorant",
  },
  {
    id: "m3",
    tournament: "Survival Series 2025",
    matchNo: 2,
    map: "Bermuda",
    date: "2025-10-10",
    rank: 12,
    kills: 2,
    points: 2,
    status: "Completed",
    game: "Free Fire",
  },
  {
    id: "m4",
    tournament: "Daily Scrims #405",
    matchNo: 1,
    map: "Sanhok",
    date: "2025-10-05",
    rank: 18,
    kills: 0,
    points: 0,
    status: "Completed",
    game: "BGMI",
  },
  {
    id: "m5",
    tournament: "TribeX Pro Invitational S4",
    matchNo: 5,
    map: "Miramar",
    date: "2025-09-25",
    rank: 2,
    kills: 10,
    points: 18,
    status: "Runner Up",
    game: "BGMI",
  },
];

export default function MyMatchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGame, setFilterGame] = useState("all");

  const filteredMatches = useMemo(() => {
    return MY_MATCH_HISTORY.filter((match) => {
      const matchesSearch = match.tournament
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGame = filterGame === "all" || match.game === filterGame;
      return matchesSearch && matchesGame;
    });
  }, [filterGame, searchTerm]);

  return (
    <div className="min-h-screen bg-background font-body pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-primary" /> My Match History
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Track your performance across all tournaments. Analyze your stats
              and improve your game.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">
                Total Kills
              </p>
              <p className="text-xl font-black text-red-500">
                {MY_MATCH_HISTORY.reduce((acc, curr) => acc + curr.kills, 0)}
              </p>
            </div>
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Wins</p>
              <p className="text-xl font-black text-[#ff1b6b]">
                {MY_MATCH_HISTORY.filter((m) => m.rank === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search tournament name..."
              className="pl-9 bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white placeholder:text-gray-600 focus:border-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={filterGame} onValueChange={setFilterGame}>
              <SelectTrigger className="bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white">
                <SelectValue placeholder="Filter by Game" />
              </SelectTrigger>
              <SelectContent className="bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white">
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="BGMI">BGMI</SelectItem>
                <SelectItem value="Valorant">Valorant</SelectItem>
                <SelectItem value="Free Fire">Free Fire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#11111A]">
                <TableRow className="border-[rgba(255,255,255,0.06)] hover:bg-transparent bg-[#11111A]">
                  <TableHead className="text-gray-400 w-[180px]">
                    Match Info
                  </TableHead>
                  <TableHead className="text-gray-400">Tournament</TableHead>
                  <TableHead className="text-center text-gray-400">
                    Rank
                  </TableHead>
                  <TableHead className="text-center text-gray-400">
                    Kills
                  </TableHead>
                  <TableHead className="text-center text-gray-400">
                    Pts
                  </TableHead>
                  <TableHead className="text-right text-gray-400">
                    Result
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <TableRow
                      key={match.id}
                      className="border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group"
                      onClick={() => toast.info("Match details page not implemented yet")}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base">
                            {match.map}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {match.date}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-medium group-hover:text-primary transition-colors">
                            {match.tournament}
                          </span>
                          <span className="text-xs text-gray-500">
                            Match #{match.matchNo} • {match.game}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {match.rank === 1 ? (
                            <Badge className="bg-[#ff1b6b]/20 text-[#ff1b6b] border-[#ff1b6b]/50 hover:bg-[#ff1b6b]/30">
                              <Crown className="w-3 h-3 mr-1" /> #1
                            </Badge>
                          ) : match.rank <= 3 ? (
                            <span className="font-bold text-white">#{match.rank}</span>
                          ) : (
                            <span className="text-gray-400">#{match.rank}</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="font-mono text-red-400 font-bold">
                          {match.kills}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="font-bold text-white text-lg">
                          {match.points}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`text-xs font-medium uppercase ${
                              match.rank === 1
                                ? "text-[#ff1b6b]"
                                : match.rank <= 3
                                  ? "text-green-400"
                                  : "text-gray-500"
                            }`}
                          >
                            {match.rank === 1
                              ? "Winner"
                              : match.rank <= 3
                                ? "Top 3"
                                : "Played"}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-gray-500"
                    >
                      No matches found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
