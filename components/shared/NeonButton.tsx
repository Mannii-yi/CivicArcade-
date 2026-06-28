"use client";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "pink" | "amber";
  size?:    "sm" | "md" | "lg";
}

const variants = {
  green: "border-neon-green text-neon-green hover:bg-neon-green hover:text-hud-bg shadow-neon-green",
  pink:  "border-neon-pink  text-neon-pink  hover:bg-neon-pink  hover:text-hud-bg shadow-neon-pink",
  amber: "border-neon-amber text-neon-amber hover:bg-neon-amber hover:text-hud-bg shadow-neon-amber",
};

const sizes = {
  sm: "text-[8px]  px-3 py-1.5",
  md: "text-[10px] px-4 py-2",
  lg: "text-[11px] px-6 py-3",
};

export default function NeonButton({
  variant = "green", size = "md", className, children, ...props
}: Props) {
  return (
    <button
      className={cn(
        "font-pixel border transition-all duration-150",
        "disabled:opacity-30 disabled:cursor-not-allowed",
        "active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}