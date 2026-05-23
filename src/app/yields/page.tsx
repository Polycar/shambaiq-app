"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  BarChart3,
  Loader2,
  Phone,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.shambaiq.com";

const CROPS = [
  "Maize","Beans","Potatoes","Wheat","Rice","Sorghum","Millet","Tea",
  "Coffee","Sugarcane","Bananas","Cassava","Sweet Potatoes","Groundnuts",
  "Soybeans","Sunflower","Sesame","Onions","Tomatoes","Cabbage","Kale",
  "Carrots","Peas","Macadamia","Avocado",
];

const currentYear = new Date().getFullYear();
const SEASONS = [
  `Long Rains ${currentYear - 1}`,
  `Short Rains ${currentYear - 1}`,
  `Long Rains ${currentYear}`,
  `Short Rains ${currentYear}`,
];

interface YieldRecord {
  season: string;
  crop: string;
  yield_bags_per_acre: number;
}

function getCookieSession(): { token?: string; phone?: string; name?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

export default function YieldsPage() {
  const [farmerId, setFarmerId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [identified, setIdentified] = useState(false);
  const [records, setRecords] = useState<YieldRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const [logCrop, setLogCrop] = useState("Maize");
  const [logSeason, setLogSeason] = useState(SEASONS[SEASONS.length - 1]);
  const [logYield, setLogYield] = useState(15);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Auto-identify if session exists
  useEffect(() => {
    const session = getCookieSession();
    if (session?.phone) {
      setToken(session.token || null);
      setFarmerId(session.phone);
      loadYields(session.phone);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadYields = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/analytics/yields/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.yields || (Array.isArray(data) ? data : []));
      }
    } catch { /* start fresh */ }
    setIdentified(true);
    setLoading(false);
  };

  const identify = async () => {
    const id = farmerId.trim();
    if (!id) return;
    await loadYields(id);
  };

  const saveYield = async () => {
    setSaving(true);
    setMsg("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API}/api/v1/analytics/yields`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          farmer_id: farmerId,
          crop: logCrop,
          season: logSeason,
          yield_bags_per_acre: logYield,
        }),
      });
      if (res.ok) {
        setMsg("Harvest logged! 🌾");
        setRecords(prev => [...prev, { season: logSeason, crop: logCrop, yield_bags_per_acre: logYield }]);
      } else {
        setMsg("Could not save. Try again.");
      }
    } catch {
      setRecords(prev => [...prev, { season: logSeason, crop: logCrop, yield_bags_per_acre: logYield }]);
      setMsg("Saved locally (offline mode) 📱");
    }
    setSaving(false);
  };

  const cropGroups = records.reduce<Record<string, YieldRecord[]>>((acc, r) => {
    if (!acc[r.crop]) acc[r.crop] = [];
    acc[r.crop].push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1e40af] to-[#1d4ed8] text-center py-8 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <TrendingUp size={28} className="text-white" />
          <h1 className="font-display text-2xl font-bold text-white">
            Yield Tracker
          </h1>
        </div>
        <p className="text-blue-200 text-sm">
          Season-over-Season Progress
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {!identified ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300">
            <p className="text-sm text-soil-400 mb-4">
              Enter your farm name or phone number to track your yields over time.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone size={16} className="absolute left-3 top-3.5 text-soil-400" />
                <input
                  type="text"
                  value={farmerId}
                  onChange={(e) => setFarmerId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && identify()}
                  placeholder="e.g. 0712345678"
                  className="w-full pl-9 pr-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <button
                onClick={identify}
                disabled={loading}
                className="px-5 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Go"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Log new harvest */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300 mb-5">
              <h2 className="font-display text-lg font-bold text-forest-700 mb-4 flex items-center gap-2">
                <Plus size={18} /> Log New Harvest
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className="block">
                  <span className="text-xs font-semibold text-soil-400">Crop</span>
                  <select
                    value={logCrop}
                    onChange={(e) => setLogCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-100 border border-cream-300 rounded-lg text-sm"
                  >
                    {CROPS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-soil-400">Season</span>
                  <select
                    value={logSeason}
                    onChange={(e) => setLogSeason(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-100 border border-cream-300 rounded-lg text-sm"
                  >
                    {SEASONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block mb-4">
                <span className="text-xs font-semibold text-soil-400">
                  Yield (Bags/Acre)
                </span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={logYield}
                  onChange={(e) => setLogYield(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-cream-100 border border-cream-300 rounded-lg text-sm"
                />
              </label>
              {msg && (
                <p className={`text-sm mb-3 ${msg.includes("!") ? "text-green-600" : "text-red-600"}`}>
                  {msg}
                </p>
              )}
              <button
                onClick={saveYield}
                disabled={saving}
                className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                💾 Save Harvest
              </button>
            </div>

            {/* Yield history */}
            {Object.keys(cropGroups).length > 0 ? (
              Object.entries(cropGroups).map(([cropName, recs]) => {
                const sorted = [...recs].sort((a, b) =>
                  a.season.localeCompare(b.season)
                );
                const maxYield = Math.max(...sorted.map((r) => r.yield_bags_per_acre));
                const first = sorted[0].yield_bags_per_acre;
                const last = sorted[sorted.length - 1].yield_bags_per_acre;
                const growth = first > 0 ? ((last - first) / first) * 100 : 0;

                return (
                  <div key={cropName} className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300 mb-4">
                    <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2">
                      <BarChart3 size={18} className="text-blue-600" />
                      {cropName}
                    </h3>
                    {/* Simple bar chart */}
                    <div className="space-y-2 mb-3">
                      {sorted.map((r, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-soil-400 w-28 shrink-0 truncate">
                            {r.season}
                          </span>
                          <div className="flex-1 h-6 bg-cream-100 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-forest-600 rounded-lg flex items-center justify-end px-2"
                              style={{
                                width: `${Math.max(10, (r.yield_bags_per_acre / maxYield) * 100)}%`,
                              }}
                            >
                              <span className="text-[10px] font-bold text-white">
                                {r.yield_bags_per_acre}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {sorted.length > 1 && (
                      <p
                        className={`text-sm font-semibold ${
                          growth > 0 ? "text-green-600" : growth < 0 ? "text-red-600" : "text-soil-400"
                        }`}
                      >
                        {growth > 0
                          ? `🚀 Yield up ${growth.toFixed(1)}% since tracking started!`
                          : growth < 0
                          ? `📉 Yield down ${Math.abs(growth).toFixed(1)}%. Review fertilizer timing.`
                          : "→ Yield stable."}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300 text-center">
                <BarChart3 size={40} className="mx-auto text-cream-400 mb-3" />
                <p className="text-soil-400 text-sm">
                  No harvest data yet. Log your first harvest above!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
