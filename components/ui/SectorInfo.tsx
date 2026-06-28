"use client";
import HUDPanel from "./HUDPanel";

interface Props {
  hexId:      string | null;
  questCount: number;
  status:     "safe" | "active" | "corrupted" | null;
}

const statusLabel = {
  safe:      { label: "SECURE ZONE",   color: "text-neon-green" },
  active:    { label: "RAID ACTIVE",   color: "text-neon-amber" },
  corrupted: { label: "CORRUPTED",     color: "text-neon-pink"  },
};

export default function SectorInfo({ hexId, questCount, status }: Props) {
  const info = status ? statusLabel[status] : null;

  return (
    <HUDPanel title="SECTOR SCAN" className="w-64" color={status === "corrupted" ? "pink" : status === "active" ? "amber" : "green"}>
      <div className="font-mono text-[11px] space-y-1.5">
        <div className="flex justify-between">
          <span className="opacity-50">SECTOR ID</span>
          <span className="text-neon-blue truncate max-w-[130px]">
            {hexId ? hexId.slice(0, 15) + "…" : "---"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">STATUS</span>
          <span className={info?.color ?? "opacity-30"}>
            {info?.label ?? "SCANNING…"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">QUESTS</span>
          <span>{questCount ?? 0} ACTIVE</span>
        </div>
      </div>
    </HUDPanel>
  );
}