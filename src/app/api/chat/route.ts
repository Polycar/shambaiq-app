import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://api.shambaiq.com';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

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

// ── Tool definitions for Gemini function calling ──────────────────────────────

const TOOL_DECLARATIONS = [
  {
    name: 'get_soil_data',
    description: 'Retrieve real soil health data for a Kenyan county — pH, nitrogen, phosphorus, potassium levels and a health score. Use this when the farmer asks about their soil or before making fertilizer recommendations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        county: { type: 'STRING', description: 'Kenyan county name e.g. "Nakuru", "Kisii", "Meru"' },
      },
      required: ['county'],
    },
  },
  {
    name: 'get_fertilizer_plan',
    description: 'Generate a specific fertilizer recommendation plan for a crop in a county. Use this when the farmer wants a detailed fertilizer schedule or application rates, including companion crop audits for intercropping.',
    parameters: {
      type: 'OBJECT',
      properties: {
        county: { type: 'STRING', description: 'Kenyan county name' },
        crop: { type: 'STRING', description: 'Crop name e.g. "Maize", "Beans", "Tomato"' },
        farm_size_acres: { type: 'NUMBER', description: 'Farm size in acres (default 1.0)' },
        budget_kes: { type: 'NUMBER', description: 'Farmer budget in KES (optional, default 5000)' },
        companion_crop: { type: 'STRING', description: 'Optional companion crop for intercropping e.g. "Beans", "Pigeon Peas"' },
      },
      required: ['county', 'crop'],
    },
  },
  {
    name: 'find_dealers',
    description: 'Find approved agrovet dealers and fertilizer stockists in a county. Use when the farmer asks where to buy inputs, fertilizers, or seeds.',
    parameters: {
      type: 'OBJECT',
      properties: {
        county: { type: 'STRING', description: 'Kenyan county name' },
      },
      required: ['county'],
    },
  },
  {
    name: 'get_weather',
    description: 'Get current weather conditions and forecast for a Kenyan county. Use when the farmer asks about rain, planting windows, or whether to spray.',
    parameters: {
      type: 'OBJECT',
      properties: {
        county: { type: 'STRING', description: 'Kenyan county name' },
      },
      required: ['county'],
    },
  },
];

// ── Tool executors ─────────────────────────────────────────────────────────────

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  try {
    if (name === 'get_soil_data') {
      const county = encodeURIComponent(String(args.county));
      const res = await fetch(`${BACKEND}/api/v1/county/${county}/soil`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return `No soil data found for ${args.county}.`;
      const data = await res.json();
      return JSON.stringify(data);
    }

    if (name === 'get_fertilizer_plan') {
      const res = await fetch(`${BACKEND}/api/v1/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          county: args.county,
          crop: args.crop,
          farm_size_acres: args.farm_size_acres ?? 1.0,
          current_fertilizer: 'DAP (Diammonium Phosphate)',
          lang: 'English',
          price_mode: 'Subsidized',
          companion_crop: args.companion_crop,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return `Could not generate fertilizer plan for ${args.crop} in ${args.county}.`;
      const data = await res.json();
      return JSON.stringify(data);
    }

    if (name === 'find_dealers') {
      const county = encodeURIComponent(String(args.county));
      const res = await fetch(`${BACKEND}/api/v1/dealers/${county}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return `No dealers found in ${args.county}.`;
      const data = await res.json();
      return JSON.stringify(data);
    }

    if (name === 'get_weather') {
      const county = encodeURIComponent(String(args.county));
      const res = await fetch(`${BACKEND}/api/v1/weather/county/${county}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return `No weather data available for ${args.county}.`;
      const data = await res.json();
      return JSON.stringify(data);
    }

    return `Unknown tool: ${name}`;
  } catch (err) {
    return `Tool ${name} failed: ${String(err)}`;
  }
}

// ── Persist conversation to backend (fire-and-forget, non-blocking) ───────────

async function persistConversation(
  token: string,
  messages: { role: string; content: string }[],
  conversationId: string | null
): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ conversation_id: conversationId, messages }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.conversation_id ?? null;
  } catch {
    return null;
  }
}

// ── Main handler ───────────────────────────────────────────────────────────────

export async function POST(request: Request) {
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

  const sessionKey = sessionData.phone || sessionData.token || clientIp(request);
  const rl = await rateLimit(`chat:${sessionKey}`, 30, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'You have sent too many messages this hour. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSecs) } }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server misconfiguration: API key missing' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { messages, conversation_id = null } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const isFirstMessage = messages.length === 1;
    const userText = messages[messages.length - 1]?.content || '';
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
      'dawa', 'kulima', 'kupanda', 'palilia', 'samadi', 'magugu', 'unyevu', 'ukame', 'dealer', 'stockist', 'buy',
    ];

    const words = normalized.split(/\s+/).map((w: string) => w.replace(/\W/g, ''));
    const isPureGreeting = isFirstMessage &&
      normalized.length < 40 &&
      words.some((w: string) => shortGreetings.includes(w)) &&
      !agKeywords.some(kw => normalized.includes(kw));

    if (isPureGreeting) {
      const farmerCtx = sessionData.token ? await fetchFarmerContext(sessionData.token) : null;
      const firstName = farmerCtx?.name?.split(' ')[0] || null;
      const isSwahili = ['habari', 'mambo', 'sasa', 'jambo', 'niaje', 'habari yako', 'poa', 'yaliyopo'].some(g => normalized.includes(g));

      let reply: string;
      if (isSwahili) {
        reply = firstName
          ? `Habari ${firstName}! Mimi ni Shamba Mshauri, mshauri wako wa kilimo. Ninaweza kukusaidia na nini leo — udongo, mazao, mbolea, au wadudu?`
          : `Habari! Mimi ni Shamba Mshauri, mshauri wako wa kilimo wa Kenya. Ninaweza kukusaidia na nini leo — udongo, mazao, mbolea, au wadudu?`;
      } else {
        reply = firstName
          ? `Hi ${firstName}! I'm Shamba Mshauri, your AI agronomist. What farming question can I help you with today?`
          : `Hi! I'm Shamba Mshauri, your AI agronomist for all 47 Kenyan counties. What farming question can I help you with today?`;
      }
      return NextResponse.json({ reply, conversation_id: null });
    }

    if (isFirstMessage && !agKeywords.some(kw => normalized.includes(kw))) {
      return NextResponse.json({
        reply: "Shamba Mshauri is specialized in Kenyan farming — crops, soil, fertilizers, pests, and livestock. Ask me anything in those areas and I'll give you specific, practical advice.",
        conversation_id: null,
      });
    }

    // Fetch farmer context
    const farmerCtx = sessionData.token ? await fetchFarmerContext(sessionData.token) : null;
    const farmerBlock = farmerCtx ? buildFarmerContextBlock(farmerCtx) : '';

    const systemInstruction = `You are Shamba Mshauri, an expert agronomist for Kenyan smallholder farmers. You know all 47 counties' soil profiles, agroecological zones, and locally available inputs.

You have access to real-time tools — use them proactively when a question involves soil, fertilizer plans, dealer locations, or weather. Do not guess when you can look it up.

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
- If farmer profile data is provided below, use it silently — do NOT say "based on your profile" or similar.
${farmerBlock ? '\n' + farmerBlock : ''}`;

    // Build contents array
    let contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // ── Agentic loop — up to 5 rounds of tool calls ────────────────────────────
    let finalText = '';
    for (let round = 0; round < 5; round++) {
      const response = await fetch(`${GEMINI_BASE}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error('[Chat] Gemini error:', response.status, errBody);
        return NextResponse.json({ error: `Gemini API error: ${response.status}` }, { status: 502 });
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts ?? [];

      // Check if there are function calls in the response
      const functionCalls = parts.filter((p: Record<string, unknown>) => p.functionCall);

      if (functionCalls.length === 0) {
        // No tool calls — extract text and exit loop
        finalText = parts.find((p: Record<string, unknown>) => p.text)?.text ?? '';
        break;
      }

      // Add model response (with function calls) to contents
      contents = [...contents, { role: 'model', parts }];

      // Execute all tool calls in parallel
      const toolResults = await Promise.all(
        functionCalls.map(async (part: { functionCall: { name: string; args: Record<string, unknown> } }) => {
          const { name, args } = part.functionCall;
          const result = await executeTool(name, args ?? {});
          return {
            functionResponse: {
              name,
              response: { result },
            },
          };
        })
      );

      // Add tool results to contents and loop
      contents = [...contents, { role: 'user', parts: toolResults }];
    }

    if (!finalText) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    // Persist conversation to backend (non-blocking — don't let a save failure break the response)
    let savedConversationId: string | null = conversation_id;
    if (sessionData.token) {
      const allMessages = [
        ...messages,
        { role: 'assistant', content: finalText },
      ];
      savedConversationId = await persistConversation(sessionData.token, allMessages, conversation_id);
    }

    return NextResponse.json({ reply: finalText, conversation_id: savedConversationId });
  } catch (error) {
    console.error('[Chat] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
