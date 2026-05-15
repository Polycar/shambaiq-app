"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MapPin, Wheat, FlaskConical, Ruler, Loader2, ArrowRight, Share2,
  FileText, MessageCircle, ChevronDown, Beaker, Navigation, Target,
  TrendingUp, Zap, CloudSun, Leaf, Send, Store,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

const FERTILIZER_OPTIONS = [
  "DAP (Diammonium Phosphate)", "CAN", "Urea", "NPK 17:17:17",
  "Mavuno (Planting)", "YaraMila Cereal", "SSP / TSP", "Manure", "None",
];

const CROP_UNITS: Record<string, { unit: string; min: number; max: number; def: number }> = {
  Maize: { unit: "Bags/Acre", min: 15, max: 50, def: 30 },
  Beans: { unit: "Bags/Acre", min: 8, max: 20, def: 12 },
  Potatoes: { unit: "Bags/Acre", min: 200, max: 400, def: 300 },
  Tomatoes: { unit: "Tons/Acre", min: 10, max: 30, def: 15 },
  "Kale (Sukuma)": { unit: "Tons/Acre", min: 5, max: 20, def: 10 },
  Wheat: { unit: "Bags/Acre", min: 10, max: 30, def: 20 },
  Sorghum: { unit: "Bags/Acre", min: 10, max: 25, def: 15 },
  Avocado: { unit: "Tons/Acre", min: 5, max: 15, def: 10 },
  Tea: { unit: "kg/Acre", min: 1000, max: 3000, def: 2000 },
};

const INSIGHTS: Record<string, string> = {
  Nakuru: "Local Variation: Naivasha soil is often more acidic than Nakuru Town.",
  Kakamega: "Western Insight: High rainfall causes phosphorus fixation here.",
  Mombasa: "Coastal Precision: Salinity varies within metres of the shore.",
  Nairobi: "Urban Variation: Peri-urban soils shift rapidly. Map precisely.",
  Kiambu: "Topography Alert: pH changes with elevation on hillsides.",
  "Uasin Gishu": "Grain Basket: Intensive cereal farming creates nutrient hotspots.",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rec = Record<string, any>;

export default function AppPage() {
  const [lang, setLang] = useState<"en" | "sw">("en");
  const [counties, setCounties] = useState<string[]>([]);
  const [subcounties, setSubcounties] = useState<string[]>([]);
  const [wards, setWards] = useState<{ ward: string; lat: number; lon: number }[]>([]);
  const [crops, setCrops] = useState<string[]>([]);

  // Form state
  const [locMode, setLocMode] = useState<"region" | "gps">("region");
  const [county, setCounty] = useState("");
  const [subcounty, setSubcounty] = useState("");
  const [ward, setWard] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [crop, setCrop] = useState("");
  const [fert, setFert] = useState("DAP (Diammonium Phosphate)");
  const [acres, setAcres] = useState(1);
  const [priceBasis, setPriceBasis] = useState<"Subsidized" | "Commercial">("Subsidized");
  const [yieldTarget, setYieldTarget] = useState(1.0);
  const [labMode, setLabMode] = useState(false);
  const [labPh, setLabPh] = useState(6.5);
  const [labN, setLabN] = useState(1.0);
  const [labP, setLabP] = useState(20.0);
  const [labK, setLabK] = useState(150.0);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Rec | null>(null);
  const [error, setError] = useState("");

  // Weather
  const [weather, setWeather] = useState<string | null>(null);

  // Chat
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Load counties + crops
  useEffect(() => {
    fetch(`${API}/api/v1/counties`).then(r => r.json()).then(d => setCounties(d.counties || d || []))
      .catch(() => setCounties(["Baringo","Bomet","Bungoma","Busia","Elgeyo Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Muranga","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita Taveta","Tana River","Tharaka Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"]));
    fetch(`${API}/api/v1/crops`).then(r => r.json()).then(d => setCrops(d.crops || d || []))
      .catch(() => setCrops(["Maize","Beans","Potatoes","Wheat","Rice (Upland)","Sorghum","Finger Millet","Tea","Coffee (Arabica)","Sugarcane","Bananas","Cassava","Sweet Potato","Groundnuts","Soybeans","Sunflower","Cowpeas","Onions","Tomatoes","Cabbage","Kale (Sukuma)","Avocado","Macadamia","Mangoes","Pyrethrum"]));
  }, []);

  // Load subcounties when county changes
  useEffect(() => {
    if (!county) { setSubcounties([]); setWards([]); return; }
    setSubcounty(""); setWard(""); setWards([]);
    fetch(`${API}/api/v1/county/${encodeURIComponent(county)}/soil`)
      .then(r => r.json()).then(d => {
        if (d.latitude && d.longitude) { setLat(d.latitude); setLon(d.longitude); }
      }).catch(() => {});
    // Try to load subcounties from wards data
    fetch(`/api/wards?county=${encodeURIComponent(county)}`).catch(() => {});
  }, [county]);

  // GPS capture
  const captureGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLon(pos.coords.longitude); },
      () => setError(lang === "en" ? "GPS access denied" : "GPS imekataliwa")
    );
  }, [lang]);

  // Yield target config
  const cropCfg = CROP_UNITS[crop] || { unit: "Multiplier", min: 0.5, max: 2.0, def: 1.0 };

  const handleSubmit = async () => {
    if (!county || !crop) { setError(lang === "en" ? "Select county and crop" : "Chagua kaunti na zao"); return; }
    setLoading(true); setError(""); setResult(null); setWeather(null); setChatHistory([]);

    try {
      const body: Rec = {
        county, crop, current_fertilizer: fert, acres, price_mode: priceBasis,
        lang: lang === "en" ? "English" : "Kiswahili",
        lat, lon,
        yield_target: cropCfg.unit === "Multiplier" ? yieldTarget : yieldTarget / cropCfg.def,
        is_subcounty: !!subcounty && subcounty !== "Whole County Average",
      };
      if (labMode) body.overrides = { pH: labPh, "Total Nitrogen (g/kg)": labN, "Extractable Phosphorus (mg/kg)": labP, "Extractable Potassium (mg/kg)": labK };
      if (ward) body.ward = ward;

      const res = await fetch(`${API}/api/v1/recommend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);

      // Fetch weather
      if (lat && lon) {
        fetch(`${API}/api/v1/weather/${lat}/${lon}`).then(r => r.json()).then(d => setWeather(d.advice || d.summary || JSON.stringify(d))).catch(() => {});
      } else {
        fetch(`${API}/api/v1/weather/county/${encodeURIComponent(county)}`).then(r => r.json()).then(d => setWeather(d.advice || d.summary || null)).catch(() => {});
      }
    } catch {
      setError(lang === "en" ? "Could not connect to ShambaIQ. Check your connection." : "Haikuwezekana kuunganisha. Jaribu tena.");
    } finally { setLoading(false); }
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const budget = result.budget || {};
    const tl = result.timeline || {};
    const breakdown = (budget.breakdown || []).map((l: string) => `🛒 ${l}`).join("\n");
    const text = `🌱 ShambaIQ (${county})\nCrop: ${result.crop}\nScore: ${result.health_score || result.soil_score || "—"}/100\n\n${breakdown}\nBudget: KES ${(budget.total_budget || result.total_cost || 0).toLocaleString()}\n\nM1: ${tl.month_1 || ""}\nM2: ${tl.month_2 || ""}\nM3: ${tl.month_3 || ""}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const downloadPDF = async () => {
    if (!result) return;
    try {
      const res = await fetch(`${API}/api/v1/report/pdf`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...result, acres, lang: lang === "en" ? "English" : "Kiswahili" }) });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = `ShambaIQ_${county}_${new Date().toISOString().slice(0,10)}.pdf`; a.click();
      }
    } catch { /* PDF generation not available offline */ }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !result) return;
    const newHistory = [...chatHistory, { role: "user", content: chatInput }];
    setChatHistory(newHistory); setChatInput(""); setChatLoading(true);
    try {
      const context = `Initial Recommendations: ${JSON.stringify(result)}\n\nConversation:\n${newHistory.map(m => `${m.role}: ${m.content}`).join("\n")}`;
      const res = await fetch(`${API}/api/v1/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ context, lang: lang === "en" ? "English" : "Kiswahili" }) });
      if (res.ok) {
        const d = await res.json();
        setChatHistory([...newHistory, { role: "assistant", content: d.reply || d.response || "No response" }]);
      }
    } catch { setChatHistory([...newHistory, { role: "assistant", content: lang === "en" ? "AI agronomist unavailable. Try again." : "Mtaalamu wa AI hapatikani. Jaribu tena." }]); }
    setChatLoading(false);
  };

  const t = lang === "en"
    ? { title: "Farm Profile", county: "Where is your farm?", subcounty: "Sub-County", ward: "Ward (High Precision)", crop: "What are you planting?", fert: "Current fertilizer", acres: "Farm size (Acres)", yieldGoal: "Yield Goal", button: "Get Precision Advice", lab: "I have a soil lab report", price: "Price Basis", gps: "GPS Precision (30m)", region: "Select Region", insight: "Precision Active", score: "SOIL HEALTH SCORE", report: "Your Insight Report", switch_title: "The Switch: Impact Analysis", feature: "Feature", habit: "Your Habit", rec: "ShambaIQ Recommendation", strategy: "Strategy", outcome: "Outcome", timeline: "3-Month Action Plan", seeds: "Certified Seed Varieties", budget: "Budget Estimate", total: "Total Cost", advice: "Actionable Advice", share: "Share on WhatsApp", pdf: "Download PDF Report", sms: "SMS Summary", dealers: "Suppliers Nearby", weather: "7-Day Weather", chart: "Nutrient Sufficiency", matches: "Best Crop Matches", chat: "Ask About Your Recommendations", chatPlaceholder: "Application rates, scheduling...", send: "Send" }
    : { title: "Maelezo ya Shamba", county: "Shamba lako lipo wapi?", subcounty: "Kaunti Ndogo", ward: "Wadi (Usahihi)", crop: "Unapanda zao gani?", fert: "Mbolea ya kawaida?", acres: "Ukubwa (Ekari)", yieldGoal: "Lengo la Mavuno", button: "Pata Ushauri", lab: "Nina ripoti ya maabara ya udongo", price: "Msingi wa Bei", gps: "GPS (30m)", region: "Chagua Eneo", insight: "Usahihi Umeamilishwa", score: "ALAMA YA UDONGO", report: "Ripoti ya Shamba", switch_title: "Mabadiliko: Uchambuzi", feature: "Kipengele", habit: "Tabia Yako", rec: "Ushauri wa ShambaIQ", strategy: "Mkakati", outcome: "Matokeo", timeline: "Mpango wa Miezi 3", seeds: "Mbegu Zilizoidhinishwa", budget: "Gharama", total: "Jumla", advice: "Ushauri", share: "Shiriki WhatsApp", pdf: "Pakua PDF", sms: "Muhtasari wa SMS", dealers: "Wauzaji Karibu", weather: "Hali ya Hewa - Siku 7", chart: "Kiwango cha Virutubisho", matches: "Mazao Bora", chat: "Uliza Kuhusu Ushauri", chatPlaceholder: "Viwango, ratiba...", send: "Tuma" };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-forest-700 to-[#1e4620] text-center py-8 px-4">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-cream-100">🌱 Shamba<span className="text-gold-400">IQ</span></h1>
        <p className="text-cream-300 text-sm mt-1">{lang === "en" ? "National Precision Agriculture Platform" : "Jukwaa la Kilimo Sahihi la Kitaifa"}</p>
        <div className="flex justify-center gap-1 mt-4">
          <button onClick={() => setLang("en")} className={`px-4 py-1.5 rounded-l-lg text-sm font-semibold transition-colors ${lang === "en" ? "bg-gold-500 text-white" : "bg-forest-600 text-cream-300"}`}>English</button>
          <button onClick={() => setLang("sw")} className={`px-4 py-1.5 rounded-r-lg text-sm font-semibold transition-colors ${lang === "sw" ? "bg-gold-500 text-white" : "bg-forest-600 text-cream-300"}`}>Kiswahili</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-5 flex items-center gap-2"><MapPin size={20} className="text-forest-600" />{t.title}</h2>

          {/* Location mode toggle */}
          <div className="flex gap-1 mb-4">
            <button onClick={() => setLocMode("region")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${locMode === "region" ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-400 border border-cream-300"}`}><MapPin size={14} />{t.region}</button>
            <button onClick={() => { setLocMode("gps"); captureGPS(); }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${locMode === "gps" ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-400 border border-cream-300"}`}><Navigation size={14} />{t.gps}</button>
          </div>

          {locMode === "gps" && lat && lon && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm"><span className="text-green-700 font-semibold">✅ GPS Locked: {lat.toFixed(4)}, {lon.toFixed(4)}</span></div>
          )}

          {/* County */}
          <label className="block mb-3">
            <span className="text-sm font-semibold text-forest-700 mb-1 block">{t.county}</span>
            <div className="relative">
              <select value={county} onChange={(e) => setCounty(e.target.value)} className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-forest-700 appearance-none focus:outline-none focus:ring-2 focus:ring-gold-400">
                <option value="">Select County...</option>
                {counties.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-3.5 text-soil-400 pointer-events-none" />
            </div>
          </label>

          {/* County insight */}
          {county && INSIGHTS[county] && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-xs text-blue-700">💡 {INSIGHTS[county]}</div>
          )}
          {county && !INSIGHTS[county] && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-xs text-green-700">💡 {t.insight}: {lang === "en" ? "Analysing regional soil chemistry." : "Inachambua kemia ya udongo wa eneo."}</div>
          )}

          {/* Crop + Fertilizer */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="block">
              <span className="text-sm font-semibold text-forest-700 mb-1 block flex items-center gap-1"><Wheat size={14} />{t.crop}</span>
              <div className="relative">
                <select value={crop} onChange={(e) => { setCrop(e.target.value); const c = CROP_UNITS[e.target.value]; setYieldTarget(c ? c.def : 1.0); }} className="w-full px-3 py-3 bg-cream-100 border border-cream-300 rounded-xl text-forest-700 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value="">Select...</option>
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3.5 text-soil-400 pointer-events-none" />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-forest-700 mb-1 block flex items-center gap-1"><FlaskConical size={14} />{t.fert}</span>
              <div className="relative">
                <select value={fert} onChange={(e) => setFert(e.target.value)} className="w-full px-3 py-3 bg-cream-100 border border-cream-300 rounded-xl text-forest-700 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gold-400">
                  {FERTILIZER_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3.5 text-soil-400 pointer-events-none" />
              </div>
            </label>
          </div>

          {/* Acres + Price */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="block">
              <span className="text-sm font-semibold text-forest-700 mb-1 block flex items-center gap-1"><Ruler size={14} />{t.acres}</span>
              <input type="number" min={0.25} max={500} step={0.25} value={acres} onChange={(e) => setAcres(Number(e.target.value))} className="w-full px-3 py-3 bg-cream-100 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </label>
            <div>
              <span className="text-sm font-semibold text-forest-700 mb-1 block">💰 {t.price}</span>
              <div className="flex gap-1">
                <button onClick={() => setPriceBasis("Subsidized")} className={`flex-1 py-3 rounded-lg text-xs font-semibold transition-colors ${priceBasis === "Subsidized" ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-400 border border-cream-300"}`}>{lang === "en" ? "Subsid." : "Ruzuku"}</button>
                <button onClick={() => setPriceBasis("Commercial")} className={`flex-1 py-3 rounded-lg text-xs font-semibold transition-colors ${priceBasis === "Commercial" ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-400 border border-cream-300"}`}>{lang === "en" ? "Market" : "Soko"}</button>
              </div>
            </div>
          </div>

          {/* Yield target slider */}
          {crop && (
            <label className="block mb-3">
              <span className="text-sm font-semibold text-forest-700 mb-1 block flex items-center gap-1"><Target size={14} />{t.yieldGoal} ({cropCfg.unit}): <span className="text-gold-600 ml-1">{yieldTarget}</span></span>
              <input type="range" min={cropCfg.min} max={cropCfg.max} step={cropCfg.max - cropCfg.min <= 50 ? 1 : 10} value={yieldTarget} onChange={(e) => setYieldTarget(Number(e.target.value))} className="w-full accent-gold-500" />
              <div className="flex justify-between text-xs text-soil-400"><span>{cropCfg.min}</span><span>{cropCfg.max}</span></div>
            </label>
          )}

          {/* Lab mode */}
          <button onClick={() => setLabMode(!labMode)} className="flex items-center gap-2 text-sm text-soil-400 hover:text-forest-700 mb-3 transition-colors"><Beaker size={16} />{t.lab} {labMode ? "▲" : "▼"}</button>
          {labMode && (
            <div className="grid grid-cols-2 gap-3 mb-3 p-4 bg-cream-100 rounded-xl">
              <label className="block"><span className="text-xs text-soil-400">pH</span><input type="number" step="0.1" value={labPh} onChange={(e) => setLabPh(Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-cream-300 rounded-lg text-sm" /></label>
              <label className="block"><span className="text-xs text-soil-400">N (g/kg)</span><input type="number" step="0.1" value={labN} onChange={(e) => setLabN(Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-cream-300 rounded-lg text-sm" /></label>
              <label className="block"><span className="text-xs text-soil-400">P (mg/kg)</span><input type="number" step="1" value={labP} onChange={(e) => setLabP(Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-cream-300 rounded-lg text-sm" /></label>
              <label className="block"><span className="text-xs text-soil-400">K (mg/kg)</span><input type="number" step="10" value={labK} onChange={(e) => setLabK(Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-cream-300 rounded-lg text-sm" /></label>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button onClick={handleSubmit} disabled={loading} className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20">
            {loading ? <><Loader2 size={20} className="animate-spin" />{lang === "en" ? "Analysing soil data..." : "Inachambua data ya udongo..."}</> : <>🌱 {t.button} <ArrowRight size={18} /></>}
          </button>
        </div>

        {/* ════════ RESULTS ════════ */}
        {result && !result.error && (
          <div className="mt-6 space-y-4">
            {/* Score */}
            <div className="rounded-2xl p-6 text-white text-center shadow-md" style={{ backgroundColor: (result.health_score ?? result.soil_score ?? 0) >= 70 ? "#16a34a" : (result.health_score ?? result.soil_score ?? 0) >= 50 ? "#f59e0b" : "#dc2626" }}>
              <div className="text-5xl font-extrabold font-display">{result.health_score ?? result.soil_score ?? "—"}</div>
              <div className="text-sm font-semibold uppercase tracking-wider mt-1 opacity-90">{t.score}</div>
            </div>

            {/* Data source badge */}
            {result.data_source && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: result.data_source.includes("API") || result.data_source.includes("iSDA") || result.data_source.includes("Lab") ? "#dcfce7" : "#f1f5f9", color: result.data_source.includes("API") || result.data_source.includes("iSDA") ? "#16a34a" : "#64748b" }}>🧬 {result.data_source}</div>
            )}

            {/* Nutrient chart */}
            {result.county_data && result.reqs && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2"><TrendingUp size={18} />{t.chart}</h3>
                {["Nitrogen", "Phosphorus", "Potassium"].map((nutrient) => {
                  const keys: Record<string, { dataKey: string; reqKey: string }> = { Nitrogen: { dataKey: "Total Nitrogen (g/kg)", reqKey: "n_min" }, Phosphorus: { dataKey: "Extractable Phosphorus (mg/kg)", reqKey: "p_min" }, Potassium: { dataKey: "Extractable Potassium (mg/kg)", reqKey: "k_min" } };
                  const cfg = keys[nutrient]; const val = result.county_data[cfg.dataKey] || 0; const req = result.reqs[cfg.reqKey] || 1; const ratio = Math.min(2, val / req);
                  return (
                    <div key={nutrient} className="mb-3">
                      <div className="flex justify-between text-xs text-soil-400 mb-1"><span>{nutrient}</span><span>{(ratio * 100).toFixed(0)}%</span></div>
                      <div className="h-3 bg-cream-200 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, ratio * 100)}%`, backgroundColor: ratio >= 1 ? "#16a34a" : ratio >= 0.7 ? "#f59e0b" : "#dc2626" }} /></div>
                    </div>
                  );
                })}
                <p className="text-xs text-soil-400 mt-2">100% = optimal {result.crop} requirement</p>
              </div>
            )}

            {/* The Switch comparison table */}
            {result.comparison && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2"><Zap size={18} />{t.switch_title}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-cream-300"><th className="text-left py-2 text-soil-400">{t.feature}</th><th className="text-left py-2 text-red-500">{t.habit}</th><th className="text-left py-2 text-green-600">{t.rec}</th></tr></thead>
                    <tbody>
                      <tr className="border-b border-cream-200"><td className="py-2">{t.strategy}</td><td className="py-2 text-red-500 text-xs">{result.comparison.current_flaw || "—"}</td><td className="py-2 text-green-600 font-bold text-xs">{result.comparison.recommended || "—"}</td></tr>
                      <tr><td className="py-2">{t.outcome}</td><td className="py-2 text-xs">{result.comparison.current_outcome || "Variable"}</td><td className="py-2 text-green-600 font-bold text-xs">{result.comparison.impact || "—"}</td></tr>
                    </tbody>
                  </table>
                </div>
                {result.comparison.reason_en && <p className="text-xs text-soil-500 mt-3 bg-cream-100 p-3 rounded-lg">{lang === "en" ? result.comparison.reason_en : result.comparison.reason_sw || result.comparison.reason_en}</p>}
              </div>
            )}

            {/* 3-Month Timeline */}
            {result.timeline && typeof result.timeline === "object" && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3">📅 {t.timeline}</h3>
                {result.timeline.season && <p className="text-xs text-soil-400 mb-3">{result.timeline.season} — {result.crop}</p>}
                {[{ label: "Month 1", key: "month_1", color: "#3b82f6" }, { label: "Month 2", key: "month_2", color: "#10b981" }, { label: "Month 3", key: "month_3", color: "#f59e0b" }].map(m => result.timeline[m.key] ? (
                  <div key={m.key} className="mb-2 p-3 rounded-lg bg-cream-50 border-t-4" style={{ borderTopColor: m.color }}>
                    <div className="text-xs text-soil-400 uppercase tracking-wider font-bold mb-1">{m.label}</div>
                    <div className="text-sm text-forest-700 font-semibold">{result.timeline[m.key]}</div>
                  </div>
                ) : null)}
              </div>
            )}

            {/* Seeds */}
            {result.seeds && result.seeds.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2"><Leaf size={18} />{t.seeds}</h3>
                {result.seeds.map((sd: Rec, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-cream-50 border border-cream-200 mb-2">
                    <div className="font-semibold text-forest-700">{sd.Variety || sd.variety} <span className="text-xs text-soil-400">({sd.Breeder || sd.breeder})</span></div>
                    <div className="text-xs text-soil-400 mt-1">{sd.Altitude_Zone || sd.altitude_zone} · {sd.Maturity_Days || sd.maturity_days} days · {sd.Yield_Bags_Per_Acre || sd.yield_bags} bags/acre</div>
                    {(sd.Special_Attributes || sd.special) && <div className="text-xs text-soil-500 italic mt-1">{sd.Special_Attributes || sd.special}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Budget */}
            {result.budget && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3">🛒 {t.budget}</h3>
                <p className="text-xs text-soil-400 mb-3">{lang === "en" ? `For ${acres} acres` : `Kwa ekari ${acres}`}</p>
                <div className="text-2xl font-extrabold text-forest-700 mb-3">{t.total}: KES {(result.budget.total_budget || 0).toLocaleString()}</div>
                {result.budget.breakdown && result.budget.breakdown.map((line: string, i: number) => <div key={i} className="text-sm text-soil-500 py-1 border-b border-cream-200 last:border-0">🛒 {line}</div>)}
              </div>
            )}

            {/* Recommendation card (fallback) */}
            {result.recommended_fertilizer && !result.budget && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3">{t.report}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-cream-200"><span className="text-soil-400">{lang === "en" ? "Fertilizer" : "Mbolea"}</span><span className="font-bold text-forest-700">{result.recommended_fertilizer}</span></div>
                  <div className="flex justify-between py-2 border-b border-cream-200"><span className="text-soil-400">{lang === "en" ? "Bags/Acre" : "Mifuko/Ekari"}</span><span className="font-bold text-forest-700">{result.bags_per_acre}</span></div>
                  <div className="flex justify-between py-2 border-b border-cream-200"><span className="text-soil-400">{lang === "en" ? "Total Bags" : "Jumla Mifuko"}</span><span className="font-bold text-forest-700">{result.total_bags}</span></div>
                  <div className="flex justify-between py-2"><span className="text-soil-400">{t.total}</span><span className="font-bold text-lg text-forest-700">KES {(result.total_cost || 0).toLocaleString()}</span></div>
                </div>
              </div>
            )}

            {/* Advice */}
            {result.advice && result.advice.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-l-forest-700 border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3">💡 {t.advice}</h3>
                {result.advice.map((a: string, i: number) => <div key={i} className={`text-sm py-2 px-3 rounded-lg mb-1 ${a.includes("❌") || a.includes("🚨") ? "bg-red-50 text-red-700" : a.includes("⚠️") ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>{a}</div>)}
              </div>
            )}

            {/* Weather */}
            {weather && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2"><CloudSun size={18} />{t.weather}</h3>
                <p className="text-sm text-soil-500">{weather}</p>
              </div>
            )}

            {/* Crop matches */}
            {result.crop_matches && result.crop_matches.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2"><Leaf size={18} />{t.matches}</h3>
                {result.crop_matches.map((m: Rec, i: number) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-sm"><span className="font-semibold text-forest-700">{m.crop}</span><span className="text-xs text-soil-400">{m.match_score}% · KES {(m.gross_income || 0).toLocaleString()}</span></div>
                    <div className="h-2 bg-cream-200 rounded-full mt-1"><div className="h-full rounded-full" style={{ width: `${m.match_score}%`, backgroundColor: m.match_score >= 85 ? "#16a34a" : m.match_score >= 70 ? "#eab308" : "#f97316" }} /></div>
                  </div>
                ))}
              </div>
            )}

            {/* Share buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={shareWhatsApp} className="flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-colors"><MessageCircle size={18} />{t.share}</button>
              <button onClick={downloadPDF} className="flex items-center justify-center gap-2 py-3 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-xl transition-colors"><FileText size={18} />{t.pdf}</button>
            </div>

            {/* Dealers link */}
            <Link href={`/dealers/${county.toLowerCase().replace(/\s+/g, "-").replace(/['']/g, "")}`} className="block text-center py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-colors">
              <Store size={16} className="inline mr-2" />{t.dealers}
            </Link>

            {/* AI Chat */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-300">
              <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2">💬 {t.chat}</h3>
              <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                {chatHistory.map((m, i) => (
                  <div key={i} className={`text-sm p-3 rounded-lg ${m.role === "user" ? "bg-cream-100 text-forest-700 ml-8" : "bg-forest-50 text-forest-700 mr-8"}`}>{m.content}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder={t.chatPlaceholder} className="flex-1 px-3 py-2 bg-cream-100 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                <button onClick={sendChat} disabled={chatLoading} className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-lg transition-colors"><Send size={16} /></button>
              </div>
            </div>

            <p className="text-center text-xs text-soil-300 mt-4">📡 ISRIC / iSDAsoil Precision | 🏛️ Kenyan Agronomic Baselines | 🚀 ShambaIQ</p>
          </div>
        )}

        {result?.error && <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 text-sm">{result.error}</div>}
      </div>
    </div>
  );
}
