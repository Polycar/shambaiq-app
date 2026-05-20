import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const API = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";
const dataDir = path.join(process.cwd(), 'src', 'data');
const csvPath = path.join(dataDir, 'crop_economics.csv');

async function validateAccess(request: Request): Promise<boolean> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('access_code') || '';
  if (!code) return false;
  
  try {
    const res = await fetch(`${API}/api/v1/analytics/stats?access_code=${code}`);
    return res.ok;
  } catch (err) {
    console.error('[AdminCropsAPI] Auth verification failed:', err);
    return false;
  }
}

export async function GET(request: Request) {
  const isValid = await validateAccess(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ error: 'CSV file not found' }, { status: 404 });
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const crops = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ''; });
      return row;
    });

    return NextResponse.json({ crops });
  } catch (error: any) {
    console.error('[AdminCropsAPI] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isValid = await validateAccess(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { crops } = await request.json();
    if (!Array.isArray(crops)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Write back to crop_economics.csv
    // Headers: Crop,ph_min,ph_max,n_need,p_need,k_need,price_per_kg,yield_per_acre,pref_texture
    const headers = ['Crop', 'ph_min', 'ph_max', 'n_need', 'p_need', 'k_need', 'price_per_kg', 'yield_per_acre', 'pref_texture'];
    const lines = [headers.join(',')];

    for (const crop of crops) {
      const row = [
        crop.Crop,
        crop.ph_min,
        crop.ph_max,
        crop.n_need,
        crop.p_need,
        crop.k_need,
        crop.price_per_kg,
        crop.yield_per_acre,
        crop.pref_texture
      ];
      lines.push(row.join(','));
    }

    fs.writeFileSync(csvPath, lines.join('\n') + '\n', 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[AdminCropsAPI] POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
