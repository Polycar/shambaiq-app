"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lang, t, FERTILIZER_OPTIONS, CROP_UNITS } from "@/lib/i18n";
import { getRecommendation, RecommendResult, getWeatherByCounty, getWeather, WeatherData, getDealersNearby, getDealersByCounty, Dealer, DealerProduct, matchCrops, CropMatch } from "@/lib/api";

const STOCK_LABEL: Record<string, string> = {
  in_stock: "In Stock",
  low_stock: "Running Low",
  out_of_stock: "Out of Stock",
};
const STOCK_COLOR: Record<string, string> = {
  in_stock: "text-green-700 font-semibold",
  low_stock: "text-amber-600 font-semibold",
  out_of_stock: "text-red-600 font-semibold",
};

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
  dealers: Dealer[];
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

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

function getCookieSession(): { token?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

function saveSoilReport(res: RecommendResult) {
  const token = getCookieSession()?.token;
  if (!token) return;
  fetch(`${BACKEND}/api/v1/auth/soil-log`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      county: res.county,
      crop: res.crop,
      health_score: res.health_score,
      estimated_cost_kes: res.budget?.total_budget ?? 0,
      primary_fertilizer: res.comparison?.recommended ?? "",
      is_acidic: res.is_acidic ?? (res.county_data ? res.county_data.pH < 5.5 : false),
      is_n_low: res.is_n_low ?? false,
      is_p_low: res.is_p_low ?? false,
      is_k_low: res.is_k_low ?? false,
    }),
  }).catch(() => {/* non-blocking */});
}

/** Strip markdown **bold** markers and leading emojis from backend text */
function clean(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/\*\*/g, "")
    .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u25A0-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
    .trim();
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Agrovet card ──────────────────────────────────────────────
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

function AgrovetCard({ dealer, isFirst, lang }: { dealer: Dealer; isFirst: boolean; lang: string }) {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState<DealerProduct[] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchProducts = async () => {
    if (!dealer.dealer_id || products !== null) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/dealers/store/${dealer.dealer_id}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {}
    setLoadingProducts(false);
  };

  const toggle = () => {
    if (!expanded && dealer.dealer_id) fetchProducts();
    setExpanded(v => !v);
  };

  const isVerified = dealer.source === "ShambaIQ Verified";

  return (
    <div
      className="rounded-xl border transition-colors hover:border-green-300"
      style={{ background: isFirst ? "#f0fdf4" : "#f8fafc" }}
    >
      <div className="p-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm text-gray-800">{dealer.name}</p>
            {isVerified && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                ShambaIQ Verified
              </span>
            )}
          </div>
          {dealer.physical_address ? (
            <p className="text-xs text-gray-500 mt-0.5">{dealer.physical_address}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">{dealer.town || dealer.county}</p>
          )}
          {dealer.phone && (
            <a href={`tel:${dealer.phone}`} className="text-xs text-blue-600 font-semibold mt-1 inline-block hover:underline">
              {dealer.phone}
            </a>
          )}
          {dealer.dealer_id && (
            <button
              onClick={toggle}
              className="mt-1.5 text-xs text-forest-700 font-semibold hover:underline block"
            >
              {expanded
                ? (lang === "en" ? "Hide stock" : "Ficha hisa")
                : (lang === "en" ? "See what’s in stock" : "Ona hisa zilizopo")}
            </button>
          )}
        </div>
        <div className="text-right shrink-0">
          {dealer.distance !== undefined && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
              {dealer.distance} km
            </span>
          )}
          {dealer.rating && (
            <p className="text-xs text-amber-600 font-semibold mt-1">{dealer.rating} / 5</p>
          )}
        </div>
      </div>

      {expanded && dealer.dealer_id && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2">
          {loadingProducts ? (
            <p className="text-xs text-gray-400 py-2">{lang === "en" ? "Loading inventory..." : "Inapakia..."}</p>
          ) : products && products.length > 0 ? (
            <div className="space-y-1.5">
              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-gray-800">{p.product_name}</span>
                    {p.unit && <span className="text-gray-400 ml-1">({p.unit})</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {p.price !== undefined && p.price !== null && (
                      <span className="text-gray-600">KSh {p.price.toLocaleString()}</span>
                    )}
                    <span className={STOCK_COLOR[p.stock_status]}>{STOCK_LABEL[p.stock_status]}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-1">{lang === "en" ? "No inventory listed yet." : "Hakuna hisa zilizoorodheshwa."}</p>
          )}
        </div>
      )}
    </div>
  );
}

const CROP_EMOJIS: Record<string, string> = {
  "Maize": "🌽",
  "Wheat": "🌾",
  "Sorghum": "🌾",
  "Millet": "🌾",
  "Finger Millet": "🌾",
  "Rice": "🍚",
  "Rice (Lowland/Paddy)": "🌾",
  "Beans": "🫘",
  "Cowpeas": "🫘",
  "Green Grams": "🫘",
  "Pigeon Peas": "🫘",
  "Soybeans": "🫘",
  "Tomato": "🍅",
  "Cabbage": "🥬",
  "Kale (Sukuma Wiki)": "🥬",
  "Onion": "🧅",
  "Spinach": "🥬",
  "Carrot": "🥕",
  "Capsicum": "🫑",
  "Chilies": "🌶️",
  "Dhania": "🌿",
  "Garlic": "🧄",
  "Snow Peas": "🫛",
  "Potato": "🥔",
  "Sweet Potato": "🍠",
  "Cassava": "🍠",
  "Arrow Root": "🥔",
  "Avocado": "🥑",
  "Mango": "🥭",
  "Banana": "🍌",
  "Watermelon": "🍉",
  "Passion Fruit": "🍇",
  "Pixie Oranges": "🍊",
  "Pawpaw": "🥭",
  "Wambugu Apples": "🍎",
  "Napier Grass": "🌱",
  "Lucerne": "🌱",
  "Sunflower": "🌻",
  "Sugarcane": "🎋",
  "Cashew Nuts": "🥜",
  "Coconuts": "🥥"
};

// ─── Component ─────────────────────────────────────────────────
export default function RecommendTool({ counties, wards, crops, countyCoords, dealers }: Props) {
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
  const [cropSearch, setCropSearch] = useState("");
  const [valErrors, setValErrors] = useState<{ county?: boolean; crop?: boolean }>({});
  const [companionCrop, setCompanionCrop] = useState("");
  const [showCompanion, setShowCompanion] = useState(false);
  const [selectedFertilizers, setSelectedFertilizers] = useState<string[]>(["None"]);
  const fertilizer = useMemo(() => selectedFertilizers.join(" + "), [selectedFertilizers]);
  const [acres, setAcres] = useState(1);
  const [priceMode, setPriceMode] = useState<"Subsidized" | "Commercial">("Subsidized");
  const [labMode, setLabMode] = useState(false);
  const [labPH, setLabPH] = useState(6.5);
  const [labN, setLabN] = useState(1.0);
  const [labP, setLabP] = useState(20.0);
  const [labK, setLabK] = useState(150.0);

  // Filter crops based on search
  const filteredCrops = useMemo(() => {
    if (!cropSearch) return crops;
    return crops.filter(c => c.crop.toLowerCase().includes(cropSearch.toLowerCase()));
  }, [crops, cropSearch]);

  // Result state
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [livePrices, setLivePrices] = useState<any>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // Agrovet state
  const [agrovets, setAgrovets] = useState<Dealer[]>([]);
  const [agrLoading, setAgrLoading] = useState(false);
  const [agrShown, setAgrShown] = useState(false);

  // Crop Matches state
  const [cropMatches, setCropMatches] = useState<CropMatch[] | null>(null);

  // Item 3: Read URL params to pre-fill form
  const searchParams = useSearchParams();
  useEffect(() => {
    const urlCounty = searchParams.get("county");
    const urlCrop = searchParams.get("crop");
    if (urlCounty && !county) {
      const match = counties.find(c => c.county.toLowerCase() === urlCounty.toLowerCase());
      if (match) setCounty(match.county);
    }
    if (urlCrop && !crop) {
      const match = crops.find(c => c.crop.toLowerCase() === urlCrop.toLowerCase() || c.slug === urlCrop.toLowerCase());
      if (match) {
        setCrop(match.crop);
        const u = CROP_UNITS[match.crop];
        if (u) setYieldVal(u.def);
      }
    }
    try {
      const raw = localStorage.getItem("shambaiq_prefs");
      if (!raw) return;
      const prefs = JSON.parse(raw);
      if (prefs.county && !county && !urlCounty) setCounty(prefs.county);
      if (prefs.crop && prefs.crop !== "Maize" && !crop && !urlCrop) {
        setCrop(prefs.crop);
        const u = CROP_UNITS[prefs.crop];
        if (u) setYieldVal(u.def);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Load live prices from Admin
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com"}/api/v1/admin/inventory`)
      .then(r => r.json())
      .then(data => setLivePrices(data))
      .catch(() => console.warn("Using baseline prices"));
  }, []);

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
    let errors: { county?: boolean; crop?: boolean } = {};
    if (locMode === "region" && !county) {
      errors.county = true;
    }
    if (!crop) {
      errors.crop = true;
    }
    if (Object.keys(errors).length > 0) {
      setValErrors(errors);
      setError(lang === "en" ? "Please fill in all highlighted fields" : "Tafadhali jaza maeneo yote yaliyosisitizwa");
      return;
    }
    setValErrors({});
    setLoading(true);
    const startTime = Date.now();
    setError("");
    setResult(null);
    setWeather(null);
    setGeminiAdvice(null);
    setCropMatches(null);

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
        companion_crop: companionCrop || undefined,
      });
      setResult(res);
      saveSoilReport(res);

      if (res.county_data) {
        if (res.matches && res.matches.length > 0) {
          // Use matches already computed by the backend using the same precision soil data
          setCropMatches(res.matches);
        } else {
          // Fallback: separate call (uses county average — less precise)
          matchCrops(resolvedCounty, acres, lang === "en" ? "English" : "Kiswahili", lat, lon)
            .then((data) => setCropMatches(data.matches))
            .catch((e) => console.error("Failed to match crops:", e));
        }
      }

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
      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) {
        await new Promise(resolve => setTimeout(resolve, 1200 - elapsed));
      }
      setLoading(false);
      // Item 5: Smooth scroll to results after loading
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [county, crop, companionCrop, fertilizer, acres, lang, labMode, labPH, labN, labP, labK, priceMode, resolvedCoords, cropUnit, yieldVal, locMode, gpsLat, counties]);

  // WhatsApp share
  const whatsappUrl = useMemo(() => {
    if (!result) return "";
    const tl = result.timeline;
    const lines = [
      `ShambaIQ Precision Report: ${result.county}`,
      `Primary Crop: ${result.crop}`,
      `Soil Health Score: ${result.health_score}`,
      "",
      ...result.budget.breakdown.map((l) => `${clean(l)}`),
      `Total Budget Estimate: KES ${result.budget.total_budget.toLocaleString()}`,
    ];
    if (tl) {
      lines.push("", `Month 1: ${clean(tl.month_1)}`, `Month 2: ${clean(tl.month_2)}`, `Month 3: ${clean(tl.month_3)}`);
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [result]);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-forest-800 via-forest-700 to-[#1e4620] overflow-hidden grain">
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="tgrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#C8860A" strokeWidth="0.4" />
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#tgrid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-10 text-center">
          {/* Item 5: Language toggle — prominent with highlighted active state */}
          <div className="absolute top-4 right-4 flex rounded-full overflow-hidden border border-cream-200/30 bg-cream-200/5">
            <button
              onClick={() => setLang("en")}
              className={`px-3.5 py-1.5 text-xs font-bold transition-all ${
                lang === "en"
                  ? "bg-gold-500 text-white"
                  : "text-cream-300 hover:bg-cream-200/10"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("sw")}
              className={`px-3.5 py-1.5 text-xs font-bold transition-all ${
                lang === "sw"
                  ? "bg-gold-500 text-white"
                  : "text-cream-300 hover:bg-cream-200/10"
              }`}
            >
              SW
            </button>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/15 border border-gold-500/25 rounded-full text-gold-300 text-xs font-medium mb-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            {t("powered_by", lang)}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-cream-100 leading-tight mb-2">
            {t("nav_advice", lang)}
          </h1>
          <p className="text-cream-300/80 text-sm max-w-sm mx-auto">
            {lang === "en" ? "Get a free, hyper-local soil analysis and fertilizer plan in seconds." : "Pata uchambuzi wa udongo na mpango wa mbolea bila malipo."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-start">

        {/* ── LEFT COLUMN: Form ─────────────────────────── */}
        <div className="lg:sticky lg:top-20 space-y-5">
        <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-forest-700">
            {t("form_title", lang)}
          </h2>

          {/* Location Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-cream-300">
            <button
              onClick={() => setLocMode("region")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                locMode === "region"
                  ? "bg-forest-700 text-cream-100"
                  : "bg-cream-50 text-forest-500 hover:bg-cream-100"
              }`}
            >
              {lang === "en" ? "Select Region" : "Chagua Eneo"}
            </button>
            <button
              onClick={() => { setLocMode("gps"); if (!gpsLat) captureGPS(); }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                locMode === "gps"
                  ? "bg-forest-600 text-cream-100"
                  : "bg-cream-50 text-forest-500 hover:bg-cream-100"
              }`}
            >
              {lang === "en" ? "Check My Farm" : "Kagua Shamba Langu"}
            </button>
          </div>

          {/* GPS Status */}
          {locMode === "gps" && (
            <div>
              {gpsLoading && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 flex items-center gap-2">
                  {/* Item 8: Proper SVG spinner instead of pipe character */}
                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {lang === "en" ? "Acquiring GPS signal..." : "Inapata ishara ya GPS..."}
                </div>
              )}
              {gpsLat !== null && gpsLon !== null && !gpsLoading && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700 font-semibold flex items-center justify-between">
                  <span>GPS Locked: {gpsLat.toFixed(4)}, {gpsLon.toFixed(4)}</span>
                  <button
                    onClick={captureGPS}
                    className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {lang === "en" ? "Refresh" : "Sasisha"}
                  </button>
                </div>
              )}
              {gpsError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {gpsError}
                </div>
              )}
            </div>
          )}

          {/* Manual Location Selection — only shown in region mode */}
          {locMode === "region" && (
            <div className="space-y-4">
              {/* County */}
              <div>
                <label htmlFor="county-select" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("form_county", lang)}
                </label>
                <select
                  id="county-select"
                  value={county}
                  onChange={(e) => {
                    setCounty(e.target.value);
                    setSubcounty("");
                    setWard("");
                    setResult(null);
                    setValErrors(prev => ({ ...prev, county: false }));
                  }}
                  className={`w-full rounded-xl border bg-cream-50 px-3 py-2.5 text-sm text-forest-800 focus:border-forest-600 focus:ring-1 focus:ring-forest-600 shadow-sm outline-none transition-all ${
                    valErrors.county ? "border-red-500 ring-1 ring-red-500" : "border-cream-300"
                  }`}
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
                  <label htmlFor="subcounty-select" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("form_subcounty", lang)}
                  </label>
                  <select
                    id="subcounty-select"
                    value={subcounty}
                    onChange={(e) => {
                      setSubcounty(e.target.value);
                      setWard("");
                    }}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-forest-800 focus:border-forest-600 focus:ring-1 focus:ring-forest-600 shadow-sm outline-none transition-colors"
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
                  <label htmlFor="ward-select" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("form_ward", lang)}
                  </label>
                  <select
                    id="ward-select"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-forest-800 focus:border-forest-600 focus:ring-1 focus:ring-forest-600 shadow-sm outline-none transition-colors"
                  >
                    <option value="">{t("form_whole_subcounty", lang)}</option>
                    {wardList.map((w) => (
                      <option key={w.ward} value={w.ward}>{w.ward}</option>
                    ))}
                  </select>
                  {ward && selectedWard && (
                    <p className="mt-1 text-xs text-green-700 font-semibold">
                      Ward Locked: {ward} ({selectedWard.latitude.toFixed(4)}, {selectedWard.longitude.toFixed(4)})
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Coordinate Resolution Badge */}
          {resolvedCoords && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 flex items-center gap-2">
              <span className="font-semibold">
                {lang === "en" ? "iSDA Precision Active" : "Usahihi wa iSDA Umeamilishwa"}
              </span>
              <span className="text-green-500">—</span>
              <span>{resolvedCoords.source} ({resolvedCoords.lat.toFixed(4)}, {resolvedCoords.lon.toFixed(4)})</span>
            </div>
          )}

          {/* Crop Selection (Premium Vertical Scroll Ribbon) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-forest-600">
                {t("form_crop", lang)} {crop && <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-bold ml-1">{crop}</span>}
              </label>
            </div>
            <input
              type="text"
              placeholder={lang === "en" ? "Search crops..." : "Tafuta mazao..."}
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              className="w-full mb-1.5 rounded-lg border border-cream-300 bg-cream-50 px-2.5 py-1.5 text-xs text-forest-800 focus:border-forest-600 outline-none transition-colors"
            />
            <div className={`flex flex-col gap-1.5 overflow-y-auto max-h-48 p-2 border rounded-xl bg-cream-50/50 transition-colors ${
              valErrors.crop ? "border-red-500 ring-1 ring-red-500" : "border-cream-300"
            }`}>
              {filteredCrops.length > 0 ? (
                filteredCrops.map((c) => {
                  const isSelected = crop === c.crop;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => {
                        setCrop(c.crop);
                        const u = CROP_UNITS[c.crop];
                        setYieldVal(u ? u.def : null);
                        setValErrors(prev => ({ ...prev, crop: false }));
                        if (companionCrop === c.crop) setCompanionCrop("");
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex justify-between items-center ${
                        isSelected
                          ? "bg-forest-700 border-forest-700 text-cream-100 shadow-sm"
                          : "bg-white border-cream-200 text-forest-800 hover:bg-cream-100 hover:border-cream-300"
                      }`}
                    >
                      <span>{c.crop}</span>
                      {isSelected && <span className="text-xs font-bold">✓</span>}
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-soil-400 p-4 text-center">
                  {lang === "en" ? "No crops found" : "Hakuna mazao yaliyopatikana"}
                </div>
              )}
            </div>
          </div>

          {/* Item 2: Companion Crop collapsed by default */}
          <div>
            <button
              type="button"
              onClick={() => setShowCompanion(!showCompanion)}
              className="flex items-center justify-between w-full text-sm font-medium text-forest-600 py-2 cursor-pointer hover:text-forest-800 transition-colors"
            >
              <span>
                {lang === "en" ? "Add Companion Crop" : "Ongeza Zao la Pili"}
                {companionCrop && <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full font-bold ml-2">{companionCrop}</span>}
              </span>
              <svg className={`w-4 h-4 transition-transform ${showCompanion ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg>
            </button>
            {showCompanion && (
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-48 p-2 border border-cream-300 rounded-xl bg-cream-50/50 slide-down">
                {!crop ? (
                  <div className="text-xs text-soil-400 p-4 text-center">
                    {lang === "en" ? "Please select a primary crop first" : "Tafadhali chagua zao kuu kwanza"}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setCompanionCrop("")}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex justify-between items-center ${
                        companionCrop === ""
                          ? "bg-forest-700 border-forest-700 text-cream-100 shadow-sm"
                          : "bg-white border-cream-200 text-forest-800 hover:bg-cream-100 hover:border-cream-300"
                      }`}
                    >
                      <span>{lang === "en" ? "None / Pure Stand" : "Hakuna"}</span>
                      {companionCrop === "" && <span className="text-xs font-bold">✓</span>}
                    </button>
                    {crops.filter(c => c.crop !== crop).map((c) => {
                      const isSelected = companionCrop === c.crop;
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => setCompanionCrop(c.crop)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? "bg-forest-700 border-forest-700 text-cream-100 shadow-sm"
                              : "bg-white border-cream-200 text-forest-800 hover:bg-cream-100 hover:border-cream-300"
                          }`}
                        >
                          <span>{c.crop}</span>
                          {isSelected && <span className="text-xs font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Fertilizer Selection (Premium Multi-Select Chips) */}
          <div>
            <label className="block text-sm font-medium text-forest-600 mb-2">
              {t("form_fert", lang)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FERTILIZER_OPTIONS.map((f) => {
                const isSelected = selectedFertilizers.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      if (f === "None") {
                        setSelectedFertilizers(["None"]);
                      } else {
                        let next = selectedFertilizers.filter((x) => x !== "None");
                        if (isSelected) {
                          next = next.filter((x) => x !== f);
                          if (next.length === 0) {
                            next = ["None"];
                          }
                        } else {
                          next.push(f);
                        }
                        setSelectedFertilizers(next);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-forest-700 border-forest-700 text-cream-100 shadow-sm scale-[1.02]"
                        : "bg-cream-50 border-cream-300 text-forest-800 hover:bg-cream-100 hover:border-cream-400"
                    }`}
                  >
                    {/* Item 11: Whole chip is tap target — checkbox is visual only */}
                    <span className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-md border-2 transition-colors ${
                      isSelected ? "bg-cream-100 border-cream-200" : "border-cream-400 bg-white"
                    }`}>
                      {isSelected && <svg className="w-3 h-3 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                    </span>
                    <span className="truncate">{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acres + Price Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="acres-input" className="block text-sm font-medium text-forest-600 mb-1">
                {t("form_acres", lang)}
              </label>
              <input
                id="acres-input"
                type="number"
                value={acres}
                onChange={(e) => setAcres(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                min={0.25}
                max={500}
                step={0.25}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-forest-800 focus:border-forest-600 focus:ring-1 focus:ring-forest-600 shadow-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="price-mode-select" className="block text-sm font-medium text-forest-600 mb-1">
                {lang === "en" ? "Price Basis" : "Msingi wa Bei"}
              </label>
              <select
                id="price-mode-select"
                value={priceMode}
                onChange={(e) => setPriceMode(e.target.value as "Subsidized" | "Commercial")}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-forest-800 focus:border-forest-600 focus:ring-1 focus:ring-forest-600 shadow-sm outline-none transition-colors"
              >
                <option value="Subsidized">{t("form_price_subsidized", lang)}</option>
                <option value="Commercial">{t("form_price_commercial", lang)}</option>
              </select>
            </div>
          </div>



          {/* Item 2: Lab Override — collapsed behind Advanced Settings disclosure */}
          <details className="border-t pt-3 group">
            <summary className="flex items-center justify-between text-sm font-medium text-gray-700 cursor-pointer list-none">
              <span>{lang === "en" ? "Advanced: Lab Soil Override" : "Kiwango cha Juu: Makadirio ya Maabara"}</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={labMode}
                  onChange={(e) => setLabMode(e.target.checked)}
                  className="rounded accent-green-600"
                />
                {t("form_lab_mode", lang)}
              </label>
              {labMode && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="lab-ph" className="text-xs text-gray-500">{t("form_lab_ph", lang)}</label>
                    <input id="lab-ph" type="number" step={0.1} value={labPH} onChange={(e) => setLabPH(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="lab-n" className="text-xs text-gray-500">{t("form_lab_n", lang)}</label>
                    <input id="lab-n" type="number" step={0.1} value={labN} onChange={(e) => setLabN(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="lab-p" className="text-xs text-gray-500">{t("form_lab_p", lang)}</label>
                    <input id="lab-p" type="number" step={1} value={labP} onChange={(e) => setLabP(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="lab-k" className="text-xs text-gray-500">{t("form_lab_k", lang)}</label>
                    <input id="lab-k" type="number" step={10} value={labK} onChange={(e) => setLabK(parseFloat(e.target.value))} className="w-full rounded-lg border px-2 py-1.5 text-sm" />
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || (locMode === "region" && !county) || !crop}
            className={`w-full py-3.5 rounded-xl font-bold text-white text-base transition-all flex items-center justify-center gap-2 shadow-md ${
              loading
                ? "bg-soil-400 cursor-not-allowed"
                : "bg-forest-600 hover:bg-forest-500 hover:scale-[1.01] shadow-forest-700/20"
            } disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {t("form_analyzing", lang)}
              </>
            ) : t("form_button", lang)}
          </button>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 flex items-start gap-2">
              <span className="shrink-0 mt-0.5">Warning: </span><span>{error}</span>
            </div>
          )}
        </div>
        </div>
        {/* end LEFT column */}

        {/* ── RIGHT COLUMN: Results ─────────────────────── */}
        <div className="space-y-5">

        {/* ── LOADING SKELETON ──────────────────────────────── */}
        {loading && (
          <div className="space-y-4 pb-6 fade-up">
            <div className="bg-white rounded-2xl border border-cream-300 p-6 text-center">
              <div className="skeleton h-20 w-20 rounded-full mx-auto mb-3" />
              <div className="skeleton h-4 w-32 mx-auto mb-2" />
              <div className="skeleton h-3 w-48 mx-auto" />
            </div>
            <div className="bg-white rounded-2xl border border-cream-300 p-5 space-y-3">
              <div className="skeleton h-4 w-40 mb-4" />
              {[1,2,3].map(i => (
                <div key={i} className="space-y-1.5">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-2 w-full" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-cream-300 p-5 space-y-3">
              <div className="skeleton h-4 w-36 mb-4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
              <div className="skeleton h-3 w-3/5" />
            </div>
          </div>
        )}

        {/* ── GEMINI FALLBACK ADVICE ─────────────────────── */}
        {geminiAdvice && (
          <div className="space-y-4 pb-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
              <span><strong>AI-Powered Advice</strong> — Precision server unavailable. Showing Gemini AI analysis using local soil data.</span>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <h3 className="font-bold text-base mb-2" style={{ color: "#1a3a1a" }}>Summary</h3>
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
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>Key Advice</h3>
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
                <h3 className="font-bold text-sm mb-1 text-red-700">Warning</h3>
                <p className="text-sm text-red-700">{geminiAdvice.warning}</p>
              </div>
            )}
          </div>
        )}

        {/* ── RESULTS ───────────────────────────────────────── */}
        {result && !result.error && (
          <div ref={resultRef} id="shambaiq-results" className="space-y-4 pb-28 fade-up">

            {/* Item 7: Back to form button on mobile */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="lg:hidden w-full py-2 rounded-xl border border-cream-300 bg-white text-sm font-semibold text-forest-600 hover:bg-cream-50 transition-colors flex items-center justify-center gap-1.5"
              data-noprint
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 15l7-7 7 7"/></svg>
              {lang === "en" ? "Change inputs" : "Badilisha maingizo"}
            </button>

            {/* Item 9: Score with plain-language explanation */}
            <div className="rounded-2xl border border-cream-300 bg-white p-6 text-center shadow-sm">
              <div
                className="w-24 h-24 rounded-full flex flex-col items-center justify-center mx-auto mb-3 shadow-lg"
                style={{ background: scoreColor(result.health_score) }}
              >
                <span className="text-4xl font-extrabold text-white leading-none">{result.health_score}</span>
                <span className="text-[10px] text-white/80 uppercase tracking-wider font-bold">/100</span>
              </div>
              <p className="font-display text-xl font-bold text-forest-700">
                {result.health_score >= 70
                  ? (lang === "en" ? "Good Soil Health" : "Afya Nzuri ya Udongo")
                  : result.health_score >= 40
                  ? (lang === "en" ? "Moderate — Needs Attention" : "Ya Wastani — Inahitaji Uangalifu")
                  : (lang === "en" ? "Poor — Action Required" : "Mbaya — Hatua Inahitajika")}
              </p>
              {/* Item 9: Plain-language score explanation */}
              <p className="text-xs text-soil-400 mt-2 max-w-xs mx-auto leading-relaxed">
                {result.health_score >= 80
                  ? (lang === "en" ? "Your soil is well-suited for this crop. Minimal amendments needed." : "Udongo wako unafaa kwa zao hili. Marekebisho madogo yanahitajika.")
                  : result.health_score >= 60
                  ? (lang === "en" ? "Good match, but 1\u20132 nutrients need boosting with the right fertilizer." : "Ulinganifu mzuri, lakini virutubisho 1-2 vinahitaji kuongezwa.")
                  : result.health_score >= 40
                  ? (lang === "en" ? "Several nutrient gaps detected. Follow the fertilizer plan below carefully." : "Mapungufu ya virutubisho yamegunduliwa. Fuata mpango wa mbolea.")
                  : (lang === "en" ? "Major soil deficiencies. Consider soil amendments and the alternative crops listed below." : "Upungufu mkubwa wa udongo. Fikiria marekebisho ya udongo.")}
              </p>
              <p className="text-xs text-soil-400 mt-1">{t("result_score", lang)} · {result.county}</p>
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

            {/* ─── Item 1: REORDERED — Budget + Fertilizer FIRST ─── */}

            {/* Shopping List / Budget — the farmer's #1 question */}
            <div className="rounded-2xl border border-cream-300 bg-white p-5">
              <h3 className="font-display font-bold text-base mb-1 text-forest-700">
                {t("shopping_title", lang)}
              </h3>
              <p className="text-xs text-soil-400 mb-3">
                {t("shopping_for", lang)} <strong>{acres} {t("shopping_acres", lang)}</strong>
              </p>
              <div className="rounded-xl p-4 mb-3 text-center bg-forest-700">
                <p className="text-sm text-cream-400 uppercase tracking-wider">{t("result_total_cost", lang)}</p>
                <p className="text-3xl font-extrabold text-gold-400">KES {result.budget.total_budget.toLocaleString()}</p>
              </div>
              {/* Item 7 (budget styling): Individual line items */}
              <div className="space-y-1.5">
                {result.budget.breakdown.map((line, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 py-1 border-b border-cream-200 last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-500 shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
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
                        <td className="py-2 pr-2 text-red-600 text-xs">{clean(result.comparison.current_flaw) || "\u2014"}</td>
                        <td className="py-2 text-green-700 font-bold">
                          {(() => {
                            const rec = clean(result.comparison.recommended);
                            if (rec && (rec.includes("None") || rec.includes("Optimal")) && result.is_k_low) {
                              return lang === "en" ? "NPK 17:17:17 + CAN (K is deficient)" : "NPK 17:17:17 + CAN (K iko chini)";
                            }
                            return rec || "\u2014";
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-2 font-medium">{t("table_outcome", lang)}</td>
                        <td className="py-2 pr-2">{clean(result.comparison.current_outcome) || "Variable"}</td>
                        <td className="py-2 text-green-700 font-bold">{clean(result.comparison.impact) || "\u2014"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Item 6: Nutrient Sufficiency — merged (removed duplicate from SPAA) */}
            <div className={`rounded-2xl border p-5 ${scoreBg(result.health_score)}`}>
              <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                {t("chart_title", lang)}
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
                            {n.current.toFixed(1)} / {n.target.toFixed(1)} {isOk ? "OK" : "Low"}
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

            {/* Timeline */}
            {result.timeline && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  {t("timeline_title", lang)}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{result.timeline.season} \u2014 {result.crop}</p>
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

            {/* Item 13: Seeds — show empty state message when none */}
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                {t("seeds_title", lang)}
              </h3>
              {result.seeds && result.seeds.length > 0 ? (
                <>
                  <p className="text-xs text-gray-500 mb-3">KALRO & Kenya Seed Company certified varieties</p>
                  <div className="space-y-2">
                    {result.seeds.map((s) => (
                      <details key={s.Variety} className="rounded-lg border overflow-hidden">
                        <summary className="px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-50">
                          {s.Variety} <span className="text-gray-400 font-normal">({s.Breeder})</span>
                        </summary>
                        <div className="px-3 py-2 text-xs text-gray-600 border-t bg-gray-50 space-y-1">
                          <p><strong>{t("seeds_zone", lang)}:</strong> {s.Altitude_Zone} \u00b7 <strong>{t("seeds_maturity", lang)}:</strong> {s.Maturity_Days} {t("seeds_days", lang)} \u00b7 <strong>{t("seeds_yield", lang)}:</strong> {s.Yield_Bags_Per_Acre} bags/acre</p>
                          <p className="text-green-700">{s.Special_Attributes}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-soil-400 py-2">
                  {lang === "en"
                    ? `No certified seed varieties found for ${result.crop} in this region. Check with your local KALRO office.`
                    : `Hakuna aina za mbegu zilizoidhinishwa kwa ${result.crop} katika eneo hili. Wasiliana na ofisi yako ya KALRO.`}
                </p>
              )}
            </div>

            {/* Item 4: SPAA Intercrop Audit — collapsed by default */}
            {result.intercrop_audit && (
              <details className="rounded-2xl border p-5 bg-white shadow-sm border-cream-300">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-bold text-base flex items-center gap-2 text-forest-700">
                    {lang === "en" ? "Intercrop Analysis" : "Uchambuzi wa Mazao Mchanganyiko"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold text-white ${
                      result.intercrop_audit.compatible
                        ? (result.intercrop_audit.status === "WARNING" || result.intercrop_audit.status === "ILANI" ? "bg-amber-500" : "bg-green-600")
                        : "bg-red-600"
                    }`}>
                      {result.intercrop_audit.compatible
                        ? (lang === "en" ? "Compatible" : "Inaoana")
                        : (lang === "en" ? "Not Compatible" : "Haiendani")}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </summary>
                <div className="mt-4 space-y-2">
                  {result.intercrop_audit.notes.map((note: string, idx: number) => {
                    const isReject = note.includes("Conflict") || note.includes("Inhibition") || note.includes("Toxicity") || note.includes("Veto") || note.includes("block") || note.includes("Mzozo") || note.includes("Uzuiaji") || note.includes("Sumu") || note.includes("kizuizi") || note.includes("Kizuizi");
                    const isWarning = note.includes("Warning") || note.includes("Ilani") || note.includes("alert") || note.includes("caution") || note.includes("management needed") || note.includes("unahitajika");
                    const isAlternative = note.includes("instead") || note.includes("Alternatives") || note.includes("badala yake") || note.includes("Mbadala");
                    return (
                      <div key={idx} className={`rounded-xl px-3 py-2.5 text-xs flex items-start gap-2 border ${
                        isAlternative ? "bg-blue-50 text-blue-800 border-blue-200 font-medium" :
                        isReject ? "bg-red-50 text-red-800 border-red-100" :
                        isWarning ? "bg-amber-50 text-amber-800 border-amber-100" :
                        "bg-green-50 text-green-800 border-green-100"
                      }`}>
                        <span className="leading-relaxed">{note}</span>
                      </div>
                    );
                  })}

                  {/* N-fixation savings */}
                  {result.intercrop_audit.n_fixation && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5">
                      <p className="text-xs font-semibold text-green-800 mb-1">{lang === "en" ? "Nitrogen Fixation Saving" : "Akiba ya Nitrojeni"}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-green-800">
                        <span>{lang === "en" ? "Fixed N" : "Nitrojeni iliyonaswa"}</span>
                        <span className="font-bold">{result.intercrop_audit.n_fixation.fixed_kg_per_ha} kg/ha ({result.intercrop_audit.n_fixation.fixed_kg_per_acre} kg/acre)</span>
                        <span>{lang === "en" ? "CAN bags saved" : "Mifuko ya CAN iliyookolewa"}</span>
                        <span className="font-bold">{result.intercrop_audit.n_fixation.can_bags_saved_per_acre} /acre</span>
                        <span>{lang === "en" ? "Saving per acre" : "Akiba kwa ekari"}</span>
                        <span className="font-bold">KES {result.intercrop_audit.n_fixation.kes_saved_per_acre.toLocaleString()}</span>
                        <span>{lang === "en" ? "Total saving" : "Jumla ya akiba"}</span>
                        <span className="font-bold">KES {result.intercrop_audit.n_fixation.kes_saved_total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Layout */}
                  {result.intercrop_audit.layout && (
                    <div className="mt-4 rounded-xl border border-cream-200 bg-cream-50 px-3 py-2.5">
                      <p className="text-xs font-semibold text-forest-700 mb-1.5">{lang === "en" ? "Planting Layout" : "Mpango wa Upandaji"}</p>
                      <div className="space-y-1 text-xs text-forest-800">
                        <p><span className="font-semibold">{lang === "en" ? "Arrangement: " : "Mpangilio: "}</span>{result.intercrop_audit.layout.arrangement}</p>
                        <p><span className="font-semibold">{lang === "en" ? "Timing: " : "Wakati: "}</span>{result.intercrop_audit.layout.timing}</p>
                        <p><span className="font-semibold">{lang === "en" ? "Spacing: " : "Nafasi: "}</span>{result.intercrop_audit.layout.spacing}</p>
                      </div>
                    </div>
                  )}

                  {/* Economics */}
                  {result.intercrop_audit.economics && (
                    <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5">
                      <p className="text-xs font-semibold text-blue-800 mb-1">{lang === "en" ? "Income Comparison" : "Ulinganisho wa Mapato"}</p>
                      <p className="text-xs text-blue-900 mb-1.5 leading-relaxed">{result.intercrop_audit.economics.summary}</p>
                      <div className="flex gap-3 flex-wrap text-xs">
                        <span className="bg-white border border-blue-200 rounded px-2 py-0.5 font-medium text-blue-800">LER {result.intercrop_audit.economics.ler_estimate}</span>
                        {result.intercrop_audit.economics.advantage_pct > 0 && (
                          <span className="bg-green-100 border border-green-200 rounded px-2 py-0.5 font-bold text-green-800">+{result.intercrop_audit.economics.advantage_pct}%</span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 mt-1.5 italic">{result.intercrop_audit.economics.note}</p>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Item 10: Weather — collapsible, moved below technical sections */}
            {weather && (
              <details className="rounded-2xl border bg-white p-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-bold text-base" style={{ color: "#1a3a1a" }}>
                    {lang === "en" ? "7-Day Weather Forecast" : "Utabiri wa Hali ya Hewa (Siku 7)"}
                  </h3>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div className="mt-3">
                  {weather.summary && (
                    <div className={`rounded-xl px-3 py-2.5 text-sm mb-3 border ${
                      weather.summary.includes("Heavy") || weather.summary.includes("dry") || weather.summary.includes("Dry")
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-green-50 border-green-200 text-green-800"
                    }`}>
                      <span className="font-semibold">{weather.summary}</span>
                      {weather.advice && <span className="opacity-80"> \u2014 {weather.advice}</span>}
                    </div>
                  )}
                  {weather.forecast && weather.forecast.length > 0 && (
                    <div className="grid grid-cols-7 gap-1.5">
                      {weather.forecast.map((day: { date: string; temp_max: number; temp_min: number; rain_mm: number; description: string; wind_kmh?: number }, i: number) => {
                        const d = new Date(day.date + "T00:00:00");
                        const dayName = i === 0
                          ? (lang === "en" ? "Today" : "Leo")
                          : d.toLocaleDateString(lang === "en" ? "en-US" : "sw-KE", { weekday: "short" });
                        const dateStr = d.toLocaleDateString(lang === "en" ? "en-US" : "sw-KE", { day: "numeric", month: "short" });
                        const desc = (day.description || "").toLowerCase();
                        let statusText = "Sunny";
                        if (desc.includes("thunder")) statusText = "Storm";
                        else if (desc.includes("heavy rain") || desc.includes("violent")) statusText = "Heavy Rain";
                        else if (desc.includes("rain") || desc.includes("shower")) statusText = "Rainy";
                        else if (desc.includes("drizzle")) statusText = "Drizzle";
                        else if (desc.includes("overcast")) statusText = "Overcast";
                        else if (desc.includes("cloud") || desc.includes("partly")) statusText = "Cloudy";
                        else if (desc.includes("fog")) statusText = "Foggy";
                        const isWet = day.rain_mm > 5;
                        const isDry = day.rain_mm < 1;
                        return (
                          <div key={day.date} className={`rounded-xl border p-2 text-center text-xs transition-all ${
                            isWet ? "bg-blue-50 border-blue-200" : isDry ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"
                          }`}>
                            <div className="font-bold text-gray-800">{dayName}</div>
                            <div className="text-gray-400 text-[10px]">{dateStr}</div>
                            <div className="text-[10px] font-semibold my-2 text-forest-700 uppercase tracking-tight">{statusText}</div>
                            <div className="font-semibold text-gray-700">{day.temp_max !== null ? `${Math.round(day.temp_max)}\u00b0` : "\u2014"}</div>
                            <div className="text-gray-400">{day.temp_min !== null ? `${Math.round(day.temp_min)}\u00b0` : "\u2014"}</div>
                            <div className={`mt-1 font-semibold ${isWet ? "text-blue-600" : "text-gray-400"}`}>{day.rain_mm !== null ? `${day.rain_mm.toFixed(1)}` : "0"}mm</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Advice */}
            {result.advice && result.advice.length > 0 && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  {t("result_advice_title", lang)}
                </h3>
                <div className="space-y-2">
                  {result.advice.map((item, i) => {
                    const isError = item.includes("\u274c") || item.includes("\ud83d\udea8") || item.includes("Critical") || item.includes("Toxicity");
                    const isWarn = item.includes("\u26a0\ufe0f") || item.includes("Deficiency") || item.includes("Low");
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
            <div className="rounded-2xl border border-cream-300 bg-white p-5 space-y-3" data-noprint>
              <h3 className="font-display font-bold text-base text-forest-700">
                {lang === "en" ? "Share & Download" : "Shiriki na Pakua"}
              </h3>
              <button
                onClick={() => {
                  const el = resultRef.current;
                  if (!el) return;
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
                className="block w-full py-3 rounded-xl text-center font-bold text-cream-100 text-sm cursor-pointer bg-forest-700 hover:bg-forest-600 transition-colors"
              >
                {lang === "en" ? "Download PDF Report" : "Pakua Ripoti ya PDF"}
              </button>
              <button
                onClick={async () => {
                  if (agrShown) { setAgrShown(false); return; }
                  const lat = resolvedCoords?.lat;
                  const lon = resolvedCoords?.lon;
                  if (!lat || !lon) return;
                  setAgrLoading(true);
                  try {
                    let nearby = dealers
                      .filter(d => d.lat !== undefined && d.lon !== undefined)
                      .map(d => {
                        const dist = haversineDistance(lat, lon, d.lat!, d.lon!);
                        return { ...d, distance: Math.round(dist * 10) / 10 };
                      })
                      .filter(d => d.distance <= 50)
                      .sort((a, b) => a.distance - b.distance);
                    if (nearby.length === 0) {
                      const resolvedCounty = result?.county || county || "Nairobi";
                      nearby = dealers
                        .filter(d => d.county !== undefined && d.county.toLowerCase() === resolvedCounty.toLowerCase())
                        .map(d => ({ ...d, distance: 55 }));
                    }
                    try {
                      const backendDealers = await getDealersNearby(lat, lon).catch(() => []);
                      if (backendDealers && backendDealers.length > 0) {
                        nearby = nearby.map(d => {
                          const match = backendDealers.find(bd => bd.name.toLowerCase() === d.name.toLowerCase());
                          if (match && match.dealer_id) return { ...d, dealer_id: match.dealer_id };
                          return d;
                        });
                      }
                    } catch { /* Non-blocking */ }
                    setAgrovets(nearby);
                    setAgrShown(true);
                  } catch { setAgrovets([]); setAgrShown(true); }
                  finally { setAgrLoading(false); }
                }}
                disabled={agrLoading}
                className={`block w-full py-3 rounded-xl text-center font-bold text-white text-sm cursor-pointer transition-all disabled:opacity-60 ${
                  agrShown ? "bg-soil-400 hover:bg-soil-500" : "bg-gold-600 hover:bg-gold-500"
                }`}
              >
                {agrLoading
                  ? (lang === "en" ? "Searching Agrovets..." : "Inatafuta Agroveti...")
                  : agrShown
                    ? (lang === "en" ? "Hide Agrovets" : "Ficha Agroveti")
                    : t("dealers_find", lang)}
              </button>
            </div>

            {/* Sticky WhatsApp FAB + Back to form on mobile */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4" data-noprint>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-bold text-white text-sm shadow-2xl pulse-glow"
                style={{ background: "#25D366" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t("result_share", lang)}
              </a>
            </div>

            {/* Item 12: Agrovet Results — single message, no duplicate */}
            {agrShown && (
              <div className="rounded-2xl border bg-white p-5">
                <h3 className="font-bold text-base mb-3" style={{ color: "#1a3a1a" }}>
                  {lang === "en" ? "Agrovets Near You" : "Agroveti Karibu Nawe"}
                </h3>
                {agrovets.length > 0 ? (
                  <div className="space-y-2.5">
                    <p className="text-xs text-gray-500">
                      {lang === "en"
                        ? `${agrovets.length} verified agrovets found within 50 km`
                        : `Agroveti ${agrovets.length} zilizopatikana ndani ya km 50`}
                    </p>
                    {agrovets.slice(0, 10).map((d, i) => (
                      <AgrovetCard key={i} dealer={d} isFirst={i === 0} lang={lang} />
                    ))}
                    {agrovets.length > 10 && (
                      <p className="text-xs text-gray-400 text-center pt-1">
                        {lang === "en"
                          ? `+${agrovets.length - 10} more agrovets nearby`
                          : `+${agrovets.length - 10} agroveti zaidi karibu`}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-2">
                    {lang === "en"
                      ? "No agrovets found within 50 km. Try a wider search on the Dealers page."
                      : "Hakuna agroveti zilizopatikana ndani ya km 50."}
                  </p>
                )}
              </div>
            )}

            {/* Alternative Crop Recommendations */}
            {cropMatches && cropMatches.length > 0 && (
              <div className="mt-8 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  {lang === "en" ? "Alternative Crops for Your Soil" : "Mazao Mbadala kwa Udongo Wako"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {cropMatches.map((cm, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-full w-2 bg-gradient-to-b from-green-400 to-emerald-600"></div>
                      <h4 className="font-bold text-gray-800 text-lg">{cm.crop}</h4>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{lang === "en" ? "Match Score" : "Ulinganifu"}</span>
                        <span className="font-bold text-emerald-600">{Math.round(cm.match_score)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.round(cm.match_score)}%` }}></div>
                      </div>
                      <p className="mt-3 text-xs text-gray-600 font-medium bg-gray-50 p-2 rounded border border-gray-100 line-clamp-2" title={cm.label}>
                        {cm.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

        {/* Item 14 (mobile): Empty state visible on all devices */}
        {!loading && !result && !geminiAdvice && (
          <div className="flex flex-col items-center justify-center min-h-[200px] lg:min-h-[400px] text-center px-8 rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50">
            <div className="w-16 h-16 rounded-2xl bg-forest-700/8 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d5a27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <p className="font-display text-lg font-bold text-forest-700 mb-2">{lang === "en" ? "Your results will appear here" : "Matokeo yako yataonekana hapa"}</p>
            <p className="text-sm text-soil-400 max-w-xs">{lang === "en" ? "Select your county, crop, and farm size \u2014 then get your free soil analysis and fertilizer plan." : "Chagua kaunti yako, zao, na ukubwa wa shamba \u2014 kisha pata uchambuzi wako wa udongo bila malipo."}</p>
          </div>
        )}

        </div>
        {/* end RIGHT column */}

        </div>
        {/* end grid */}
      </div>
    </div>
  );
}
