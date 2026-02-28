"use client";

import {
    AlertTriangle,
    Edit2,
    Loader2,
    MoreVertical,
    Plus,
    Trash2,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth";

type TeamMember = {
    gameName: string;
    role: "leader" | "member";
};

type Team = {
    _id: string;
    teamName: string;
    mode: string;
    captainID: string;
    members: TeamMember[];
};

export default function TeamTab() {
    const userId = useAuthStore((s) => s.user?._id);

    // TODO: wire to backend API
    const teams: Team[] = [];
    const isLoading = false;
    const isError = false;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">My Squads</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your teams and rosters for tournaments.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                        variant="outline"
                        onClick={() => {
                            // TODO: open create team modal
                        }}
                    >
                        <Plus className="w-4 h-4" /> Create Team
                    </Button>
                </div>

                {/* Teams Grid */}
                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12 border border-dashed border-red-500 rounded-xl bg-red-500/10">
                            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-3" />
                            <h3 className="text-lg font-medium text-red-500">
                                Failed to load teams
                            </h3>
                            <p className="text-sm text-red-400 mb-4">
                                There was an error fetching your teams. Please try again later.
                            </p>
                        </div>
                    ) : teams.length > 0 ? (
                        teams.map((team) => (
                            <div
                                key={team._id}
                                className="group relative bg-[#11111A] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start">
                                    {/* Team Info */}
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                                {team.teamName}
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                                                <span className="bg-[rgba(255,255,255,0.04)] px-2 py-0.5 rounded text-gray-300 capitalize">
                                                    {team.mode}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" /> {team.members.length}{" "}
                                                    Members
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions (captain only) */}
                                    {team.captainID === userId && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-500 hover:bg-transparent"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-[#0C0C11] border-[rgba(255,255,255,0.06)] text-white"
                                            >
                                                <DropdownMenuItem className="focus:bg-[rgba(255,255,255,0.04)] cursor-pointer">
                                                    <Edit2 className="w-4 h-4 mr-2" /> Edit Roster
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Team
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                {/* Member chips */}
                                <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap gap-2">
                                    {team.members.map((member, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-1.5 bg-[rgba(255,255,255,0.04)] px-2 py-1 rounded text-xs text-gray-300 border border-[rgba(255,255,255,0.06)]"
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full ${member.role === "leader"
                                                        ? "bg-[#ff1b6b]"
                                                        : "bg-gray-500"
                                                    }`}
                                            />
                                            {member.gameName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 border border-dashed border-[rgba(255,255,255,0.06)] rounded-xl bg-[rgba(255,255,255,0.02)]">
                            <Users className="w-12 h-12 mx-auto text-gray-600 mb-3 opacity-50" />
                            <h3 className="text-lg font-medium text-gray-300">
                                No teams found
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Create a squad to start registering for tournaments.
                            </p>
                            <Button
                                variant="outline"
                                className="border-[rgba(255,255,255,0.06)] text-white hover:bg-[rgba(255,255,255,0.04)]"
                            >
                                Create Your First Team
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
