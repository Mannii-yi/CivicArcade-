const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function analyzeImage(base64Image: string): Promise<{
  enemy_type: string;
  severity_level: number;
  xp_bounty: number;
  required_party_size: number;
  clean_description: string;
}> {
  const prompt = `You are an AI triage system for a civic infrastructure game called CivicArcade.
Analyze this image of a real-world location and return ONLY a valid JSON object with exactly these fields:
{
  "enemy_type": "short name for the civic problem (e.g. Waste Accumulation, Pothole, Broken Streetlight, Waterlogging, Graffiti)",
  "severity_level": <integer 1-10>,
  "xp_bounty": <integer, severity_level * 50>,
  "required_party_size": <integer 1-3>,
  "clean_description": "one sentence describing the issue for citizens"
}
Return ONLY the JSON. No markdown, no explanation, no backticks.`;

  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/jpeg", data: base64Image } },
        ],
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 300 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    return JSON.parse(text.trim());
  } catch {
    throw new Error("Gemini returned invalid JSON: " + text);
  }
}