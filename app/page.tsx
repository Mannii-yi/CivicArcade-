"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import SectorInfo    from "@/components/ui/SectorInfo";
import NeonButton    from "@/components/shared/NeonButton";
import XPBar         from "@/components/ui/XPBar";
import QuestLog      from "@/components/ui/QuestLog";
import HUDPanel      from "@/components/ui/HUDPanel";
import RaidModal     from "@/components/raid/RaidModal";
import Leaderboard   from "@/components/ui/Leaderboard";
import AnomalyAlert  from "@/components/ui/AnomalyAlert";
import Scanlines     from "@/components/shared/Scanlines";
import MiniStats     from "@/components/ui/MiniStats";
import { coordsToHex, getSurroundingHexes } from "@/lib/h3utils";
import { usePlayerLocation } from "@/hooks/usePlayerLocation";
import { useRealtime }       from "@/hooks/useRealtime";
import { SFX }               from "@/lib/sound";
import { supabase }          from "@/lib/supabase";
import type { HexTile, Quest } from "@/types";
import type { LogEntry }       from "@/components/ui/QuestLog";

const GameMap = dynamic(() => import("@/components/map/GameMap"), { ssr: false });

function timestamp() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export default function HomePage() {
  const { location }              = usePlayerLocation();
  const [quests, setQuests]       = useState<{ hex_id: string; status: string }[]>([]);
  const [hoveredHex,  setHoveredHover]  = useState<string | null>(null);
  const [selectedHex, setSelectedHex]   = useState<string | null>(null);
  const [raidOpen,  setRaidOpen]  = useState(false);
  const [alertMsg,  setAlertMsg]  = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", time: timestamp(), type: "info",  message: "CivicArcade systems online." },
    { id: "2", time: timestamp(), type: "warn",  message: "Scanning local sectors…" },
  ]);
  const [xp,    setXp]    = useState(0);
  const xpPopRef = useRef<HTMLDivElement>(null);
  const level = Math.floor(xp / 500) + 1;

  function addLog(message: string, type: LogEntry["type"] = "info") {
    setLogs(prev => [...prev.slice(-20), {
      id: crypto.randomUUID(), time: timestamp(), message, type,
    }]);
  }

  function spawnXpPop(amount: number) {
    const el = document.createElement("div");
    el.className = "xp-pop";
    el.textContent = `+${amount} XP`;
    el.style.left = `${Math.random() * 200 + 600}px`;
    el.style.top  = `${Math.random() * 100 + 300}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  function gainXp(amount: number) {
    setXp(prev => prev + amount);
    spawnXpPop(amount);
    SFX.xpGain();
  }

  // Load quests from Supabase
  useEffect(() => {
    supabase.from("quests").select("hex_id, status").eq("status", "active")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setQuests(data);
          addLog(`${data.length} active quests loaded.`, "warn");
        }
      });
  }, []);

  // Seed local mock quests if DB is empty
  useEffect(() => {
    if (!location) return;
    supabase.from("quests").select("id").eq("status", "active").limit(1)
      .then(({ data }) => {
        if (!data || data.length === 0) {
          const center = coordsToHex(location.lat, location.lng);
          const ring   = getSurroundingHexes(center, 2);
          const picks  = ring.sort(() => Math.random() - 0.5).slice(0, 3);
          setQuests(picks.map(hex_id => ({ hex_id, status: "active" })));
          addLog("Local anomalies seeded for demo.", "warn");
        }
      });
  }, [location]);

  // Realtime multiplayer sync
  useRealtime(
    (q: Quest) => {
      setQuests(prev => [...prev, { hex_id: q.hex_id, status: q.status }]);
      setAlertMsg(`${q.enemy_type} detected in sector ${q.hex_id.slice(0, 10)}…`);
      SFX.alert();
      addLog(`BROADCAST: ${q.enemy_type} — sector ${q.hex_id.slice(0,10)}…`, "danger");
    },
    (q: Quest) => {
      setQuests(prev => prev.map(p =>
        p.hex_id === q.hex_id ? { ...p, status: q.status } : p
      ));
      addLog(`Sector ${q.hex_id.slice(0,10)}… → ${q.status.toUpperCase()}`, "success");
    },
  );

  function handleHexSelect(hexId: string) {
    setSelectedHex(hexId);
    SFX.hexSelect();
    addLog(`Sector ${hexId.slice(0, 12)}… locked on.`, "info");
  }

  function handleHexHover(hexId: string | null) {
    setHoveredHover(hexId);
    if (hexId) SFX.hover();
  }

  function handleQuestCreated(xpGain: number, enemyType: string) {
    gainXp(xpGain);
    addLog(`⚔ RAID LOGGED: ${enemyType}`, "danger");
    addLog(`+${xpGain} XP awarded.`, "success");
    if (selectedHex) {
      setQuests(prev => {
        const exists = prev.some(q => q.hex_id === selectedHex);
        return exists ? prev : [...prev, { hex_id: selectedHex, status: "active" }];
      });
    }
  }

  async function handleValidate() {
    if (!selectedHex) return;
    SFX.verify();
    const { error } = await supabase
      .from("quests")
      .update({ status: "validated" })
      .eq("hex_id", selectedHex)
      .eq("status", "active");

    if (!error) {
      setQuests(prev => prev.map(q =>
        q.hex_id === selectedHex ? { ...q, status: "validated" } : q
      ));
    }
    gainXp(25);
    addLog(`✔ Sector ${selectedHex.slice(0,10)}… verified.`, "success");
  }

  const isActiveQuest  = quests.some(q => q.hex_id === selectedHex && q.status === "active");
  const selectedStatus: HexTile["status"] = isActiveQuest ? "corrupted" : selectedHex ? "safe" : "safe";
  const activeCount    = quests.filter(q => q.status === "active").length;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "#0A0A0F" }}>

      {/* CRT effects */}
      <Scanlines />

      {/* Fullscreen anomaly alert */}
      <AnomalyAlert message={alertMsg} onDone={() => setAlertMsg(null)} />

      {/* MAP */}
      <GameMap
        quests={quests}
        onHexSelect={handleHexSelect}
        onHexHover={handleHexHover}
      />

      {/* NAVBAR */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, height: 44 }}
        className="flex items-center justify-between px-4 bg-black/75 backdrop-blur-sm border-b border-neon-green/20">
        <div className="flex items-center gap-3">
          <span className="font-pixel text-neon-green text-[10px] animate-flicker">CIVIC</span>
          <span className="font-pixel text-neon-pink  text-[10px]">ARCADE</span>
          <span className="font-mono text-[8px] text-white/15">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono text-[9px] text-neon-green/50">
            DELHI · {activeCount} RAIDS ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-pixel text-neon-blue text-[8px]">HERO_01</p>
            <p className="font-mono text-[8px] text-white/40">LVL {level} · {xp} XP</p>
          </div>
          <div className="w-7 h-7 border border-neon-blue/50 flex items-center justify-center font-pixel text-neon-blue text-[9px]"
            style={{ boxShadow: "0 0 8px rgba(0,245,255,0.2)" }}>
            H1
          </div>
        </div>
      </div>

      {/* LEFT PANELS */}
      <div style={{ position: "absolute", top: 52, left: 12, bottom: 36, zIndex: 20, width: 252 }}
        className="flex flex-col gap-2 overflow-hidden">
        <HUDPanel title="PLAYER STATUS" color="green">
          <div className="flex justify-between font-mono text-[9px] mb-2">
            <span className="text-white/40">LEVEL</span>
            <span className="text-neon-green font-pixel text-[8px]">{level}</span>
          </div>
          <div className="flex justify-between font-mono text-[9px] mb-2">
            <span className="text-white/40">RAIDS ACTIVE</span>
            <span className="text-neon-pink">{activeCount}</span>
          </div>
          <XPBar xp={xp} level={level} />
        </HUDPanel>

        <QuestLog entries={logs} />
        <Leaderboard localXp={xp} />
      </div>

      {/* RIGHT PANELS */}
      <div style={{ position: "absolute", top: 52, right: 12, zIndex: 20, width: 212 }}
        className="flex flex-col gap-2">
        <SectorInfo
          hexId={hoveredHex ?? selectedHex}
          questCount={activeCount}
          status={hoveredHex
            ? (quests.some(q => q.hex_id === hoveredHex) ? "corrupted" : "safe")
            : selectedStatus}
        />
        <HUDPanel color="green">
          <p className="font-pixel text-[7px] text-white/25 mb-2">MAP LEGEND</p>
          {[
            { color: "#39FF14", label: "SECURE ZONE", glow: "#39FF1460" },
            { color: "#FFD700", label: "ACTIVE RAID", glow: "#FFD70060" },
            { color: "#FF007F", label: "CORRUPTED",   glow: "#FF007F60" },
          ].map(({ color, label, glow }) => (
            <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ background: color, boxShadow: `0 0 6px ${glow}` }} />
              <span className="font-mono text-[9px] text-white/50">{label}</span>
            </div>
          ))}
        </HUDPanel>
        <HUDPanel color="blue">
          <p className="font-pixel text-[7px] text-neon-blue/50 mb-2">CONTROLS</p>
          {[
            { key: "CLICK HEX",  action: "Lock sector"      },
            { key: "RAID BTN",   action: "Report + AI scan" },
            { key: "VERIFY BTN", action: "+25 XP"           },
            { key: "SCROLL",     action: "Zoom map"         },
            { key: "DRAG",       action: "Pan map"          },
          ].map(({ key, action }) => (
            <div key={key} className="flex justify-between items-center mb-1 last:mb-0">
              <span className="font-pixel text-[7px] text-neon-blue/70 bg-neon-blue/10 px-1 py-0.5">{key}</span>
              <span className="font-mono text-[8px] text-white/35">{action}</span>
            </div>
          ))}
        </HUDPanel>
      </div>

      {/* BOTTOM ACTIONS */}
      <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}
        className="flex flex-col items-center gap-2">
        {selectedHex ? (
          <>
            <div className="flex gap-3">
              <NeonButton variant="pink" size="lg"
                onClick={() => { SFX.raidOpen(); setRaidOpen(true); }}>
                ⚔ TRIGGER CIVIC RAID
              </NeonButton>
              <NeonButton variant="amber" size="lg" onClick={handleValidate}>
                ✔ VERIFY HAZARD
              </NeonButton>
            </div>
            <p className="font-mono text-[8px] text-white/25">
              SECTOR {selectedHex.slice(0, 14)}… LOCKED
            </p>
          </>
        ) : (
          <div style={{ border: "1px solid rgba(57,255,20,0.15)", background: "rgba(0,0,0,0.6)" }}
            className="px-5 py-2">
            <p className="font-pixel text-[8px] text-neon-green/40 animate-pulse">
              ▸ CLICK ANY HEX TILE TO BEGIN
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM STATUS BAR */}
      <MiniStats
        lat={location?.lat ?? null}
        lng={location?.lng ?? null}
        activeRaids={activeCount}
        totalXp={xp}
        hexId={selectedHex}
      />

      {/* RAID MODAL */}
      {raidOpen && selectedHex && location && (
        <RaidModal
          hexId={selectedHex}
          lat={location.lat}
          lng={location.lng}
          onClose={() => setRaidOpen(false)}
          onQuestCreated={handleQuestCreated}
        />
      )}

    </div>
  );
}