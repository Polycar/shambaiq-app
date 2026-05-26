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

    // Fetch farmer context to personalise the prompt (best-effort)
    const ctx = token ? await fetchFarmerContext(token) : null;
    const county = ctx?.county || null;
    const crop = userCrop || ctx?.latest_soil?.crop || ctx?.fields?.[0]?.crop || null;

    const locationLine = county ? `The farmer is in ${county} County, Kenya.` : 'The farmer is in Kenya.';
    const cropLine = crop ? `The crop shown is ${crop}.` : '';

    const prompt = `You are an expert plant pathologist advising Kenyan smallholder farmers.
${locationLine}${cropLine ? ' ' + cropLine : ''}

Analyze the image carefully and identify the exact disease, pest, or nutrient deficiency shown.

STRICT RULES — follow every one:
- treatment_steps: numbered steps the farmer can take TODAY. Each step MUST name the exact product (e.g. "Ridomil Gold MZ 68 WP"), the exact dose (e.g. "40g per 20L water"), and when/how to apply. Minimum 3 steps.
- products: 2-4 real products sold at Kenyan agrovets with approximate KES retail prices.
- prevention: specific to THIS disease — what protectant spray, resistant variety, or cultural practice prevents this exact pathogen. Do NOT say "practice crop rotation" unless rotation is a primary control for this specific disease. Be specific.
- severity: "Low", "Moderate", "High", or "Critical".
- notes: warnings about resistance, re-entry intervals, or when to call an extension officer.
- If the plant looks healthy, set condition to "Healthy", confidence to 95+, and give maintenance advice in notes.
- NEVER give vague or generic advice. Name products. Give doses.

Respond ONLY with a raw JSON object — no markdown, no backticks, no extra text:
{
  "condition": "Exact name of disease/pest/deficiency or Healthy",
  "confidence": 85,
  "severity": "Moderate",
  "treatment_steps": [
    "Step 1: Remove and destroy all infected plant material immediately — do not compost it.",
    "Step 2: Spray Ridomil Gold MZ 68 WP at 40g per 20L water, covering both sides of all leaves. Apply in the evening.",
    "Step 3: Repeat spray every 10–14 days until symptoms stop spreading. Use Dithane M-45 as an alternating product to prevent resistance."
  ],
  "products": [
    {"name": "Ridomil Gold MZ 68 WP", "price_kes": "~KES 850 per 100g"},
    {"name": "Dithane M-45", "price_kes": "~KES 600 per 200g"}
  ],
  "prevention": "Specific prevention for this exact disease.",
  "notes": "Any resistance warnings, re-entry periods, or referral advice."
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
            maxOutputTokens: 1500,
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

    // Strip any residual markdown fences, then fall back to regex extraction
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
