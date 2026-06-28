"use client";

interface Props {
  username: string;
  level: number;
  xp: number;
}

export default function Navbar({ username, level, xp }: Props) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 bg-hud-bg/80 backdrop-blur-sm border-b border-neon-green/20">
      
      {/* Left: game title */}
      <div>
        <span className="font-pixel text-neon-green text-[11px] tracking-widest animate-flicker">
          CIVIC
        </span>
        <span className="font-pixel text-neon-pink text-[11px] tracking-widest">
          ARCADE
        </span>
        <span className="font-mono text-[9px] text-neon-green/30 ml-3">v1.0</span>
      </div>

      {/* Center: server status */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
        <span className="font-mono text-[9px] text-neon-green/60 tracking-widest">
          SERVER ONLINE · DELHI SECTOR
        </span>
      </div>

      {/* Right: player info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-pixel text-neon-blue text-[8px]">{username}</p>
          <p className="font-mono text-[9px] text-neon-green/50">
            LVL {level} · {xp} XP
          </p>
        </div>
        <div className="w-7 h-7 border border-neon-blue flex items-center justify-center text-neon-blue font-pixel text-[8px]">
          {username[0]?.toUpperCase()}
        </div>
      </div>
    </div>
  );
}