
const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-black text-white">
      
      {/* Container for Animation */}
      <div className="flex flex-col items-center justify-center gap-4">
        
        {/* The Breathing Logo */}
        <h1 className="font-headline text-4xl sm:text-6xl font-black tracking-tighter animate-pulse-deep">
          <span className="text-[#E11D48] drop-shadow-[0_0_15px_rgba(225,29,72,0.6)]">
            TribeX
          </span>
          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            eSports
          </span>
        </h1>

        {/* Optional: Minimal Loading Bar */}
        <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full bg-[#E11D48] animate-loading-bar origin-left" />
        </div>

      </div>
    </div>
  );
};

export default AppLoader;