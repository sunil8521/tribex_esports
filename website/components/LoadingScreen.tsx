import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-100 flex h-screen w-screen items-center justify-center bg-black/90 backdrop-blur-md transition-all">
      <div className="flex flex-col items-center gap-6">
        
        {/* Animated Spinner with Glow */}
        <div className="relative flex items-center justify-center">
          {/* Background Pulse Effect */}
          <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/20 opacity-75" />
          
          {/* Main Spinner */}
          <Loader2 className="relative h-16 w-16 animate-spin text-primary drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
        </div>

        {/* Text Animation */}
        <div className="text-center space-y-2">
          <h2 className="font-headline text-2xl font-bold tracking-widest text-foreground">
            TRIBEX<span className="text-primary">ESPORTS</span>
          </h2>
          
         
          
      
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;