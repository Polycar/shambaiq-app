import Link from "next/link";
import {
  Heart, Wheat, Users, Leaf, TreePine,
  TrendingUp, MapPin, Sprout, BarChart3, Globe,
} from "lucide-react";
import { getCountySoils, getCrops, getWards } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

const SDGs = [
  {
    number: 1,
    title: "No Poverty",
    color: "#E5243B",
    icon: Heart,
    headline: "Reducing wasted input spend",
    description:
      "Kenyan smallholder farmers spend an average of KES 8,000–15,000 per acre on fertilizer each season. Without soil data, many buy the wrong type — DAP on acidic soil locks phosphorus, wasting up to 40% of the investment. ShambaIQ's precision recommendations match fertilizer to actual soil chemistry, saving farmers KES 2,000–5,000 per acre per season.",
    metrics: [
      { label: "Counties with acidic soil needing Mavuno instead of DAP", value: "15" },
      { label: "Potential savings per acre per season", value: "KES 3,000+" },
      { label: "Counties with alkaline soil needing different strategy", value: "7" },
    ],
    links: [
      { text: "See which counties need Mavuno, not DAP", href: "/blog/kakamega-soil-western-kenya-mavuno" },
      { text: "Fertilizer cost comparison", href: "/blog/dap-vs-can-vs-npk-fertilizer-guide-kenya" },
    ],
  },
  {
    number: 2,
    title: "Zero Hunger",
    color: "#DDA63A",
    icon: Wheat,
    headline: "Higher yields through soil intelligence",
    description:
      "When farmers know their soil's exact nutrient gaps, they can target interventions precisely. A farmer in Nakuru with pH 6.28 and adequate phosphorus doesn't need DAP — they need CAN for nitrogen top dressing. This targeted approach increases yield by 20–40% compared to blanket fertilizer application, producing more food from the same land.",
    metrics: [
      { label: "Crops with precision recommendations", value: "25" },
      { label: "Counties with complete soil profiles", value: "47" },
      { label: "Wards with precision data", value: "1,450+" },
    ],
    links: [
      { text: "Complete maize farming guide", href: "/blog/complete-maize-farming-guide-kenya" },
      { text: "Fertilizer rates for 25 crops", href: "/blog/how-much-fertilizer-per-acre-kenya-calculator" },
    ],
  },
  {
    number: 5,
    title: "Gender Equality",
    color: "#FF3A21",
    icon: Users,
    headline: "Removing barriers for women farmers",
    description:
      "Women make up over 60% of Kenya's smallholder farmers but face disproportionate barriers to agricultural advice. Extension officer visits are infrequent and often reach male household heads. Agrovet shops in market towns require travel and cash. ShambaIQ delivers the same precision advice through any phone — free, bilingual (English and Kiswahili), and accessible from the shamba itself.",
    metrics: [
      { label: "Cost to access soil advice", value: "Free" },
      { label: "Languages supported", value: "2 (EN + SW)" },
      { label: "Minimum technology required", value: "Any phone with browser" },
    ],
    links: [
      { text: "Get free soil advice", href: "/app" },
      { text: "All 47 county soil reports", href: "/soil" },
    ],
  },
  {
    number: 13,
    title: "Climate Action",
    color: "#3F7E44",
    icon: Leaf,
    headline: "Data-driven climate-smart farming",
    description:
      "Over-application of synthetic nitrogen fertilizer produces nitrous oxide (N₂O), a greenhouse gas 300 times more potent than CO₂. By calculating the exact nitrogen gap for each county and crop, ShambaIQ prevents over-application — farmers buy only what the soil needs. Our intercropping recommendations promote live mulch systems that reduce soil temperature, conserve moisture, and build soil organic carbon.",
    metrics: [
      { label: "N₂O reduction from precision N application", value: "Up to 30%" },
      { label: "Soil moisture savings from intercrop mulch", value: "Up to 40%" },
      { label: "Intercropping systems by agroecological zone", value: "8+" },
    ],
    links: [
      { text: "Semi-arid farming guide", href: "/blog/farming-semi-arid-kenya-machakos-makueni-kitui" },
      { text: "Why soil acidity matters", href: "/blog/why-your-soil-is-acidic-kenya" },
    ],
  },
  {
    number: 15,
    title: "Life on Land",
    color: "#56C02B",
    icon: TreePine,
    headline: "Monitoring soil health to prevent degradation",
    description:
      "Soil degradation affects 33% of Kenya's arable land. Without monitoring, farmers don't know their soil is declining until yields collapse. ShambaIQ tracks five key soil parameters (pH, nitrogen, phosphorus, potassium, organic carbon) for every county using iSDAsoil satellite data at 30-metre resolution. This creates a national baseline that makes soil degradation visible and actionable.",
    metrics: [
      { label: "Soil parameters monitored", value: "5" },
      { label: "Satellite resolution", value: "30 metres" },
      { label: "Counties below critical organic carbon", value: "12" },
    ],
    links: [
      { text: "2026 county soil rankings", href: "/blog/kenya-county-soil-rankings-2026" },
      { text: "Explore all county soil reports", href: "/soil" },
    ],
  },
];

export default function ImpactPage() {
  const counties = getCountySoils();
  const crops = getCrops();
  const wards = getWards();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ShambaIQ Impact — Sustainable Development Goals",
    author: { "@type": "Organization", name: "ShambaIQ" },
    datePublished: "2026-05-01",
    dateModified: "2026-05-31",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Our Impact" }]} />

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-700/10 rounded-full text-forest-700 text-sm font-medium mb-6">
            <Globe size={16} />
            UN Sustainable Development Goals
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-forest-700 mb-4">
            Precision agriculture for
            <br />
            <span className="text-gold-600">sustainable impact</span>
          </h1>
          <p className="text-soil-400 text-lg leading-relaxed max-w-2xl mx-auto">
            ShambaIQ contributes to 5 UN Sustainable Development Goals by making
            satellite soil data free and accessible to every Kenyan farmer.
          </p>
        </div>

        {/* Coverage stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: MapPin, value: counties.length.toString(), label: "Counties covered", color: "#16a34a" },
            { icon: Sprout, value: crops.length.toString(), label: "Crops analyzed", color: "#C8860A" },
            { icon: BarChart3, value: wards.length.toLocaleString(), label: "Wards mapped", color: "#2563eb" },
            { icon: TrendingUp, value: "Free", label: "Cost to farmers", color: "#dc2626" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-cream-300 text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                  <Icon size={24} style={{ color: s.color }} />
                </div>
                <div className="font-display text-2xl font-bold text-forest-700">{s.value}</div>
                <div className="text-xs text-soil-400 mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* SDG sections */}
        <div className="space-y-8">
          {SDGs.map((sdg) => {
            const Icon = sdg.icon;
            return (
              <section
                key={sdg.number}
                className="bg-white rounded-2xl border border-cream-300 overflow-hidden"
              >
                {/* SDG header bar */}
                <div className="flex items-center gap-4 p-6 pb-0">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: sdg.color }}
                  >
                    <span className="text-white font-bold text-lg">{sdg.number}</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: sdg.color }}>
                      SDG {sdg.number}
                    </div>
                    <h2 className="font-display text-xl font-bold text-forest-700">{sdg.title}</h2>
                  </div>
                </div>

                <div className="p-6">
                  {/* Headline */}
                  <h3 className="font-display text-lg font-semibold text-forest-700 mb-3">
                    {sdg.headline}
                  </h3>

                  {/* Description */}
                  <p className="text-soil-400 leading-relaxed mb-6">{sdg.description}</p>

                  {/* Metrics */}
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    {sdg.metrics.map((m) => (
                      <div key={m.label} className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                        <div className="font-display text-xl font-bold text-forest-700">{m.value}</div>
                        <div className="text-xs text-soil-400 mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Related links */}
                  <div className="flex flex-wrap gap-2">
                    {sdg.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm px-4 py-2 rounded-lg border border-cream-300 hover:border-gold-400 text-forest-700 hover:text-gold-600 transition-colors"
                      >
                        {link.text} →
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Data sources */}
        <section className="mt-16 bg-cream-100 rounded-2xl p-8">
          <h2 className="font-display text-2xl font-bold text-forest-700 mb-4 text-center">Our data sources</h2>
          <p className="text-soil-400 text-center mb-8 max-w-xl mx-auto">
            ShambaIQ is built on open, peer-reviewed geospatial datasets — not proprietary data behind paywalls.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="font-display font-bold text-forest-700 mb-1">iSDAsoil</div>
              <p className="text-xs text-soil-400">30m resolution soil maps for Africa. pH, nitrogen, phosphorus, potassium, organic carbon. Machine learning predictions trained on 100,000+ soil samples.</p>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-forest-700 mb-1">ISRIC SoilGrids</div>
              <p className="text-xs text-soil-400">250m global soil data. Provides fallback for pH, nitrogen, and organic carbon when iSDA is unavailable.</p>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-forest-700 mb-1">Open-Meteo</div>
              <p className="text-xs text-soil-400">7-day weather forecasts with agronomic interpretation. Identifies safe fertilizer application windows based on rainfall predictions.</p>
            </div>
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="mt-12 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">
            Partner with us
          </h2>
          <p className="text-cream-400 mb-6 max-w-lg mx-auto">
            We&apos;re looking for development partners, county governments, and agricultural organizations
            who want to bring precision soil data to Kenyan farmers at scale.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="mailto:andabwa0@gmail.com"
              className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
            >
              Get in Touch →
            </a>
            <Link
              href="/app"
              className="px-8 py-3 bg-cream-200/10 hover:bg-cream-200/20 text-cream-200 font-semibold rounded-xl transition-colors border border-cream-200/20"
            >
              Try ShambaIQ Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
