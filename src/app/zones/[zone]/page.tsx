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
    title: `${zone} — Soil Health & Farming Guide`,
    description: `${zone} agroecological zone covers ${counties.length} Kenyan counties: ${counties.map((c) => c.county).join(", ")}. Explore soil data and crop recommendations.`,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
      <p className="text-soil-400 mb-10">
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
                    <span className="font-semibold text-forest-700 group-hover:text-gold-600 transition-colors">
                      {c.county}
                    </span>
                    <span className="block text-xs text-soil-400">
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
              Top Crops for this Zone
            </h2>
            <div className="space-y-2">
              {zoneCrops.map((c) => (
                <Link
                  key={c.crop}
                  href={`/crops/${slugify(c.crop)}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-cream-100 text-sm transition-colors"
                >
                  <span className="font-medium text-forest-700">{c.crop}</span>
                  <span className="text-xs font-bold text-gold-600">
                    Avg {c.avg}/100
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <Link
            href="/app"
            className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
          >
            Get Advice for This Zone →
          </Link>
        </div>
      </div>
    </div>
  );
}
