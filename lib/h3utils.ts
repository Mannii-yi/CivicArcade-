import { latLngToCell, cellToBoundary, gridDisk } from "h3-js";

export const H3_RESOLUTION = 8;

/** Convert lat/lng to H3 hex ID */
export function coordsToHex(lat: number, lng: number): string {
  return latLngToCell(lat, lng, H3_RESOLUTION);
}

/** Get boundary polygon for a hex (for MapLibre rendering) */
export function hexBoundary(hexId: string): [number, number][] {
  // cellToBoundary returns [lat, lng] — MapLibre needs [lng, lat]
  return cellToBoundary(hexId).map(([lat, lng]) => [lng, lat]);
}

/** Get all hex IDs within `radius` rings of center hex */
export function getSurroundingHexes(centerHex: string, radius: number): string[] {
  return gridDisk(centerHex, radius);
}

/** Get hex status color */
export function hexStatusColor(status: "safe" | "active" | "corrupted"): string {
  return {
    safe:      "#39FF14",
    active:    "#FFD700",
    corrupted: "#FF007F",
  }[status];
}