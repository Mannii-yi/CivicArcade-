"use client";
import { cn } from "@/lib/utils";

interface Props {
  title?:     string;
  className?: string;
  children:   React.ReactNode;
  color?:     "green" | "pink" | "amber" | "blue";
}

export default function HUDPanel({ title, className, children, color = "green" }: Props) {
  const borderColor = {
    green: "#39FF14",
    pink:  "#FF007F",
    amber: "#FFD700",
    blue:  "#00F5FF",
  }[color];

  const titleColor = {
    green: "text-neon-green",
    pink:  "text-neon-pink",
    amber: "text-neon-amber",
    blue:  "text-neon-blue",
  }[color];

  return (
    <div
      className={cn("p-3 relative", className)}
      style={{
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${borderColor}40`,
        boxShadow: `inset 0 0 20px rgba(0,0,0,0.5), 0 0 8px ${borderColor}20`,
      }}
    >
      {title && (
        <div className={cn("font-pixel text-[7px] mb-2 pb-1.5 border-b border-white/10", titleColor)}>
          ▸ {title}
        </div>
      )}
      {children}
    </div>
  );
}