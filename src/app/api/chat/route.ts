import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // 1. Session check to protect the endpoint from unauthorized consumption
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
        'hapana', 'who are you', 'wewe ni nani', 'how are you', 'uhali gani', 'mambo vipi', 'niaje', 'yaliyopo', 'poa'
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
        'ng\'ombe', 'kuku', 'mbuzi', 'mahindi', 'maharagwe', 'viazi', 'nyanya', 'kitunguu', 'kahawa', 'chai',
        'dawa', 'kulima', 'kupanda', 'palilia', 'samadi', 'magugu', 'unyevu', 'ukame'
      ];

      const isGreeting = normalized.length < 40 &&
        normalized.split(/\s+/).map(w => w.replace(/\W/g, '')).some(w => shortGreetings.includes(w));
      const isAgri = agKeywords.some(kw => normalized.includes(kw));

      if (!isGreeting && !isAgri) {
        return NextResponse.json({
          reply: "Shamba Mshauri is specialized in Kenyan farming — crops, soil, fertilizers, pests, and livestock. Ask me anything in those areas and I'll give you specific, practical advice."
        });
      }
    }


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
- If unsure, say so and refer them to their county agricultural extension officer.`;

    // Build conversation history — system instruction is sent separately and persists every turn
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
