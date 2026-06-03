import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, computeSoilHealthScore, getZones } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowRight, Layers } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Soil Reports for All 47 Kenyan Counties",
  description:
    "Free soil health reports for every Kenyan county. pH, nitrogen, phosphorus, potassium data from satellite soil mapping. Find the best soil for your crops.",
  alternates: { canonical: "https://shambaiq.com/soil" },
  openGraph: {
    title: "Kenya County Soil Reports — All 47 Counties",
    description: "Free satellite-powered soil health data: pH, nitrogen, phosphorus, and potassium for every Kenyan county.",
    url: "https://shambaiq.com/soil",
    images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: "Kenya Soil Health Reports" }],
  },
  twitter: { card: "summary_large_image", title: "Kenya County Soil Reports", description: "Satellite soil data for all 47 Kenyan counties — pH, N, P, K and crop suitability.", images: ["https://shambaiq.com/api/og"] },
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

  const scoreColor = (s: number) =>
    s >= 70 ? "#16a34a" : s >= 50 ? "#f59e0b" : "#dc2626";

  const total = counties.length;

  const soilListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kenya County Soil Reports",
    description: "Free soil health reports for every Kenyan county. pH, nitrogen, phosphorus, potassium data from satellite soil mapping.",
    url: `${BASE_URL}/soil`,
    numberOfItems: counties.length,
    itemListElement: counties
      .sort((a, b) => a.county.localeCompare(b.county))
      .map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${c.county} County Soil Report`,
        url: `${BASE_URL}/soil/${c.slug}`,
      })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <JsonLd schemas={[soilListSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Soil reports" },
        ]}
      />

      {/* Header */}
      <div className="mb-10 md:mb-14">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-forest-700 mb-3 leading-tight">
          Kenya county soil reports
        </h1>
        <p className="text-soil-500 max-w-2xl text-lg leading-relaxed">
          Explore soil health data for all {total} Kenyan counties. Each report
          includes pH, nitrogen, phosphorus, potassium, and organic carbon levels with
          crop recommendations — powered by 30m precision satellite data.
        </p>
      </div>

      {/* Zone sections */}
      {grouped.map((g) => (
        <section key={g.zone} className="mb-14">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-cream-300">
            <div className="w-9 h-9 rounded-lg bg-forest-700/8 flex items-center justify-center shrink-0">
              <Layers size={16} className="text-forest-600" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-forest-600 leading-tight">
                {g.zone}
              </h2>
              <span className="text-sm text-soil-500">
                {g.counties.length} counties
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {g.counties.map((c) => (
              <Link
                key={c.slug}
                href={`/soil/${c.slug}`}
                className="bg-white rounded-2xl p-5 border border-cream-300 hover:border-gold-400 card-hover group"
              >
                {/* Top row: name + score badge */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-forest-700 group-hover:text-gold-700 transition-colors text-lg leading-tight">
                    {c.county}
                  </h3>
                  <span
                    className="text-sm font-bold px-2.5 py-1 rounded-full text-white shrink-0 ml-2"
                    style={{ backgroundColor: scoreColor(c.score) }}
                  >
                    {c.score}
                  </span>
                </div>

                {/* Nutrient rows with micro-bars */}
                <div className="space-y-2.5">
                  {[
                    { label: "pH", val: String(c.pH), pct: Math.min(100, ((c.pH - 3) / 5) * 100), color: c.pH >= 5.5 && c.pH <= 7.0 ? "#16a34a" : "#f59e0b" },
                    { label: "N", val: `${c.nitrogen} g/kg`, pct: Math.min(100, (c.nitrogen / 2.5) * 100), color: c.nitrogen >= 1.2 ? "#16a34a" : c.nitrogen >= 0.8 ? "#f59e0b" : "#dc2626" },
                    { label: "P", val: `${c.phosphorus} mg/kg`, pct: Math.min(100, (c.phosphorus / 40) * 100), color: c.phosphorus >= 20 ? "#16a34a" : c.phosphorus >= 12 ? "#f59e0b" : "#dc2626" },
                  ].map((n) => (
                    <div key={n.label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-soil-500 font-medium">{n.label}</span>
                        <span className="font-semibold text-forest-700">{n.val}</span>
                      </div>
                      <div className="nutrient-bar">
                        <div className="nutrient-bar-fill" style={{ width: `${n.pct}%`, backgroundColor: n.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* View link */}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gold-700 group-hover:text-gold-500 transition-colors">
                  View report <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
