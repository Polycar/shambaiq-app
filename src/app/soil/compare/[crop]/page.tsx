import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCrops,
  getCropBySlug,
  getTopCountiesForCrop,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION, makeFAQSchema } from "@/lib/schema";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ crop: string }>;
}

export async function generateStaticParams() {
  return getCrops().map((c) => ({ crop: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { crop: slug } = await params;
  const crop = getCropBySlug(slug);
  if (!crop) return {};
  return {
    title: `Best counties to grow ${crop.crop} in Kenya — all 47 ranked`,
    description: `Which county is best for ${crop.crop} farming in Kenya? All 47 counties ranked by soil pH, nutrients, rainfall, and altitude suitability. Click any county for a full fertilizer plan.`,
    alternates: { canonical: `${BASE_URL}/soil/compare/${slug}` },
    openGraph: {
      title: `Best counties for ${crop.crop} in Kenya — soil suitability ranking`,
      description: `Soil suitability scores for ${crop.crop} across all 47 Kenyan counties. Ranked by pH, nutrients, rainfall, and altitude suitability.`,
      url: `${BASE_URL}/soil/compare/${slug}`,
    },
  };
}

export default async function CropCountyComparePage({ params }: PageProps) {
  const { crop: slug } = await params;
  const crop = getCropBySlug(slug);
  if (!crop) notFound();

  const ranked = getTopCountiesForCrop(crop, 47);
  const top3 = ranked.slice(0, 3).map((r) => r.county.county);

  const faqSchema = makeFAQSchema([
    {
      question: `Which county is best for ${crop.crop} farming in Kenya?`,
      answer: `Based on soil and climate suitability analysis, the top counties for ${crop.crop} are ${top3.join(", ")}. Scores combine soil pH, nitrogen, phosphorus, and potassium against ${crop.crop}'s nutrient requirements, plus a rainfall and altitude multiplier that penalises counties outside the crop's climate range.`,
    },
    {
      question: `What soil pH does ${crop.crop} need?`,
      answer: `${crop.crop} grows best between pH ${crop.ph_min} and ${crop.ph_max}. Counties whose soils fall outside this range will need lime (if acidic) or sulphur (if alkaline) before planting.`,
    },
    {
      question: `What is the expected yield per acre for ${crop.crop} in Kenya?`,
      answer: `A well-managed ${crop.crop} crop yields about ${crop.yield_per_acre.toLocaleString()} kg/acre. At a market price of approximately KES ${crop.price_per_kg}/kg, gross revenue per acre is around KES ${(crop.price_per_kg * crop.yield_per_acre).toLocaleString()}.`,
    },
  ]);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${crop.crop} soil suitability by county — Kenya`,
    description: `Soil and climate suitability scores for ${crop.crop} farming across all 47 Kenyan counties, derived from iSDA satellite soil measurements (pH, nitrogen, phosphorus, potassium) plus county rainfall and altitude compared against ${crop.crop}'s optimal growing conditions.`,
    url: `${BASE_URL}/soil/compare/${slug}`,
    inLanguage: "en-KE",
    keywords: [`${crop.crop} Kenya`, `best county for ${crop.crop}`, "soil suitability", "Kenya agriculture"],
    variableMeasured: ["Soil suitability score (0–100)", "Soil pH", "Total Nitrogen (g/kg)", "Extractable Phosphorus (mg/kg)", "Extractable Potassium (mg/kg)", "Rainfall (mm/year)", "Altitude (m)"],
    creator: { "@id": `${BASE_URL}/#organization` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    spatialCoverage: { "@type": "Place", name: "Kenya", geo: { "@type": "GeoShape", box: "-4.7 33.9 4.6 41.9" } },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Soil reports", item: `${BASE_URL}/soil` },
      { "@type": "ListItem", position: 3, name: "County comparison", item: `${BASE_URL}/soil/compare` },
      { "@type": "ListItem", position: 4, name: crop.crop, item: `${BASE_URL}/soil/compare/${slug}` },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[faqSchema, datasetSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Soil reports", href: "/soil" },
          { label: "County comparison", href: "/soil/compare" },
          { label: crop.crop },
        ]}
      />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-3">
        Best counties to grow {crop.crop} in Kenya
      </h1>
      <p className="text-soil-500 max-w-2xl mb-2">
        All 47 counties ranked by soil and climate suitability for {crop.crop} — scored against pH {crop.ph_min}–{crop.ph_max} target,{" "}
        {crop.n_need} nitrogen, {crop.p_need} phosphorus, {crop.k_need} potassium, plus rainfall ({crop.rain_min}–{crop.rain_max} mm) and altitude ({crop.alt_min}–{crop.alt_max} m) requirements.
      </p>
      <p className="text-sm text-soil-400 mb-8">
        Click any county to see the full fertilizer plan, planting calendar, and seed varieties.
      </p>

      {/* Top 3 highlight */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {ranked.slice(0, 3).map(({ county, score }, i) => (
          <Link
            key={county.slug}
            href={`/soil/${county.slug}/${slug}`}
            className="relative bg-white rounded-2xl p-5 border-2 border-gold-300 hover:border-gold-500 transition-all group text-center"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gold-500 text-white text-xs font-bold rounded-full">
              #{i + 1} best
            </span>
            <div className="font-display text-xl font-bold text-forest-700 mt-2 group-hover:text-gold-700 transition-colors">
              {county.county}
            </div>
            <div className="text-xs text-soil-500 mb-3">{county.zone}</div>
            <span
              className="inline-block px-4 py-1 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: score >= 70 ? "#16a34a" : "#f59e0b" }}
            >
              {score}/100
            </span>
          </Link>
        ))}
      </div>

      {/* Full ranking */}
      <section className="bg-white rounded-2xl border border-cream-300 overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-200">
          <h2 className="font-display text-lg font-bold text-forest-700">
            All 47 counties — {crop.crop} suitability ranking
          </h2>
        </div>
        <div className="divide-y divide-cream-100">
          {ranked.map(({ county, score }, i) => (
            <Link
              key={county.slug}
              href={`/soil/${county.slug}/${slug}`}
              className="flex items-center gap-4 px-6 py-3 hover:bg-cream-50 transition-colors group"
            >
              <span className="w-8 text-sm font-bold text-soil-400 shrink-0">
                #{i + 1}
              </span>
              <span className="flex-1">
                <span className="font-semibold text-forest-700 group-hover:text-gold-700 transition-colors">
                  {county.county}
                </span>
                <span className="text-xs text-soil-400 ml-2">{county.zone}</span>
              </span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-cream-200 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${score}%`,
                      backgroundColor: score >= 70 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626",
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white w-12 text-center"
                  style={{
                    backgroundColor: score >= 70 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626",
                  }}
                >
                  {score}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Link
          href={`/crops/${slug}`}
          className="block text-center px-6 py-3 bg-white border border-cream-300 hover:border-gold-400 text-forest-700 font-semibold rounded-xl transition-colors"
        >
          {crop.crop} farming guide →
        </Link>
        <Link
          href={`/app?crop=${encodeURIComponent(crop.crop)}`}
          className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
        >
          Get free fertilizer plan →
        </Link>
      </div>
    </div>
  );
}
