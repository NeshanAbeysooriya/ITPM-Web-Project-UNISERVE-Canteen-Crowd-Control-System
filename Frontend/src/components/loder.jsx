export function Loder() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col justify-center items-center gap-6">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute w-24 h-24 bg-accent/20 rounded-full animate-ping"></div>
        
        {/* Middle Rotating Segmented Ring */}
        <div className="w-20 h-20 border-4 border-transparent border-t-accent border-r-accent rounded-full animate-spin"></div>
        
        {/* Inner Solid Morphing Core */}
        <div className="absolute w-12 h-12 bg-gradient-to-tr from-accent to-highlight rounded-2xl animate-pulse rotate-45 shadow-lg shadow-accent/40"></div>
        
        {/* Center Dot */}
        <div className="absolute w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Modern Loading Text */}
      <div className="flex flex-col items-center">
        <span className="text-secondary font-black tracking-[0.2em] uppercase text-xs animate-pulse">
          UniServe
        </span>
        <div className="mt-2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}