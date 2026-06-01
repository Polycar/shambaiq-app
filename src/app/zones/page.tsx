import Link from "next/link";
import { Metadata } from "next";
import { getZones, getCountiesByZone, computeSoilHealthScore, slugify } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Agroecological Zones of Kenya — Soil & Farming Regions",
  description:
    "Explore Kenya's 7 agroecological zones. Compare soil health, suitable crops, and farming conditions across Central Highlands, Rift Valley, Lake Victoria Basin and more.",
  alternates: { canonical: "https://shambaiq.com/zones" },
};

export default function ZonesPage() {
  const zones = getZones();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Agroecological Zones" }]} />
      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        Agroecological Zones of Kenya
      </h1>
      <p className="text-soil-400 mb-10 max-w-2xl">
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
                <h2 className="font-display text-xl font-bold text-forest-700 group-hover:text-gold-600 transition-colors">
                  {z}
                </h2>
                <span className="text-sm font-bold text-gold-600">
                  Avg: {avgScore}
                </span>
              </div>
              <div className="text-sm text-soil-400 mb-3">
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
