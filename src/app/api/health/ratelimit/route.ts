import { NextResponse } from 'next/server';
import { getRateLimitDiagnostics } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Diagnostic endpoint: GET /api/health/ratelimit
// Reports whether the Upstash Redis backend is actually active in this
// deployment. Returns env-var NAMES only (no secret values) plus a live ping.
export async function GET() {
  const diag = await getRateLimitDiagnostics();
  return NextResponse.json(diag, {
    status: diag.healthy ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
