/**
 * ShambaIQ Bilingual System — English / Kiswahili
 * Extracted from the production Streamlit app
 */

export type Lang = "en" | "sw";

const translations = {
  // ─── Navigation ──────────────────────────────────────────────
  nav_home: { en: "Home", sw: "Nyumbani" },
  nav_soil: { en: "Soil data", sw: "Data ya udongo" },
  nav_crops: { en: "Crops", sw: "Mazao" },
  nav_zones: { en: "Zones", sw: "Kanda" },
  nav_dealers: { en: "Dealers", sw: "Wauzaji" },
  nav_advice: { en: "Get advice", sw: "Pata ushauri" },
  nav_yield: { en: "Track yield", sw: "Fuatilia mavuno" },
  nav_doctor: { en: "Plant Doctor", sw: "Daktari wa mimea" },

  // ─── Hero ────────────────────────────────────────────────────
  hero_title: {
    en: "Precision agriculture for every Kenyan farmer",
    sw: "Kilimo bora kwa kila mkulima wa Kenya",
  },
  hero_subtitle: {
    en: "Free soil analysis and fertilizer advice for all 47 counties. Powered by 30m precision satellite data.",
    sw: "Uchambuzi wa udongo na ushauri wa mbolea kwa kaunti zote 47. Inatumia data ya satelaiti ya usahihi ya mita 30.",
  },
  hero_cta: { en: "Get free advice", sw: "Pata ushauri bure" },

  // ─── Farm Profile Form ──────────────────────────────────────
  form_title: { en: "Farm profile", sw: "Maelezo ya shamba" },
  form_county: { en: "Where is your farm?", sw: "Shamba lako lipo wapi?" },
  form_subcounty: { en: "Select sub-county", sw: "Chagua kaunti ndogo" },
  form_ward: { en: "Select ward (high precision)", sw: "Chagua wadi (usahihi wa juu)" },
  form_whole_county: { en: "Whole county average", sw: "Wastani wa kaunti nzima" },
  form_whole_subcounty: { en: "Whole sub-county average", sw: "Wastani wa kaunti ndogo" },
  form_crop: { en: "What are you planting?", sw: "Unapanda zao gani?" },
  form_fert: { en: "What fertilizer do you usually use?", sw: "Mbolea ya kawaida?" },
  form_acres: { en: "Farm size (acres)", sw: "Ukubwa (ekari)" },
  form_button: { en: "🌱 Get precision advice", sw: "🌱 Pata ushauri" },
  form_price_subsidized: { en: "Subsidized (KES 2,500/bag)", sw: "Ruzuku (KES 2,500/mfuko)" },
  form_price_commercial: { en: "Commercial (market rate)", sw: "Bei ya soko" },
  form_yield_goal: { en: "Target yield", sw: "Lengo la mavuno" },
  form_lab_mode: { en: "I have lab results", sw: "Nina matokeo ya maabara" },
  form_lab_ph: { en: "Lab pH", sw: "pH ya maabara" },
  form_lab_n: { en: "Lab N (g/kg)", sw: "N ya maabara (g/kg)" },
  form_lab_p: { en: "Lab P (mg/kg)", sw: "P ya maabara (mg/kg)" },
  form_lab_k: { en: "Lab K (mg/kg)", sw: "K ya maabara (mg/kg)" },
  form_select_county: { en: "Select county...", sw: "Chagua kaunti..." },
  form_analyzing: { en: "Analysing soil data...", sw: "Inachambua data ya udongo..." },
  form_select_first: { en: "Please identify your location first.", sw: "Tafadhali bainisha eneo lako kwanza." },

  // ─── Results ─────────────────────────────────────────────────
  result_title: { en: "Your insight report", sw: "Ripoti ya shamba" },
  result_score: { en: "Soil health score", sw: "Alama ya afya ya udongo" },
  result_mapping: { en: "Precision mapping for", sw: "Ramani ya" },
  result_budget_title: { en: "Budget estimate", sw: "Gharama" },
  result_total_cost: { en: "Total cost", sw: "Jumla" },
  result_advice_title: { en: "Actionable advice", sw: "Ushauri" },
  result_share: { en: "Share on WhatsApp", sw: "Shiriki WhatsApp" },
  result_download_pdf: { en: "Download PDF report", sw: "Pakua PDF" },
  result_sms: { en: "SMS summary", sw: "Muhtasari wa SMS" },

  // ─── The Switch (Fertilizer Comparison) ─────────────────────
  switch_title: { en: "The switch: impact analysis", sw: "Mabadiliko: uchambuzi" },
  table_feature: { en: "Feature", sw: "Kipengele" },
  table_habit: { en: "Your habit", sw: "Tabia yako" },
  table_rec: { en: "ShambaIQ recommendation", sw: "Ushauri wa ShambaIQ" },
  table_strategy: { en: "Strategy", sw: "Mkakati" },
  table_outcome: { en: "Outcome", sw: "Matokeo" },

  // ─── Nutrient Chart ──────────────────────────────────────────
  chart_title: { en: "Nutrient sufficiency", sw: "Kiwango cha virutubisho" },
  chart_current: { en: "Current level", sw: "Kiwango cha sasa" },
  chart_target: { en: "Target level", sw: "Kiwango lengwa" },
  nutrient_n: { en: "Nitrogen (N)", sw: "Nitrojeni (N)" },
  nutrient_p: { en: "Phosphorus (P)", sw: "Fosforasi (P)" },
  nutrient_k: { en: "Potassium (K)", sw: "Potasiamu (K)" },

  // ─── Status Labels ──────────────────────────────────────────
  status_low: { en: "Low", sw: "Chini" },
  status_optimal: { en: "Optimal", sw: "Bora" },
  status_acidic: { en: "Acidic", sw: "Asidi" },
  status_good: { en: "Healthy", sw: "Afya" },
  status_high: { en: "High", sw: "Juu" },
  status_deficient: { en: "Deficient", sw: "Upungufu" },

  // ─── Timeline ────────────────────────────────────────────────
  timeline_title: { en: "3-month action plan", sw: "Mpango wa miezi 3" },
  timeline_month1: { en: "Month 1", sw: "Mwezi 1" },
  timeline_month2: { en: "Month 2", sw: "Mwezi 2" },
  timeline_month3: { en: "Month 3", sw: "Mwezi 3" },

  // ─── Seeds ───────────────────────────────────────────────────
  seeds_title: { en: "Certified seed varieties", sw: "Mbegu zilizoidhinishwa" },
  seeds_zone: { en: "Zone", sw: "Eneo" },
  seeds_maturity: { en: "Maturity", sw: "Kukomaa" },
  seeds_yield: { en: "Yield", sw: "Mavuno" },
  seeds_days: { en: "days", sw: "siku" },

  // ─── Shopping List ───────────────────────────────────────────
  shopping_title: { en: "Fertilizer shopping list", sw: "Orodha ya ununuzi wa mbolea" },
  shopping_for: { en: "for", sw: "kwa" },
  shopping_acres: { en: "acres", sw: "ekari" },

  // ─── Weather ─────────────────────────────────────────────────
  weather_title: { en: "7-day weather", sw: "Hali ya hewa ya siku 7" },
  weather_loading: { en: "Fetching weather...", sw: "Inaangalia hali ya hewa..." },

  // ─── Crop Suitability ────────────────────────────────────────
  crops_title: { en: "Crop suitability", sw: "Mazao yanayofaa" },
  crops_view: { en: "View best crop matches", sw: "Angalia mazao bora" },
  crops_match: { en: "match", sw: "ulinganifu" },

  // ─── Dealers ─────────────────────────────────────────────────
  dealers_title: { en: "Suppliers nearby", sw: "Wauzaji karibu" },
  dealers_find: { en: "Find agrovets near me", sw: "Tafuta agroveti karibu" },
  dealers_view_map: { en: "View on map", sw: "Angalia kwenye ramani" },
  dealers_no_local: {
    en: "No local dealers found. Use the button above to search on Google Maps.",
    sw: "Hakuna wauzaji wa hapa. Tumia kitufe hapo juu kutafuta kwenye Google Maps.",
  },

  // ─── Yield Tracker ───────────────────────────────────────────
  yield_title: { en: "Yield tracker", sw: "Kufuatilia mavuno" },
  yield_subtitle: { en: "Season-over-season progress", sw: "Maendeleo ya msimu" },
  yield_log: { en: "Log new harvest", sw: "Andika mavuno mapya" },
  yield_farm_id: { en: "Farm name or mobile number", sw: "Jina la shamba au nambari ya simu" },
  yield_save: { en: "Save harvest", sw: "Hifadhi mavuno" },
  yield_no_data: { en: "No harvest data yet. Log your first harvest above!", sw: "Hakuna data ya mavuno bado. Andika mavuno yako ya kwanza!" },
  yield_up: { en: "yield up", sw: "mavuno yameongezeka" },
  yield_down: { en: "yield down", sw: "mavuno yamepungua" },

  // ─── Plant Doctor ────────────────────────────────────────────
  doctor_title: { en: "Plant Doctor", sw: "Daktari wa mimea" },
  doctor_subtitle: { en: "AI pest & disease diagnostics", sw: "Uchunguzi wa wadudu na magonjwa kwa AI" },
  doctor_snap: { en: "Snap a photo of a sick plant leaf or stem to get instant troubleshooting advice.", sw: "Piga picha ya jani au shina lenye ugonjwa kupata ushauri wa haraka." },
  doctor_camera: { en: "Open camera to scan", sw: "Fungua kamera kupiga" },
  doctor_upload: { en: "Or upload a photo from your gallery", sw: "Au pakia picha kutoka kwa faili zako" },
  doctor_analyze: { en: "Analyze with AI", sw: "Chambua na AI" },

  // ─── General ─────────────────────────────────────────────────
  powered_by: { en: "Powered by 30m precision satellite data", sw: "Inatumia data ya satelaiti ya usahihi ya mita 30" },
  all_counties: { en: "All 47 counties", sw: "Kaunti zote 47" },
  learn_more: { en: "Learn more", sw: "Jifunze zaidi" },
  loading: { en: "Loading...", sw: "Inapakia..." },
  error: { en: "Something went wrong", sw: "Kuna tatizo" },
  try_again: { en: "Try again", sw: "Jaribu tena" },
  language: { en: "English", sw: "Kiswahili" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.en ?? key;
}

export function getAllTranslations(lang: Lang): Record<TranslationKey, string> {
  const result = {} as Record<TranslationKey, string>;
  for (const key of Object.keys(translations) as TranslationKey[]) {
    result[key] = translations[key][lang];
  }
  return result;
}

// Fertilizer options (same in both languages)
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

// Crop-specific yield units
export const CROP_UNITS: Record<string, { unit: string; min: number; max: number; def: number }> = {
  Maize: { unit: "Bags/Acre", min: 15, max: 50, def: 30 },
  Beans: { unit: "Bags/Acre", min: 8, max: 20, def: 12 },
  Potato: { unit: "Bags/Acre", min: 200, max: 400, def: 300 },
  Tomato: { unit: "Tons/Acre", min: 10, max: 30, def: 15 },
  "Kale (Sukuma Wiki)": { unit: "Tons/Acre", min: 5, max: 20, def: 10 },
  Wheat: { unit: "Bags/Acre", min: 10, max: 30, def: 20 },
  Sorghum: { unit: "Bags/Acre", min: 10, max: 25, def: 15 },
  Avocado: { unit: "Tons/Acre", min: 5, max: 15, def: 10 },
  Tea: { unit: "kg/Acre", min: 1000, max: 3000, def: 2000 },
  "Coffee (Robusta)": { unit: "Kg/Acre", min: 200, max: 1500, def: 600 },
  "Rice (Lowland/Paddy)": { unit: "Bags/Acre", min: 15, max: 50, def: 30 },
};

// Comparison reasons — bilingual
export const COMPARISON_REASONS: Record<string, { en: string; sw: string }> = {
  P_Deficit_with_CAN: { en: "Lacks phosphorus needed for strong root development.", sw: "Haina fosforasi inayohitajika kwa ukuzaji wa mizizi." },
  N_Deficit_with_DAP: { en: "Lacks sufficient nitrogen for vegetative growth later.", sw: "Haina nitrojeni ya kutosha kwa ukuaji wa baadaye." },
  Low_Density: { en: "Nutrient density is too low for commercial yields.", sw: "Uzito wa virutubisho ni mdogo sana kwa mavuno ya kibiashara." },
  NPK_Generic: { en: "Generic blend. Ratio may not match your exact soil deficit.", sw: "Mchanganyiko wa jumla. Uwiano unaweza usilingane na upungufu wako wa udongo." },
  Optimal: { en: "Soil is optimal; current fertilizer is unnecessary.", sw: "Udongo uko sawa; mbolea ya sasa haihitajiki." },
  Default: { en: "Generally meets requirements.", sw: "Kwa ujumla inakidhi mahitaji." },
  Impact_Optimized: { en: "Optimized recovery", sw: "Uboreshaji uliopangwa" },
  Impact_Variable: { en: "Variable yield", sw: "Mavuno yasiyo na uhakika" },
  Rec_Optimal: { en: "None required (optimal soil)", sw: "Mbolea haihitajiki (udongo uko sawa)" },
  Acidic_with_DAP: { en: "DAP is acidifying. Switch to Mavuno/SSP to protect soil pH.", sw: "DAP inaongeza asidi. Tumia Mavuno/SSP kulinda udongo." },
  Acidic_with_NPK: { en: "Soil is acidic. Mavuno/SSP is safer for long-term health.", sw: "Udongo una asidi. Mavuno/SSP ni salama zaidi kwa afya." },
  K_Deficit_with_DAP: { en: "Lacks potassium (K) detected in your soil.", sw: "Haina potasiamu (K) iliyopatikana kwenye udongo wako." },
  K_Deficit_with_CAN: { en: "Lacks potassium (K) and phosphorus (P).", sw: "Haina potasiamu (K) na fosforasi (P)." },
};
