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

    // 2. Agricultural topic filtering to prevent prompt abuse/billing spikes
    const userText = messages[messages.length - 1]?.content || '';
    
    const isAgriculturalQuery = (text: string): boolean => {
      const normalized = text.toLowerCase().trim();

      // Permit short standard greetings and basic conversational words (less than 40 chars)
      const shortGreetings = [
        'hi', 'hello', 'hey', 'habari', 'mambo', 'sasa', 'jambo', 'greetings', 'morning', 'afternoon', 'evening',
        'thanks', 'thank you', 'asante', 'shukran', 'please', 'help', 'usaidizi', 'ok', 'sawa', 'yes', 'no', 'ndio',
        'hapana', 'who are you', 'wewe ni nani', 'how are you', 'uhali gani', 'mambo vipi', 'niaje', 'yaliyopo', 'poa'
      ];

      if (normalized.length < 40) {
        const words = normalized.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ''));
        if (words.some(w => shortGreetings.includes(w))) {
          return true;
        }
      }

      // Agriculture-related keywords in English and Swahili
      const agKeywords = [
        // English
        'soil', 'crop', 'farm', 'fertilizer', 'dap', 'can', 'urea', 'npk', 'pest', 'disease', 'seed', 'weather',
        'rain', 'yield', 'harvest', 'irrigation', 'livestock', 'poultry', 'chicken', 'cow', 'goat', 'sheep', 'pig',
        'maize', 'bean', 'potato', 'tomato', 'onion', 'cabbage', 'coffee', 'tea', 'shamba', 'mshauri', 'agronomy',
        'agronomist', 'county', 'kalro', 'ncpb', 'plant', 'doctor', 'leaf', 'stem', 'water', 'cultivat', 'grow',
        'sow', 'plow', 'mulch', 'compost', 'manure', 'nutrient', 'nitrogen', 'phosphor', 'potass', 'ph ', 'acidity',
        'alkalinity', 'liming', 'erosion', 'agriculture', 'agricultural', 'agrovet', 'agribusiness', 'veterinary',
        'fodder', 'silage', 'milking', 'pasture', 'tillage', 'weed', 'herbicide', 'pesticide', 'fungicide', 'insecticide',
        'spraying', 'nursery', 'seedling', 'transplant', 'pruning', 'grafting', 'mulching', 'drought', 'dryness',
        'moisture', 'drainage', 'intercrop', 'rotation', 'fallow', 'greenhouse', 'hydroponic', 'organic', 'composting',
        'vermicompost', 'bee', 'apiculture', 'honey', 'fish', 'aquaculture', 'tilapia', 'catfish', 'pond',

        // Swahili
        'shamba', 'mchanga', 'kilimo', 'mmea', 'mazao', 'mbolea', 'wadudu', 'ugonjwa', 'mbegu', 'mvua', 'hali ya hewa',
        'mavuno', 'umwagiliaji', 'ng\'ombe', 'kuku', 'mbuzi', 'kondoo', 'nguruwe', 'mahindi', 'maharagwe', 'viazi',
        'nyanya', 'kitunguu', 'kabeji', 'kahawa', 'chai', 'dawa', 'kulima', 'kupanda', 'palilia', 'uvunaji', 'ng\'ombe wa maziwa',
        'mayai', 'chakula cha mifugo', 'agrovet', 'boma', 'mbolea ya jivu', 'samadi', 'dawa ya wadudu', 'magugu',
        'kukausha', 'unyevu', 'ukame'
      ];

      return agKeywords.some(keyword => normalized.includes(keyword));
    };

    if (!isAgriculturalQuery(userText)) {
      return NextResponse.json({
        reply: "As Shamba Mshauri (your AI Agronomist), I am specialized only in farming, soil health, crop management, livestock, and agricultural practices in Kenya. 🌾\n\nI noticed your question isn't related to agriculture. Please feel free to ask me anything about crop diseases, fertilizers, planting timing, or soil care!"
      });
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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
