import Link from "next/link";
import { Trophy, Users, Coins, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Tournament, TournamentStatus } from "@/types/api";

/* ── Status badge config ──────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; className: string; pulse?: boolean }> = {
  CREATED: { label: "Upcoming", className: "bg-blue-600/20 text-blue-400 border-blue-600/50" },
  REG_OPEN: { label: "Open", className: "bg-green-600/20 text-green-400 border-green-600/50" },
  REG_CLOSED: { label: "Reg Closed", className: "bg-yellow-600/20 text-yellow-400 border-yellow-600/50" },
  QUAL_RUNNING: { label: "Qualifiers", className: "bg-purple-600/20 text-purple-400 border-purple-600/50", pulse: true },
  QUAL_COMPLETE: { label: "Quals Done", className: "bg-indigo-600/20 text-indigo-400 border-indigo-600/50" },
  SEMI_RUNNING: { label: "Semis Live", className: "bg-purple-600/20 text-purple-400 border-purple-600/50", pulse: true },
  SEMI_COMPLETE: { label: "Semis Done", className: "bg-indigo-600/20 text-indigo-400 border-indigo-600/50" },
  FINALS: { label: "Finals", className: "bg-orange-600/20 text-orange-400 border-orange-600/50", pulse: true },
  COMPLETED: { label: "Ended", className: "bg-gray-600/20 text-gray-400 border-gray-600/50" },
  CANCELLED: { label: "Cancelled", className: "bg-red-600/20 text-red-400 border-red-600/50" },
};

function StatusBadge({ status }: { status: TournamentStatus }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-600/20 text-gray-400" };
  return (
    <Badge className={`${config.className} ${config.pulse ? "animate-pulse" : ""}`}>
      {config.label}
    </Badge>
  );
}

/* ── Helpers ──────────────────────────────────────────────── */

function totalPrize(pool: Tournament["prizePool"]): number {
  return pool.reduce((sum, p) => sum + p.amount, 0);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const MODE_LABEL: Record<string, string> = { solo: "Solo", duo: "Duo", squad: "Squad" };

/* ── Component ───────────────────────────────────────────── */

const TournamentCard = ({ card }: { card: Tournament }) => {
  const {
    _id,
    title,
    game,
    mode,
    status,
    entryFee,
    prizePool,
    registeredCount,
    maxParticipants,
    thumbnail,
    schedule,
  } = card;

  const thumbnailUrl = thumbnail?.url
    ? thumbnail.url.replace("/upload/", "/upload/f_auto,q_auto,dpr_auto/")
    : "/placeholder.jpg";

  const isFull = maxParticipants > 0 && registeredCount >= maxParticipants;
  const progress = maxParticipants > 0 ? (registeredCount / maxParticipants) * 100 : 0;
  const isJoinable = status === "REG_OPEN" && !isFull;
  const prize = totalPrize(prizePool);

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="backdrop-blur-md bg-black/50 border-white/10">
            {game}
          </Badge>
          <Badge variant="secondary" className="backdrop-blur-md bg-black/50 border-white/10">
            {MODE_LABEL[mode] ?? mode}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="mb-3 line-clamp-1 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Prize Pool
            </span>
            <span className="font-bold text-green-400">
              {prize > 0 ? `₹${prize.toLocaleString()}` : "TBD"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Coins className="w-3 h-3" /> Entry Fee
            </span>
            <span className={entryFee.amount === 0 ? "font-bold text-primary" : "font-bold text-foreground"}>
              {entryFee.amount === 0 ? "FREE" : `₹${entryFee.amount}`}
            </span>
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Calendar className="w-3 h-3" />
          <span>Starts {formatDate(schedule.qualifierStart)}</span>
        </div>

        {/* Slots Progress */}
        {(status === "REG_OPEN" || status === "CREATED") && (
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> Slots
              </span>
              <span className={isFull ? "text-red-400 font-bold" : "text-foreground"}>
                {registeredCount}/{maxParticipants}
              </span>
            </div>
            <Progress
              value={progress}
              className={`h-1.5 bg-white/10 ${isFull ? "*:bg-red-500" : "*:bg-primary"}`}
            />
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5">
          {isJoinable ? (
            <Link href={`/tournaments/${_id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all">
                Join Tournament
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <Link href={`/tournaments/${_id}`}>
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                View Details
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
