import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCountySoils,
  getCrops,
  getCountyBySlug,
  getCropBySlug,
  scoreCropForCounty,
  N_THRESHOLDS,
  P_THRESHOLDS,
  K_THRESHOLDS,
  getSeedsByCrop,
  getTopDressing,
  getPrices,
  getCropCalendars,
  slugify,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScoreRing from "@/components/ScoreRing";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION } from "@/lib/schema";

const getYieldUnit = (cropName: string) => {
  const c = cropName.toLowerCase();
  if (c.includes("sugarcane") || c.includes("sugar cane")) return "tons/acre";
  if (c.includes("napier") || c.includes("lucerne") || c.includes("fodder")) return "tons/acre";
  if (c.includes("avocado") || c.includes("mango") || c.includes("pixie") || c.includes("orange") || c.includes("apple") || c.includes("macadamia") || c.includes("coconut") || c.includes("pawpaw") || c.includes("banana")) return "tons/acre";
  if (c.includes("cabbage") || c.includes("watermelon") || c.includes("pumpkin")) return "tons/acre";
  if (c.includes("pyrethrum")) return "kg/acre";
  if (c.includes("coffee") || c.includes("tea") || c.includes("sisal")) return "kg/acre";
  return "bags/acre";
};

interface PageProps {
  params: Promise<{ county: string; crop: string }>;
}

// Generate top-10 combos at build; rest rendered on-demand (ISR)
export async function generateStaticParams() {
  const counties = getCountySoils().slice(0, 5);
  const crops = getCrops().slice(0, 2);
  return counties.flatMap((c) =>
    crops.map((cr) => ({ county: c.slug, crop: cr.slug }))
  );
}

export const dynamicParams = true;
export const revalidate = 86400; // re-generate daily

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: cSlug, crop: crSlug } = await params;
  const county = getCountyBySlug(cSlug);
  const crop = getCropBySlug(crSlug);
  if (!county || !crop) return {};
  const score = scoreCropForCounty(county, crop);
  return {
    title: `Growing ${crop.crop} in ${county.county} — Soil Analysis, Fertilizer Plan, Budget`,
    description: `${county.county} County scores ${score}/100 for ${crop.crop}. Precision fertilizer rates, seed varieties, planting calendar, and per-acre budget. Satellite soil data.`,
    alternates: { canonical: `https://shambaiq.com/soil/${cSlug}/${crSlug}` },
    openGraph: {
      title: `${crop.crop} in ${county.county} — ${score}/100 Suitability Score`,
      description: `Soil match analysis, fertilizer plan, and seed varieties for ${crop.crop} in ${county.county} County.`,
      url: `https://shambaiq.com/soil/${cSlug}/${crSlug}`,
      images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: `${crop.crop} farming in ${county.county} County` }],
    },
    twitter: { card: "summary_large_image", title: `${crop.crop} in ${county.county} — ${score}/100 Suitability`, description: `Soil analysis and fertilizer plan for ${crop.crop} in ${county.county} County, Kenya.`, images: ["https://shambaiq.com/api/og"] },
  };
}

export default async function CountyCropPage({ params }: PageProps) {
  const { county: cSlug, crop: crSlug } = await params;
  const county = getCountyBySlug(cSlug);
  const crop = getCropBySlug(crSlug);
  if (!county || !crop) notFound();

  const score = scoreCropForCounty(county, crop);
  const seeds = getSeedsByCrop(crop.crop);
  const topDress = getTopDressing().find(
    (t) => t.crop.toLowerCase() === crop.crop.toLowerCase()
  );
  const prices = getPrices();
  const calendars = getCropCalendars().filter(
    (c) => c.crop.toLowerCase() === crop.crop.toLowerCase()
  );

  const estimatedRevenue = crop.price_per_kg * crop.yield_per_acre;
  const dapPrice = prices.find((p) => p.fertilizer === "DAP");
  const canPrice = prices.find((p) => p.fertilizer === "CAN");

  const phOk = county.pH >= crop.ph_min && county.pH <= crop.ph_max;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${county.county} good for growing ${crop.crop}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${county.county} County scores ${score}/100 for ${crop.crop} suitability. The county has soil pH ${county.pH} (optimal range ${crop.ph_min}–${crop.ph_max}), nitrogen ${county.nitrogen} g/kg, and phosphorus ${county.phosphorus} mg/kg. ${score >= 70 ? `This is a strong match for ${crop.crop}.` : score >= 50 ? `${crop.crop} can be grown with targeted soil management.` : `Significant soil amendments are recommended before planting ${crop.crop}.`}`,
        },
      },
      {
        "@type": "Question",
        name: `What fertilizer should I use for ${crop.crop} in ${county.county}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Fertilizer for ${crop.crop} in ${county.county} should address the county's soil profile: pH ${county.pH}${!phOk ? ` (lime is recommended to reach the target ${crop.ph_min}–${crop.ph_max})` : ""}, nitrogen ${county.nitrogen} g/kg, and phosphorus ${county.phosphorus} mg/kg. Use ShambaIQ's free tool for a precise bag-per-acre plan at shambaiq.com/app.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the soil pH for ${crop.crop} in ${county.county}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${county.county} County has soil pH ${county.pH}. ${crop.crop} requires pH ${crop.ph_min}–${crop.ph_max}. The soil is ${phOk ? "within the optimal pH range for this crop" : "outside the optimal range and may require lime or sulfur amendment"}.`,
        },
      },
    ],
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Soil reports", item: `${BASE_URL}/soil` },
      { "@type": "ListItem", position: 3, name: `${county.county} County`, item: `${BASE_URL}/soil/${cSlug}` },
      { "@type": "ListItem", position: 4, name: crop.crop, item: `${BASE_URL}/soil/${cSlug}/${crSlug}` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[faqSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Soil reports", href: "/soil" },
          { label: county.county, href: `/soil/${county.slug}` },
          { label: crop.crop },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
        <div className="flex-1">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
            Growing {crop.crop} in {county.county}
          </h1>
          <p className="text-soil-500">
            Soil suitability analysis based on {county.county}&apos;s nutrient
            profile
          </p>
          <p className="text-sm text-soil-500 leading-relaxed max-w-3xl mt-4">
            Thinking about growing {crop.crop.toLowerCase()} in {county.county} county? 
            Based on precision satellite soil data, this page analyzes your local soil suitability for {crop.crop.toLowerCase()} farming. 
            Explore our tailored fertilizer recommendations, seed varieties, optimal planting calendar, and a detailed per-acre production budget designed to help you maximize yields.
          </p>
        </div>
        <ScoreRing score={score} label="Suitability score" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Soil match */}
          <section className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Soil match analysis
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-300">
                    <th className="text-left py-2 text-soil-500 font-medium">
                      Nutrient
                    </th>
                    <th className="text-right py-2 text-soil-500 font-medium">
                      {county.county} soil
                    </th>
                    <th className="text-right py-2 text-soil-500 font-medium">
                      {crop.crop} needs
                    </th>
                    <th className="text-right py-2 text-soil-500 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cream-200">
                    <td className="py-3 font-medium text-forest-700">pH</td>
                    <td className="py-3 text-right">{county.pH}</td>
                    <td className="py-3 text-right">
                      {crop.ph_min}–{crop.ph_max}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          county.pH >= crop.ph_min && county.pH <= crop.ph_max
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {county.pH >= crop.ph_min && county.pH <= crop.ph_max
                          ? "OK"
                          : "Adjust"}
                      </span>
                    </td>
                  </tr>
                  {[
                    {
                      label: "Nitrogen",
                      val: county.nitrogen,
                      unit: "g/kg",
                      need: crop.n_need,
                      min: N_THRESHOLDS[crop.n_need] ?? 0.8,
                      ok: county.nitrogen >= (N_THRESHOLDS[crop.n_need] ?? 0.8),
                    },
                    {
                      label: "Phosphorus",
                      val: county.phosphorus,
                      unit: "mg/kg",
                      need: crop.p_need,
                      min: P_THRESHOLDS[crop.p_need] ?? 12,
                      ok: county.phosphorus >= (P_THRESHOLDS[crop.p_need] ?? 12),
                    },
                    {
                      label: "Potassium",
                      val: county.potassium,
                      unit: "mg/kg",
                      need: crop.k_need,
                      min: K_THRESHOLDS[crop.k_need] ?? 150,
                      ok: county.potassium >= (K_THRESHOLDS[crop.k_need] ?? 150),
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-cream-200">
                      <td className="py-3 font-medium text-forest-700">
                        {row.label}
                      </td>
                      <td className="py-3 text-right">
                        {row.val} {row.unit}
                      </td>
                      <td className="py-3 text-right capitalize text-soil-500 text-xs">
                        min {row.min} {row.unit}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            row.ok
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.ok ? "OK" : "Low"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Planting calendar */}
          {calendars.length > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-cream-300">
              <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
                Planting calendar
              </h2>
              {calendars.map((cal) => (
                <div key={cal.season} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-bold text-gold-700 mb-2">
                    {cal.season}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Month 1", val: cal.month1 },
                      { label: "Month 2", val: cal.month2 },
                      { label: "Month 3", val: cal.month3 },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="bg-cream-50 rounded-lg p-3 border border-cream-200"
                      >
                        <div className="text-xs text-soil-500 mb-1">
                          {m.label}
                        </div>
                        <div className="text-sm text-forest-700 font-medium">
                          {m.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Top dressing */}
          {topDress && (
            <section className="bg-white rounded-2xl p-6 border border-cream-300">
              <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
                Top dressing guide
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-cream-50 rounded-lg p-4 border border-cream-200">
                  <div className="text-xs text-soil-500 mb-1">Product</div>
                  <div className="font-semibold text-forest-700">
                    {topDress.product}
                  </div>
                </div>
                <div className="bg-cream-50 rounded-lg p-4 border border-cream-200">
                  <div className="text-xs text-soil-500 mb-1">Timing</div>
                  <div className="font-semibold text-forest-700">
                    {topDress.timing}
                  </div>
                </div>
                <div className="bg-cream-50 rounded-lg p-4 border border-cream-200 sm:col-span-2">
                  <div className="text-xs text-soil-500 mb-1">Instruction</div>
                  <div className="text-sm text-forest-700">
                    {topDress.instruction}
                  </div>
                </div>
                <div className="bg-cream-50 rounded-lg p-4 border border-cream-200">
                  <div className="text-xs text-soil-500 mb-1">
                    Bags per Acre
                  </div>
                  <div className="font-semibold text-forest-700">
                    {topDress.bags_per_acre}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Seeds */}
          {seeds.length > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-cream-300">
              <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
                Recommended seed varieties
              </h2>
              <div className="space-y-3">
                {seeds.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-cream-50 border border-cream-200"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-forest-700">
                        {s.variety}
                      </span>
                      <span className="text-xs bg-forest-100 text-forest-600 px-2 py-0.5 rounded-full">
                        {s.altitude_zone}
                      </span>
                    </div>
                    <div className="text-xs text-soil-500 mb-1">
                      {s.breeder} · {s.maturity_days} days ·{" "}
                      {s.yield_bags} {getYieldUnit(crop.crop)}
                    </div>
                    {s.special && (
                      <div className="text-xs text-soil-500 italic mt-1">
                        {s.special}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Economics card */}
          <div className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Economics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-soil-500">Market price</span>
                <span className="font-semibold text-forest-700">
                  KES {crop.price_per_kg}/kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-soil-500">Expected yield</span>
                <span className="font-semibold text-forest-700">
                  {crop.yield_per_acre.toLocaleString()} kg/acre
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-soil-500">Estimated revenue</span>
                <span className="font-bold text-green-600">
                  KES {estimatedRevenue.toLocaleString()}/acre
                </span>
              </div>
              <hr className="border-cream-200" />
              <div className="flex justify-between text-sm">
                <span className="text-soil-500">Preferred texture</span>
                <span className="font-semibold text-forest-700">
                  {crop.pref_texture}
                </span>
              </div>
            </div>
          </div>

          {/* Fertilizer prices */}
          <div className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Fertilizer prices
            </h2>
            <div className="space-y-2">
              {prices.slice(0, 5).map((p) => (
                <div key={p.fertilizer} className="flex justify-between text-sm">
                  <span className="text-soil-500">{p.fertilizer}</span>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">
                      KES {p.subsidized.toLocaleString()}
                    </span>
                    <span className="text-xs text-soil-300 ml-1">
                      ({p.commercial.toLocaleString()})
                    </span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-soil-300 mt-2">
                Green = subsidized · (Commercial) per 50kg bag
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-forest-700 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-cream-100 mb-4">
              Related
            </h3>
            <div className="space-y-2">
              <Link
                href={`/soil/${county.slug}`}
                className="block text-sm text-cream-300 hover:text-gold-400 transition-colors"
              >
                ← {county.county} full soil report
              </Link>
              <Link
                href={`/crops/${crop.slug}`}
                className="block text-sm text-cream-300 hover:text-gold-400 transition-colors"
              >
                {crop.crop} farming guide →
              </Link>
              <Link
                href={`/dealers/${county.slug}`}
                className="block text-sm text-cream-300 hover:text-gold-400 transition-colors"
              >
                Agrovets in {county.county} →
              </Link>
              <Link
                href={`/app?county=${encodeURIComponent(county.county)}&crop=${encodeURIComponent(crop.crop)}`}
                className="block mt-4 text-center px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-lg text-sm transition-colors"
              >
                Get full advice →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
