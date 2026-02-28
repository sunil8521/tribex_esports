'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Mail, Lock, Key, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface EmailFormInput {
  email: string;
}

interface ResetFormInput {
  otp: string;
  newPassword: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const emailForm = useForm<EmailFormInput>();
  const resetForm = useForm<ResetFormInput>();

  const onEmailSubmit: SubmitHandler<EmailFormInput> = async (data) => {
    try {
      setIsRequesting(true);
      await apiFetch<void>("/users/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
      });
      setEmail(data.email);
      setStep("otp");
      toast.success("Reset code sent to your email");
    } catch (error: any) {
      toast.error(error?.message || "Failed to send reset code");
    } finally {
      setIsRequesting(false);
    }
  };

  const onResetSubmit: SubmitHandler<ResetFormInput> = async (data) => {
    try {
      setIsResetting(true);
      await apiFetch<void>("/users/verify-otp", {
        method: "POST",
        body: JSON.stringify({ otp: data.otp, newPassword: data.newPassword }),
      });
      toast.success("Password reset successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.message || "Invalid code or failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 font-body">
      <div className="w-full max-w-100 space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="mx-auto mb-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              <span className="text-primary">TribeX</span>
              <span className="text-foreground">eSports</span>
            </h1>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {step === "email" ? "Forgot password?" : "Reset password"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === "email"
              ? "Enter your email to receive a reset code"
              : `We've sent a code to ${email}`}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {step === "email" ? (
            <form
              key="email-form"
              autoComplete="on"
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="name@example.com"
                    className={`flex h-10 w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                      emailForm.formState.errors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-input"
                    }`}
                    {...emailForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isRequesting}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {isRequesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <>
                    Send Reset Code <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form
              key="reset-form"
              autoComplete="off"
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              className="space-y-4"
            >
              <input
                type="text"
                autoComplete="username"
                value={email}
                readOnly
                className="hidden"
                style={{ display: "none" }}
              />

              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium leading-none text-foreground">
                  Reset Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter 6-digit code"
                    className={`flex h-10 w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                      resetForm.formState.errors.otp
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-input"
                    }`}
                    {...resetForm.register("otp", {
                      required: "Reset code is required",
                    })}
                  />
                </div>
                {resetForm.formState.errors.otp && (
                  <p className="text-xs text-destructive">
                    {resetForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium leading-none text-foreground"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    className={`flex h-10 w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
                      resetForm.formState.errors.newPassword
                        ? "border-destructive focus-visible:ring-destructive"
                        : "border-input"
                    }`}
                    {...resetForm.register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {resetForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="flex w-full items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to email
              </button>
            </form>
          )}
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
