import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, MoveLeft } from "lucide-react";
import Link from "next/link";
const NotFound = () => {
  return (
    <div className="relative min-h-dvh w-full bg-[#020617] overflow-hidden flex items-center justify-center font-body selection:bg-red-500/30">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-20%] left-[20%] w-125 h-125 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center justify-center h-full text-center">
        
        {/* --- 1. GLITCHY 404 TEXT ART --- */}
        <div className="relative mb-8 select-none">
           {/* Background Shadow Layer */}
           <h1 className="text-[120px] sm:text-[180px] md:text-[250px] font-black text-white/5 tracking-tighter blur-sm absolute inset-0 transform translate-x-2 translate-y-2">
             404
           </h1>
           
           {/* Main Text Layer */}
           <h1 className="relative text-[120px] sm:text-[180px] md:text-[250px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-b from-white to-white/10 drop-shadow-2xl">
             404
           </h1>

           {/* Overlay "VOID" Badge */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/20 backdrop-blur-md border border-red-500/50 px-6 py-2 rounded-full rotate-[-10deg]">
              <span className="text-red-500 font-bold tracking-[0.5em] text-md md:text-2xl">LOST_CONNECTION</span>
           </div>
        </div>

        {/* --- 2. TEXT CONTENT --- */}
        <div className="space-y-6 max-w-2xl mx-auto relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse mx-auto">
            <AlertTriangle className="w-3 h-3" /> System Failure
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            YOU ARE <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E11D48] to-orange-600">OUT OF ZONE</span>
          </h2>
          
          <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
            The map coordinate you are looking for has been eliminated or never existed. 
            Rotate back to the safe zone before the circle closes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto bg-[#E11D48] hover:bg-[#be123c] text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] font-bold text-base h-12 px-8">
                <Home className="w-4 h-4 mr-2" /> Return to Lobby
              </Button>
            </Link>
            <Link href="/tournaments">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/10 text-white hover:bg-white/5 font-bold text-base h-12">
                <MoveLeft className="w-4 h-4 mr-2" /> Find Match
                </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;