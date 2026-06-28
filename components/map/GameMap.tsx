"use client";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import HexLayer from "./HexLayer";
import { usePlayerLocation } from "@/hooks/usePlayerLocation";
import { useHexGrid } from "@/hooks/useHexGrid";

interface Props {
  quests:      { hex_id: string; status: string }[];
  onHexSelect: (hexId: string) => void;
  onHexHover:  (hexId: string | null) => void;
}

export default function GameMap({ quests, onHexSelect, onHexHover }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<maplibregl.Map | null>(null);
  const playerMarker = useRef<maplibregl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { location, error, loading } = usePlayerLocation();

  const tiles = useHexGrid(
    location?.lat ?? null,
    location?.lng ?? null,
    quests
  );

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [77.209, 28.6139],
      zoom: 14,
      pitch: 20,
    });

    mapRef.current.on("load", () => setMapReady(true));

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapReady || !location) return;

    mapRef.current.flyTo({
      center: [location.lng, location.lat],
      zoom: 15,
      speed: 1.2,
    });

    if (playerMarker.current) {
      playerMarker.current.setLngLat([location.lng, location.lat]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `<div class="player-ping"></div><div class="player-dot"></div>`;
      el.style.position = "relative";
      el.style.width = "20px";
      el.style.height = "20px";

      playerMarker.current = new maplibregl.Marker({ element: el })
        .setLngLat([location.lng, location.lat])
        .addTo(mapRef.current!);
    }
  }, [location, mapReady]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Map fills entire screen */}
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
      />

      {mapReady && (
        <HexLayer
          map={mapRef.current}
          tiles={tiles}
          onHexClick={onHexSelect}
          onHexHover={onHexHover}
        />
      )}

      {loading && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(10,10,15,0.8)", zIndex: 10
        }}>
          <p className="font-pixel text-neon-green text-xs animate-pulse">
            ACQUIRING SIGNAL...
          </p>
        </div>
      )}

      {error && (
        <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 10 }}
          className="bg-hud-surface border border-neon-pink px-3 py-2">
          <p className="font-pixel text-neon-pink text-[10px]">GPS ERROR: {error}</p>
        </div>
      )}
    </div>
  );
}