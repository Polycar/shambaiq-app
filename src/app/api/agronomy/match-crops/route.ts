import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const rl = await rateLimit(`match-crops:${clientIp(request)}`, 10, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes before trying again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSecs) } }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfiguration: API key missing' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { county, acres, soil, lat, lon, zone, month, season, weather } = body;

    if (!county) {
      return NextResponse.json({ error: 'County is required' }, { status: 400 });
    }

    const farmSize = acres || 1;

    let soilContext = '';
    if (soil) {
      soilContext = `
Specific Soil Profile at this location:
- pH: ${soil.pH}
- Nitrogen (N): ${soil.nitrogen} g/kg
- Phosphorus (P): ${soil.phosphorus} mg/kg
- Potassium (K): ${soil.potassium} mg/kg
- Organic Carbon (OC): ${soil.organic_carbon} g/kg
- Texture: ${soil.texture || 'Loam'}
`;
    } else {
      soilContext = `No precise soil data available — use typical soil profile averages for ${county} County, Kenya.`;
    }

    const seasonContext = (season || month) ? `
Current Growing Conditions:
- Month: ${month || 'Unknown'}
- Farming Season: ${season || 'Unknown'}
${zone ? `- Agroecological Zone: ${zone}` : ''}
${weather ? `- 7-Day Weather Outlook:
  - Average High: ${weather.avg_temp_max}°C
  - Average Low: ${weather.avg_temp_min}°C
  - Total Rainfall (7 days): ${weather.total_rain_7d} mm
  - Summary: ${weather.summary}` : '- Weather data: not available'}
` : '';

    const prompt = `You are a world-class agronomist and agricultural economist specializing in Kenyan agriculture.
Analyze the following soil properties, farm specifications, and current growing conditions to recommend the most suitable crops RIGHT NOW:
- Location: ${county} County, Kenya ${lat && lon ? `(Coordinates: ${lat}, ${lon})` : ''}
- Farm Size: ${farmSize} acres
${soilContext}${seasonContext}
Recommend the top 5 absolute best-suited crops for this farm. You have NO restriction on which crops you may suggest — draw from the full global catalogue of crops that are grown or could be grown commercially in Kenya, including but not limited to: staple grains, legumes, root crops, vegetables, fruits, tree crops, spices, herbs, floriculture, industrial crops, fodder, and any high-value or emerging crops that fit. Do NOT limit yourself to a pre-set list.

Factor in ALL of the following when scoring each crop:
1. Soil fit — pH, NPK levels, organic carbon, and physical texture suitability
2. Seasonal fit — whether the current season and 7-day rainfall/temperature outlook favour planting, active growth, or harvesting right now
3. Agroecological zone fit — altitude, humidity regime, and zone-specific crop performance
4. Economic fit — realistic gross income potential at current Kenyan farm-gate prices (2024–2026)

If the soil, season, and zone are a strong match for a niche, specialist, or rarely-listed crop (e.g. Stevia, Chia, Dragon Fruit, French Beans for export, Artemisia, Moringa, Rosemary, Lavender, Macadamia, Bt Cotton, Jatropha, etc.) — suggest it. Accuracy and agronomic correctness matter more than familiarity.

For each crop, you must calculate:
1. A realistic "match_score" (an integer from 0 to 100) representing how well the crop fits all parameters including soil, season, and weather.
2. A suitability "label" ('EXCELLENT' for scores >= 85, 'VERY GOOD' for 70-84, 'GOOD' for 45-69, 'POOR' for <45).
3. A projected annual "gross_income" in KES (Kenyan Shillings) for the entire farm size of ${farmSize} acres, based on typical high-yield market gate prices in Kenya (2024-2026).
4. A highly specific 1-2 sentence explanation in English ("reason") explaining why this crop fits these precise soil metrics AND current seasonal/weather conditions.
5. A matching, accurate Swahili translation of the explanation ("reason_sw").

Respond ONLY with a raw JSON object containing a "matches" field which is a JSON array of the top 5 crops in this exact format (no markdown, no backticks, no comments, no surrounding text):
{
  "matches": [
    {
      "crop": "Avocado (Hass)",
      "match_score": 92,
      "label": "EXCELLENT",
      "gross_income": 350000,
      "reason": "Hass avocados thrive in well-drained loam texture with slightly acidic pH (5.5 - 6.5) and benefit from high organic carbon levels.",
      "reason_sw": "Parachichi za Hass hustawi katika udongo wa tifutifu unaopitisha maji vizuri na pH ya asidi kidogo (5.5 - 6.5) na hufaidika na kiwango kikubwa cha kaboni ya kikaboni."
    }
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2000 },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[MatchCrops] Gemini API error:', response.status, errBody);
      return NextResponse.json({ error: `Gemini API error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: cleaned }, { status: 502 });
    }
  } catch (error) {
    console.error('[MatchCrops] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
