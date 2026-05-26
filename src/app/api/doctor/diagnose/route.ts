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
    // Non-blocking
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

    const ctx = token ? await fetchFarmerContext(token) : null;
    const county = ctx?.county || null;
    const crop = userCrop || ctx?.latest_soil?.crop || ctx?.fields?.[0]?.crop || null;

    const locationLine = county ? `The farmer is in ${county} County, Kenya.` : 'The farmer is in Kenya.';
    const cropLine = crop ? `The crop shown is ${crop}.` : '';

    const prompt = `You are an expert plant pathologist advising Kenyan smallholder farmers.
${locationLine}${cropLine ? ' ' + cropLine : ''}

Analyze the image carefully and identify the exact disease, pest, or nutrient deficiency shown.

Rules:
- treatment_steps: 3 numbered steps the farmer can take TODAY, each naming the exact product, dose, and method.
- products: 2-3 real products sold at Kenyan agrovets with approximate KES retail prices.
- prevention: specific to THIS disease.
- severity: "Low", "Moderate", "High", or "Critical".
- notes: resistance warnings or referral advice.
- If healthy, set condition to "Healthy", confidence 95+.

Return ONLY a JSON object, no markdown, no extra text:
{
  "condition": "Disease name or Healthy",
  "confidence": 85,
  "severity": "Moderate",
  "treatment_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "products": [{"name": "Product", "price_kes": "~KES 850 per 100g"}],
  "prevention": "...",
  "notes": "..."
}`;

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
            temperature: 0.2,
            maxOutputTokens: 2048,
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
      console.error('[PlantDoctor] Empty text. Full response:', JSON.stringify(data));
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    // Strip markdown fences, then extract JSON object via regex
    let textToParse = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    if (!textToParse.startsWith('{')) {
      const match = textToParse.match(/\{[\s\S]*\}/);
      if (match) textToParse = match[0];
    }

    let parsed: {
      condition: string;
      confidence: number;
      severity?: string;
      treatment_steps?: string[];
      products?: { name: string; price_kes: string }[];
      prevention?: string;
      notes?: string;
      treatment?: string;
    };

    try {
      parsed = JSON.parse(textToParse);
    } catch {
      console.error('[PlantDoctor] JSON parse failed. Raw text:', text);
      return NextResponse.json({ error: 'Could not parse AI response. Please try again.' }, { status: 502 });
    }

    if (token) {
      saveDiagnosis(token, {
        county,
        crop,
        condition: parsed.condition,
        confidence: parsed.confidence,
        treatment: parsed.treatment_steps?.join(' ') || parsed.treatment || '',
        prevention: parsed.prevention || '',
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('[PlantDoctor] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
