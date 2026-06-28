"use client";
import { useMemo } from "react";
import { coordsToHex, getSurroundingHexes, hexBoundary } from "@/lib/h3utils";
import type { HexTile } from "@/types";

export function useHexGrid(
  lat: number | null,
  lng: number | null,
  quests: { hex_id: string; status: string }[],
  radius = 4
) {
  return useMemo(() => {
    if (!lat || !lng) return [];

    const centerHex  = coordsToHex(lat, lng);
    const hexIds     = getSurroundingHexes(centerHex, radius);

    // Build a quick lookup from quests
    const questMap = new Map<string, { count: number; hasCorrupted: boolean }>();
    for (const q of quests) {
      const entry = questMap.get(q.hex_id) ?? { count: 0, hasCorrupted: false };
      entry.count++;
      if (q.status === "active") entry.hasCorrupted = true;
      questMap.set(q.hex_id, entry);
    }

    return hexIds.map((hexId): HexTile & { boundary: [number, number][] } => {
      const info = questMap.get(hexId);
      let status: HexTile["status"] = "safe";
      if (info?.hasCorrupted) status = "corrupted";
      else if (info?.count)   status = "active";

      return {
        hexId,
        status,
        questCount: info?.count ?? 0,
        boundary:   hexBoundary(hexId),
      };
    });
  }, [lat, lng, quests, radius]);
}