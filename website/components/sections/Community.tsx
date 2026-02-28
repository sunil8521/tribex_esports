import {
  Zap,
  KeyRound,
  Headset,
} from "lucide-react";
import {
  FaDiscord,
  FaWhatsapp,
} from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function Community() {
  return (
    <section id="community" className="py-16 md:py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">

        <GlowCard
          customSize={true}
          glowColor="red"
          className="p-0 overflow-hidden border border-white/10"
        >
          {/* Main Background with Red Gradient Accent */}
          <div className="rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-8 md:p-12 relative z-10">

            {/* Background Decorator */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left Column: Text & CTAs */}
              <div className="text-center lg:text-left space-y-6">
                <h2 className="font-headline text-3xl md:text-5xl font-black tracking-tight uppercase">
                  Join The <span className="text-primary drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">TribeX</span>
                  <br />
                  <span className="text-foreground">Community</span>
                </h2>

                <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
                  Don't miss a beat. Connect with thousands of gamers, get instant scrim notifications, and find your next squad.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="relative overflow-hidden bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold tracking-wide border-0 shadow-lg shadow-green-500/20 transition-all hover:scale-105 hover:shadow-green-500/40"
                  >
                    <Link rel="noopener noreferrer" href="https://whatsapp.com/channel/0029Vb6nTSk4o7qDjcH17I1K" target="_blank">
                      <FaWhatsapp className="mr-2 h-5 w-5" />
                      Join WhatsApp
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    className="relative overflow-hidden bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold tracking-wide border-0 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:shadow-indigo-500/40"
                  >
                    <Link rel="noopener noreferrer" href="https://discord.gg/pbFZQMWYQu" target="_blank">
                      <FaDiscord className="mr-2 h-5 w-5" />
                      Join Discord
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Feature 1 */}
                <div className="group bg-black/40 border border-white/5 p-6 rounded-xl text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-black/60 hover:-translate-y-1">
                  <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Fast Updates</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Instant alerts for new tournaments & slots.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="group bg-black/40 border border-white/5 p-6 rounded-xl text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-black/60 hover:-translate-y-1">
                  <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <KeyRound className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Room ID's</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Get ID & Password 15 mins before match.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="group bg-black/40 border border-white/5 p-6 rounded-xl text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-black/60 hover:-translate-y-1">
                  <div className="h-12 w-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Headset className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Direct access to mods for disputes.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </GlowCard>
      </div>
    </section>
  );
}