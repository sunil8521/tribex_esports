"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import React from "react";

import { apiFetch } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { renderGoogleButton } from "@/lib/googleIdentity";

type LoginFormInputs = {
    emailOrUsername: string;
    password: string;
};

type LoginResponse = {
    success: boolean;
    message: string;
}


export default function LoginForm() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            await apiFetch<LoginResponse>("/api/v1/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    emailOrUsername: data.emailOrUsername,
                    password: data.password,
                }),
            });

            // Invalidate /me so Header refetches fresh user data
            await queryClient.invalidateQueries({ queryKey: ["me"] });

            toast.success("Successfully logged in");
            const returnTo = searchParams.get("returnTo") || "/";
            router.replace(returnTo);
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || "Invalid email or password");
        }
    };

    const handleGoogleCredential = async (idToken: string) => {
        try {
            await apiFetch<LoginResponse>("/api/v1/auth/google", {
                method: "POST",
                body: JSON.stringify({ idToken }),
            });

            await queryClient.invalidateQueries({ queryKey: ["me"] });

            toast.success("Logged in with Google");
            const returnTo = searchParams.get("returnTo") || "/";
            router.replace(returnTo);
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message || "Google login failed");
        }
    };

    const googleBtnRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!googleBtnRef.current) return;

        // Render the official Google button (more reliable than One Tap)
        renderGoogleButton(googleBtnRef.current, handleGoogleCredential, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            width: "100%",
        }).catch((err) => {
            console.error(err);
        });
    }, []);


    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-4">
                <div ref={googleBtnRef} className="w-full" />
            </div>

            <div className="my-4 flex items-center gap-3">
                <div className="h-px w-full bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px w-full bg-border" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="emailOrUsername" className="text-sm font-medium leading-none text-foreground">
                        Email / Username
                    </label>
                    <input
                        id="emailOrUsername"
                        type="text"
                        placeholder="name@example.com"
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${errors.emailOrUsername
                            ? "border-destructive focus-visible:ring-destructive"
                            : "border-input"
                            }`}
                        {...register("emailOrUsername", {
                            required: "Email or username is required",
                        })}
                    />
                    {errors.emailOrUsername && (
                        <p className="text-xs text-destructive">{errors.emailOrUsername.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">
                            Password
                        </label>
                        <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Your password"
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${errors.password
                            ? "border-destructive focus-visible:ring-destructive"
                            : "border-input"
                            }`}
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })}
                    />
                    {errors.password && (
                        <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>
        </div>
    );
}