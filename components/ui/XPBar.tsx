"use client";

interface Props {
  xp: number;
  level: number;
}

const XP_PER_LEVEL = 500;

export default function XPBar({ xp, level }: Props) {
  const currentLevelXP = xp % XP_PER_LEVEL;
  const pct = Math.min((currentLevelXP / XP_PER_LEVEL) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="font-pixel text-[7px] text-neon-green/60">XP</span>
        <span className="font-mono text-[9px] text-neon-green/60">
          {currentLevelXP} / {XP_PER_LEVEL}
        </span>
      </div>
      <div className="h-1.5 w-full bg-hud-border relative overflow-hidden">
        <div
          className="h-full bg-neon-green transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 6px #39FF14, 0 0 12px #39FF1460",
          }}
        />
        {/* Scanline tick marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 w-px bg-hud-bg/60"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>
      <p className="font-pixel text-[7px] text-neon-green/40 mt-0.5 text-right">
        NEXT LVL {level + 1}
      </p>
    </div>
  );
}