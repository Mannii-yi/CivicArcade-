"use client";
import { useEffect, useState } from "react";
import HUDPanel from "./HUDPanel";
import { supabase } from "@/lib/supabase";

interface Row {
  username: string;
  xp:       number;
  level:    number;
}

// Fallback mock data so hackathon demo always has content
const MOCK_LEADERS: Row[] = [
  { username: "HERO_01",   xp: 850, level: 2 },
  { username: "CIVIC_X",   xp: 620, level: 2 },
  { username: "PATCH_R",   xp: 410, level: 1 },
  { username: "ZONE_07",   xp: 280, level: 1 },
  { username: "ANOMALY_K", xp: 120, level: 1 },
];

const RANK_COLORS = ["text-neon-amber", "text-white/60", "text-neon-amber/40"];

export default function Leaderboard({ localXp }: { localXp: number }) {
  const [rows, setRows] = useState<Row[]>(MOCK_LEADERS);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("username, xp, level")
      .order("xp", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) setRows(data as Row[]);
      });
  }, [localXp]);

  // Inject local player dynamically
  const merged = [...rows]
    .map(r => r.username === "HERO_01" ? { ...r, xp: localXp } : r)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5);

  return (
    <HUDPanel title="LEADERBOARD" color="amber" className="w-full">
      <div className="space-y-1.5">
        {merged.map((row, i) => (
          <div key={row.username}
            className={`flex items-center gap-2 ${row.username === "HERO_01" ? "opacity-100" : "opacity-70"}`}>
            <span className={`font-pixel text-[8px] w-4 ${RANK_COLORS[i] ?? "text-white/30"}`}>
              {i + 1}
            </span>
            <div className="flex-1 h-px bg-white/5" />
            <span className={`font-mono text-[9px] ${row.username === "HERO_01" ? "text-neon-green" : "text-white/50"}`}>
              {row.username}
            </span>
            <span className="font-pixel text-[7px] text-neon-amber w-12 text-right">
              {row.xp} XP
            </span>
          </div>
        ))}
      </div>
    </HUDPanel>
  );
}