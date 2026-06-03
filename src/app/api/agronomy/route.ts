import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.shambaiq.com';

async function logSoilReport(token: string, payload: object) {
  try {
    await fetch(`${BACKEND}/api/v1/auth/soil-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Non-blocking — never fail the recommendation if logging fails
  }
}

export async function POST(request: Request) {
  const rl = await rateLimit(`agronomy:${clientIp(request)}`, 15, 15 * 60 * 1000);
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

  // Read session token for logging (best-effort, not required)
  let token: string | undefined;
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('shambaiq_session');
    if (session?.value) {
      const parsed = JSON.parse(decodeURIComponent(session.value));
      token = parsed?.token;
    }
  } catch { /* ignore */ }

  try {
    const body = await request.json();
    const { county, crop, fertilizer, acres, soil } = body;

    if (!county || !crop) {
      return NextResponse.json({ error: 'County and crop are required' }, { status: 400 });
    }

    const soilContext = soil
      ? `Soil data: pH=${soil.pH}, Nitrogen=${soil.nitrogen}g/kg, Phosphorus=${soil.phosphorus}mg/kg, Potassium=${soil.potassium}mg/kg.`
      : `No precise soil data provided — use typical values for ${county} County, Kenya.`;

    const prompt = `You are an expert agronomist specializing in Kenyan smallholder farming. Provide a precise, actionable fertilizer and crop management recommendation.

Farm Details:
- County: ${county}, Kenya
- Crop: ${crop}
- Current fertilizer: ${fertilizer || 'Unknown'}
- Farm size: ${acres || 1} acres
- ${soilContext}

Respond ONLY with a raw JSON object in exactly this format (no markdown, no backticks):
{
  "summary": "2-3 sentence executive summary of the soil situation and main recommendation",
  "primary_fertilizer": "Specific fertilizer product recommended (e.g. DAP 18:46:0)",
  "application_rate": "Exact rate in kg/acre",
  "estimated_cost_kes": 3500,
  "timing": "When and how to apply (e.g. at planting vs top-dress)",
  "key_advice": ["Tip 1 specific to ${county}", "Tip 2", "Tip 3"],
  "warning": "Any critical soil issue or common mistake to avoid in ${county} for ${crop}"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[Agronomy] Gemini API error:', response.status, errBody);
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

      // Save to backend — fire and forget, never blocks the response
      if (token) {
        logSoilReport(token, {
          county,
          crop,
          estimated_cost_kes: parsed.estimated_cost_kes,
          primary_fertilizer: parsed.primary_fertilizer,
          is_acidic: soil?.pH ? soil.pH < 6.0 : false,
          is_n_low: false,
          is_p_low: false,
          is_k_low: false,
          health_score: soil?.pH ? Math.round(Math.min(100, (soil.pH / 7) * 80)) : 50,
        });
      }

      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: cleaned }, { status: 502 });
    }
  } catch (error) {
    console.error('[Agronomy] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
