import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert agricultural plant doctor in Kenya. Analyze this image of a plant leaf or stem.
      Identify any disease, pest, or nutrient deficiency.
      
      Respond STRICTLY with a raw JSON object and nothing else. Do not wrap it in markdown block quotes or backticks.
      
      Schema:
      {
        "condition": "Name of the disease/pest/deficiency or 'Healthy'",
        "confidence": <number between 0 and 100 representing certainty>,
        "treatment": "Actionable, localized treatment advice (e.g., specific fungicides or organic remedies available to farmers)",
        "prevention": "Best practices to prevent this in the future (e.g., crop rotation, spacing)"
      }
    `;

    // The frontend sends base64 without the data:image/jpeg;base64, prefix
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanedText);
      return NextResponse.json(parsed);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON:', text);
      throw parseError;
    }
  } catch (error: any) {
    console.error('Gemini Diagnosis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
