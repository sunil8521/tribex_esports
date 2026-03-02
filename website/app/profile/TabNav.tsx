"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  CreditCard,
  Gamepad2,
  Shield,
  User,
  Users,
} from "lucide-react";

const tabs = [
  { id: "profile", href: "/profile", label: "My Profile", icon: User },
  { id: "games", href: "/profile/games", label: "Game Profiles", icon: Gamepad2 },
  { id: "teams", href: "/profile/teams", label: "Teams", icon: Users },
  { id: "security", href: "/profile/security", label: "Security", icon: Shield },
  { id: "billing", href: "/profile/billing", label: "Billing", icon: CreditCard },
  { id: "danger", href: "/profile/danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-white/10">
      <div className="flex gap-6">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 py-4 border-b-2 transition ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}