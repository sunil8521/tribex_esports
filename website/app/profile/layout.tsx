import Link from "next/link";
import TabNav from "./TabNav";
import {
  AlertTriangle,
  CreditCard,
  Gamepad2,
  Shield,
  User,
  Users,
} from "lucide-react";


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
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-body">
         <div className="max-w-6xl mx-auto">
           {/* Header */}
           <div className="mb-8">
             <h1 className="text-3xl font-headline fon t-bold text-white">Settings</h1>
             <p className="text-muted-foreground">
               Manage your account preferences and game profiles.
             </p>
           </div>
   
           <div className="space-y-8">
             {/* Tab Navigation */}
             <TabNav />
           
   
             {/* Tab Content */}
             <div className="w-full">
              {children}
             </div>
           </div>
         </div>
       </div>
  );
}