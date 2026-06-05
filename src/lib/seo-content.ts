// ─────────────────────────────────────────────────────────────────────────────
// ShambaIQ SEO content generators
// Produces UNIQUE, data-driven prose + schema for programmatic pages so that
// each county / crop / ward page is substantively different (not boilerplate).
// This is the main defence against thin/duplicate-content deindexing on the
// ~1,880 county×crop and ~1,450 ward pages.
// ─────────────────────────────────────────────────────────────────────────────

import {
  CountySoil,
  CropEconomics,
  Ward,
  N_THRESHOLDS,
  P_THRESHOLDS,
  K_THRESHOLDS,
} from "./data";
import { BASE_URL, AUTHOR_PERSON, ORGANIZATION, makeFAQSchema } from "./schema";

// ── Small helpers ─────────────────────────────────────────────────────────────

function phClass(pH: number): string {
  if (pH < 5.0) return "strongly acidic";
  if (pH < 5.5) return "moderately acidic";
  if (pH < 6.5) return "slightly acidic to near-neutral";
  if (pH <= 7.3) return "neutral";
  return "alkaline";
}

function scoreBand(score: number): "excellent" | "good" | "moderate" | "poor" {
  if (score >= 75) return "excellent";
  if (score >= 60) return "good";
  if (score >= 45) return "moderate";
  return "poor";
}

function nutrientStatus(value: number, min: number): "adequate" | "marginal" | "deficient" {
  if (value >= min) return "adequate";
  if (value >= min * 0.7) return "marginal";
  return "deficient";
}

function joinNatural(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// ── County × Crop narrative ───────────────────────────────────────────────────
// Returns 2–3 unique sentences that reference this county's actual soil values
// against this crop's actual needs. No two crop/county combinations read alike.

export function countyCropNarrative(
  county: CountySoil,
  crop: CropEconomics,
  score: number,
): string {
  const nMin = N_THRESHOLDS[crop.n_need] ?? 0.8;
  const pMin = P_THRESHOLDS[crop.p_need] ?? 12;
  const kMin = K_THRESHOLDS[crop.k_need] ?? 150;

  const phOk = county.pH >= crop.ph_min && county.pH <= crop.ph_max;
  const phLow = county.pH < crop.ph_min;
  const nStat = nutrientStatus(county.nitrogen, nMin);
  const pStat = nutrientStatus(county.phosphorus, pMin);
  const kStat = nutrientStatus(county.potassium, kMin);
  const band = scoreBand(score);

  const deficits: string[] = [];
  if (nStat !== "adequate") deficits.push("nitrogen");
  if (pStat !== "adequate") deficits.push("phosphorus");
  if (kStat !== "adequate") deficits.push("potassium");

  const textureMatch = crop.pref_texture
    .toLowerCase()
    .split(/[\s,/]+/)
    .some((t) => t && county.texture.toLowerCase().includes(t));

  // Sentence 1 — verdict tied to the real score and pH.
  const verdict: Record<string, string> = {
    excellent: `${county.county} County is well suited to ${crop.crop}, scoring ${score}/100 on ShambaIQ's soil-match model.`,
    good: `${county.county} County is a solid choice for ${crop.crop}, with a soil-match score of ${score}/100.`,
    moderate: `${crop.crop} can be grown in ${county.county} County, but the soil scores ${score}/100 and needs targeted management to reach full potential.`,
    poor: `${county.county} County is a challenging environment for ${crop.crop} (soil-match score ${score}/100) and will need significant amendment before planting.`,
  };

  // Sentence 2 — pH reality.
  const phSentence = phOk
    ? `Local soils average pH ${county.pH} — ${phClass(county.pH)} and inside the ${crop.ph_min}–${crop.ph_max} band ${crop.crop} prefers, so no lime is usually required.`
    : phLow
      ? `At an average pH of ${county.pH} the soil is ${phClass(county.pH)}, below ${crop.crop}'s preferred ${crop.ph_min}–${crop.ph_max} range; agricultural lime will lift pH and unlock phosphorus the crop cannot otherwise access.`
      : `At an average pH of ${county.pH} the soil sits above ${crop.crop}'s preferred ${crop.ph_min}–${crop.ph_max} range, which can limit uptake of phosphorus and micronutrients.`;

  // Sentence 3 — nutrients + texture, naming the actual gaps.
  let nutrientSentence: string;
  if (deficits.length === 0) {
    nutrientSentence = `Nitrogen (${county.nitrogen} g/kg), phosphorus (${county.phosphorus} mg/kg) and potassium (${county.potassium} mg/kg) all meet ${crop.crop}'s requirements, so a maintenance fertilizer programme is enough.`;
  } else {
    nutrientSentence = `The main gap is ${joinNatural(deficits)} — measured at N ${county.nitrogen} g/kg, P ${county.phosphorus} mg/kg, K ${county.potassium} mg/kg against this crop's ${crop.n_need}/${crop.p_need}/${crop.k_need} demand — so the fertilizer plan below prioritises closing ${deficits.length > 1 ? "those deficits" : "that deficit"}.`;
  }

  // Sentence 4 — texture + economics, for body depth.
  const textureSentence = textureMatch
    ? `The county's predominantly ${county.texture.toLowerCase()} soils suit ${crop.crop}, which favours ${crop.pref_texture.toLowerCase()}.`
    : `${crop.crop} prefers ${crop.pref_texture.toLowerCase()} soils, while ${county.county} is largely ${county.texture.toLowerCase()}, so drainage and organic-matter management matter more here.`;

  const revenue = crop.price_per_kg * crop.yield_per_acre;
  const econSentence = `At current prices (about KES ${crop.price_per_kg}/kg) and a typical ${crop.yield_per_acre.toLocaleString()} kg/acre yield, a well-managed ${crop.crop} crop here can gross roughly KES ${revenue.toLocaleString()} per acre.`;

  // Sentence 5 — climate caveat when rainfall or altitude is significantly off.
  let climateSentence = "";
  if (county.rainfall < crop.rain_min * 0.75) {
    climateSentence = `${county.county} receives approximately ${county.rainfall} mm/year — well below ${crop.crop}'s minimum of ${crop.rain_min} mm — so supplemental irrigation would be essential for this crop.`;
  } else if (crop.alt_min > 0 && county.altitude < crop.alt_min * 0.7) {
    climateSentence = `At ${county.altitude} m, the county sits below ${crop.crop}'s preferred altitude range (${crop.alt_min}–${crop.alt_max} m), which limits yield potential due to heat stress.`;
  } else if (county.altitude > crop.alt_max * 1.2) {
    climateSentence = `At ${county.altitude} m, the county sits above ${crop.crop}'s preferred altitude ceiling of ${crop.alt_max} m, where frost risk and cold nights reduce the crop's productivity.`;
  }

  void band; // band already reflected in verdict map
  const parts = [verdict[band], phSentence, nutrientSentence, textureSentence];
  if (climateSentence) parts.push(climateSentence);
  parts.push(econSentence);
  return parts.join(" ");
}

// ── County × Crop FAQ (richer, captures "People Also Ask") ────────────────────

export function countyCropFAQSchema(
  county: CountySoil,
  crop: CropEconomics,
  score: number,
) {
  const phOk = county.pH >= crop.ph_min && county.pH <= crop.ph_max;
  const revenue = crop.price_per_kg * crop.yield_per_acre;
  const band = scoreBand(score);

  return makeFAQSchema([
    {
      question: `Is ${county.county} good for growing ${crop.crop}?`,
      answer: `${county.county} County scores ${score}/100 for ${crop.crop} suitability (${band}). Soil pH is ${county.pH} against a preferred ${crop.ph_min}–${crop.ph_max}, nitrogen ${county.nitrogen} g/kg and phosphorus ${county.phosphorus} mg/kg. County rainfall is ${county.rainfall} mm/year against ${crop.crop}'s ${crop.rain_min}–${crop.rain_max} mm range. ${
        band === "excellent" || band === "good"
          ? `This is a workable match for ${crop.crop}.`
          : `Soil amendments or irrigation may be needed before planting ${crop.crop}.`
      }`,
    },
    {
      question: `What fertilizer is best for ${crop.crop} in ${county.county}?`,
      answer: `Base the plan on ${county.county}'s soil: pH ${county.pH}${
        !phOk ? ` (apply lime to reach ${crop.ph_min}–${crop.ph_max})` : ""
      }, nitrogen ${county.nitrogen} g/kg and phosphorus ${county.phosphorus} mg/kg. Get an exact bag-per-acre basal and top-dressing schedule free at ${BASE_URL}/app.`,
    },
    {
      question: `What soil pH does ${crop.crop} need, and does ${county.county} have it?`,
      answer: `${crop.crop} grows best at pH ${crop.ph_min}–${crop.ph_max}. ${county.county} averages pH ${county.pH}, which is ${
        phOk ? "within that range" : "outside the ideal range and may need lime or sulphur"
      }.`,
    },
    {
      question: `How much can I earn from ${crop.crop} per acre in ${county.county}?`,
      answer: `At roughly KES ${crop.price_per_kg}/kg and an expected ${crop.yield_per_acre.toLocaleString()} kg/acre, gross revenue is about KES ${revenue.toLocaleString()} per acre before input costs. Use the ShambaIQ budget tool for a net figure based on your fertilizer plan.`,
    },
  ]);
}

// ── Dataset schema (Google Dataset Search eligibility) ────────────────────────
// Soil measurements are genuine structured data — eligible for Dataset rich
// results, which almost no Kenyan agri competitor targets.

export function makeSoilDatasetSchema(opts: {
  name: string;
  description: string;
  url: string;
  variables: string[];
  spatialName: string;
  lat?: number;
  lon?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: "en-KE",
    keywords: opts.variables,
    variableMeasured: opts.variables,
    creator: ORGANIZATION,
    publisher: { "@id": `${BASE_URL}/#organization` },
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    spatialCoverage: {
      "@type": "Place",
      name: opts.spatialName,
      ...(opts.lat != null && opts.lon != null
        ? { geo: { "@type": "GeoCoordinates", latitude: opts.lat, longitude: opts.lon } }
        : {}),
    },
  };
}

// ── Ward narrative ────────────────────────────────────────────────────────────

export function wardNarrative(
  county: CountySoil,
  ward: Ward,
  soil: { pH: number; n: number; p: number; k: number },
  topCrops: { crop: CropEconomics; score: number }[],
  isPrecision: boolean,
): string {
  const top = topCrops.slice(0, 3).map((c) => c.crop.crop);
  const lead = `${ward.ward} ward sits in ${ward.subcounty} sub-county, ${county.county} County${
    ward.population > 0 ? `, home to about ${ward.population.toLocaleString()} people` : ""
  }.`;

  const dataSentence = isPrecision
    ? `Soil here is mapped at 30 m resolution: pH ${soil.pH.toFixed(1)} (${phClass(soil.pH)}), nitrogen ${soil.n.toFixed(2)} g/kg, phosphorus ${soil.p.toFixed(1)} mg/kg and potassium ${soil.k.toFixed(1)} mg/kg.`
    : `Working from ${county.county} County soil averages, the profile is pH ${soil.pH.toFixed(1)} (${phClass(soil.pH)}), nitrogen ${soil.n.toFixed(2)} g/kg, phosphorus ${soil.p.toFixed(1)} mg/kg and potassium ${soil.k.toFixed(1)} mg/kg.`;

  const phAdvice =
    soil.pH < 5.5
      ? `The ${phClass(soil.pH)} pH means lime is worth applying before most crops to release locked-up phosphorus.`
      : soil.pH > 7.3
        ? `The ${phClass(soil.pH)} pH can restrict micronutrient uptake, so watch for zinc and iron deficiency.`
        : `That pH suits a broad range of crops without lime.`;

  const cropSentence = top.length
    ? `Based on this soil, the strongest-scoring crops for ${ward.ward} are ${joinNatural(top)} — see the full ranking below.`
    : "";

  return [lead, dataSentence, phAdvice, cropSentence].filter(Boolean).join(" ");
}

// ── Global WebSite + Organization graph (sitelinks search box) ────────────────

export function siteGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ORGANIZATION,
      AUTHOR_PERSON,
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "ShambaIQ",
        description:
          "Precision soil intelligence and free fertilizer plans for Kenyan farmers across all 47 counties.",
        publisher: { "@id": `${BASE_URL}/#organization` },
        inLanguage: "en-KE",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/soil/{search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}
