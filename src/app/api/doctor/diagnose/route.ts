import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.shambaiq.com';

async function fetchFarmerContext(token: string) {
  try {
    const res = await fetch(`${BACKEND}/api/v1/auth/me/context`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function saveDiagnosis(token: string, payload: object) {
  try {
    await fetch(`${BACKEND}/api/v1/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Non-blocking — never fail the diagnosis if saving fails
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('shambaiq_session');
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }

  let token: string | undefined;
  try {
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
    if (!sessionData.phone && !sessionData.token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
    token = sessionData.token;
  } catch {
    return NextResponse.json({ error: 'Unauthorized: Invalid session format' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfiguration: API key missing' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { image, crop: userCrop } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Fetch farmer context to personalise the Gemini prompt (best-effort)
    const ctx = token ? await fetchFarmerContext(token) : null;
    const county = ctx?.county || null;
    const crop = userCrop || ctx?.latest_soil?.crop || ctx?.fields?.[0]?.crop || null;

    const locationLine = county ? `The farmer is in ${county} County, Kenya.` : 'The farmer is in Kenya.';
    const cropLine = crop ? `The crop in the image is likely ${crop}.` : '';

    const prompt = `You are an expert plant pathologist working with Kenyan smallholder farmers.
${locationLine}${cropLine ? ' ' + cropLine : ''}

Analyze the image for any disease, pest damage, or nutrient deficiency.

IMPORTANT: Respond ONLY with a raw JSON object — no markdown, no backticks.

Schema:
{"condition":"Specific disease/pest/deficiency name, or Healthy","confidence":85,"treatment":"Specific treatment using products available at Kenyan agrovets — include exact product names, dosages, and timing.","prevention":"Practical prevention steps suited to smallholder farmers${county ? ` in ${county}` : ' in Kenya'}."}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: 'image/jpeg', data: image } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[PlantDoctor] Gemini API error:', response.status, errBody);
      return NextResponse.json({ error: `Gemini API error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    let parsed: { condition: string; confidence: number; treatment: string; prevention: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        condition: 'Diagnosis Complete',
        confidence: 70,
        treatment: cleaned,
        prevention: 'Practice crop rotation and scout your fields weekly for early signs of pest or disease pressure.',
      };
    }

    // Save to backend — fire and forget, never blocks the response
    if (token) {
      saveDiagnosis(token, {
        county,
        crop,
        condition: parsed.condition,
        confidence: parsed.confidence,
        treatment: parsed.treatment,
        prevention: parsed.prevention,
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('[PlantDoctor] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
