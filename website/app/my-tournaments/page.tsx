'use client';

import {
  CheckCircle2,
  ChevronRight,
  Copy,
  Edit2,
  Eye,
  Gamepad2,
  Lock,
  RefreshCw,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const MY_REGISTERED_TOURNAMENTS = [
  {
    id: "t1",
    title: "TribeX Pro Invitational S5",
    game: "BGMI",
    status: "active",
    roomDetails: {
      isRevealed: true,
      roomId: "123456",
      password: "tribe_winner",
    },
    nextMatch: {
      stage: "Semi-Final",
      matchNo: "Match #2",
      startTime: "2025-10-25T19:00:00",
      map: "Miramar",
    },
    myTeam: {
      name: "Team Soul",
      players: [
        { ign: "SoulMortal", id: "554321" },
        { ign: "SoulGoblin", id: "554322" },
        { ign: "SoulHector", id: "554323" },
        { ign: "SoulAkshat", id: "554324" },
      ],
    },
  },
  {
    id: "t2",
    title: "Valorant Community Cup",
    game: "Valorant",
    status: "check-in",
    roomDetails: {
      isRevealed: false,
      roomId: null,
      password: null,
    },
    nextMatch: {
      stage: "Qualifier Round 1",
      matchNo: "Match #1",
      startTime: "2025-10-25T18:30:00",
      map: "Ascent",
    },
    myTeam: {
      name: "AimGods",
      players: [{ ign: "Player1", id: "000000" }],
    },
  },
];

export default function MyTournamentsPage() {
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [revealedRooms, setRevealedRooms] = useState<Record<string, boolean>>(
    {}
  );

  const handleEditClick = (tournament: any) => {
    setSelectedTournament(tournament);
    setIsEditOpen(true);
  };

  const handleRevealRoom = (id: string) => {
    setRevealedRooms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-body pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-headline font-bold text-white uppercase tracking-tight">
              My Tournaments
            </h1>
            <p className="text-muted-foreground">
              Manage registrations and view room details.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-white/10 text-white hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {MY_REGISTERED_TOURNAMENTS.map((item) => (
            <div
              key={item.id}
              className="bg-[#0a141d]/40 border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                    {item.game === "BGMI" ? (
                      <Gamepad2 className="w-6 h-6" />
                    ) : (
                      <Trophy className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {item.game} • {item.myTeam.name}
                    </p>
                  </div>
                </div>

                {item.status === "check-in" ? (
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse">
                    Check-in Required
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-green-500/30 text-green-500 bg-green-500/5"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                  </Badge>
                )}
              </div>

              <Separator className="bg-white/5 mb-4" />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Next Match
                  </p>
                  {item.nextMatch ? (
                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Stage</span>
                        <span className="text-white font-medium">
                          {item.nextMatch.stage}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Map</span>
                        <span className="text-white font-medium">
                          {item.nextMatch.map}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-400">Start Time</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                          <Timer className="w-3 h-3 mr-1" /> 01:22:10
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming matches.</p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    Room Details{" "}
                    {item.roomDetails.isRevealed ? (
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                  </p>

                  {item.roomDetails.isRevealed ? (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 relative group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-primary font-bold uppercase">ID</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white font-bold tracking-wider">
                            {item.roomDetails.roomId}
                          </span>
                          <Copy className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-primary font-bold uppercase">Pass</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white font-bold tracking-wider">
                            {revealedRooms[item.id]
                              ? item.roomDetails.password
                              : "••••••••"}
                          </span>
                          <Eye
                            className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white"
                            onClick={() => handleRevealRoom(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex flex-col items-center justify-center text-center h-[88px]">
                      <Lock className="w-5 h-5 text-gray-600 mb-1" />
                      <p className="text-xs text-gray-500">Details locked.</p>
                      <p className="text-[10px] text-gray-600">
                        Reveals 15m before start.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => handleEditClick(item)}
                >
                  <Edit2 className="w-3 h-3 mr-2" /> Edit Roster
                </Button>

                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => router.push(`/tournaments/${item.id}`)}
                >
                  View Full Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#0f172a] border-white/10 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Edit Team:{" "}
              <span className="text-primary">{selectedTournament?.myTeam?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Update your roster. Changes locked 1 hour before start.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTeam} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-gray-300">
                Team Name
              </Label>
              <Input
                id="teamName"
                defaultValue={selectedTournament?.myTeam?.name}
                className="bg-black/40 border-white/20 text-white focus:border-primary"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300">Player Roster</Label>
              <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {selectedTournament?.myTeam?.players?.map(
                  (player: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        defaultValue={player.ign}
                        placeholder="IGN"
                        className="bg-black/40 border-white/20 text-white text-xs h-9"
                      />
                      <Input
                        defaultValue={player.id}
                        placeholder="ID"
                        className="bg-black/40 border-white/20 text-white text-xs h-9 font-mono"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
