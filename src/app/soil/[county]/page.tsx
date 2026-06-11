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
import SoilEmbedCard from "@/components/SoilEmbedCard";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION, makeCountyFAQSchema } from "@/lib/schema";

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
    title: `${county.county} Soil Report — pH, Nitrogen & Phosphorus`,
    description: `${county.county} County soil: pH ${county.pH}, N ${county.nitrogen} g/kg, P ${county.phosphorus} mg/kg. Precision fertilizer recommendations for 40+ crops. Free satellite soil data.`,
    alternates: { canonical: `https://shambaiq.com/soil/${slug}` },
    openGraph: {
      title: `${county.county} County Soil Report`,
      description: `pH ${county.pH} · N ${county.nitrogen} g/kg · P ${county.phosphorus} mg/kg`,
      url: `https://shambaiq.com/soil/${slug}`,
      images: [{ url: `/api/og/county/${slug}`, width: 1200, height: 630, alt: `${county.county} County Soil Report` }],
    },
    twitter: { card: "summary_large_image", title: `${county.county} Soil Report`, description: `pH ${county.pH} · Nitrogen ${county.nitrogen} g/kg · Phosphorus ${county.phosphorus} mg/kg`, images: [`/api/og/county/${slug}`] },
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
  const faqSchema = makeCountyFAQSchema({
    county: county.county,
    pH: county.pH,
    nitrogen: county.nitrogen,
    phosphorus: county.phosphorus,
    potassium: county.potassium,
    zone: county.zone,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Soil reports", item: `${BASE_URL}/soil` },
      { "@type": "ListItem", position: 3, name: county.zone, item: `${BASE_URL}/zones/${slugify(county.zone)}` },
      { "@type": "ListItem", position: 4, name: `${county.county} County`, item: `${BASE_URL}/soil/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd schemas={[faqSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Soil reports", href: "/soil" },
            { label: county.zone, href: `/zones/${slugify(county.zone)}` },
            { label: `${county.county} County` },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-12">
          <div className="flex-1">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
              {county.county} county soil health report
            </h1>
            <p className="text-soil-500 mb-1">
              <span className="font-medium">{county.zone}</span> agroecological
              zone
            </p>
            <p className="text-sm text-soil-300">
              Soil baseline: iSDA Africa · County average
            </p>
          </div>
          <ScoreRing score={score} />
        </div>

        {/* Soil suitability text section */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 mb-8 prose max-w-none">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-4">
            Soil suitability and agriculture in {county.county} County
          </h2>
          <p className="text-soil-500 text-sm leading-relaxed mb-4">
            Understanding the local soil chemistry is essential for optimizing crop yields and selecting the right inputs in <strong>{county.county} County</strong>. Situated within the <strong>{county.zone}</strong> zone, this region features varied soil profiles that directly influence crop suitability. With a recorded average soil pH of <strong>{county.pH}</strong>, farming practices must adapt to balance acidity or alkalinity to ensure optimal plant nutrient availability.
          </p>
          <p className="text-soil-500 text-sm leading-relaxed">
            The major soil type here ranges across different sub-counties, requiring tailored fertilizer applications. For crops in {county.county}, standard DAP or NPK inputs may need to be adjusted based on the nitrogen (recorded at <strong>{county.nitrogen} g/kg</strong>) and extractable phosphorus (recorded at <strong>{county.phosphorus} mg/kg</strong>) levels. In acidic regions, applying agricultural lime is recommended to raise soil pH before planting, unlocking bound nutrients and preventing common yield deficiencies.
          </p>
        </section>

        {/* Nutrient breakdown */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 mb-8">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-6">
            Nutrient breakdown
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
              label="Total nitrogen"
              value={county.nitrogen}
              unit="g/kg"
              type="nitrogen"
              max={2.5}
            />
            <NutrientBar
              label="Extractable phosphorus"
              value={county.phosphorus}
              unit="mg/kg"
              type="phosphorus"
              max={50}
            />
            <NutrientBar
              label="Extractable potassium"
              value={county.potassium}
              unit="mg/kg"
              type="potassium"
              max={500}
            />
            <NutrientBar
              label="Organic carbon"
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
            Best crops for {county.county}
          </h2>
          <p className="text-sm text-soil-500 mb-6">
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
                  <span className="font-semibold text-forest-700 group-hover:text-gold-700 transition-colors">
                    {crop.crop}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor:
                        s >= 70 ? "#16a34a" : s >= 50 ? "#f59e0b" : "#dc2626",
                    }}
                  >
                    {s}
                  </span>
                </div>
                <div className="text-xs text-soil-500">
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
            <p className="text-sm text-soil-500 mb-5">
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
              Neighboring counties
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
                      <span className="text-xs text-soil-500 ml-2">
                        {n.zone}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-forest-600">
                      {nScore}
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
                    className="p-3 rounded-lg bg-cream-50 border border-cream-200 flex justify-between items-start gap-2"
                  >
                    <div>
                      <div className="font-medium text-forest-700 text-sm">
                        {d.name}
                      </div>
                      <div className="text-xs text-soil-500 mt-0.5">{d.town}</div>
                    </div>
                    {d.rating && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-gold-700 shrink-0">
                        ⭐ {d.rating}
                      </span>
                    )}
                  </div>
                ))}
                {dealers.length > 4 && (
                  <Link
                    href={`/dealers/${slug}`}
                    className="text-sm text-gold-700 hover:text-gold-700 font-medium"
                  >
                    View all {dealers.length} dealers →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-soil-500">
                No dealers listed yet.{" "}
                <Link
                  href={`/dealers/${slug}`}
                  className="text-gold-700 hover:underline"
                >
                  View nearby options →
                </Link>
              </p>
            )}
          </section>
        </div>

        {/* Frequently asked questions */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 mb-8">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-forest-700 mb-2 text-base">
                What is the soil pH in {county.county} County?
              </h3>
              <p className="text-soil-500 text-sm leading-relaxed">
                {county.county} County has an average soil pH of {county.pH} ({county.pH < 5.5 ? "strongly acidic" : county.pH < 6.5 ? "moderately acidic to neutral" : "neutral to alkaline"}). {
                  county.pH < 5.5
                    ? "Lime application is strongly recommended before planting most crops to unlock phosphorus availability."
                    : "Most crops perform well at this pH without lime treatment."
                }
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-forest-700 mb-2 text-base">
                What crops grow best in {county.county} County?
              </h3>
              <p className="text-soil-500 text-sm leading-relaxed">
                Based on precision soil mapping data, {county.county} soils have nitrogen at {county.nitrogen} g/kg and phosphorus at {county.phosphorus} mg/kg. Get a full ranked crop suitability list for your specific farm at shambaiq.com/app.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-forest-700 mb-2 text-base">
                What fertilizer should I use in {county.county}?
              </h3>
              <p className="text-soil-500 text-sm leading-relaxed">
                Fertilizer choice depends on your target crop and exact soil conditions. Farms in the {county.zone} zone typically benefit from DAP or NPK compound at planting, followed by CAN top-dressing. Get a precise budget and bag-per-acre plan at shambaiq.com/app.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Embed Widget Generator for Dofollow Backlink growth */}
        <SoilEmbedCard countyName={county.county} countySlug={slug} />

        {/* CTA */}
        <section className="bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">
            Get personalized advice for {county.county}
          </h2>
          <p className="text-cream-400 mb-6 max-w-lg mx-auto">
            Our recommendation engine matches {county.county}&apos;s exact soil
            data against 40+ crops for a full fertilizer plan.
          </p>
          <Link
            href={`/app?county=${encodeURIComponent(county.county)}`}
            className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
          >
            Get free advice →
          </Link>
        </section>
      </div>
    </>
  );
}
