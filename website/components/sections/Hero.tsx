'use client';

import { useRef } from "react";
import Link from "next/link";
// Changed from next/link
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Trophy, ChartBar } from "lucide-react"; // Icons for buttons

// 1. Your JSON Data (Integrated directly)
const PLACEHOLDER_IMAGES = [
  {
    id: "hero-valorant-1",
    description: "Valorant promotional art",
    imageUrl: "https://static.wikia.nocookie.net/valorant/images/3/3a/Closed_Beta_Promo.jpg",
    imageHint: "esports game"
  },
  {
    id: "hero-pubg-1",
    description: "PUBG mobile art",
    imageUrl: "https://cdn.asoworld.com/img/7013538fee3f4ec2993a8bf2c3a9c1a4.jpg",
    imageHint: "battle royale"
  },
  {
    id: "hero-csgo-1",
    description: "Counter-Strike: Global Offensive wallpaper",
    imageUrl: "https://images.logicalincrements.com/gallery/1920/822/csgowallpaper5.webp",
    imageHint: "first-person shooter"
  },
  {
    id: "hero-bgmi-1",
    description: "Battlegrounds Mobile India update art",
    imageUrl: "https://st1.techlusive.in/wp-content/uploads/2024/09/BGMI-3.4-update.jpg",
    imageHint: "mobile gaming"
  },
  {
    id: "hero-csgo-2",
    description: "Counter-Strike: Global Offensive artwork",
    imageUrl: "https://pixelz.cc/wp-content/uploads/2017/11/counter-strike-global-offensive-cs-go-artwork-uhd-4k-wallpaper.jpg",
    imageHint: "action game"
  }
];

export default function Hero() {
  const plugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: true }));

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-black">
      {/* 2. Carousel Section */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent className="h-full ml-0"> {/* ml-0 fixes standard spacing issues in full width */}
          {PLACEHOLDER_IMAGES.map((image, index) => (
            <CarouselItem key={image.id} className="relative h-[90vh] min-h-[600px] w-full pl-0">
              {/* React Image Optimization Strategy:
                  - First image gets loading="eager" (loads instantly)
                  - Others get loading="lazy" (saves bandwidth)
              */}
              <img

                src={image.imageUrl}
                alt={image.description}
                loading={index === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover brightness-75 transition-transform duration-1000 ease-in-out"
                style={{ objectPosition: "center 20%" }}
              />

              {/* Dark Gradient Overlay for readability */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent opacity-90" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent" />

      {/* 3. Text & Content Layer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center md:px-6">
        <div className="container mx-auto animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10">

          {/* Main Headline - Scaled for Mobile & Laptop */}
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
              Join
            </span>{' '}
            The Ultimate Esports Experience Today!
          </h1>

          <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Dive into thrilling tournaments and connect with fellow gamers.
            Discover your next favorite game and be part of our vibrant community!
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/tournaments">
              <Button
                size="lg"
                className="h-14 w-full min-w-[200px] gap-2 rounded-full border-2 border-primary bg-primary text-xl font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105 hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] sm:w-auto"
              >
                <Trophy className="h-6 w-6" />
                Tournaments
              </Button>
            </Link>

            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full min-w-[200px] gap-2 rounded-full border-2 border-white/20 bg-black/40 text-xl font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white hover:bg-white/10 sm:w-auto"
              >
                <ChartBar className="h-6 w-6" />
                Leaderboard
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

