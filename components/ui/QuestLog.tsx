"use client";
import { useEffect, useRef } from "react";
import HUDPanel from "./HUDPanel";

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: "info" | "warn" | "danger" | "success";
}

interface Props {
  entries: LogEntry[];
}

const typeStyles = {
  info:    "text-neon-blue",
  warn:    "text-neon-amber",
  danger:  "text-neon-pink",
  success: "text-neon-green",
};

const typePrefix = {
  info:    "ℹ",
  warn:    "⚠",
  danger:  "✖",
  success: "✔",
};

export default function QuestLog({ entries }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
    <HUDPanel title="QUEST LOG" className="w-72" color="blue">
      <div className="h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        {entries.length === 0 && (
          <p className="font-mono text-[9px] text-neon-blue/30 italic">
            Awaiting anomaly signals…
          </p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-2 items-start">
            <span className={`font-mono text-[9px] shrink-0 ${typeStyles[entry.type]}`}>
              {typePrefix[entry.type]}
            </span>
            <div className="flex-1">
              <span className="font-mono text-[9px] text-neon-blue/40 mr-1">
                [{entry.time}]
              </span>
              <span className={`font-mono text-[9px] ${typeStyles[entry.type]}`}>
                {entry.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </HUDPanel>
  );
}