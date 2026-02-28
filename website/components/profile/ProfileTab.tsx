"use client";

import { Camera, Mail, User, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";
import { useModalStore } from "@/store/modal";



type ProfileFormValues = {
    username: string;
    email: string;
};

type ApiResponse = { success: boolean; message: string };

export default function ProfileTab() {
    const user = useAuthStore((s) => s.user);
    const openModal = useModalStore((s) => s.openModal);
    const queryClient = useQueryClient();

    const [isUpdating, setIsUpdating] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            username: user?.username ?? "",
            email: user?.email ?? "",
        },
    });

    // ── Update username/email ──────────────────────────────────
    const onSubmit = async (data: ProfileFormValues) => {
        setIsUpdating(true);
        try {
            await apiFetch<ApiResponse>("/api/v1/user/profile", {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error?.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    // ── Select DiceBear avatar ─────────────────────────────────


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Avatar Card */}
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                    <Avatar className="w-24 h-24 border-2 border-primary/50">
                        <AvatarImage src={user?.userProfileImage} />
                        <AvatarFallback>
                            {user?.username?.slice(0, 2).toUpperCase() ?? "U"}
                        </AvatarFallback>
                    </Avatar>

                    {/* Camera button opens the avatar picker dialog */}
                    <button onClick={() => {
                        openModal({ type: "PROFILE_IMAGE" })
                    }} className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-lg hover:bg-primary/90 transition-colors cursor-pointer">
                        <Camera className="w-4 h-4" />
                    </button>

                </div>

                <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-white">{user?.username}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
            </div>

            {/* Personal Info Form */}
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Personal Information</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                <input
                                    {...register("username", {
                                        required: "Username is required",
                                        minLength: { value: 3, message: "Min 3 characters" },
                                    })}
                                    className="w-full bg-[#11111A] border border-[rgba(255,255,255,0.06)] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            {errors.username && (
                                <p className="text-xs text-red-500">{errors.username.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                                {...register("email", { required: "Email is required" })}
                                className="w-full bg-[#11111A] border border-[rgba(255,255,255,0.06)] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
