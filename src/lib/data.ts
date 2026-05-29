import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(filename: string): Record<string, string>[] {
  const content = fs.readFileSync(path.join(dataDir, filename), 'utf-8');
  const lines = content.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

// ─── Types ─────────────────────────────────────────
export interface CountySoil {
  county: string;
  slug: string;
  zone: string;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
}

export interface CropEconomics {
  crop: string;
  slug: string;
  ph_min: number;
  ph_max: number;
  n_need: string;
  p_need: string;
  k_need: string;
  price_per_kg: number;
  yield_per_acre: number;
  pref_texture: string;
}

export interface Dealer {
  name: string;
  county: string;
  town: string;
  lat: number;
  lon: number;
  phone: string;
  stocks: string;
  rating?: number;
}

export interface Seed {
  crop: string;
  variety: string;
  breeder: string;
  altitude_zone: string;
  maturity_days: string;
  yield_bags: string;
  special: string;
}

export interface CropCalendar {
  crop: string;
  season: string;
  month1: string;
  month2: string;
  month3: string;
}

export interface TopDressing {
  crop: string;
  product: string;
  timing: string;
  instruction: string;
  bags_per_acre: number;
}

export interface FertilizerPrice {
  fertilizer: string;
  subsidized: number;
  commercial: number;
}

export interface CountyCoord {
  county: string;
  latitude: number;
  longitude: number;
}

// ─── Slugify ───────────────────────────────────────
export function slugify(name: string): string {
  return name.toLowerCase().replace(/[''()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Data Loaders ──────────────────────────────────
let _counties: CountySoil[] | null = null;
export function getCountySoils(): CountySoil[] {
  if (_counties) return _counties;
  const rows = parseCSV('kenya_county_soils.csv');
  _counties = rows.map(r => ({
    county: r['County'],
    slug: slugify(r['County']),
    zone: r['Agroecological Zone'],
    pH: parseFloat(r['pH']),
    nitrogen: parseFloat(r['Total Nitrogen (g/kg)']),
    phosphorus: parseFloat(r['Extractable Phosphorus (mg/kg)']),
    potassium: parseFloat(r['Extractable Potassium (mg/kg)']),
    organicCarbon: parseFloat(r['Organic Carbon (g/kg)']),
  }));
  return _counties;
}

export function getCountyBySlug(slug: string): CountySoil | undefined {
  return getCountySoils().find(c => c.slug === slug);
}

let _crops: CropEconomics[] | null = null;
export function getCrops(): CropEconomics[] {
  if (_crops) return _crops;
  const rows = parseCSV('crop_economics.csv');
  _crops = rows.map(r => ({
    crop: r['Crop'],
    slug: slugify(r['Crop']),
    ph_min: parseFloat(r['ph_min']),
    ph_max: parseFloat(r['ph_max']),
    n_need: r['n_need'],
    p_need: r['p_need'],
    k_need: r['k_need'],
    price_per_kg: parseFloat(r['price_per_kg']),
    yield_per_acre: parseFloat(r['yield_per_acre']),
    pref_texture: r['pref_texture'],
  }));
  return _crops;
}

/** Call this after writing crop_economics.csv so the next request re-reads the file. */
export function invalidateCropsCache(): void {
  _crops = null;
}

export function getCropBySlug(slug: string): CropEconomics | undefined {
  return getCrops().find(c => c.slug === slug);
}

let _dealers: Dealer[] | null = null;
export function getDealers(): Dealer[] {
  if (_dealers) return _dealers;
  const rows = parseCSV('dealers.csv');
  _dealers = rows.map(r => ({
    name: r['name'],
    county: r['county'],
    town: r['town'],
    lat: parseFloat(r['lat']),
    lon: parseFloat(r['lon']),
    phone: r['phone'] || '',
    stocks: r['stocks'] || '',
    rating: r['rating'] ? parseFloat(r['rating']) : undefined,
  }));
  return _dealers;
}

export function getDealersByCounty(countyName: string): Dealer[] {
  return getDealers().filter(d => d.county.toLowerCase() === countyName.toLowerCase());
}

let _seeds: Seed[] | null = null;
export function getSeeds(): Seed[] {
  if (_seeds) return _seeds;
  const rows = parseCSV('seeds.csv');
  _seeds = rows.map(r => ({
    crop: r['Crop'],
    variety: r['Variety'],
    breeder: r['Breeder'],
    altitude_zone: r['Altitude_Zone'],
    maturity_days: r['Maturity_Days'],
    yield_bags: r['Yield_Bags_Per_Acre'],
    special: r['Special_Attributes'] || '',
  }));
  return _seeds;
}

export function getSeedsByCrop(cropName: string): Seed[] {
  return getSeeds().filter(s => s.crop.toLowerCase() === cropName.toLowerCase());
}

let _calendars: CropCalendar[] | null = null;
export function getCropCalendars(): CropCalendar[] {
  if (_calendars) return _calendars;
  const rows = parseCSV('crop_calendars.csv');
  _calendars = rows.map(r => ({
    crop: r['Crop'],
    season: r['Season'],
    month1: r['Month_1'],
    month2: r['Month_2'],
    month3: r['Month_3'],
  }));
  return _calendars;
}

let _topDressing: TopDressing[] | null = null;
export function getTopDressing(): TopDressing[] {
  if (_topDressing) return _topDressing;
  const rows = parseCSV('top_dressing.csv');
  _topDressing = rows.map(r => ({
    crop: r['Crop'],
    product: r['Product'],
    timing: r['Timing'],
    instruction: r['Instruction'],
    bags_per_acre: parseFloat(r['Bags_Per_Acre']),
  }));
  return _topDressing;
}

let _prices: FertilizerPrice[] | null = null;
export function getPrices(): FertilizerPrice[] {
  if (_prices) return _prices;
  const rows = parseCSV('prices.csv');
  _prices = rows.map(r => ({
    fertilizer: r['Fertilizer'],
    subsidized: parseFloat(r['Subsidized']),
    commercial: parseFloat(r['Commercial']),
  }));
  return _prices;
}

let _coords: CountyCoord[] | null = null;
export function getCountyCoords(): CountyCoord[] {
  if (_coords) return _coords;
  const rows = parseCSV('county_coordinates.csv');
  _coords = rows.map(r => ({
    county: r['County'],
    latitude: parseFloat(r['Latitude']),
    longitude: parseFloat(r['Longitude']),
  }));
  return _coords;
}

// ─── Scoring ───────────────────────────────────────
export function scoreCropForCounty(county: CountySoil, crop: CropEconomics): number {
  let score = 100;

  // pH
  if (county.pH < crop.ph_min) {
    score -= Math.min(40, (crop.ph_min - county.pH) * 20);
  } else if (county.pH > crop.ph_max) {
    score -= Math.min(40, (county.pH - crop.ph_max) * 20);
  }

  // Nitrogen
  const nThresholds: Record<string, number> = { high: 1.2, medium: 0.8, low: 0.5 };
  const nMin = nThresholds[crop.n_need] || 0.8;
  if (county.nitrogen < nMin) {
    score -= Math.min(20, ((nMin - county.nitrogen) / nMin) * 30);
  }

  // Phosphorus
  const pThresholds: Record<string, number> = { high: 20, medium: 12, low: 6 };
  const pMin = pThresholds[crop.p_need] || 12;
  if (county.phosphorus < pMin) {
    score -= Math.min(20, ((pMin - county.phosphorus) / pMin) * 25);
  }

  // Potassium
  const kThresholds: Record<string, number> = { high: 200, medium: 150, low: 100 };
  const kMin = kThresholds[crop.k_need] || 150;
  if (county.potassium < kMin) {
    score -= Math.min(20, ((kMin - county.potassium) / kMin) * 25);
  }

  // Scale score to a realistic maximum of 94% due to non-soil field factors
  return Math.max(0, Math.round(score * 0.94));
}

export function getTopCropsForCounty(county: CountySoil, limit = 8): { crop: CropEconomics; score: number }[] {
  const crops = getCrops();
  return crops
    .map((crop) => ({ crop, score: computeCropSoilScore(county, crop) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getTopCountiesForCrop(crop: CropEconomics, limit = 10): { county: CountySoil; score: number }[] {
  const counties = getCountySoils();
  return counties
    .map((county) => ({ county, score: computeCropSoilScore(county, crop) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ─── Soil Health Score (SQI — matches recommender.py sigmoid) ──
export function computeSoilHealthScore(county: CountySoil): number {
  // Sigmoid function — same as recommender.py
  const sig = (x: number, x_crit: number): number =>
    1 / (1 + Math.exp(-5 * (x / x_crit - 0.5)));

  // pH uses Gaussian centered at 6.5 (optimal for most crops)
  const s_ph = Math.exp(-Math.pow(county.pH - 6.5, 2) / 2.0);

  // Nutrients use sigmoid against general thresholds
  // Thresholds calibrated to iSDAsoil output scale
  const s_n = sig(county.nitrogen, 1.2);
  const s_p = sig(county.phosphorus, 20);
  const s_k = sig(county.potassium, 150);
  const s_oc = sig(county.organicCarbon, 15);

  // Weighted: pH 40% (gatekeeper), each nutrient 15%
  const raw = s_ph * 0.4 + s_n * 0.15 + s_p * 0.15 + s_k * 0.15 + s_oc * 0.15;
  // Maximum realistic SQI is around 94% under real field conditions
  return Math.round(Math.min(94, Math.max(0, raw * 94)));
}

// ─── Crop-Soil Suitability Score (sigmoid model) ───
export function computeCropSoilScore(county: CountySoil, crop: CropEconomics): number {
  const sig = (x: number, x_crit: number) =>
    1 / (1 + Math.exp(-5 * (x / x_crit - 0.5)));
  const phMid = (crop.ph_min + crop.ph_max) / 2;
  const s_ph  = Math.exp(-Math.pow(county.pH - phMid, 2) / 2.0);
  const nThresholds: Record<string, number> = { high: 1.2, medium: 0.8, low: 0.5 };
  const pThresholds: Record<string, number> = { high: 20, medium: 12, low: 6 };
  const kThresholds: Record<string, number> = { high: 200, medium: 150, low: 100 };
  const nCrit = nThresholds[crop.n_need] ?? 1.0;
  const pCrit = pThresholds[crop.p_need] ?? 15;
  const kCrit = kThresholds[crop.k_need] ?? 120;
  const s_n  = sig(county.nitrogen, nCrit);
  const s_p  = sig(county.phosphorus, pCrit);
  const s_k  = sig(county.potassium, kCrit);
  const s_oc = sig(county.organicCarbon, 12);
  const raw = s_ph * 0.4 + s_n * 0.2 + s_p * 0.2 + s_k * 0.1 + s_oc * 0.1;
  // Maximum realistic suitability score is around 94%
  return Math.round(Math.min(94, Math.max(0, raw * 94)));
}

// ─── Zone Helpers ──────────────────────────────────
export function getZones(): string[] {
  const zones = new Set(getCountySoils().map(c => c.zone));
  return Array.from(zones).sort();
}

export function getCountiesByZone(zone: string): CountySoil[] {
  return getCountySoils().filter(c => c.zone === zone);
}

export function getNeighboringCounties(county: CountySoil, limit = 3): CountySoil[] {
  const coords = getCountyCoords();
  const target = coords.find(c => c.county.toLowerCase() === county.county.toLowerCase());
  if (!target) return [];

  const all = getCountySoils().filter(c => c.county !== county.county);
  const withDist = all.map(c => {
    const co = coords.find(cc => cc.county.toLowerCase() === c.county.toLowerCase());
    const dist = co
      ? Math.sqrt(Math.pow(co.latitude - target.latitude, 2) + Math.pow(co.longitude - target.longitude, 2))
      : 999;
    return { county: c, dist };
  });
  withDist.sort((a, b) => a.dist - b.dist);
  return withDist.slice(0, limit).map(w => w.county);
}

// ─── Nutrient Status ───────────────────────────────
export function getNutrientStatus(
  value: number,
  type: 'ph' | 'nitrogen' | 'phosphorus' | 'potassium' | 'oc'
): { label: string; color: string } {
  switch (type) {
    case 'ph':
      if (value < 5.5) return { label: 'Acidic', color: '#dc2626' };
      if (value < 6.0) return { label: 'Slightly Acidic', color: '#f59e0b' };
      if (value <= 7.0) return { label: 'Optimal', color: '#16a34a' };
      if (value <= 7.5) return { label: 'Slightly Alkaline', color: '#f59e0b' };
      return { label: 'Alkaline', color: '#dc2626' };
    case 'nitrogen':
      if (value < 0.8) return { label: 'Low', color: '#dc2626' };
      if (value < 1.2) return { label: 'Moderate', color: '#f59e0b' };
      return { label: 'Adequate', color: '#16a34a' };
    case 'phosphorus':
      if (value < 12) return { label: 'Low', color: '#dc2626' };
      if (value < 20) return { label: 'Moderate', color: '#f59e0b' };
      return { label: 'Adequate', color: '#16a34a' };
    case 'potassium':
      if (value < 150) return { label: 'Low', color: '#dc2626' };
      if (value < 200) return { label: 'Moderate', color: '#f59e0b' };
      return { label: 'Adequate', color: '#16a34a' };
    case 'oc':
      if (value < 10) return { label: 'Low', color: '#dc2626' };
      if (value < 20) return { label: 'Moderate', color: '#f59e0b' };
      return { label: 'Adequate', color: '#16a34a' };
  }
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.shambaiq.com';

// ─── Ward Types & Loader ──────────────────────────
export interface Ward {
  county: string;
  subcounty: string;
  ward: string;
  slug: string;
  latitude: number;
  longitude: number;
  population: number;
}

let _wards: Ward[] | null = null;
export function getWards(): Ward[] {
  if (_wards) return _wards;
  const rows = parseCSV('wards.csv');
  _wards = rows.map(r => ({
    county: r['County'],
    subcounty: r['Subcounty'] || r['SubCounty'],
    ward: r['Ward'],
    slug: slugify(r['Ward']),
    latitude: parseFloat(r['Latitude']),
    longitude: parseFloat(r['Longitude']),
    population: parseFloat(r['pop2009'] || '0'),
  }));
  return _wards;
}

export function getWardsByCounty(countyName: string): Ward[] {
  return getWards().filter(w => w.county.toLowerCase() === countyName.toLowerCase());
}

export function getWardBySlug(countySlug: string, wardSlug: string): Ward | undefined {
  const county = getCountyBySlug(countySlug);
  if (!county) return undefined;
  return getWards().find(
    w => w.county.toLowerCase() === county.county.toLowerCase() && slugify(w.ward) === wardSlug
  );
}

export function getSubcountiesByCounty(countyName: string): string[] {
  const wards = getWardsByCounty(countyName);
  return Array.from(new Set(wards.map(w => w.subcounty))).sort();
}

// ─── Subcounty Coordinates ─────────────────────────
export interface SubcountyCoord {
  county: string;
  subcounty: string;
  latitude: number;
  longitude: number;
}

let _subcountyCoords: SubcountyCoord[] | null = null;
export function getSubcountyCoords(): SubcountyCoord[] {
  if (_subcountyCoords) return _subcountyCoords;
  const rows = parseCSV('subcounty_coordinates.csv');
  _subcountyCoords = rows.map(r => ({
    county: r['County'],
    subcounty: r['SubCounty'] || r['Subcounty'],
    latitude: parseFloat(r['Latitude']),
    longitude: parseFloat(r['Longitude']),
  }));
  return _subcountyCoords;
}

// ─── Comparison Reasons (EN/SW) ────────────────────
export interface ComparisonReason {
  condition: string;
  reason_en: string;
  reason_sw: string;
}

let _comparisonReasons: ComparisonReason[] | null = null;
export function getComparisonReasons(): ComparisonReason[] {
  if (_comparisonReasons) return _comparisonReasons;
  const rows = parseCSV('comparison_reasons.csv');
  _comparisonReasons = rows.map(r => ({
    condition: r['Condition'],
    reason_en: r['Reason_EN'],
    reason_sw: r['Reason_SW'],
  }));
  return _comparisonReasons;
}

// ─── Bilingual UI Strings ──────────────────────────
export type Lang = 'en' | 'sw';

export const UI_STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    title: "Farm Profile",
    county: "Where is your farm?",
    crop: "What are you planting?",
    fert: "What fertilizer do you usually use?",
    acres: "Farm size (Acres)",
    button: "Get Precision Advice",
    report_title: "Your Insight Report",
    budget_title: "Budget Estimate",
    total_cost: "Total Cost",
    advice_title: "Actionable Advice",
    share: "Share on WhatsApp",
    download_pdf: "Download PDF Report",
    dealers_title: "Suppliers Nearby",
    sms_button: "SMS Summary",
    switch_title: "The Switch: Impact Analysis",
    table_feature: "Feature",
    table_habit: "Your Habit",
    table_rec: "ShambaIQ Recommendation",
    table_strategy: "Strategy",
    table_outcome: "Outcome",
    chart_title: "Nutrient Sufficiency",
    status_low: "Low",
    status_optimal: "Optimal",
    status_acidic: "Acidic",
    status_good: "Healthy",
    yield_title: "Yield Tracker",
    yield_desc: "Season-over-Season Progress",
    doctor_title: "Plant Doctor",
    doctor_desc: "AI Pest & Disease Diagnostics",
    home: "Home",
    soil: "Soil",
    yields: "Yields",
    doctor: "Doctor",
    me: "Me",
  },
  sw: {
    title: "Maelezo ya Shamba",
    county: "Shamba lako lipo wapi?",
    crop: "Unapanda zao gani?",
    fert: "Mbolea ya kawaida?",
    acres: "Ukubwa (Ekari)",
    button: "Pata Ushauri",
    report_title: "Ripoti ya Shamba",
    budget_title: "Gharama",
    total_cost: "Jumla",
    advice_title: "Ushauri",
    share: "Shiriki WhatsApp",
    download_pdf: "Pakua PDF",
    dealers_title: "Wauzaji Karibu",
    sms_button: "Muhtasari wa SMS",
    switch_title: "Mabadiliko: Uchambuzi",
    table_feature: "Kipengele",
    table_habit: "Tabia Yako",
    table_rec: "Ushauri wa ShambaIQ",
    table_strategy: "Mkakati",
    table_outcome: "Matokeo",
    chart_title: "Kiwango cha Virutubisho",
    status_low: "Chini",
    status_optimal: "Bora",
    status_acidic: "Tindikali",
    status_good: "Afya",
    yield_title: "Ufuatiliaji wa Mazao",
    yield_desc: "Maendeleo ya Msimu",
    doctor_title: "Daktari wa Mimea",
    doctor_desc: "Uchunguzi wa Magonjwa kwa AI",
    home: "Nyumbani",
    soil: "Udongo",
    yields: "Mazao",
    doctor: "Daktari",
    me: "Mimi",
  },
};

export const FERTILIZER_OPTIONS = [
  "DAP (Diammonium Phosphate)",
  "CAN",
  "Urea",
  "NPK 17:17:17",
  "Mavuno (Planting)",
  "YaraMila Cereal",
  "SSP / TSP",
  "Potassium Sulphate / MOP",
  "Manure",
  "None",
];

// ─── Crop yield units (from Streamlit app) ─────────
export const CROP_UNITS: Record<string, { unit: string; min: number; max: number; def: number }> = {
  Maize: { unit: "Bags/Acre", min: 15, max: 50, def: 30 },
  Beans: { unit: "Bags/Acre", min: 8, max: 20, def: 12 },
  Potatoes: { unit: "Bags/Acre", min: 200, max: 400, def: 300 },
  Wheat: { unit: "Bags/Acre", min: 10, max: 40, def: 20 },
  Rice: { unit: "Bags/Acre", min: 15, max: 50, def: 30 },
  Sorghum: { unit: "Bags/Acre", min: 10, max: 30, def: 15 },
  Millet: { unit: "Bags/Acre", min: 5, max: 20, def: 10 },
  Tea: { unit: "Kg/Acre", min: 500, max: 3000, def: 1500 },
  Coffee: { unit: "Kg/Acre", min: 200, max: 1500, def: 500 },
  Sugarcane: { unit: "Tons/Acre", min: 20, max: 80, def: 50 },
};
