import Link from "next/link";
import { Metadata } from "next";
import { getZones, getCountiesByZone, computeSoilHealthScore, slugify } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Agroecological Zones of Kenya — Soil & Farming Regions",
  description: "Explore Kenya's 7 agroecological zones. Compare soil health and crop suitability across the Central Highlands, Rift Valley, Lake Basin, and more.",
  alternates: { canonical: "https://shambaiq.com/zones" },
  openGraph: {
    title: "Kenya's Agroecological Zones — Soil & Farming Regions",
    description: "Compare soil health, crop suitability, and farming conditions across Central Highlands, Rift Valley, Lake Basin, and 4 more Kenyan zones.",
    url: "https://shambaiq.com/zones",
    images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: "Kenya Agroecological Zones" }],
  },
  twitter: { card: "summary_large_image", title: "Kenya's Agroecological Zones", description: "Soil health and crop suitability across Kenya's 7 agroecological zones.", images: ["https://shambaiq.com/api/og"] },
};

export default function ZonesPage() {
  const zones = getZones();

  const zonesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kenya's Agroecological Zones",
    description: "Kenya's 7 agroecological zones covering all 47 counties.",
    url: `${BASE_URL}/zones`,
    numberOfItems: zones.length,
    itemListElement: zones.map((z, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: z,
      url: `${BASE_URL}/zones/${slugify(z)}`,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[zonesListSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Agroecological Zones" }]} />
      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        Agroecological Zones of Kenya
      </h1>
      <p className="text-soil-500 mb-10 max-w-2xl">
        Kenya&apos;s 47 counties fall across distinct agroecological zones, each
        with unique soil characteristics and farming potential.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {zones.map((z) => {
          const counties = getCountiesByZone(z);
          const avgScore =
            Math.round(
              counties.reduce((s, c) => s + computeSoilHealthScore(c), 0) /
                counties.length
            );
          const avgPH = (
            counties.reduce((s, c) => s + c.pH, 0) / counties.length
          ).toFixed(1);

          return (
            <Link
              key={z}
              href={`/zones/${slugify(z)}`}
              className="bg-white rounded-2xl p-6 border border-cream-300 hover:border-gold-400 hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-display text-xl font-bold text-forest-700 group-hover:text-gold-700 transition-colors">
                  {z}
                </h2>
                <span className="text-sm font-bold text-gold-700">
                  Avg: {avgScore}
                </span>
              </div>
              <div className="text-sm text-soil-500 mb-3">
                {counties.length} counties · Avg pH {avgPH}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {counties.map((c) => (
                  <span
                    key={c.slug}
                    className="text-xs bg-cream-200 text-soil-500 px-2 py-0.5 rounded-full"
                  >
                    {c.county}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
