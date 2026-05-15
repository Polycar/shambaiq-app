import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, computeSoilHealthScore, getZones } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Soil Reports for All 47 Kenyan Counties",
  description:
    "Free soil health reports for every Kenyan county. pH, nitrogen, phosphorus, potassium data from iSDAsoil satellite mapping. Find the best soil for your crops.",
};

export default function SoilDirectoryPage() {
  const counties = getCountySoils();
  const zones = getZones();

  const grouped = zones.map((zone) => ({
    zone,
    counties: counties
      .filter((c) => c.zone === zone)
      .map((c) => ({ ...c, score: computeSoilHealthScore(c) }))
      .sort((a, b) => b.score - a.score),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Soil Reports" },
        ]}
      />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        Kenya County Soil Reports
      </h1>
      <p className="text-soil-400 mb-10 max-w-2xl">
        Explore soil health data for all 47 Kenyan counties. Each report
        includes pH, nitrogen, phosphorus, potassium levels, and crop
        recommendations based on iSDAsoil satellite data.
      </p>

      {grouped.map((g) => (
        <section key={g.zone} className="mb-12">
          <h2 className="font-display text-xl font-bold text-forest-600 mb-4 pb-2 border-b border-cream-300">
            {g.zone}
            <span className="text-sm font-normal text-soil-400 ml-3">
              {g.counties.length} counties
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {g.counties.map((c) => (
              <Link
                key={c.slug}
                href={`/soil/${c.slug}`}
                className="bg-white rounded-xl p-5 border border-cream-300 hover:border-gold-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-forest-700 group-hover:text-gold-600 transition-colors">
                    {c.county}
                  </h3>
                  <span
                    className="text-sm font-bold px-2.5 py-1 rounded-full text-white"
                    style={{
                      backgroundColor:
                        c.score >= 70
                          ? "#16a34a"
                          : c.score >= 50
                          ? "#f59e0b"
                          : "#dc2626",
                    }}
                  >
                    {c.score}
                  </span>
                </div>
                <div className="text-xs text-soil-400 space-y-1">
                  <div className="flex justify-between">
                    <span>pH</span>
                    <span className="font-semibold text-forest-700">{c.pH}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nitrogen</span>
                    <span className="font-semibold text-forest-700">
                      {c.nitrogen} g/kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phosphorus</span>
                    <span className="font-semibold text-forest-700">
                      {c.phosphorus} mg/kg
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
