import { GlowCard } from "@/components/ui/spotlight-card";

const GAMES_DATA = [
  {
    id: "f1-cover",
    title: "F1 24",
    imageUrl: "https://media.contentapi.ea.com/content/dam/ea/f1/f1-24/common/f124-standard-ed-16x9.jpg.adapt.crop191x100.1200w.jpg",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "pubg-cover",
    title: "PUBG Mobile",
    imageUrl: "https://st1.techlusive.in/wp-content/uploads/2024/09/BGMI-3.4-update.jpg",
    className: "",
  },
  {
    id: "cod-cover",
    title: "Call of Duty: Black Ops 6",
    imageUrl: "https://preview.redd.it/cod-which-cod-game-has-the-best-cover-art-ill-go-first-v0-lhwczd71sel91.jpg?auto=webp&s=68ee52f75c50f7ba4539b8094b39b6654ef7b295",
    className: "",
  },
  {
    id: "valorant-cover-new",
    title: "Valorant",
    imageUrl: "https://variety.com/wp-content/uploads/2024/08/valorant.png",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "freefire-cover",
    title: "Free Fire",
    imageUrl: "https://dl.dir.freefiremobile.com/common/web_event/hash/54f31449f5f91cf0cc223cc635cd5952jpg",
    className: "",
  },
  {
    id: "fortnite-cover",
    title: "Fortnite",
    imageUrl: "https://300mind.studio/blog/wp-content/uploads/2023/12/Fortnite-Game-Strategies.webp",
    className: "",
  },
];

export default function FeaturedGames() {
  return (
    <section id="games" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            <span className="text-primary drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">Featured</span> Games
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Explore the arenas where legends are born.
          </p>
        </div>

        {/* I kept your original auto-rows-[300px] size */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-4">
          {GAMES_DATA.map((game) => (
            <GlowCard
              key={game.id}
              className={game.className}
              customSize={true}
              glowColor="red"
              borderGlowOnly={true}
            >
              {/* Parent needs 'relative h-full w-full' so image knows what to fill */}
              <div className="group relative w-full h-full overflow-hidden rounded-2xl">


                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white font-bold text-lg">{game.title}</h3>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}