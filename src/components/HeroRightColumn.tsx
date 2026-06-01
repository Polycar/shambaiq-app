"use client";

import { useState, useEffect } from "react";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

interface SoilReport {
  county?: string;
  crop?: string;
  health_score?: number;
  recommended_fert?: string;
  total_budget?: number;
  is_acidic?: boolean;
  is_n_low?: boolean;
  is_p_low?: boolean;
  is_k_low?: boolean;
}

function getCookieSession(): { token?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626";
  const label = score >= 70 ? "Good" : score >= 50 ? "Fair" : "Poor";
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
        <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={`${(score / 100) * 138.2} 138.2`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-bold text-lg leading-none">{score}</span>
        <span className="text-[9px] font-medium leading-none mt-0.5" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

// Static mockup card shown for guests / while loading
function StaticMockup() {
  return (
    <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-cream-200 text-xs font-medium tracking-wide uppercase mb-0.5">Soil Report</p>
          <p className="text-white font-display font-bold text-base leading-tight">Nakuru County · Maize</p>
        </div>
        <ScoreRing score={74} />
      </div>
      <div className="space-y-3 mb-5">
        {[
          { label: "pH", value: "6.2", pct: 64, color: "#16a34a" },
          { label: "Nitrogen", value: "1.4 g/kg", pct: 56, color: "#f59e0b" },
          { label: "Phosphorus", value: "28 mg/kg", pct: 70, color: "#16a34a" },
          { label: "Potassium", value: "310 mg/kg", pct: 78, color: "#16a34a" },
        ].map((n) => (
          <div key={n.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-cream-300">{n.label}</span>
              <span className="font-semibold text-white">{n.value}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${n.pct}%`, backgroundColor: n.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-3 mb-3">
        <p className="text-green-200 text-xs font-semibold">Recommended: DAP 18:46:0 · 50kg/acre</p>
      </div>
      <p className="text-gold-300 text-sm font-bold text-center">KES 3,200 estimated cost</p>
    </div>
  );
}

export default function HeroRightColumn() {
  const [report, setReport] = useState<SoilReport | null>(null);
  const [status, setStatus] = useState<"loading" | "guest" | "no-report" | "ready">("loading");

  useEffect(() => {
    const session = getCookieSession();
    if (!session?.token) { setStatus("guest"); return; }

    fetch(`${BACKEND}/api/v1/auth/soil-history?limit=1`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const h = data?.history;
        if (h && h.length > 0) { setReport(h[0]); setStatus("ready"); }
        else setStatus("no-report");
      })
      .catch(() => setStatus("no-report"));
  }, []);

  if (status === "loading" || status === "guest") return <StaticMockup />;

  if (status === "no-report") {
    return (
      <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 shadow-2xl text-center flex flex-col items-center justify-center min-h-[260px]">
        <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <p className="text-white font-display font-bold text-base mb-2">No report yet</p>
        <p className="text-cream-300 text-xs mb-5 max-w-[200px] leading-relaxed">
          Run your first free soil analysis — see your farm's health score here.
        </p>
        <a href="/app" className="inline-block px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-xl text-sm transition-colors">
          Get Free Report →
        </a>
      </div>
    );
  }

  const score = report?.health_score ?? 70;

  return (
    <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-cream-200 text-xs font-medium tracking-wide uppercase mb-0.5">Your Last Report</p>
          <p className="text-white font-display font-bold text-base leading-tight">
            {report?.county ?? "Your Farm"}{report?.crop ? ` · ${report.crop}` : ""}
          </p>
        </div>
        <ScoreRing score={score} />
      </div>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {report?.is_acidic && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-400/30">Acidic soil</span>}
        {report?.is_n_low && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">Low N</span>}
        {report?.is_p_low && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">Low P</span>}
        {report?.is_k_low && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">Low K</span>}
        {!report?.is_acidic && !report?.is_n_low && !report?.is_p_low && !report?.is_k_low && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-400/30">Balanced soil</span>
        )}
      </div>

      {report?.recommended_fert && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-3 mb-3">
          <p className="text-green-200 text-xs font-semibold leading-relaxed">Recommended: {report.recommended_fert}</p>
        </div>
      )}

      {report?.total_budget != null && report.total_budget > 0 && (
        <p className="text-gold-300 text-sm font-bold text-center mb-3">
          KES {report.total_budget.toLocaleString()} estimated cost
        </p>
      )}

      <a href="/app" className="block w-full py-2.5 text-center text-xs font-bold text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-xl transition-colors">
        Run Updated Report →
      </a>
    </div>
  );
}
