import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCountySoils,
  getCountyBySlug,
  computeSoilHealthScore,
  getTopCropsForCounty,
  getNeighboringCounties,
  getDealersByCounty,
  getWardsByCounty,
  getSubcountiesByCounty,
  slugify,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScoreRing from "@/components/ScoreRing";
import NutrientBar from "@/components/NutrientBar";
import CollapsibleWards from "@/components/CollapsibleWards";

interface PageProps {
  params: Promise<{ county: string }>;
}

export async function generateStaticParams() {
  return getCountySoils().map((c) => ({ county: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) return {};
  return {
    title: `${county.county} County Soil Health Report 2026 — pH, Nitrogen, Phosphorus`,
    description: `${county.county} soil analysis: pH ${county.pH}, Nitrogen ${county.nitrogen} g/kg, Phosphorus ${county.phosphorus} mg/kg. Get precision fertilizer recommendations for 25 crops. Free soil data from iSDAsoil satellite mapping.`,
    openGraph: {
      title: `${county.county} County Soil Report`,
      description: `pH ${county.pH} · N ${county.nitrogen} g/kg · P ${county.phosphorus} mg/kg`,
      images: [`/api/og/county/${slug}`],
    },
    alternates: {
      languages: { sw: `/sw/udongo/${slug}` },
    },
  };
}

export default async function CountySoilPage({ params }: PageProps) {
  const { county: slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const score = computeSoilHealthScore(county);
  const topCrops = getTopCropsForCounty(county, 8);
  const neighbors = getNeighboringCounties(county, 3);
  const dealers = getDealersByCounty(county.county);
  const subcounties = getSubcountiesByCounty(county.county);
  const wards = getWardsByCounty(county.county);

  // FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the soil pH in ${county.county} County?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${county.county} County has an average soil pH of ${county.pH}, which is in the ${county.zone} agroecological zone.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the best crops to grow in ${county.county}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on soil analysis, the top crops for ${county.county} include ${topCrops
            .slice(0, 5)
            .map((c) => c.crop.crop)
            .join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What fertilizer is recommended for ${county.county} County?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Fertilizer recommendations depend on the crop. Use ShambaIQ's recommendation tool for a personalized plan based on ${county.county}'s soil data.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Soil Reports", href: "/soil" },
            { label: county.zone, href: `/zones/${slugify(county.zone)}` },
            { label: `${county.county} County` },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-12">
          <div className="flex-1">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
              {county.county} County Soil Health Report
            </h1>
            <p className="text-soil-400 mb-1">
              <span className="font-medium">{county.zone}</span> agroecological
              zone
            </p>
            <p className="text-sm text-soil-300">
              Data: iSDAsoil 30m satellite mapping · Updated 2026
            </p>
          </div>
          <ScoreRing score={score} />
        </div>

        {/* Nutrient breakdown */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 mb-8">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-6">
            Nutrient Breakdown
          </h2>
          <div className="space-y-5">
            <NutrientBar
              label="pH"
              value={county.pH}
              unit=""
              type="ph"
              max={10}
            />
            <NutrientBar
              label="Total Nitrogen"
              value={county.nitrogen}
              unit="g/kg"
              type="nitrogen"
              max={2.5}
            />
            <NutrientBar
              label="Extractable Phosphorus"
              value={county.phosphorus}
              unit="mg/kg"
              type="phosphorus"
              max={50}
            />
            <NutrientBar
              label="Extractable Potassium"
              value={county.potassium}
              unit="mg/kg"
              type="potassium"
              max={500}
            />
            <NutrientBar
              label="Organic Carbon"
              value={county.organicCarbon}
              unit="g/kg"
              type="oc"
              max={35}
            />
          </div>
        </section>

        {/* Best crops */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 mb-8">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-2">
            Best Crops for {county.county}
          </h2>
          <p className="text-sm text-soil-400 mb-6">
            Scored against {county.county}&apos;s soil nutrients
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {topCrops.map(({ crop, score: s }) => (
              <Link
                key={crop.slug}
                href={`/soil/${slug}/${crop.slug}`}
                className="rounded-xl border border-cream-300 hover:border-gold-400 p-4 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-forest-700 group-hover:text-gold-600 transition-colors">
                    {crop.crop}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor:
                        s >= 70 ? "#16a34a" : s >= 50 ? "#f59e0b" : "#dc2626",
                    }}
                  >
                    {s}/100
                  </span>
                </div>
                <div className="text-xs text-soil-400">
                  {crop.pref_texture} · KES {crop.price_per_kg}/kg
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Wards (sub-county drill-down) */}
        {wards.length > 0 && (
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 mb-8">
            <h2 className="font-display text-xl font-bold text-forest-700 mb-2">
              Wards in {county.county}
            </h2>
            <p className="text-sm text-soil-400 mb-5">
              {wards.length} wards across {subcounties.length} sub-counties — tap to expand
            </p>
            <CollapsibleWards
              countySlug={slug}
              subcounties={subcounties}
              wards={wards.map((w) => ({ ward: w.ward, slug: slugify(w.ward), subcounty: w.subcounty }))}
            />
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Neighbors */}
          <section className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Neighboring Counties
            </h2>
            <div className="space-y-3">
              {neighbors.map((n) => {
                const nScore = computeSoilHealthScore(n);
                return (
                  <Link
                    key={n.slug}
                    href={`/soil/${n.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-cream-100 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-forest-700">
                        {n.county}
                      </span>
                      <span className="text-xs text-soil-400 ml-2">
                        {n.zone}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-forest-600">
                      {nScore}/100
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Dealers */}
          <section className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Agrovets in {county.county}
            </h2>
            {dealers.length > 0 ? (
              <div className="space-y-3">
                {dealers.slice(0, 4).map((d, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-cream-50 border border-cream-200"
                  >
                    <div className="font-medium text-forest-700 text-sm">
                      {d.name}
                    </div>
                    <div className="text-xs text-soil-400">{d.town}</div>
                  </div>
                ))}
                {dealers.length > 4 && (
                  <Link
                    href={`/dealers/${slug}`}
                    className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                  >
                    View all {dealers.length} dealers →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-soil-400">
                No dealers listed yet.{" "}
                <Link
                  href={`/dealers/${slug}`}
                  className="text-gold-600 hover:underline"
                >
                  View nearby options →
                </Link>
              </p>
            )}
          </section>
        </div>

        {/* CTA */}
        <section className="bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">
            Get personalized advice for {county.county}
          </h2>
          <p className="text-cream-400 mb-6 max-w-lg mx-auto">
            Our recommendation engine matches {county.county}&apos;s exact soil
            data against 25 crops for a full fertilizer plan.
          </p>
          <Link
            href="/app"
            className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
          >
            Get Free Advice →
          </Link>
        </section>
      </div>
    </>
  );
}
