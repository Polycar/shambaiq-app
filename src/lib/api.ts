/**
 * ShambaIQ Backend API Client
 * Wraps all endpoints from shambaiq-backend-production.up.railway.app
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

// ─── Types ───────────────────────────────────────────────────────

export interface RecommendRequest {
  county: string;
  crop: string;
  current_fertilizer: string;
  farm_size_acres: number;
  lang?: "English" | "Kiswahili";
  lat?: number;
  lon?: number;
  overrides?: Record<string, number>;
  price_mode?: "Subsidized" | "Commercial";
  yield_target?: number;
}

export interface RecommendResult {
  county: string;
  crop: string;
  health_score: number;
  data_source: string;
  confidence: string;
  county_data: {
    pH: number;
    "Total Nitrogen (g/kg)": number;
    "Extractable Phosphorus (mg/kg)": number;
    "Extractable Potassium (mg/kg)": number;
    "Organic Carbon (g/kg)": number;
  };
  reqs: { n_min: number; p_min: number; k_min: number };
  comparison: {
    current_flaw: string;
    recommended: string;
    current_outcome: string;
    impact: string;
  };
  advice: string[];
  budget: {
    total_budget: number;
    breakdown: string[];
  };
  timeline?: {
    season: string;
    month_1: string;
    month_2: string;
    month_3: string;
  };
  seeds?: Array<{
    Variety: string;
    Breeder: string;
    Altitude_Zone: string;
    Maturity_Days: string;
    Yield_Bags_Per_Acre: string;
    Special_Attributes: string;
  }>;
  weather_advice?: string;
  error?: string;
  is_acidic?: boolean;
  is_n_low?: boolean;
  is_p_low?: boolean;
  is_k_low?: boolean;
}

export interface CropMatch {
  crop: string;
  match_score: number;
  label: string;
  gross_income: number;
}

export interface WeatherData {
  summary: string;
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    rain_mm: number;
    description: string;
  }>;
  advice: string;
}

export interface Dealer {
  name: string;
  county?: string;
  town?: string;
  lat?: number;
  lon?: number;
  phone?: string;
  stocks?: string;
  distance?: number;
  rating?: number;
  source?: string;
}

export interface SoilPrecision {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_carbon: number;
  source: string;
  resolution: string;
}

export interface YieldEntry {
  farmer_id: string;
  crop: string;
  season: string;
  yield_bags_per_acre: number;
}

// ─── Fetcher ─────────────────────────────────────────────────────

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Recommendation ──────────────────────────────────────────────

export async function getRecommendation(req: RecommendRequest): Promise<RecommendResult> {
  return api<RecommendResult>("/api/v1/recommend", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function matchCrops(
  soilData: Record<string, number>,
  farmAcres: number,
  lang: string
): Promise<CropMatch[]> {
  return api<CropMatch[]>("/api/v1/match-crops", {
    method: "POST",
    body: JSON.stringify({ soil_data: soilData, farm_acres: farmAcres, lang }),
  });
}

// ─── Data ────────────────────────────────────────────────────────

export async function fetchCrops(): Promise<string[]> {
  return api<string[]>("/api/v1/crops");
}

export async function fetchCounties(): Promise<string[]> {
  return api<string[]>("/api/v1/counties");
}

export async function fetchCountySoil(county: string) {
  return api<Record<string, number>>(`/api/v1/county/${encodeURIComponent(county)}/soil`);
}

export async function fetchSeeds(crop: string) {
  return api<RecommendResult["seeds"]>(`/api/v1/seeds/${encodeURIComponent(crop)}`);
}

// ─── Soil Precision ──────────────────────────────────────────────

export async function getSoilPrecision(lat: number, lon: number): Promise<SoilPrecision> {
  return api<SoilPrecision>(`/api/v1/soil/precision/${lat}/${lon}`);
}

export async function getSoilISDA(lat: number, lon: number): Promise<SoilPrecision> {
  return api<SoilPrecision>(`/api/v1/soil/isda/${lat}/${lon}`);
}

// ─── Weather ─────────────────────────────────────────────────────

export async function getWeatherByCounty(county: string): Promise<WeatherData> {
  return api<WeatherData>(`/api/v1/weather/county/${encodeURIComponent(county)}`);
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  return api<WeatherData>(`/api/v1/weather/${lat}/${lon}`);
}

// ─── Dealers ─────────────────────────────────────────────────────

export async function getDealersByCounty(county: string): Promise<Dealer[]> {
  const res = await api<{ dealers: Dealer[] }>(`/api/v1/dealers/${encodeURIComponent(county)}`);
  return res.dealers;
}

export async function getDealersNearby(lat: number, lon: number): Promise<Dealer[]> {
  const res = await api<{ dealers: Dealer[] }>(`/api/v1/dealers/nearby/${lat}/${lon}`);
  return res.dealers;
}

export async function getDealersLive(lat: number, lon: number): Promise<Dealer[]> {
  const res = await api<{ dealers: Dealer[] }>(`/api/v1/dealers/live/${lat}/${lon}`);
  return res.dealers;
}

// ─── Analytics / Yields ──────────────────────────────────────────

export async function logYield(entry: YieldEntry) {
  return api("/api/v1/analytics/yields", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export async function getYieldHistory(farmerId: string) {
  return api<YieldEntry[]>(`/api/v1/analytics/yields/${encodeURIComponent(farmerId)}`);
}

export async function submitFeedback(recommendationId: string, rating: number, comment?: string) {
  return api("/api/v1/analytics/feedback", {
    method: "POST",
    body: JSON.stringify({ recommendation_id: recommendationId, rating, comment }),
  });
}

export async function getDashboardStats() {
  return api("/api/v1/analytics/stats");
}

// ─── Reports ─────────────────────────────────────────────────────

export async function getWhatsAppLink(result: RecommendResult, acres: number): Promise<{ url: string }> {
  return api<{ url: string }>("/api/v1/report/whatsapp-link", {
    method: "POST",
    body: JSON.stringify({ result, farm_acres: acres }),
  });
}

export async function getSMSSummary(result: RecommendResult, lang: string): Promise<{ sms: string }> {
  return api<{ sms: string }>("/api/v1/report/sms-summary", {
    method: "POST",
    body: JSON.stringify({ result, lang }),
  });
}

// ─── Auth ────────────────────────────────────────────────────────

export async function register(phone: string, email?: string) {
  return api("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ phone, email }),
  });
}

export async function login(phone: string) {
  return api<{ token: string }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

// ─── Health ──────────────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string }> {
  return api<{ status: string }>("/health");
}
