import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getZones,
  getCountiesByZone,
  computeSoilHealthScore,
  getTopCropsForCounty,
  slugify,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION } from "@/lib/schema";

interface PageProps {
  params: Promise<{ zone: string }>;
}

export async function generateStaticParams() {
  return getZones().map((z) => ({ zone: slugify(z) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zone: slug } = await params;
  const zones = getZones();
  const zone = zones.find((z) => slugify(z) === slug);
  if (!zone) return {};
  const counties = getCountiesByZone(zone);
  return {
    title: `${zone} — Soil Health & Farming Guide | ShambaIQ`,
    description: `${zone} agroecological zone: soil health scores, crop suitability, and fertilizer recommendations for ${counties.length} Kenyan counties.`,
    alternates: { canonical: `https://shambaiq.com/zones/${slug}` },
    openGraph: {
      title: `${zone} — Kenya Agroecological Zone Guide`,
      description: `Soil health data and crop recommendations for ${counties.length} counties in the ${zone} zone.`,
      url: `https://shambaiq.com/zones/${slug}`,
      images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: `${zone} Agroecological Zone Kenya` }],
    },
    twitter: { card: "summary_large_image", title: `${zone} — Farming Guide`, description: `Soil health and crop recommendations for all ${counties.length} counties in ${zone}.`, images: ["https://shambaiq.com/api/og"] },
  };
}

export default async function ZonePage({ params }: PageProps) {
  const { zone: slug } = await params;
  const zones = getZones();
  const zone = zones.find((z) => slugify(z) === slug);
  if (!zone) notFound();

  const counties = getCountiesByZone(zone)
    .map((c) => ({ ...c, score: computeSoilHealthScore(c) }))
    .sort((a, b) => b.score - a.score);

  // Aggregate top crops across zone
  const cropScores: Record<string, number[]> = {};
  counties.forEach((c) => {
    getTopCropsForCounty(c, 5).forEach(({ crop, score }) => {
      if (!cropScores[crop.crop]) cropScores[crop.crop] = [];
      cropScores[crop.crop].push(score);
    });
  });
  const zoneCrops = Object.entries(cropScores)
    .map(([crop, scores]) => ({
      crop,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length,
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${zone} — Kenya Agroecological Zone`,
    description: `${zone} agroecological zone in Kenya, covering ${counties.length} counties.`,
    url: `${BASE_URL}/zones/${slug}`,
    containedInPlace: { "@type": "Country", name: "Kenya", identifier: "KE" },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Zones", item: `${BASE_URL}/zones` },
      { "@type": "ListItem", position: 3, name: zone, item: `${BASE_URL}/zones/${slug}` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[placeSchema, breadcrumbSchema, ORGANIZATION]} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Zones", href: "/zones" },
          { label: zone },
        ]}
      />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        {zone}
      </h1>
      <p className="text-soil-500 mb-10">
        {counties.length} counties in this agroecological zone
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl p-6 border border-cream-300 mb-6">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Counties
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {counties.map((c) => (
                <Link
                  key={c.slug}
                  href={`/soil/${c.slug}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-cream-200 hover:border-gold-400 transition-all group"
                >
                  <div>
                    <span className="font-semibold text-forest-700 group-hover:text-gold-700 transition-colors">
                      {c.county}
                    </span>
                    <span className="block text-xs text-soil-500">
                      pH {c.pH} · N {c.nitrogen} g/kg
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold px-2.5 py-1 rounded-full text-white"
                    style={{
                      backgroundColor:
                        c.score >= 70 ? "#16a34a" : c.score >= 50 ? "#f59e0b" : "#dc2626",
                    }}
                  >
                    {c.score}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section className="bg-white rounded-2xl p-6 border border-cream-300 mb-6">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Top crops for this zone
            </h2>
            <div className="space-y-2">
              {zoneCrops.map((c) => (
                <Link
                  key={c.crop}
                  href={`/crops/${slugify(c.crop)}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-cream-100 text-sm transition-colors"
                >
                  <span className="font-medium text-forest-700">{c.crop}</span>
                  <span className="text-xs font-bold text-gold-700">
                    Avg {c.avg}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <Link
            href="/app"
            className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
          >
            Get advice for this zone →
          </Link>
        </div>
      </div>
    </div>
  );
}
