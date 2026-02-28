"use client";

import { Lock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type PasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type ApiResponse = { success: boolean; message: string };

export default function SecurityTab() {
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<PasswordFormValues>();

    const onSubmit = async (data: PasswordFormValues) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsUpdating(true);
        try {
            await apiFetch<ApiResponse>("/api/v1/user/password", {
                method: "PATCH",
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });
            toast.success("Password changed successfully");
            reset();
        } catch (error: any) {
            toast.error(error?.message || "Failed to change password");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0C0C11] border border-[rgba(255,255,255,0.06)] rounded-xl p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-md space-y-4"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">
                            Current Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                            placeholder="Current password"
                                type="password"
                                {...register("currentPassword", {
                                    required: "Current password is required",
                                })}
                                className="w-full bg-[#11111A] border border-[rgba(255,255,255,0.06)] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        {errors.currentPassword && (
                            <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                                type="password"
                                placeholder="New password"
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                className="w-full bg-[#11111A] border border-[rgba(255,255,255,0.06)] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                            placeholder="Confirm password"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (val) =>
                                        val === watch("newPassword") || "Passwords do not match",
                                })}
                                className="w-full bg-[#11111A] border border-[rgba(255,255,255,0.06)] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-primary text-white min-w-[160px]"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
