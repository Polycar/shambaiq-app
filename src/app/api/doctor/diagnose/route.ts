import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // Session check to protect the endpoint from unauthorized consumption
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('shambaiq_session');
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }

  try {
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
    if (!sessionData.phone && !sessionData.token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized: Invalid session format' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Surface a clear error if the key is missing (helps debug Vercel env issues)
  if (!apiKey) {
    console.error('[PlantDoctor] GEMINI_API_KEY is not set in environment variables');
    return NextResponse.json(
      { error: 'Server misconfiguration: API key missing' },
      { status: 503 }
    );
  }


  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const prompt = `You are an expert agricultural plant doctor in Kenya. Analyze this image of a plant leaf or stem.
Identify any disease, pest, or nutrient deficiency visible.

IMPORTANT: Respond ONLY with a raw JSON object. Do NOT use markdown, backticks, or any other formatting.

Use exactly this schema:
{"condition":"Name of the disease/pest/deficiency, or Healthy if no issues","confidence":85,"treatment":"Specific, actionable treatment advice using products available at Kenyan agrovets. Include product names and dosages where possible.","prevention":"Practical prevention steps for Kenyan small-scale farmers."}`;

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
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[PlantDoctor] Gemini API error:', response.status, errBody);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) {
      console.error('[PlantDoctor] Empty response from Gemini:', JSON.stringify(data));
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    // Strip any accidental markdown wrappers
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      console.error('[PlantDoctor] JSON parse failed. Raw text:', text);
      // Return a graceful structured response so the UI still shows something useful
      return NextResponse.json({
        condition: 'Diagnosis Complete',
        confidence: 70,
        treatment: cleaned,
        prevention: 'Practice crop rotation and scout your fields weekly for early signs of pest or disease pressure.',
      });
    }
  } catch (error) {
    console.error('[PlantDoctor] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
