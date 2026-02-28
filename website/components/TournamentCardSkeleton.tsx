/* Animated skeleton matching TournamentCard layout */

const TournamentCardSkeleton = () => {
    return (
        <div className="relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-card/50 animate-pulse">
            {/* Thumbnail skeleton */}
            <div className="relative aspect-video w-full bg-white/5">
                {/* Floating badge placeholders */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <div className="h-5 w-12 rounded-full bg-white/10" />
                    <div className="h-5 w-14 rounded-full bg-white/10" />
                </div>
                <div className="absolute top-3 right-3">
                    <div className="h-5 w-16 rounded-full bg-white/10" />
                </div>
            </div>

            {/* Content skeleton */}
            <div className="flex flex-col flex-1 p-5">
                {/* Title */}
                <div className="h-5 w-3/4 rounded bg-white/10 mb-3" />

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-16 rounded bg-white/5" />
                        <div className="h-5 w-20 rounded bg-white/10" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-16 rounded bg-white/5" />
                        <div className="h-5 w-12 rounded bg-white/10" />
                    </div>
                </div>

                {/* Schedule */}
                <div className="h-3 w-32 rounded bg-white/5 mb-4" />

                {/* Slots progress */}
                <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                        <div className="h-3 w-10 rounded bg-white/5" />
                        <div className="h-3 w-12 rounded bg-white/5" />
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5" />
                </div>

                {/* Button */}
                <div className="mt-auto pt-4 border-t border-white/5">
                    <div className="h-10 w-full rounded-md bg-white/10" />
                </div>
            </div>
        </div>
    );
};

export default TournamentCardSkeleton;
