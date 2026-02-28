"use client";

import {
  AlertTriangle,
  CreditCard,
  Gamepad2,
  Shield,
  User,
  Users,
} from "lucide-react";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy-load tab content — profile is auth-protected so SEO doesn't matter.
// This reduces the initial page bundle significantly.
const ProfileTab = dynamic(() => import("@/components/profile/ProfileTab"), {
  ssr: false,
});
const GameTab = dynamic(() => import("@/components/profile/GameTab"), {
  ssr: false,
});
const TeamTab = dynamic(() => import("@/components/profile/TeamTab"), {
  ssr: false,
});
const SecurityTab = dynamic(() => import("@/components/profile/SecurityTab"), {
  ssr: false,
});
const BillingTab = dynamic(() => import("@/components/profile/BillingTab"), {
  ssr: false,
});
const DangerTab = dynamic(() => import("@/components/profile/DangerTab"), {
  ssr: false,
});

/* ── Tab definitions ─────────────────────────────────────────── */

const TAB_IDS = ["profile", "games", "teams", "security", "billing", "danger"] as const;
type TabId = (typeof TAB_IDS)[number];

const tabs: { id: TabId; label: string; icon: React.ElementType; variant?: "danger" }[] = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "games", label: "Game Profiles", icon: Gamepad2 },
  { id: "teams", label: "Teams", icon: Users },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing & Payments", icon: CreditCard },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, variant: "danger" },
];

/* ── Page ─────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use URL search param for tab state (?tab=games) — Next.js way
  // Shareable, works with browser back button, no extra state management
  const rawTab = searchParams.get("tab");
  const activeTab: TabId = TAB_IDS.includes(rawTab as TabId) ? (rawTab as TabId) : "profile";

  const setActiveTab = (id: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "profile") {
      params.delete("tab");
    } else {
      params.set("tab", id);
    }
    const qs = params.toString();
    router.replace(`/profile${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-white">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and game profiles.
          </p>
        </div>

        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Profile sections"
                className="overflow-x-auto thin-scrollbar w-full sm:w-auto"
              >
                <div className="inline-flex items-center gap-3 px-2 py-2 sm:py-0">
                  {tabs.map(({ id, label, icon: Icon, variant }) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activeTab === id}
                      onClick={() => setActiveTab(id)}
                      className={`relative flex items-center gap-2 px-1 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === id
                        ? variant === "danger"
                          ? "border-red-500 text-red-500"
                          : "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-white/10"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${activeTab === id ? "" : "opacity-70"}`} />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            <Suspense
              fallback={
                <div className="py-12 text-center text-muted-foreground">Loading…</div>
              }
            >
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "games" && <GameTab />}
              {activeTab === "teams" && <TeamTab />}

              {activeTab === "security" && <SecurityTab />}
              {activeTab === "billing" && <BillingTab />}
              {activeTab === "danger" && <DangerTab />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
