"use client";

interface Props {
  lat:         number | null;
  lng:         number | null;
  activeRaids: number;
  totalXp:     number;
  hexId:       string | null;
}

export default function MiniStats({ lat, lng, activeRaids, totalXp, hexId }: Props) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
      height: 28,
      background: "rgba(0,0,0,0.75)",
      borderTop: "1px solid rgba(57,255,20,0.15)",
      display: "flex", alignItems: "center",
      padding: "0 16px", gap: 24,
    }}>
      {[
        { label: "LAT",    value: lat?.toFixed(4)  ?? "---" },
        { label: "LNG",    value: lng?.toFixed(4)  ?? "---" },
        { label: "RAIDS",  value: String(activeRaids) },
        { label: "XP",     value: String(totalXp) },
        { label: "SECTOR", value: hexId ? hexId.slice(0, 10) + "…" : "NONE" },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(255,255,255,0.25)" }}>
            {label}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(57,255,20,0.7)" }}>
            {value}
          </span>
        </div>
      ))}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#39FF14",
          boxShadow: "0 0 6px #39FF14",
          animation: "pulse 2s infinite",
        }} />
        <span style={{ fontFamily: "monospace", fontSize: 8, color: "rgba(57,255,20,0.4)" }}>
          SUPABASE REALTIME CONNECTED
        </span>
      </div>
    </div>
  );
}