"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import React from "react";
import { Loader2, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { renderGoogleButton } from "@/lib/googleIdentity";

type SignupFormInputs = {
  username: string;
  email: string;
  // phone: string;
  password: string;
  terms: boolean;
};

type SignupResponse = {
  success: boolean;
  message: string;

};

export default function SignupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      await apiFetch<SignupResponse>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      // Invalidate /me so Header picks up the new user
      await queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("Account created");
      router.replace("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create account. Please try again.");
    }
  };

  const handleGoogleCredential = async (idToken: string) => {
    try {
      await apiFetch<SignupResponse>("/api/v1/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });

      await queryClient.invalidateQueries({ queryKey: ["me"] });

      toast.success("Signed up with Google");
      router.replace("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Google signup failed");
    }
  };

  const googleBtnRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!googleBtnRef.current) return;

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
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 font-body">
      <div className="w-full max-w-[450px] space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="mx-auto mb-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              <span className="text-primary">TribeX</span>
              <span className="text-foreground">eSports</span>
            </h1>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your details below to join the tribe</p>
        </div>

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
              <label htmlFor="username" className="text-sm font-medium leading-none text-foreground">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  placeholder="ProGamer123"
                  className={`flex h-10 w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${errors.username ? "border-destructive focus-visible:ring-destructive" : "border-input"
                    }`}
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" },
                  })}
                />
              </div>
              {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`flex h-10 w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-input"
                    }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium leading-none text-foreground">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  className={`flex h-10 w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${errors.phone ? "border-destructive focus-visible:ring-destructive" : "border-input"
                    }`}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^\d{10}$/, message: "Phone number must be exactly 10 digits" },
                  })}
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div> */}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className={`flex h-10 w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${errors.password ? "border-destructive focus-visible:ring-destructive" : "border-input"
                    }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary/20 bg-background"
                {...register("terms", { required: "You must agree to the terms" })}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm font-medium leading-none text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline hover:text-red-400">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline hover:text-red-400">
                    Privacy Policy
                  </Link>
                </label>
                {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
