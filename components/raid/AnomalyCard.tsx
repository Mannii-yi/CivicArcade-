"use client";
import HUDPanel from "@/components/ui/HUDPanel";

interface Props {
  enemyType:        string;
  severityLevel:    number;
  xpBounty:         number;
  requiredParty:    number;
  description:      string;
}

const severityColor = (s: number) =>
  s >= 8 ? "text-neon-pink" : s >= 5 ? "text-neon-amber" : "text-neon-green";

const severityLabel = (s: number) =>
  s >= 8 ? "CRITICAL" : s >= 5 ? "MODERATE" : "LOW";

export default function AnomalyCard({
  enemyType, severityLevel, xpBounty, requiredParty, description,
}: Props) {
  return (
    <HUDPanel
      title="ANOMALY DETECTED"
      color={severityLevel >= 8 ? "pink" : severityLevel >= 5 ? "amber" : "green"}
      className="w-full"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <span className="font-pixel text-[9px] text-white/80 max-w-[160px] leading-4">
            {enemyType.toUpperCase()}
          </span>
          <span className={`font-pixel text-[8px] ${severityColor(severityLevel)}`}>
            {severityLabel(severityLevel)}
          </span>
        </div>

        <p className="font-mono text-[9px] text-white/50 leading-4 border-t border-white/10 pt-2">
          {description}
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: "SEVERITY", value: `${severityLevel}/10` },
            { label: "XP BOUNTY", value: `+${xpBounty}` },
            { label: "PARTY REQ", value: `×${requiredParty}` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center border border-white/10 p-1">
              <p className="font-mono text-[7px] text-white/30">{label}</p>
              <p className="font-pixel text-[8px] text-neon-green mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </HUDPanel>
  );
}