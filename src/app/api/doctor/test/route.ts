import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const rl = await rateLimit(`doctor-test:${clientIp(request)}`, 5, 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: 'FAIL',
      reason: 'GEMINI_API_KEY is not set',
    }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Return only this exact JSON, nothing else: {"condition":"Healthy","confidence":99}' }] }],
          generationConfig: { maxOutputTokens: 100, temperature: 0 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        status: 'FAIL',
        http_status: response.status,
        raw: data,
      }, { status: 502 });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const finishReason = data?.candidates?.[0]?.finishReason ?? 'unknown';

    let parseResult = 'OK';
    try { JSON.parse(text.replace(/```json\s*/gi,'').replace(/```\s*/g,'').trim()); }
    catch { parseResult = 'PARSE_FAILED'; }

    return NextResponse.json({
      status: parseResult === 'OK' ? 'OK' : 'PARSE_FAILED',
      finish_reason: finishReason,
      raw_text: text,
      key_prefix: apiKey.slice(0, 10) + '...',
    });
  } catch (err) {
    return NextResponse.json({ status: 'FAIL', reason: String(err) }, { status: 500 });
  }
}
