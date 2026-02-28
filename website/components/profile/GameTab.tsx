"use client";

import { Gamepad2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type GameProfile = {
    gameId: string;
    gameName: string;
    game: string;
};

export default function GameTab() {
    // TODO: wire to backend — for now, empty state
    const gameProfiles: GameProfile[] = [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Game IDs</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your in-game identities.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                        onClick={() => {
                            // TODO: open add game modal
                        }}
                    >
                        <Plus className="w-4 h-4" /> Add New Game
                    </Button>
                </div>

                <div className="grid gap-4">
                    {gameProfiles.length > 0 ? (
                        gameProfiles.map((profile, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-[#11111A] border border-[rgba(255,255,255,0.06)] rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center text-primary font-bold">
                                        {profile.game.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{profile.game}</h4>
                                        <p className="text-xs text-gray-400">
                                            IGN:{" "}
                                            <span className="text-gray-200">{profile.gameName}</span>{" "}
                                            • ID:{" "}
                                            <span className="font-mono text-gray-200">
                                                {profile.gameId}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 border border-dashed border-[rgba(255,255,255,0.06)] rounded-lg">
                            <Gamepad2 className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                            <p className="text-gray-400">No game profiles added yet.</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Add your BGMI or Free Fire game ID to start joining tournaments.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
