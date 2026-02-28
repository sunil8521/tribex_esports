"use client";

import { Loader2, Check, Sparkles } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";

const STYLES = [
    { id: "croodles", label: "Croodles" },
    { id: "big-ears", label: "Big Ears" },
    { id: "notionists", label: "Notionists" },
    { id: "bottts", label: "Bottts" },
    { id: "open-peeps", label: "Open Peeps" },
] as const;

const SEEDS = [
    "Garfield", "Tinkerbell", "Annie", "Loki", "Cleo",
    "Angel", "Bob", "Mia", "Coco", "Gracie",
    "Bear", "Bella", "Abby", "Harley", "Cali",
    "Leo", "Luna", "Jack", "Felix", "Kiki",
] as const;

function diceBearUrl(style: string, seed: string) {
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
}

type ApiResponse = { success: boolean; message: string };

const ProfileImageModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);
    const [activeStyle, setActiveStyle] = useState<string>(STYLES[0].id);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    const handleAvatarSelect = async (url: string) => {
        setSelectedUrl(url);
        setIsSavingAvatar(true);
        try {
            await apiFetch<ApiResponse>("/api/v1/user/avatar", {
                method: "PATCH",
                body: JSON.stringify({ avatarUrl: url }),
            });
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Avatar updated!");
            onClose();
        } catch (error: any) {
            toast.error(error?.message || "Failed to update avatar");
        } finally {
            setIsSavingAvatar(false);
            setSelectedUrl(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0a0a10] border border-white/[0.08] text-white sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                {/* Header */}
                <DialogHeader className="px-5 pt-5 pb-3">
                    <DialogTitle className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Choose Your Avatar
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        Pick a style, then tap an avatar to save it.
                    </DialogDescription>
                </DialogHeader>

                {/* Style tabs */}
                <div className="px-5 pb-3">
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                        {STYLES.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setActiveStyle(style.id)}
                                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap
                  transition-all duration-200 cursor-pointer
                  ${activeStyle === style.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "bg-white/[0.04] text-gray-400 hover:bg-white/[0.08] hover:text-gray-200"
                                    }
                `}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Avatar grid — overflow-hidden on parent prevents horizontal scrollbar */}
                <div className="overflow-y-auto overflow-x-hidden flex-1 px-5 py-4">
                    <div className="grid grid-cols-4 gap-3">
                        {SEEDS.map((seed) => {
                            const url = diceBearUrl(activeStyle, seed);
                            const isCurrentAvatar = user?.userProfileImage === url;
                            const isLoading = isSavingAvatar && selectedUrl === url;

                            return (
                                <button
                                    key={seed}
                                    onClick={() => handleAvatarSelect(url)}
                                    disabled={isSavingAvatar}
                                    className={`
                    group relative flex flex-col items-center gap-1 rounded-xl p-2
                    transition-all duration-200 cursor-pointer
                    disabled:cursor-not-allowed disabled:opacity-40
                    ${isCurrentAvatar
                                            ? "bg-primary/10 ring-2 ring-primary/60"
                                            : "bg-white/[0.03] hover:bg-white/[0.07]"
                                        }
                  `}
                                >
                                    {/* Avatar image */}
                                    <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={url}
                                            alt={seed}
                                            className={`
                        w-full h-full object-cover
                        transition-transform duration-200
                        group-hover:scale-110
                      `}
                                        />

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200 rounded-lg" />

                                        {/* Current avatar checkmark */}
                                        {isCurrentAvatar && (
                                            <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5 shadow-lg">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}

                                        {/* Loading spinner */}
                                        {isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Seed label */}
                                    <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors truncate w-full text-center">
                                        {seed}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileImageModal;