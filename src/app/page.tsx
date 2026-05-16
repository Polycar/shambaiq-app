import Link from "next/link";
import {
  MapPin,
  Sprout,
  ClipboardCheck,
  Wheat,
  BarChart3,
  Camera,
  Store,
  Layers,
} from "lucide-react";
import {
  getCountySoils,
  getCrops,
  getZones,
  computeSoilHealthScore,
  getWards,
} from "@/lib/data";

export default function HomePage() {
  const counties = getCountySoils();
  const crops = getCrops();
  const zones = getZones();
  const wardCount = getWards().length;

  const topCounties = counties
    .map((c) => ({ ...c, score: computeSoilHealthScore(c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-forest-700 via-[#1e4620] to-forest-700 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C8860A" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              Powered by iSDAsoil 30m satellite data
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-cream-100 leading-tight mb-6">
              Know your soil.
              <br />
              <span className="text-gold-400">Grow with precision.</span>
            </h1>
            <p className="text-lg md:text-xl text-cream-300 mb-10 leading-relaxed max-w-2xl">
              Free soil analysis, fertilizer plans, and crop recommendations for
              all 47 Kenyan counties. Data-driven farming for every shamba.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/app"
                className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-all hover:scale-[1.02] shadow-lg shadow-gold-500/25"
              >
                Get Free Advice →
              </Link>
              <Link
                href="/soil"
                className="px-8 py-3.5 bg-cream-200/10 hover:bg-cream-200/20 text-cream-200 font-semibold rounded-xl text-lg transition-colors border border-cream-200/20"
              >
                Explore Counties
              </Link>
            </div>
          </div>

          {/* Stats bar — bold green */}
          <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6 max-w-2xl">
            {[
              { n: "47", label: "Counties" },
              { n: "25", label: "Crops" },
              { n: wardCount.toLocaleString(), label: "Wards" },
              { n: "Free", label: "Forever" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-extrabold text-gold-400">
                  {s.n}
                </div>
                <div className="text-sm text-cream-300 mt-1 font-medium tracking-wide uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards — Lucide icons + green left border */}
      <section className="py-12 md:py-16 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-700 text-center mb-4">
            Everything your shamba needs
          </h2>
          <p className="text-center text-soil-400 mb-12 max-w-xl mx-auto">
            Soil reports, fertilizer plans, yield tracking, and crop disease diagnosis — all in one place
          </p>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
            {([
              { icon: Sprout, title: "Soil & Crop Advice", desc: "Precision fertilizer recommendations matched to your county\u2019s soil chemistry. iSDAsoil data at 30m resolution.", href: "/app", color: "#16a34a" },
              { icon: BarChart3, title: "Yield Tracker", desc: "Log your harvest season by season. Track how precision farming improves your yield over time.", href: "/yields", color: "#2563eb" },
              { icon: Camera, title: "Plant Doctor", desc: "Snap a photo of a sick leaf. AI-powered pest and disease diagnosis with localized treatment advice.", href: "/doctor", color: "#dc2626" },
              { icon: Store, title: "Find Agrovets", desc: "Locate nearby input suppliers by county. Phone numbers, stock lists, and directions to your nearest dealer.", href: "/dealers", color: "#C8860A" },
            ] as const).map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} className="min-w-[85vw] sm:min-w-[300px] md:min-w-0 snap-center bg-white rounded-2xl p-6 border-l-4 shadow-sm hover:shadow-md transition-all group" style={{ borderLeftColor: card.color }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${card.color}15` }}>
                    <Icon size={24} strokeWidth={1.8} style={{ color: card.color }} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest-700 mb-2 group-hover:text-gold-600 transition-colors">{card.title}</h3>
                  <p className="text-sm text-soil-400 leading-relaxed">{card.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-700 text-center mb-4">How ShambaIQ works</h2>
          <p className="text-center text-soil-400 mb-10 md:mb-14 max-w-xl mx-auto">From satellite to shamba in three steps</p>
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
            {([
              { step: "01", title: "Select your county", desc: "Choose from 47 counties and 1,450 wards. We fetch soil data from iSDAsoil satellite mapping at 30-metre resolution.", icon: MapPin },
              { step: "02", title: "Pick your crop", desc: "25 crops analyzed against your soil\u2019s pH, nitrogen, phosphorus, and potassium. Each scored for suitability.", icon: Wheat },
              { step: "03", title: "Get your plan", desc: "Fertilizer type, bags per acre, timing, budget, and nearest agrovet. Actionable advice you can use today.", icon: ClipboardCheck },
            ] as const).map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative bg-white rounded-2xl p-8 border border-cream-300 hover:border-gold-400 transition-colors group shadow-sm">
                  <div className="absolute -top-4 -left-2 font-display text-6xl font-bold text-cream-300 group-hover:text-gold-200 transition-colors select-none">{s.step}</div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-forest-700/10 rounded-xl flex items-center justify-center text-forest-700 mb-5">
                      <Icon size={28} strokeWidth={1.8} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-forest-700 mb-3">{s.title}</h3>
                    <p className="text-soil-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top counties */}
      <section className="py-12 md:py-16 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-forest-700">County Soil Reports</h2>
              <p className="text-soil-400 mt-2">Healthiest soils across Kenya</p>
            </div>
            <Link href="/soil" className="text-gold-600 hover:text-gold-700 font-semibold text-sm">All 47 counties →</Link>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
            {topCounties.map((c) => (
              <Link key={c.slug} href={`/soil/${c.slug}`} className="min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-center bg-white rounded-2xl p-6 border border-cream-300 hover:border-gold-400 hover:shadow-lg transition-all group shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-forest-700 group-hover:text-gold-600 transition-colors">{c.county}</h3>
                    <span className="text-xs text-soil-400 font-medium">{c.zone}</span>
                  </div>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-display text-lg font-bold text-white shadow-md" style={{ backgroundColor: c.score >= 70 ? "#16a34a" : c.score >= 50 ? "#f59e0b" : "#dc2626" }}>{c.score}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-soil-400">pH</span><span className="block font-semibold text-forest-700">{c.pH}</span></div>
                  <div><span className="text-soil-400">Nitrogen</span><span className="block font-semibold text-forest-700">{c.nitrogen} g/kg</span></div>
                  <div><span className="text-soil-400">Phosphorus</span><span className="block font-semibold text-forest-700">{c.phosphorus} mg/kg</span></div>
                  <div><span className="text-soil-400">Potassium</span><span className="block font-semibold text-forest-700">{c.potassium} mg/kg</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Crops marquee */}
      <section className="py-12 md:py-16 bg-forest-700 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10">
          <h2 className="font-display text-3xl font-bold text-cream-100 mb-2 text-center">25 Crops Supported</h2>
          <p className="text-center text-cream-400">Every crop matched to your county&apos;s soil</p>
        </div>
        
        <div className="relative w-full flex overflow-hidden group">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-forest-700 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-forest-700 to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...crops, ...crops].map((c, i) => (
              <Link key={`${c.slug}-${i}`} href={`/crops/${c.slug}`} className="bg-forest-600/50 hover:bg-forest-600 border border-forest-500/30 hover:border-gold-500/40 rounded-full px-8 py-3 mx-2 text-center transition-all group/link whitespace-nowrap">
                <span className="text-cream-200 group-hover/link:text-gold-300 font-medium text-sm transition-colors">{c.crop}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-8 md:mt-10 text-center relative z-20">
          <Link href="/crops" className="inline-block px-6 py-2.5 rounded-lg border border-gold-500/40 text-gold-400 text-sm font-semibold hover:bg-gold-500 hover:text-white transition-colors">
            View All 25 Crops
          </Link>
        </div>
      </section>

      {/* Zones */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-forest-700 text-center mb-8 md:mb-10">Agroecological Zones</h2>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {zones.map((z) => {
              const zoneCounties = counties.filter((c) => c.zone === z);
              const slug = z.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              return (
                <Link key={z} href={`/zones/${slug}`} className="min-w-[75vw] sm:min-w-[250px] md:min-w-0 snap-center bg-white rounded-xl p-5 border border-cream-300 hover:border-gold-400 transition-all group shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers size={18} className="text-forest-600" strokeWidth={1.8} />
                    <h3 className="font-display font-bold text-forest-700 group-hover:text-gold-600 transition-colors">{z}</h3>
                  </div>
                  <p className="text-sm text-soil-400">{zoneCounties.length} counties</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-cream-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4">Ready to farm with data?</h2>
          <p className="text-lg text-soil-400 mb-8">Get a free, personalized soil report and fertilizer plan for your county in under 30 seconds.</p>
          <Link href="/app" className="inline-block px-10 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-all hover:scale-[1.02] shadow-lg shadow-gold-500/25">
            Get Free Soil Advice →
          </Link>
        </div>
      </section>
    </>
  );
}
