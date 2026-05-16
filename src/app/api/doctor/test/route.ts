import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      status: 'FAIL', 
      reason: 'GEMINI_API_KEY is not set in Vercel environment variables' 
    }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with just the word: OK' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json({ 
        status: 'FAIL', 
        reason: `Gemini rejected the key: HTTP ${response.status}`,
        detail: body.slice(0, 200)
      }, { status: 502 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return NextResponse.json({ status: 'OK', gemini_response: text, key_prefix: apiKey.slice(0, 10) + '...' });
  } catch (err) {
    return NextResponse.json({ status: 'FAIL', reason: String(err) }, { status: 500 });
  }
}
