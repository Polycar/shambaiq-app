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
    title: "No poverty",
    color: "#E5243B",
    icon: Heart,
    headline: "Reducing wasted input spend",
    description:
      "Kenyan smallholder farmers spend an average of KES 8,000–15,000 per acre on fertilizer each season. Without soil data, many buy the wrong type — DAP on acidic soil locks phosphorus, wasting up to 40% of the investment. ShambaIQ's precision recommendations match fertilizer to actual soil chemistry, saving farmers KES 2,000–5,000 per acre per season.",
    metrics: [
      { label: "Acidic soil counties needing Mavuno instead of DAP", value: "15" },
      { label: "Potential savings per acre per season", value: "KES 3,000+" },
      { label: "Alkaline soil counties needing different strategy", value: "7" },
    ],
    links: [
      { text: "See which counties need Mavuno, not DAP", href: "/blog/kakamega-soil-western-kenya-mavuno" },
      { text: "Fertilizer cost comparison", href: "/blog/dap-vs-can-vs-npk-fertilizer-guide-kenya" },
    ],
  },
  {
    number: 2,
    title: "Zero hunger",
    color: "#DDA63A",
    icon: Wheat,
    headline: "Higher yields through soil intelligence",
    description:
      "When farmers know their soil's exact nutrient gaps, they can target interventions precisely. A farmer in Nakuru with pH 6.28 and adequate phosphorus doesn't need DAP — they need CAN for nitrogen top dressing. This targeted approach increases yield by 20–40% compared to blanket fertilizer application, producing more food from the same land.",
    metrics: [
      { label: "Crops with precision recommendations", value: "40" },
      { label: "Counties with complete soil profiles", value: "47" },
      { label: "Wards with precision data", value: "1,450+" },
    ],
    links: [
      { text: "Complete maize farming guide", href: "/blog/complete-maize-farming-guide-kenya" },
      { text: "Fertilizer rates for 40 crops", href: "/blog/how-much-fertilizer-per-acre-kenya-calculator" },
    ],
  },
  {
    number: 5,
    title: "Gender equality",
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
    title: "Climate action",
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
    title: "Life on land",
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

      {/* Decorative Radial Background */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.06),transparent_60%)] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Our impact" }]} />

        {/* Hero Banner Section */}
        <div className="text-center mt-12 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-700/10 border border-forest-700/10 rounded-full text-forest-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Globe size={14} className="text-gold-500" />
            UN sustainable development goals
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-forest-800 tracking-tight leading-[1.1] mb-6">
            Precision agriculture for
            <br />
            <span className="bg-gradient-to-r from-forest-700 via-gold-600 to-forest-800 bg-clip-text text-transparent">
              sustainable impact
            </span>
          </h1>
          
          <p className="text-soil-500 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            ShambaIQ contributes to 5 UN Sustainable Development Goals by making
            high-resolution satellite soil data free and accessible to every Kenyan farmer.
          </p>

          {/* Quick Jump Link index */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8 max-w-3xl mx-auto">
            {SDGs.map(sdg => {
              const Icon = sdg.icon;
              return (
                <a 
                  key={sdg.number}
                  href={`#sdg-${sdg.number}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-cream-300 hover:border-gold-400 hover:bg-white text-xs font-bold text-forest-700 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <Icon size={12} style={{ color: sdg.color }} />
                  Goal {sdg.number}: {sdg.title}
                </a>
              );
            })}
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: MapPin, value: counties.length.toString(), label: "Counties covered", color: "#16a34a" },
            { icon: Sprout, value: crops.length.toString(), label: "Crops analyzed", color: "#C8860A" },
            { icon: BarChart3, value: wards.length.toLocaleString(), label: "Wards mapped", color: "#2563eb" },
            { icon: TrendingUp, value: "Free", label: "Cost to farmers", color: "#dc2626" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.label} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-cream-300/80 text-center hover:border-gold-400/60 hover:-translate-y-1 hover:shadow-md hover:shadow-cream-200/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${s.color}12` }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <div className="font-display text-3xl font-extrabold text-forest-700 tracking-tight">{s.value}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-soil-500 mt-1.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* SDG Section Cards */}
        <div className="space-y-10">
          {SDGs.map((sdg) => {
            const Icon = sdg.icon;
            return (
              <section
                id={`sdg-${sdg.number}`}
                key={sdg.number}
                className="bg-white/85 backdrop-blur-md rounded-3xl border border-cream-300/80 overflow-hidden hover:border-gold-400/60 hover:shadow-xl hover:shadow-cream-200/40 hover:-translate-y-0.5 transition-all duration-300 group scroll-mt-6"
              >
                {/* Brand Header */}
                <div className="flex items-center gap-4 p-6 pb-2">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: sdg.color }}
                  >
                    {/* Inner glowing element */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-white font-extrabold text-2xl relative z-10">{sdg.number}</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: sdg.color }}>
                      Goal {sdg.number}
                    </div>
                    <h2 className="font-display text-2xl font-black text-forest-700 tracking-tight">{sdg.title}</h2>
                  </div>
                </div>

                <div className="p-6">
                  {/* Headline Statement */}
                  <h3 className="font-display text-lg font-bold text-forest-700 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded bg-gold-500" />
                    {sdg.headline}
                  </h3>

                  {/* Body Text */}
                  <p className="text-soil-500 leading-relaxed font-medium mb-6 text-sm md:text-[15px]">
                    {sdg.description}
                  </p>

                  {/* Frosted Metrics Grid */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {sdg.metrics.map((m) => (
                      <div 
                        key={m.label} 
                        className="bg-cream-50/60 backdrop-blur-sm rounded-2xl p-5 border border-cream-200/80 hover:bg-cream-100/50 hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="font-display text-2xl font-extrabold text-forest-700 tracking-tight">{m.value}</div>
                        <div className="text-[11px] font-bold text-soil-500 mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Clean CTA Capsule Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {sdg.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-xs font-bold px-4 py-2.5 rounded-xl border border-cream-300 text-forest-800 bg-white hover:bg-gold-500 hover:text-white hover:border-gold-500 hover:shadow-sm transition-all duration-300 flex items-center gap-1.5"
                      >
                        {link.text} 
                        <span className="font-light text-soil-500 group-hover:text-white">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Data Sources Grid Section */}
        <section className="mt-20 bg-cream-100/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-cream-200">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-extrabold text-forest-700 tracking-tight mb-3">Our data sources</h2>
            <p className="text-soil-500 max-w-xl mx-auto font-medium text-sm leading-relaxed">
              ShambaIQ is entirely built on open, peer-reviewed geospatial and meteorological datasets — not proprietary data locked behind high paywalls.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "iSDAsoil", desc: "30-metre high-resolution soil maps for Africa. Monitors pH, nitrogen, phosphorus, potassium, and organic carbon. Built using machine learning models trained on 100,000+ localized soil samples." },
              { title: "ISRIC SoilGrids", desc: "250-metre global standardized soil databases. Provides secondary verification and robust fallback parameters when localized maps require broad calibration." },
              { title: "Open-Meteo", desc: "Premium agronomic weather telemetry and 7-day predictive rainfall models. Dynamically calculates optimal application windows to prevent fertilizer runoff." }
            ].map(source => (
              <div 
                key={source.title} 
                className="bg-white/80 rounded-2xl p-6 border border-cream-200 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              >
                <div className="font-display font-extrabold text-forest-700 mb-2.5 text-base">{source.title}</div>
                <p className="text-xs text-soil-500 leading-relaxed font-medium">{source.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partnership Radially Gradiented CTA */}
        <section className="mt-12 bg-gradient-to-br from-forest-800 to-forest-950 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden group">
          {/* Inner Light Flare effect */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.12),transparent_60%)] pointer-events-none" />
          
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-cream-100 tracking-tight leading-tight mb-4 relative z-10">
            Partner with us
          </h2>
          
          <p className="text-cream-400 mb-8 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium relative z-10">
            We are actively looking for development partners, county agronomists, and non-profit organizations
            who want to scale precision soil science and agricultural security for smallholder farmers.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <a
              href="mailto:info@shambaiq.com"
              className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-white font-extrabold rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-gold-600/20 hover:-translate-y-0.5"
            >
              Get in touch →
            </a>
            <Link
              href="/app"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-cream-200 font-bold rounded-xl transition-all duration-300 border border-white/20 hover:-translate-y-0.5"
            >
              Try ShambaIQ free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
