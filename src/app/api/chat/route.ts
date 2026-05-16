import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfiguration: API key missing' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Build the conversation history for Gemini
    const systemPrompt = `You are Shamba Mshauri (Farm Advisor), an expert agronomist working with smallholder farmers across all 47 counties of Kenya. You have deep knowledge of:
- Kenyan soil types, pH levels, and nutrient profiles by county and agroecological zone
- Kenyan crops: maize, beans, potatoes, tea, coffee, pyrethrum, wheat, rice, sorghum, millet, vegetables, fruits
- Fertilizer products available in Kenya: DAP, CAN, Urea, NPK blends, organic options, NCPB subsidized products
- Common Kenyan crop diseases, pests, and nutrient deficiencies
- Kenya Meteorological Department seasonal forecasts and long/short rain seasons
- KALRO and Kenya Seed Company certified seed varieties
- Kenyan agricultural extension services and county-specific advice

Rules:
- Always give specific, actionable advice using products and services available to Kenyan farmers
- Quote approximate prices in KES when relevant
- If the farmer mentions a specific county, tailor your advice to that county's soil profile
- Respond in the same language the farmer uses (English or Kiswahili)
- Keep responses concise and practical — farmers need clear steps, not essays
- If you are unsure, say so and suggest they contact their county agricultural extension officer`;

    // Build messages array for Gemini
    const conversationHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Inject system context as first user message if this is the start
    const contents =
      messages.length === 1
        ? [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I am ready to assist Kenyan farmers with precise, localized agronomic advice.' }] },
            ...conversationHistory,
          ]
        : conversationHistory;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[Chat] Gemini API error:', response.status, errBody);
      return NextResponse.json({ error: `Gemini API error: ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('[Chat] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
