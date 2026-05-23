import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.shambaiq.com';

interface FarmerContext {
  name: string | null;
  county: string | null;
  language_pref: string;
  latest_soil: {
    county: string;
    crop: string;
    is_acidic: boolean;
    is_n_low: boolean;
    is_p_low: boolean;
    is_k_low: boolean;
    health_score: number;
    recommended_fert: string;
    scanned_at: string | null;
  } | null;
  fields: { name: string; size_acres: number; crop: string; county: string }[];
}

async function fetchFarmerContext(token: string): Promise<FarmerContext | null> {
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

function buildFarmerContextBlock(ctx: FarmerContext): string {
  const lines: string[] = ['--- FARMER PROFILE (use this — do not ask the farmer to repeat it) ---'];

  if (ctx.name) lines.push(`Name: ${ctx.name}`);
  if (ctx.county) lines.push(`Home county: ${ctx.county}`);
  if (ctx.language_pref && ctx.language_pref !== 'en') lines.push(`Preferred language: ${ctx.language_pref}`);

  if (ctx.fields.length > 0) {
    const fieldSummary = ctx.fields
      .map(f => `${f.name} (${f.size_acres} acres, ${f.crop}, ${f.county})`)
      .join('; ');
    lines.push(`Registered fields: ${fieldSummary}`);
  }

  if (ctx.latest_soil) {
    const s = ctx.latest_soil;
    const deficiencies = [
      s.is_acidic ? 'acidic pH' : null,
      s.is_n_low ? 'low N' : null,
      s.is_p_low ? 'low P' : null,
      s.is_k_low ? 'low K' : null,
    ].filter(Boolean).join(', ') || 'none detected';
    lines.push(`Latest soil scan (${s.scanned_at?.slice(0, 10) ?? 'unknown date'}): county=${s.county}, crop=${s.crop}, health score=${s.health_score}/100, deficiencies=${deficiencies}, recommended fert=${s.recommended_fert}`);
  }

  lines.push('---');
  return lines.join('\n');
}

export async function POST(request: Request) {
  // 1. Session check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('shambaiq_session');
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }

  let sessionData: { phone?: string; token?: string; name?: string };
  try {
    sessionData = JSON.parse(decodeURIComponent(sessionCookie.value));
    if (!sessionData.phone && !sessionData.token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized: Invalid session format' }, { status: 401 });
  }

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

    // 2. Agricultural topic filtering — only applied to the opening message.
    // Follow-up messages in an active conversation are always allowed through;
    // blocking them would cut off natural clarifying questions like "what do you mean?" or "how much?".
    const isFirstMessage = messages.length === 1;
    const userText = messages[messages.length - 1]?.content || '';

    if (isFirstMessage) {
      const normalized = userText.toLowerCase().trim();

      const shortGreetings = [
        'hi', 'hello', 'hey', 'habari', 'mambo', 'sasa', 'jambo', 'greetings', 'morning', 'afternoon', 'evening',
        'thanks', 'thank you', 'asante', 'shukran', 'please', 'help', 'usaidizi', 'ok', 'sawa', 'yes', 'no', 'ndio',
        'hapana', 'who are you', 'wewe ni nani', 'how are you', 'uhali gani', 'mambo vipi', 'niaje', 'yaliyopo', 'poa',
      ];

      const agKeywords = [
        'soil', 'crop', 'farm', 'fertilizer', 'dap', 'can', 'urea', 'npk', 'pest', 'disease', 'seed', 'weather',
        'rain', 'yield', 'harvest', 'irrigation', 'livestock', 'poultry', 'chicken', 'cow', 'goat', 'sheep', 'pig',
        'maize', 'bean', 'potato', 'tomato', 'onion', 'cabbage', 'coffee', 'tea', 'shamba', 'mshauri', 'agronomy',
        'agronomist', 'county', 'kalro', 'ncpb', 'plant', 'doctor', 'leaf', 'stem', 'water', 'cultivat', 'grow',
        'sow', 'plow', 'mulch', 'compost', 'manure', 'nutrient', 'nitrogen', 'phosphor', 'potass', 'ph', 'acidity',
        'alkalinity', 'liming', 'erosion', 'agriculture', 'agricultural', 'agrovet', 'agribusiness', 'veterinary',
        'fodder', 'silage', 'milking', 'pasture', 'tillage', 'weed', 'herbicide', 'pesticide', 'fungicide', 'insecticide',
        'spraying', 'nursery', 'seedling', 'transplant', 'pruning', 'grafting', 'mulching', 'drought', 'moisture',
        'drainage', 'intercrop', 'rotation', 'fallow', 'greenhouse', 'hydroponic', 'organic', 'composting',
        'bee', 'honey', 'fish', 'aquaculture', 'tilapia', 'pond',
        'kilimo', 'mmea', 'mazao', 'mbolea', 'wadudu', 'ugonjwa', 'mbegu', 'mvua', 'mavuno', 'umwagiliaji',
        "ng'ombe", 'kuku', 'mbuzi', 'mahindi', 'maharagwe', 'viazi', 'nyanya', 'kitunguu', 'kahawa', 'chai',
        'dawa', 'kulima', 'kupanda', 'palilia', 'samadi', 'magugu', 'unyevu', 'ukame',
      ];

      const isGreeting = normalized.length < 40 &&
        normalized.split(/\s+/).map(w => w.replace(/\W/g, '')).some(w => shortGreetings.includes(w));
      const isAgri = agKeywords.some(kw => normalized.includes(kw));

      if (!isGreeting && !isAgri) {
        return NextResponse.json({
          reply: "Shamba Mshauri is specialized in Kenyan farming — crops, soil, fertilizers, pests, and livestock. Ask me anything in those areas and I'll give you specific, practical advice.",
        });
      }
    }

    // 3. Fetch farmer context from backend (best-effort, never blocks the chat if it fails)
    const farmerCtx = sessionData.token ? await fetchFarmerContext(sessionData.token) : null;
    const farmerBlock = farmerCtx ? buildFarmerContextBlock(farmerCtx) : '';

    const systemInstruction = `You are Shamba Mshauri, an expert agronomist for Kenyan smallholder farmers. You know all 47 counties' soil profiles, agroecological zones, and locally available inputs.

STRICT RULES — follow every one, no exceptions:
- Answer the question directly in the first sentence. No preamble.
- Never say "As Shamba Mshauri" or introduce yourself — the farmer already knows who you are.
- Never repeat county or crop context the farmer already gave — they know where they are.
- No motivational language ("powerhouse", "amazing", "great question", "absolutely").
- Short question = short answer. Match response length to question complexity.
- Give specific names: exact fertilizer products (DAP 18:46:0, CAN 26%), seed varieties (H614D, Fahari F1), approximate KES prices.
- If a crop truly cannot grow in the named county, say so plainly and immediately suggest what does work there.
- Respond in the same language the farmer uses (English or Kiswahili).
- If unsure, say so and refer them to their county agricultural extension officer.
- If farmer profile data is provided below, use it silently — do NOT say "based on your profile" or similar; just give advice that naturally reflects what you know about them.
${farmerBlock ? '\n' + farmerBlock : ''}`;

    // Build conversation history — system instruction persists every turn via systemInstruction field
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 700,
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
