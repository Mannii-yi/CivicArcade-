"use client";
import { useEffect, useState } from "react";

interface Props {
  message: string | null;
  onDone:  () => void;
}

export default function AnomalyAlert({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2800);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
      transition: "opacity 0.4s",
      opacity: visible ? 1 : 0,
    }}>
      {/* Red flash border */}
      <div style={{
        position: "absolute", inset: 0,
        border: "3px solid #FF007F",
        boxShadow: "inset 0 0 60px rgba(255,0,127,0.3), 0 0 60px rgba(255,0,127,0.2)",
        animation: "borderFlash 0.4s ease-in-out 3",
        pointerEvents: "none",
      }} />

      {/* Center message */}
      <div style={{
        background: "rgba(0,0,0,0.92)",
        border: "1px solid #FF007F",
        boxShadow: "0 0 30px rgba(255,0,127,0.5)",
        padding: "24px 40px",
        textAlign: "center",
        animation: "slideDown 0.3s ease-out",
      }}>
        <p style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9,
          color: "#FF007F",
          letterSpacing: 2,
          marginBottom: 8,
        }}>
          ⚠ HAZARD ANOMALY DETECTED
        </p>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 11,
          color: "rgba(255,255,255,0.7)",
          maxWidth: 300,
        }}>
          {message}
        </p>
      </div>
    </div>
  );
}