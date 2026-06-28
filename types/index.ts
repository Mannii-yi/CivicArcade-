export type HexStatus = "safe" | "active" | "corrupted";

export interface Quest {
  id: string;
  hex_id: string;
  lat: number;
  lng: number;
  enemy_type: string;
  severity_level: number;
  xp_bounty: number;
  required_party_size: number;
  clean_description: string;
  status: "active" | "validated" | "resolved";
  image_url?: string;
  created_by?: string;
  created_at: string;
}

export interface Player {
  id: string;
  username: string;
  xp: number;
  level: number;
}

export interface HexTile {
  hexId: string;
  status: HexStatus;
  questCount: number;
}

export interface GeminiQuestResponse {
  enemy_type: string;
  severity_level: number;
  xp_bounty: number;
  required_party_size: number;
  clean_description: string;
}