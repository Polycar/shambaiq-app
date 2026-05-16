"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Lang, t, FERTILIZER_OPTIONS, CROP_UNITS } from "@/lib/i18n";
import { getRecommendation, RecommendResult, getWeatherByCounty, getWeather, WeatherData } from "@/lib/api";

// ─── Types for serialized data passed from server ───────────────
interface CountyData {
  county: string;
  slug: string;
  zone: string;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_carbon: number;
}
interface WardData {
  county: string;
  subcounty: string;
  ward: string;
  latitude: number;
  longitude: number;
}
interface CropData {
  crop: string;
  slug: string;
}
interface CountyCoordData {
  county: string;
  latitude: number;
  longitude: number;
}

interface Props {
  counties: CountyData[];
  wards: WardData[];
  crops: CropData[];
  countyCoords: CountyCoordData[];
}

// ─── Score color ────────────────────────────────────────────────
function scoreColor(s: number) {
  if (s >= 70) return "#16a34a";
  if (s >= 40) return "#f59e0b";
  return "#dc2626";
}
function scoreBg(s: number) {
  if (s >= 70) return "bg-green-50 border-green-200";
  if (s >= 40) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

/** Strip markdown **bold** markers and leading emojis from backend text */
function clean(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/\*\*/g, "")
    .replace(/^[\u2728\u26A0\uFE0F\u2705\u274C\u2757\u2615\u26C5\u2600\uFE0F\u2614\u2B50\uD83C-\uDBFF][\uDC00-\uDFFF]?\s*/g, "")
    .replace(/^[🚨⚠️✅❌🚀💡🌧️☀️🍃🏔️📅📡🧬📊🛒🏷️💧🌦️⛅🎯🔄📤🌍💰🌾⛈️☁️🌫️🎉]+\s*/g, "")
    .trim();
}

// ─── Component ─────────────────────────────────────────────────
export default function RecommendTool({ counties, wards, crops, countyCoords }: Props) {
  const [lang, setLang] = useState<Lang>("en");

  // Location mode: "region" = County/SubCounty/Ward, "gps" = GPS coordinates
  const [locMode, setLocMode] = useState<"region" | "gps">("region");
  const [gpsLat, setGpsLat] = useState<number | null>(null);
  const [gpsLon, setGpsLon] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  // Form state
  const [county, setCounty] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [ward, setWard] = useState("");
  const [crop, setCrop] = useState("");
  const [fertilizer, setFertilizer] = useState(FERTILIZER_OPTIONS[0]);
  const [acres, setAcres] = useState(1);
  const [priceMode, setPriceMode] = useState<"Subsidized" | "Commercial">("Subsidized");
  const [labMode, setLabMode] = useState(false);
  const [labPH, setLabPH] = useState(6.5);
  const [labN, setLabN] = useState(1.0);
  const [labP, setLabP] = useState(20.0);
  const [labK, setLabK] = useState(150.0);

  // Result state
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // GPS capture
  const captureGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError(lang === "en" ? "GPS not supported on this device" : "GPS haitumiki kwenye kifaa hiki");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude);
        setGpsLon(pos.coords.longitude);
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(
          lang === "en"
            ? `GPS error: ${err.message}. Enable location access.`
            : `Hitilafu ya GPS: ${err.message}. Ruhusu ufikiaji wa eneo.`
        );
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [lang]);

  // Computed drill-down
  const subcounties = useMemo(() => {
    if (!county) return [];
    const filtered = wards.filter((w) => w.county.toLowerCase() === county.toLowerCase());
    return Array.from(new Set(filtered.map((w) => w.subcounty))).sort();
  }, [county, wards]);

  const wardList = useMemo(() => {
    if (!county || !subcounty) return [];
    return wards
      .filter(
        (w) =>
          w.county.toLowerCase() === county.toLowerCase() &&
          w.subcounty === subcounty
      )
      .sort((a, b) => a.ward.localeCompare(b.ward));
  }, [county, subcounty, wards]);

  // Yield target
  const cropUnit = crop ? CROP_UNITS[crop] || { unit: "Multiplier", min: 0.5, max: 2.0, def: 1.0 } : null;
  const [yieldVal, setYieldVal] = useState<number | null>(null);

  const selectedWard = useMemo(() => {
    if (!ward) return null;
    return wards.find(
      (w) =>
        w.county.toLowerCase() === county.toLowerCase() &&
        w.subcounty === subcounty &&
        w.ward === ward
    );
  }, [county, subcounty, ward, wards]);

  // Resolve best available coordinates: GPS > Ward > Sub-County centroid > County centroid
  const resolvedCoords = useMemo(() => {
    // 1. GPS coordinates (highest precision — 30m)
    if (locMode === "gps" && gpsLat !== null && gpsLon !== null) {
      return { lat: gpsLat, lon: gpsLon, source: "GPS (30m)" };
    }
    // 2. Ward centroid
    if (selectedWard) {
      return { lat: selectedWard.latitude, lon: selectedWard.longitude, source: `Ward: ${ward}` };
    }
    // 3. Sub-county centroid (average of wards in that sub-county)
    if (county && subcounty) {
      const scWards = wards.filter(
        (w) => w.county.toLowerCase() === county.toLowerCase() && w.subcounty === subcounty
      );
      if (scWards.length > 0) {
        const avgLat = scWards.reduce((s, w) => s + w.latitude, 0) / scWards.length;
        const avgLon = scWards.reduce((s, w) => s + w.longitude, 0) / scWards.length;
        return { lat: avgLat, lon: avgLon, source: `Sub-County: ${subcounty}` };
      }
    }
    // 4. County centroid
    if (county) {
      const cc = countyCoords.find((c) => c.county.toLowerCase() === county.toLowerCase());
      if (cc) {
        return { lat: cc.latitude, lon: cc.longitude, source: `County: ${county}` };
      }
    }
    return null;
  }, [locMode, gpsLat, gpsLon, selectedWard, ward, county, subcounty, wards, countyCoords]);

  // Submit
  const [geminiAdvice, setGeminiAdvice] = useState<{
    summary: string;
    primary_fertilizer: string;
    application_rate: string;
    estimated_cost_kes: number;
    timing: string;
    key_advice: string[];
    warning: string;
  } | null>(null);

  const handleSubmit = useCallback(async () => {
    if (locMode === "gps" && !gpsLat) {
      setError(lang === "en" ? "Capture GPS first" : "Pata GPS kwanza");
      return;
    }
    if (locMode === "region" && !county) {
      setError(t("form_select_first", lang));
      return;
    }
    if (!crop) {
      setError(lang === "en" ? "Select a crop" : "Chagua zao");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setWeather(null);
    setGeminiAdvice(null);

    const lat = resolvedCoords?.lat;
    const lon = resolvedCoords?.lon;
    const resolvedCounty = county || "Nairobi";

    try {
      const overrides = labMode
        ? {
            pH: labPH,
            "Total Nitrogen (g/kg)": labN,
            "Extractable Phosphorus (mg/kg)": labP,
            "Extractable Potassium (mg/kg)": labK,
          }
        : undefined;

      const yieldTarget =
        cropUnit && yieldVal ? yieldVal / cropUnit.def : undefined;

      const res = await getRecommendation({
        county: resolvedCounty,
        crop,
        current_fertilizer: fertilizer,
        farm_size_acres: acres,
        lang: lang === "en" ? "English" : "Kiswahili",
        lat,
        lon,
        overrides,
        price_mode: priceMode,
        yield_target: yieldTarget,
      });
      setResult(res);

      // Fire weather in background — prefer coordinate-based weather
      if (lat && lon) {
        getWeather(lat, lon).then(setWeather).catch(() => {
          getWeatherByCounty(resolvedCounty).then(setWeather).catch(() => {});
        });
      } else {
        getWeatherByCounty(resolvedCounty).then(setWeather).catch(() => {});
      }
    } catch {
      // Railway backend failed — fall back to Gemini AI agronomic advice
      try {
        const countyData = counties.find((c) => c.county.toLowerCase() === resolvedCounty.toLowerCase());
        const geminiRes = await fetch("/api/agronomy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            county: resolvedCounty,
            crop,
            fertilizer,
            acres,
            soil: countyData
              ? { pH: countyData.pH, nitrogen: countyData.nitrogen, phosphorus: countyData.phosphorus, potassium: countyData.potassium }
              : null,
          }),
        });
        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          setGeminiAdvice(geminiData);
        } else {
          setError(lang === "en" ? "Unable to get advice — please try again." : "Imeshindwa kupata ushauri — jaribu tena.");
        }
      } catch {
        setError(lang === "en" ? "No internet connection." : "Hakuna muunganisho wa intaneti.");
      }
    } finally {
      setLoading(false);
    }
  }, [county, crop, fertilizer, acres, lang, labMode, labPH, labN, labP, labK, priceMode, resolvedCoords, cropUnit, yieldVal, locMode, gpsLat, counties]);

  // WhatsApp share
  const whatsappUrl = useMemo(() => {
    if (!result) return "";
    const tl = result.timeline;
    const lines = [
      `🌱 ShambaIQ (${result.county})`,
      `Crop: ${result.crop}`,
      `Score: ${result.health_score}/100`,
      "",
      ...result.budget.breakdown.map((l) => `🛒 ${l}`),
      `Budget: KES ${result.budget.total_budget.toLocaleString()}`,
    ];
    if (tl) {
      lines.push("", `M1: ${tl.month_1}`, `M2: ${tl.month_2}`, `M3: ${tl.month_3}`);
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [result]);

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      {/* Language toggle bar */}
      <div className="sticky top-0 z-50 border-b" style={{ background: "#1a3a1a" }}>
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-2">
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <svg width="28" height="28" viewBox="10 70 100 190" fill="none">
              <path d="M60 240 L35 140 Q30 100 60 80 Q90 100 85 140 Z" fill="#15803d" />
              <circle cx="60" cy="130" r="22" fill="#dcfce7" />
              <path d="M60 140 L60 118" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
              <path d="M60 125 Q48 115 50 108 Q55 105 60 118" fill="#16a34a" />
              <path d="M60 130 Q72 120 70 113 Q65 110 60 122" fill="#16a34a" />
            </svg>
            <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Shamba<span style={{ color: "#C8860A" }}>IQ</span>
            </span>
          </Link>
          <button
            onClick={() => setLang(lang === "en" ? "sw" : "en")}
            className="text-sm font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,0.15)", color: "#F5F0E1" }}
          >
            {lang === "en" ? "🇰🇪 Kiswahili" : "🇬🇧 English"}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div
        className="text-center text-white py-10 px-4"
        style={{
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)",
        }}
      >
        <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: "var(--font-display)" }}>
          🌱 {t("nav_advice", lang)}
        </h1>
        <p className="text-sm opacity-90 max-w-md mx-auto">
          {t("powered_by", lang)}
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* ── FORM ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 space-y-4">
          <h2 className="font-bold text-lg" style={{ color: "#1a3a1a" }}>
            {t("form_title", lang)}
          </h2>

          {/* Location Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            <button
              onClick={() => setLocMode("region")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                locMode === "region"
                  ? "text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              style={locMode === "region" ? { background: "#1a3a1a" } : {}}
            >
              📍 {lang === "en" ? "Select Region" : "Chagua Eneo"}
            </button>
            <button
              onClick={() => { setLocMode("gps"); if (!gpsLat) captureGPS(); }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                locMode === "gps"
                  ? "text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              style={locMode === "gps" ? { background: "#16a34a" } : {}}
            >
              📡 {lang === "en" ? "Check My Farm" : "Kagua Shamba Langu"}
            </button>
          </div>

          {/* GPS Status */}
          {locMode === "gps" && (
            <div>
              {gpsLoading && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 flex items-center gap-2">
                  <span className="animate-spin">📡</span>
                  {lang === "en" ? "Acquiring GPS signal..." : "Inapata ishara ya GPS..."}
                </div>
              )}
              {gpsLat !== null && gpsLon !== null && !gpsLoading && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 font-semibold flex items-center justify-between">
                  <span>✅ GPS Locked: {gpsLat.toFixed(4)}, {gpsLon.toFixed(4)}</span>
                  <button
                    onClick={captureGPS}
                    className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🔄 {lang === "en" ? "Refresh" : "Sasisha"}
                  </button>
                </div>
              )}
              {gpsError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  ⚠️ {gpsError}
                </div>
              )}
            </div>
          )}

          {/* Manual Location Selection — only shown in region mode */}
          {locMode === "region" && (
            <div className="space-y-4">
              {/* County */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📍 {t("form_county", lang)}
                </label>
                <select
                  value={county}
                  onChange={(e) => {
                    setCounty(e.target.value);
                    setSubcounty("");
                    setWard("");
                    setResult(null);
                  }}
                  className="w-full rounded-xl border-gray-300 border px-3 py-2.5 text-sm focus:border-green-600 focus:ring-green-600 shadow-sm"
                >
                  <option value="">{t("form_select_county", lang)}</option>
                  {counties.map((c) => (
                    <option key={c.slug} value={c.county}>
                      {c.county}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcounty */}
              {subcounties.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🏘️ {t("form_subcounty", lang)}
                  </label>
                  <select
                    value={subcounty}
                    onChange={(e) => {
                      setSubcounty(e.target.value);
                      setWard("");
                    }}
                    className="w-full rounded-xl border-gray-300 border px-3 py-2.5 text-sm shadow-sm"
                  >
                    <option value="">{t("form_whole_county", lang)}</option>
                    {subcounties.map((sc) => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ward */}
              {wardList.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🎯 {t("form_ward", lang)}
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-xl border-gray-300 border px-3 py-2.5 text-sm shadow-sm"
                  >
                    <option value="">{t("form_whole_subcounty", lang)}</option>
                    {wardList.map((w) => (
                      <option key={w.ward} value={w.ward}>{w.ward}</option>
                    ))}
                  </select>
                  {ward && selectedWard && (
                    <p className="mt-1 text-xs text-green-700 font-semibold">
                      🎯 Ward Locked: {ward} ({selectedWard.latitude.toFixed(4)}, {selectedWard.longitude.toFixed(4)})
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Coordinate Resolution Badge */}
          {resolvedCoords && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 flex items-center gap-2">
              <span>🛰️</span>
              <span className="font-semibold">
                {lang === "en" ? "iSDA Precision Active" : "Usahihi wa iSDA Umeamilishwa"}
              </span>
              <span className="text-green-500">—</span>
              <span>{resolvedCoords.source} ({resolvedCoords.lat.toFixed(4)}, {resolvedCoords.lon.toFixed(4)})</span>
            </div>
          )}

          {/* Crop + Fertilizer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🌾 {t("form_crop", lang)}
              </label>
              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value);
                  const u = CROP_UNITS[e.target.value];
                  setYieldVal(u ? u.def : null);
                }}
                className="w-full rounded-xl border-gray-300 border px-3 py-2.5 text-sm"
              >
                <option value="">—</option>
                {crops.map((c) => (
                  <option key={c.slug} value={c.crop}>{c.crop}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🧪 {t("form_fert", lang)}
              </label>
              <select
                value={fertilizer}
                onChange={(e) => setFertilizer(e.target.value)}
                className="w-full rounded-xl border-gray-300 border px-3 py-2.5 text-sm"
              >
                {FERTILIZER_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Acres + Price Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📐 {t("form_acres", lang)}
              </label>
              <input
                type="number"
                value={acres}
                onChange={(e) => setAcres(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                min={0.25}
                max={500}
                step={0.25}
                className="w-full rounded-xl border-gray-300 border px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💰 {lang === "en" ? "Price Basis" : "Msingi wa Bei"}
              </label>
              <select
                value={priceMode}
                onChange={(e) => setPriceMode(e.target.value as "Subsidized" | "Commercial")}
                className="w-full rounded-xl border-gray-300 border px-3 py-2.5 text-sm"
              >
                <option value="Subsidized">{t("form_price_subsidized", lang)}</option>
                <option value="Commercial">{t("form_price_commercial", lang)}</option>
              </select>
            </div>
          </div>

          {/* Yield Target */}
          {cropUnit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🎯 {t("form_yield_goal", lang)} ({cropUnit.unit})
              </label>
              <input
                type="range"
                min={cropUnit.min}
                max={cropUnit.max}
                step={cropUnit.max - cropUnit.min <= 50 ? 1 : 10}
                value={yieldVal ?? cropUnit.def}
                onChange={(e) => setYieldVal(parseFloat(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                <span>{cropUnit.min}</span>
                <span className="font-bold text-green-700">{yieldVal ?? cropUnit.def} {cropUnit.unit}</span>
                <span>{cropUnit.max}</span>
              </div>
            </div>
          )}

          {/* Lab Override */}
          <div className="border-t pt-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={labMode}
                onChange={(e) => setLabMode(e.target.checked)}
                className="rounded accent-green-600"
              />
              🧪 {t("form_lab_mode", lang)}
            </label>
            {labMode && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs text-gray-500">{t("form_lab_ph", lang)}</label>
                  <input type="number" step={0.1} value={labPH} onChange={(e) => setLabPH(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">{t("form_lab_n", lang)}</label>
                  <input type="number" step={0.1} value={labN} onChange={(e) => setLabN(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">{t("form_lab_p", lang)}</label>
                  <input type="number" step={1} value={labP} onChange={(e) => setLabP(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">{t("form_lab_k", lang)}</label>
                  <input type="number" step={10} value={labK} onChange={(e) => setLabK(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !county || !crop}
            className="w-full py-3 rounded-xl font-bold text-white text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: loading ? "#64748b" : "#16a34a" }}
          >
            {loading ? t("form_analyzing", lang) : t("form_button", lang)}
          </button>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </div>

        {/* ── GEMINI FALLBACK ADVICE ─────────────────────── */}
        {geminiAdvice && (
          <div className="space-y-4 pb-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
              <span>⚡</span>
              <span><strong>AI-Powered Advice</strong> — Precision server unavailable. Showing Gemini AI analysis using local soil data.</span>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <h3 className="font-bold text-base mb-2" style={{ color: "#1a3a1a" }}>📋 Summary</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{geminiAdvice.summary}</p>
            </div>

            <div className="rounded-2xl text-center text-white py-6 px-4" style={{ background: "#1a3a1a" }}>
              <p className="text-sm uppercase tracking-wider opacity-70 mb-1">Recommended Fertilizer</p>
              <p className="text-2xl font-extrabold">{geminiAdvice.primary_fertilizer}</p>
              <p className="text-sm opacity-80 mt-1">{geminiAdvice.application_rate}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-white p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Est. Cost</p>
                <p className="text-xl font-extrabold" style={{ color: "#16a34a" }}>KES {geminiAdvice.estimated_cost_kes?.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Timing</p>
                <p className="text-sm font-semibold text-gray-800">{geminiAdvice.timing}</p>
              </div>
            </div>

            {geminiAdvice.key_advice?.length > 0 && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>💡 Key Advice</h3>
                <ul className="space-y-2">
                  {geminiAdvice.key_advice.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {geminiAdvice.warning && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <h3 className="font-bold text-sm mb-1 text-red-700">⚠️ Warning</h3>
                <p className="text-sm text-red-700">{geminiAdvice.warning}</p>
              </div>
            )}
          </div>
        )}

        {/* ── RESULTS ───────────────────────────────────────── */}
        {result && !result.error && (
          <div ref={resultRef} id="shambaiq-results" className="space-y-4 pb-20">
            {/* Score */}
            <div className="rounded-2xl text-center text-white py-6 px-4" style={{ background: scoreColor(result.health_score) }}>
              <p className="text-6xl font-extrabold">{result.health_score}</p>
              <p className="text-sm font-bold tracking-wider uppercase mt-1">{t("result_score", lang)}</p>
            </div>

            {/* Data source badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{
                  background: result.data_source?.includes("API") || result.data_source?.includes("iSDA") || result.data_source?.includes("Lab")
                    ? "#16a34a" : "#64748b",
                }}
              >
                {clean(result.data_source)}
              </span>
              <span className="text-xs text-gray-500">
                {clean(result.confidence)} | {t("result_mapping", lang)} {result.county}
              </span>
            </div>

            {/* Nutrient Sufficiency */}
            <div className={`rounded-2xl border p-5 ${scoreBg(result.health_score)}`}>
              <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                📊 {t("chart_title", lang)}
              </h3>
              {result.reqs && result.county_data && (
                <div className="space-y-3">
                  {[
                    {
                      label: t("nutrient_n", lang),
                      current: result.county_data["Total Nitrogen (g/kg)"],
                      target: result.reqs.n_min,
                    },
                    {
                      label: t("nutrient_p", lang),
                      current: result.county_data["Extractable Phosphorus (mg/kg)"],
                      target: result.reqs.p_min,
                    },
                    {
                      label: t("nutrient_k", lang),
                      current: result.county_data["Extractable Potassium (mg/kg)"],
                      target: result.reqs.k_min,
                    },
                  ].map((n) => {
                    const ratio = n.target > 0 ? Math.min(n.current / n.target, 2) : 1;
                    const pct = Math.round(ratio * 50);
                    const isOk = ratio >= 0.9;
                    return (
                      <div key={n.label}>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span>{n.label}</span>
                          <span className={isOk ? "text-green-700" : "text-red-600"}>
                            {n.current.toFixed(1)} / {n.target.toFixed(1)} {isOk ? "✓" : "⚠"}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              background: isOk ? "#16a34a" : "#ef4444",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-gray-500 mt-1">
                    1.0 = {lang === "en" ? `optimal ${result.crop} requirement` : `mahitaji bora ya ${result.crop}`}
                  </p>
                </div>
              )}
            </div>

            {/* The Switch — Fertilizer Comparison */}
            {result.comparison && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  {t("switch_title", lang)}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-2">{t("table_feature", lang)}</th>
                        <th className="text-left py-2 pr-2">{t("table_habit", lang)}</th>
                        <th className="text-left py-2 text-green-700">{t("table_rec", lang)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 pr-2 font-medium">{t("table_strategy", lang)}</td>
                        <td className="py-2 pr-2 text-red-600 text-xs">{clean(result.comparison.current_flaw) || "—"}</td>
                        <td className="py-2 text-green-700 font-bold">
                          {(() => {
                            const rec = clean(result.comparison.recommended);
                            // Fix contradiction: if K is low, don't say "None required"
                            if (rec && (rec.includes("None") || rec.includes("Optimal")) && result.is_k_low) {
                              return lang === "en" ? "NPK 17:17:17 + CAN (K is deficient)" : "NPK 17:17:17 + CAN (K iko chini)";
                            }
                            return rec || "—";
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium">{t("table_outcome", lang)}</td>
                        <td className="py-2 pr-2">{clean(result.comparison.current_outcome) || "Variable"}</td>
                        <td className="py-2 text-green-700 font-bold">{clean(result.comparison.impact) || "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Timeline */}
            {result.timeline && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  📅 {t("timeline_title", lang)}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{result.timeline.season} — {result.crop}</p>
                {[
                  { label: t("timeline_month1", lang), text: result.timeline.month_1, color: "#3b82f6" },
                  { label: t("timeline_month2", lang), text: result.timeline.month_2, color: "#10b981" },
                  { label: t("timeline_month3", lang), text: result.timeline.month_3, color: "#f59e0b" },
                ].map((m) => (
                  <div key={m.label} className="mb-3 rounded-lg p-3" style={{ background: "#f8fafc", borderTop: `4px solid ${m.color}` }}>
                    <p className="text-xs uppercase tracking-wider font-bold text-gray-400">{m.label}</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: "#0f172a" }}>{clean(m.text)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Seeds */}
            {result.seeds && result.seeds.length > 0 && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  🧬 {t("seeds_title", lang)}
                </h3>
                <p className="text-xs text-gray-500 mb-3">KALRO & Kenya Seed Company certified varieties</p>
                <div className="space-y-2">
                  {result.seeds.map((s) => (
                    <details key={s.Variety} className="rounded-lg border overflow-hidden">
                      <summary className="px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-50">
                        🏷️ {s.Variety} <span className="text-gray-400 font-normal">({s.Breeder})</span>
                      </summary>
                      <div className="px-3 py-2 text-xs text-gray-600 border-t bg-gray-50 space-y-1">
                        <p><strong>{t("seeds_zone", lang)}:</strong> {s.Altitude_Zone} · <strong>{t("seeds_maturity", lang)}:</strong> {s.Maturity_Days} {t("seeds_days", lang)} · <strong>{t("seeds_yield", lang)}:</strong> {s.Yield_Bags_Per_Acre} bags/acre</p>
                        <p className="text-green-700">{s.Special_Attributes}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Budget / Shopping List */}
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="font-bold text-base mb-1" style={{ color: "#1a3a1a" }}>
                🛒 {t("shopping_title", lang)}
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                {t("shopping_for", lang)} <strong>{acres} {t("shopping_acres", lang)}</strong>
              </p>
              <div className="rounded-xl p-4 mb-3 text-center" style={{ background: "#1a3a1a" }}>
                <p className="text-sm text-gray-300 uppercase tracking-wider">{t("result_total_cost", lang)}</p>
                <p className="text-3xl font-extrabold text-white">KES {result.budget.total_budget.toLocaleString()}</p>
              </div>
              <ul className="space-y-1.5">
                {result.budget.breakdown.map((line, i) => (
                  <li key={i} className="text-sm text-gray-700 pl-4 relative before:content-['🛒'] before:absolute before:left-0">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* 7-Day Weather Forecast */}
            {weather && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  ⛅ {lang === "en" ? "7-Day Weather Forecast" : "Utabiri wa Hali ya Hewa (Siku 7)"}
                </h3>

                {/* Agronomic Advice Banner */}
                {weather.summary && (
                  <div className={`rounded-xl px-3 py-2.5 text-sm mb-3 border ${
                    weather.summary.includes("Heavy") || weather.summary.includes("dry") || weather.summary.includes("Dry")
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-green-50 border-green-200 text-green-800"
                  }`}>
                    <span className="font-semibold">{weather.summary}</span>
                    {weather.advice && <span className="opacity-80"> — {weather.advice}</span>}
                  </div>
                )}

                {/* Daily Forecast Cards */}
                {weather.forecast && weather.forecast.length > 0 && (
                  <div className="grid grid-cols-7 gap-1.5">
                    {weather.forecast.map((day: { date: string; temp_max: number; temp_min: number; rain_mm: number; description: string; wind_kmh?: number }, i: number) => {
                      const d = new Date(day.date + "T00:00:00");
                      const dayName = i === 0
                        ? (lang === "en" ? "Today" : "Leo")
                        : d.toLocaleDateString(lang === "en" ? "en-US" : "sw-KE", { weekday: "short" });
                      const dateStr = d.toLocaleDateString(lang === "en" ? "en-US" : "sw-KE", { day: "numeric", month: "short" });

                      // Weather icon from description
                      const desc = (day.description || "").toLowerCase();
                      let icon = "☀️";
                      if (desc.includes("thunder")) icon = "⛈️";
                      else if (desc.includes("heavy rain") || desc.includes("violent")) icon = "🌧️";
                      else if (desc.includes("rain") || desc.includes("shower")) icon = "🌦️";
                      else if (desc.includes("drizzle")) icon = "🌦️";
                      else if (desc.includes("overcast")) icon = "☁️";
                      else if (desc.includes("cloud") || desc.includes("partly")) icon = "⛅";
                      else if (desc.includes("fog")) icon = "🌫️";

                      const isWet = day.rain_mm > 5;
                      const isDry = day.rain_mm < 1;

                      return (
                        <div
                          key={day.date}
                          className={`rounded-xl border p-2 text-center text-xs transition-all ${
                            isWet ? "bg-blue-50 border-blue-200" : isDry ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"
                          }`}
                        >
                          <div className="font-bold text-gray-800">{dayName}</div>
                          <div className="text-gray-400 text-[10px]">{dateStr}</div>
                          <div className="text-2xl my-1">{icon}</div>
                          <div className="font-semibold text-gray-700">
                            {day.temp_max !== null ? `${Math.round(day.temp_max)}°` : "—"}
                          </div>
                          <div className="text-gray-400">
                            {day.temp_min !== null ? `${Math.round(day.temp_min)}°` : "—"}
                          </div>
                          <div className={`mt-1 font-semibold ${isWet ? "text-blue-600" : "text-gray-400"}`}>
                            💧 {day.rain_mm !== null ? `${day.rain_mm.toFixed(1)}` : "0"}mm
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Advice */}
            {result.advice && result.advice.length > 0 && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  💡 {t("result_advice_title", lang)}
                </h3>
                <div className="space-y-2">
                  {result.advice.map((item, i) => {
                    const isError = item.includes("❌") || item.includes("🚨") || item.includes("Critical") || item.includes("Toxicity");
                    const isWarn = item.includes("⚠️") || item.includes("Deficiency") || item.includes("Low");
                    const bg = isError ? "bg-red-50 border-red-200" : isWarn ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200";
                    return (
                      <div key={i} className={`rounded-lg border px-3 py-2 text-sm ${bg}`}>
                        {clean(item)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Share & Download Actions */}
            <div className="rounded-2xl border bg-white p-5 space-y-3" data-noprint>
              <h3 className="font-bold text-base" style={{ color: "#1a3a1a" }}>
                {lang === "en" ? "Share & Download" : "Shiriki na Pakua"}
              </h3>
              <button
                onClick={() => {
                  const el = resultRef.current;
                  if (!el) return;
                  // Hide the share buttons during print
                  const noprint = el.querySelectorAll('[data-noprint]');
                  noprint.forEach(n => (n as HTMLElement).style.display = 'none');
                  const style = document.createElement('style');
                  style.textContent = `
                    @media print {
                      body * { visibility: hidden; }
                      #shambaiq-results, #shambaiq-results * { visibility: visible; }
                      #shambaiq-results { position: absolute; left: 0; top: 0; width: 100%; }
                    }
                  `;
                  document.head.appendChild(style);
                  window.print();
                  style.remove();
                  noprint.forEach(n => (n as HTMLElement).style.display = '');
                }}
                className="block w-full py-3 rounded-xl text-center font-bold text-white text-sm cursor-pointer"
                style={{ background: "#1a3a1a" }}
              >
                {lang === "en" ? "Download PDF Report" : "Pakua Ripoti ya PDF"}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl text-center font-bold text-white text-sm"
                style={{ background: "#25D366" }}
              >
                {t("result_share", lang)}
              </a>
              <a
                href={`https://www.google.com/maps/search/Agrovet+Fertilizer/@${selectedWard?.latitude || 0},${selectedWard?.longitude || 0},14z`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl text-center font-bold text-white text-sm"
                style={{ background: "#2563eb" }}
              >
                {t("dealers_find", lang)}
              </a>
            </div>

            {/* Footer attribution */}
            <p className="text-center text-xs text-gray-400 pb-6">
              ISRIC / iSDAsoil Precision | Kenyan Agronomic Baselines | ShambaIQ
            </p>
          </div>
        )}

        {/* API error in result */}
        {result?.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-red-800 font-semibold">{result.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
