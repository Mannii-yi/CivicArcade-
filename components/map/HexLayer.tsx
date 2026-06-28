"use client";
import { useEffect, useRef } from "react";
import type { Map } from "maplibre-gl";
import { hexStatusColor } from "@/lib/h3utils";
import type { HexTile } from "@/types";

interface Props {
  map: Map | null;
  tiles: (HexTile & { boundary: [number, number][] })[];
  onHexClick: (hexId: string) => void;
  onHexHover: (hexId: string | null) => void;
}

type HexGeoJSON = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      hexId: string;
      status: string;
      questCount: number;
    };
    geometry: {
      type: "Polygon";
      coordinates: Array<[number, number][]>;
    };
  }>;
};

export default function HexLayer({ map, tiles, onHexClick, onHexHover }: Props) {
  const prevTileCount = useRef(0);

  useEffect(() => {
    if (!map || tiles.length === 0) return;

    const SOURCE_ID = "hex-grid";
    const FILL_ID   = "hex-fill";
    const LINE_ID   = "hex-line";

    const geojson: HexGeoJSON = {
      type: "FeatureCollection",
      features: tiles.map((tile) => ({
        type:       "Feature",
        properties: { hexId: tile.hexId, status: tile.status, questCount: tile.questCount },
        geometry: {
          type:        "Polygon",
          coordinates: [[...tile.boundary, tile.boundary[0]]],
        },
      })),
    };

    // Add or update source
    if (map.getSource(SOURCE_ID)) {
      (map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource(SOURCE_ID, { type: "geojson", data: geojson });

      // Fill layer
      map.addLayer({
        id:     FILL_ID,
        type:   "fill",
        source: SOURCE_ID,
        paint: {
          "fill-color": [
            "match", ["get", "status"],
            "safe",      "#39FF14",
            "active",    "#FFD700",
            "corrupted", "#FF007F",
            "#39FF14",
          ],
          "fill-opacity": 0.15,
        },
      });

      // Border layer
      map.addLayer({
        id:     LINE_ID,
        type:   "line",
        source: SOURCE_ID,
        paint: {
          "line-color": [
            "match", ["get", "status"],
            "safe",      "#39FF14",
            "active",    "#FFD700",
            "corrupted", "#FF007F",
            "#39FF14",
          ],
          "line-width":   1.5,
          "line-opacity": 0.7,
        },
      });

      // Hover effect
      map.on("mousemove", FILL_ID, (e) => {
        map.getCanvas().style.cursor = "crosshair";
        const hexId = e.features?.[0]?.properties?.hexId;
        if (hexId) onHexHover(hexId);
      });
      map.on("mouseleave", FILL_ID, () => {
        map.getCanvas().style.cursor = "";
        onHexHover(null);
      });

      // Click
      map.on("click", FILL_ID, (e) => {
        const hexId = e.features?.[0]?.properties?.hexId;
        if (hexId) onHexClick(hexId);
      });
    }

    prevTileCount.current = tiles.length;
  }, [map, tiles]);

  return null;
}