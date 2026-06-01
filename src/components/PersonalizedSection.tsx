"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CloudSun, Stethoscope, TrendingUp } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

interface SoilReport {
  county?: string;
  crop?: string;
  health_score?: number;
  recommended_fert?: string;
  is_acidic?: boolean;
  is_n_low?: boolean;
  is_p_low?: boolean;
  is_k_low?: boolean;
  created_at?: string;
}

interface WeatherDay {
  date: string;
  temp_max: number;
  temp_min: number;
  rain_mm: number;
  description: string;
}

interface WeatherData {
  summary: string;
  forecast: WeatherDay[];
  advice: string;
}

interface Diagnosis {
  condition: string;
  crop?: string;
  county?: string;
  created_at?: string;
}

function getCookieSession(): { token?: string; name?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

function getRecommendedAction(report: SoilReport): string {
  const month = new Date().getMonth() + 1;
  const isLongRains = month >= 3 && month <= 5;
  const isShortRains = month >= 10 && month <= 12;

  if (report.is_acidic) {
    return `Apply agricultural lime to ${report.county ?? "your farm"} before the ${isLongRains ? "short" : "next"} rains season`;
  }
  if (report.is_n_low) {
    return `Apply CAN top-dressing now to boost nitrogen for your ${report.crop ?? "crops"}`;
  }
  if (report.is_p_low) {
    return `Add DAP or TSP before next planting to address low phosphorus`;
  }
  if (report.is_k_low) {
    return `Apply NPK 17:17:17 to fix potassium deficiency in your ${report.crop ?? "crops"}`;
  }
  if (isLongRains) {
    return `Long rains season — ideal time to apply basal fertilizer for your ${report.crop ?? "crops"}`;
  }
  if (isShortRains) {
    return `Short rains starting — prepare land and apply DAP at planting`;
  }
  return `Your soil is balanced. Consider running an updated analysis for the new season`;
}

function weatherIcon(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes("thunder")) return "⛈️";
  if (d.includes("heavy rain") || d.includes("violent")) return "🌧️";
  if (d.includes("rain") || d.includes("shower") || d.includes("drizzle")) return "🌦️";
  if (d.includes("overcast")) return "☁️";
  if (d.includes("cloud") || d.includes("partly")) return "⛅";
  return "☀️";
}

export default function PersonalizedSection() {
  const [report, setReport] = useState<SoilReport | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [lastDx, setLastDx] = useState<Diagnosis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getCookieSession();
    if (!session?.token) { setReady(true); return; }

    const headers = { Authorization: `Bearer ${session.token}` };

    // Fetch soil history + diagnosis history in parallel
    Promise.all([
      fetch(`${BACKEND}/api/v1/auth/soil-history?limit=1`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${BACKEND}/api/v1/diagnosis/history`, { headers })
        .then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([soilData, dxData]) => {
      const latestReport = soilData?.history?.[0] ?? null;
      setReport(latestReport);
      setLastDx(dxData?.history?.[0] ?? null);

      // Fetch weather for their county
      if (latestReport?.county) {
        fetch(`${BACKEND}/api/v1/weather/county/${encodeURIComponent(latestReport.county)}`)
          .then(r => r.ok ? r.json() : null)
          .then(w => setWeather(w))
          .catch(() => {})
          .finally(() => setReady(true));
      } else {
        setReady(true);
      }
    });
  }, []);

  // Only render for logged-in users with a report
  if (!ready || !report) return null;

  const today = weather?.forecast?.[0];
  const action = getRecommendedAction(report);

  return (
    <section className="bg-cream-100 border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* ── Weather card ── */}
          {today ? (
            <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-2xl">
                {weatherIcon(today.description)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-soil-500 uppercase tracking-wider mb-1">
                  Today · {report.county}
                </p>
                <p className="font-display text-2xl font-bold text-forest-700 leading-none">
                  {Math.round(today.temp_max)}°<span className="text-base font-normal text-soil-500 ml-1">/ {Math.round(today.temp_min)}°C</span>
                </p>
                <p className="text-xs text-soil-500 mt-1 leading-snug">{today.description}</p>
                {today.rain_mm > 2 && (
                  <p className="text-xs text-blue-600 font-semibold mt-1">💧 {today.rain_mm.toFixed(1)}mm rain expected</p>
                )}
                {weather?.advice && (
                  <p className="text-xs text-forest-600 font-medium mt-2 leading-relaxed">{weather.advice}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <CloudSun size={22} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-soil-500 uppercase tracking-wider mb-1">{report.county}</p>
                <p className="text-sm text-soil-500">Weather unavailable right now</p>
              </div>
            </div>
          )}

          {/* ── Recommended action ── */}
          <div className="bg-white rounded-2xl p-5 border border-forest-600/20 shadow-sm border-l-4 border-l-forest-600">
            <p className="text-xs font-semibold text-forest-600 uppercase tracking-wider mb-2">Recommended Action</p>
            <p className="text-sm text-forest-700 font-medium leading-relaxed mb-3">{action}</p>
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-gold-800 transition-colors"
            >
              Get updated plan <ArrowRight size={12} />
            </Link>
          </div>

          {/* ── Last diagnosis or yields quick link ── */}
          {lastDx ? (
            <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <Stethoscope size={20} className="text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-soil-500 uppercase tracking-wider mb-1">Last Diagnosis</p>
                <p className="text-sm font-semibold text-forest-700 leading-tight truncate">{lastDx.condition}</p>
                {lastDx.crop && <p className="text-xs text-soil-500 mt-0.5">{lastDx.crop}</p>}
                <Link href="/doctor" className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 mt-2 transition-colors">
                  Plant Doctor <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <TrendingUp size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-soil-500 uppercase tracking-wider mb-1">Track Your Yields</p>
                <p className="text-xs text-soil-500 leading-relaxed mb-2">Log your harvest season by season to see progress.</p>
                <Link href="/yields" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  My Yields <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
