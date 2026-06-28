"use client";
import { useRef, useState } from "react";
import NeonButton from "@/components/shared/NeonButton";
import AnomalyCard from "./AnomalyCard";
import HUDPanel from "@/components/ui/HUDPanel";

interface Props {
  hexId:   string;
  lat:     number;
  lng:     number;
  onClose: () => void;
  onQuestCreated: (xp: number, enemyType: string) => void;
}

type Phase = "capture" | "uploading" | "result" | "error";

export default function RaidModal({ hexId, lat, lng, onClose, onQuestCreated }: Props) {
  const fileRef             = useRef<HTMLInputElement>(null);
  const [phase, setPhase]   = useState<Phase>("capture");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [errMsg, setErrMsg] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!preview) return;
    setPhase("uploading");

    try {
      const res = await fetch("/api/quest", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ base64Image: preview, hex_id: hexId, lat, lng }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setResult(data.ai);
      setPhase("result");
      onQuestCreated(data.ai.xp_bounty, data.ai.enemy_type);
    } catch (err: any) {
      setErrMsg(err.message);
      setPhase("error");
    }
  }

  return (
    // Fullscreen overlay
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ width: 360 }} className="flex flex-col gap-3">

        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="font-pixel text-neon-pink text-[10px]">⚔ CIVIC RAID</span>
          <button
            onClick={onClose}
            className="font-pixel text-[9px] text-white/40 hover:text-white/80"
          >
            [ESC]
          </button>
        </div>

        <HUDPanel color="pink">
          <p className="font-mono text-[8px] text-white/30 mb-1">TARGET SECTOR</p>
          <p className="font-pixel text-[8px] text-neon-pink">{hexId.slice(0, 16)}…</p>
        </HUDPanel>

        {/* PHASE: capture */}
        {phase === "capture" && (
          <>
            {/* Image preview / upload zone */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                height: 200,
                border: "1px dashed rgba(255,0,127,0.4)",
                background: "rgba(255,0,127,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", position: "relative",
              }}
            >
              {preview ? (
                <img src={preview} alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className="text-center">
                  <p className="font-pixel text-[9px] text-neon-pink/60">[ TAP TO CAPTURE ]</p>
                  <p className="font-mono text-[8px] text-white/20 mt-1">Photo or upload an image</p>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div className="flex gap-2">
              <NeonButton variant="pink" size="md"
                className="flex-1" onClick={handleSubmit} disabled={!preview}>
                ▸ SUBMIT TO AI
              </NeonButton>
              <NeonButton variant="amber" size="md" onClick={onClose}>
                CANCEL
              </NeonButton>
            </div>
          </>
        )}

        {/* PHASE: uploading */}
        {phase === "uploading" && (
          <HUDPanel color="amber" className="text-center py-6">
            <p className="font-pixel text-[9px] text-neon-amber animate-pulse">
              GEMINI AI ANALYZING…
            </p>
            <p className="font-mono text-[8px] text-white/30 mt-2">
              Identifying civic anomaly…
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {[0,1,2,3,4].map(i => (
                <div key={i}
                  className="w-1.5 h-6 bg-neon-amber/60 animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </HUDPanel>
        )}

        {/* PHASE: result */}
        {phase === "result" && result && (
          <>
            <AnomalyCard
              enemyType={result.enemy_type}
              severityLevel={result.severity_level}
              xpBounty={result.xp_bounty}
              requiredParty={result.required_party_size}
              description={result.clean_description}
            />
            <NeonButton variant="green" size="md" className="w-full" onClick={onClose}>
              ✔ QUEST LOGGED — CLOSE
            </NeonButton>
          </>
        )}

        {/* PHASE: error */}
        {phase === "error" && (
          <>
            <HUDPanel color="pink">
              <p className="font-pixel text-[8px] text-neon-pink mb-1">TRANSMISSION FAILED</p>
              <p className="font-mono text-[9px] text-white/40">{errMsg}</p>
            </HUDPanel>
            <NeonButton variant="pink" size="md" className="w-full"
              onClick={() => setPhase("capture")}>
              ↺ RETRY
            </NeonButton>
          </>
        )}

      </div>
    </div>
  );
}