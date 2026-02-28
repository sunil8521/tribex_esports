"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart2,
  FileText,
  Home,
  LogOut,
  Menu,
  Swords,
  Trophy,
  User,
  User2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import Image from "next/image";

// Navigation Data
const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/my-matches", label: "My Matches", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart2 },
  { href: "/blog", label: "Blog", icon: FileText },
];

type UserInfo = {
  _id: string;
  username?: string;
  email?: string;
  userProfileImage?: string;
  role?: string;
};

type MeResponse = {
  success: boolean;
  data: { user: UserInfo };
};

export default function Header() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const { user, setUser, clearUser } = useAuthStore();

  // Fetch current user from /me. Cookies are httpOnly — this is the only way
  // to know who's logged in. The backend handles silent token refresh, so even
  // if the access token expired, calling /me will get new cookies back.
  const { data, error } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<MeResponse>("/api/v1/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min — re-check session periodically
    refetchOnWindowFocus: true, // re-validate when user returns to tab
  });

  // Sync /me result → Zustand store
  React.useEffect(() => {
    if (data?.data?.user?._id) {
      setUser(data.data.user);
    }
  }, [data, setUser]);

  // If /me returns 401, session is truly dead — clear stale user data
  React.useEffect(() => {
    if (error) {
      clearUser();
    }
  }, [error, clearUser]);

  const isLoggedIn = Boolean(user?._id);

  const closeSheet = () => {
    // Radix Sheet listens for ESC
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  };

  const handleLogout = async () => {
    try {
      await apiFetch<void>("/api/v1/auth/logout", { method: "POST" });
      toast.success("Logged out");
      clearUser();
      // Clear cached user
      queryClient.removeQueries({ queryKey: ["me"] });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent bg-background/40 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            width={36}
            height={36}
            src="/logo.png"
            alt="TribeX Logo"
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-120"
          />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              TribeX
            </span>
            <span className="text-foreground">eSports</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <link.icon className="h-4 w-4 transition-colors group-hover:text-primary" />
              <span>{link.label}</span>
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Right Side Actions (Login/Profile) */}
        <div className="hidden items-center gap-4 xl:flex">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage
                    src={user?.userProfileImage}
                    alt={user?.username || "User Avatar"}
                  />
                  <AvatarFallback>
                    {user?.username?.slice(0, 2).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-primary">
                      {user?.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/75 hover:text-primary">
                  <User className="mr-2 h-4 w-4" />
                  <Link className="w-full" href="/profile">
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/75 hover:text-primary">
                  <Trophy className="mr-2 h-4 w-4" />
                  <Link className="w-full" href="/my-tournaments">
                    My Tournaments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-primary focus:bg-destructive/20 focus:text-primary"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:-translate-y-0.5"
              >
                Join the Tribe
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className=" text-white hover:bg-white/10"
              >
                <Menu className="h-10 w-10" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[350px] border-l border-white/10 bg-black/95 backdrop-blur-xl p-0 text-white"
            >
              <div className="flex flex-col h-full py-12 px-6">
                {/* Top */}
                <div className="flex flex-col items-center justify-center mb-8">
                  {isLoggedIn ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative p-1 rounded-full border-2 border-[#E11D48] shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                        <Avatar className="h-15 w-15 hover:cursor-pointer transition-all">
                          <AvatarImage
                            src={user?.userProfileImage}
                            alt={user?.username || "User Avatar"}
                          />
                          <AvatarFallback>
                            {user?.username?.slice(0, 2).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white">
                          {user?.username}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <Link href="/" className="flex items-center gap-2 mb-4">
                      <Image
                        width={36}
                        height={36}
                        src="/logo.png"
                        alt="TribeX Logo"
                        className="h-9 w-auto transition-transform duration-300 group-hover:scale-120"
                      />
                      <h1 className="text-xl font-bold tracking-tight">
                        <span className="text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                          TribeX
                        </span>
                        <span className="text-foreground">eSports</span>
                      </h1>
                    </Link>
                  )}
                </div>

                {/* Middle */}
                <nav className="flex-1 flex flex-col items-center justify-center gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeSheet}
                      className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-[#E11D48] hover:scale-105 transition-all duration-200"
                    >
                      <link.icon className="h-5 w-5 opacity-70" />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Bottom */}
                <div className="mt-auto pt-8 border-t border-white/10 w-full">
                  {isLoggedIn ? (
                    <div className="flex flex-col gap-3 px-4">
                      <Link href="/my-tournaments" onClick={closeSheet}>
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
                        >
                          <Trophy className=" h-4 w-4" /> My Tournaments
                        </Button>
                      </Link>

                      <Link href="/profile" onClick={closeSheet}>
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
                        >
                          <User2 className="h-4 w-4" /> My Profile
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 mt-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Log Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-4 px-2">
                      <Link
                        href="/login"
                        onClick={closeSheet}
                        className="flex-1"
                      >
                        <Button
                          variant="ghost"
                          className="w-full text-white hover:text-[#E11D48] hover:bg-[#E11D48]/10 font-semibold"
                        >
                          Login
                        </Button>
                      </Link>
                      <div className="h-6 w-1px bg-white/20" />
                      <Link
                        href="/signup"
                        className="flex-1"
                        onClick={closeSheet}
                      >
                        <Button className="w-full bg-[#E11D48] hover:bg-[#be123c] text-white shadow-lg shadow-red-900/20 font-semibold">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
