import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image, hex_id, lat, lng } = body;

    if (!base64Image || !hex_id || !lat || !lng) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Strip data URL prefix if present
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // Run Gemini vision
    const result = await analyzeImage(imageData);

    // Save to Supabase
    const { data, error } = await supabase.from("quests").insert({
      hex_id,
      lat,
      lng,
      enemy_type:          result.enemy_type,
      severity_level:      result.severity_level,
      xp_bounty:           result.xp_bounty,
      required_party_size: result.required_party_size,
      clean_description:   result.clean_description,
      status:              "active",
      created_by:          "HERO_01",
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ quest: data, ai: result });
  } catch (err: any) {
    console.error("Quest API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}