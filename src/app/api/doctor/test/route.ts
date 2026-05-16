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
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json({ 
        status: 'FAIL', 
        reason: `Could not list models: HTTP ${response.status}`,
        detail: body.slice(0, 500)
      }, { status: 502 });
    }

    const data = await response.json();
    const modelNames = data.models?.map((m: any) => m.name) || [];
    
    return NextResponse.json({ 
      status: 'LISTED', 
      count: modelNames.length,
      models: modelNames,
      key_prefix: apiKey.slice(0, 10) + '...' 
    });
  } catch (err) {
    return NextResponse.json({ status: 'FAIL', reason: String(err) }, { status: 500 });
  }
}
