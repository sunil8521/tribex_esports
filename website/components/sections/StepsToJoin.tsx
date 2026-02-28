import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import { GlowCard } from "@/components/ui/spotlight-card"; // Ensure you have this component, or use standard Card
import { cn } from "@/lib/utils";
import { UserPlus, Trophy, Swords } from "lucide-react"; // Added icons for visual appeal

// Updated StepIcon to use Primary Color (Red)
const StepIcon = ({ number, icon: Icon, className }: { number: number, icon: any, className?: string }) => (
  <div className={cn("relative h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]", className)}>
    <div className="absolute inset-0 flex items-center justify-center">
      <Icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
    </div>
    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
      {number}
    </div>
  </div>
);

export default function StepsToJoin() {
  return (
    <section id="steps-to-join" className="py-16 md:py-24 bg-background relative overflow-hidden">

      {/* Background Decorator (Optional) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            <span className="text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">3 Simple Steps</span> to Join
          </h2>
          <div className="mx-auto mt-6 grid max-w-3xl gap-4">
            <p className="text-lg text-muted-foreground">
              Participating in <span className="text-foreground font-semibold">TribeX</span> tournaments is effortless.
              Register, choose your battle, and start your journey to pro status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Step 1 */}
          <GlowCard customSize={true} className="text-center flex flex-col p-0 h-full group bg-card/50 backdrop-blur-sm border-white/5" glowColor="red">
            <CardHeader className="flex flex-col items-center pt-8">
              <StepIcon number={1} icon={UserPlus} className="mx-auto" />
              <CardTitle className="mt-6 font-headline text-xl text-foreground">Create Account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow items-center justify-between pb-8 px-6">
              <CardDescription className="text-center text-base">
                Sign up in seconds via Discord or Email to unlock your personalized dashboard.
              </CardDescription>
              <div className="mt-6 w-full">
                <Button asChild variant="link" className="text-primary ">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </GlowCard>

          {/* Step 2 */}
          <GlowCard customSize={true} className="text-center flex flex-col p-0 h-full group bg-card/50 backdrop-blur-sm border-white/5" glowColor="red">
            <CardHeader className="flex flex-col items-center pt-8">
              <StepIcon number={2} icon={Trophy} className="mx-auto" />
              <CardTitle className="mt-6 font-headline text-xl text-foreground">Select Tournament</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col grow items-center justify-between pb-8 px-6">
              <CardDescription className="text-center text-base">
                Browse our daily scrims and weekly tournaments. Filter by game, rank, or prize pool.
              </CardDescription>
              <div className="mt-6 w-full">
                <Button asChild variant="link" className="text-primary">
                  <Link href="/tournaments">Explore</Link>
                </Button>
              </div>
            </CardContent>
          </GlowCard>

          {/* Step 3 */}
          <GlowCard customSize={true} className="text-center flex flex-col p-0 h-full group bg-card/50 backdrop-blur-sm border-white/5" glowColor="red">
            <CardHeader className="flex flex-col items-center pt-8">
              <StepIcon number={3} icon={Swords} className="mx-auto" />
              <CardTitle className="mt-6 font-headline text-xl text-foreground">Compete & Win</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow items-center justify-between pb-8 px-6">
              <CardDescription className="text-center text-base">
                Join the lobby, battle it out, and claim your rewards instantly on the leaderboard.
              </CardDescription>
              <div className="mt-6 w-full">
                <Button asChild variant="link" className="text-primary">
                  <Link href="/signin">Join Now</Link>
                </Button>
              </div>
            </CardContent>
          </GlowCard>

        </div>
      </div>
    </section>
  );
}