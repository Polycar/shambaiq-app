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
  ArrowRight,
  Satellite,
  Leaf,
  TrendingUp,
  User,
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

  const scoreColor = (s: number) =>
    s >= 70 ? "#16a34a" : s >= 50 ? "#f59e0b" : "#dc2626";

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-forest-800 via-forest-700 to-[#1e4620] overflow-hidden grain">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#C8860A" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-gold-500/[0.06] blur-3xl animate-float" />
        <div className="absolute bottom-10 left-[10%] w-48 h-48 rounded-full bg-forest-300/[0.08] blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/15 border border-gold-500/25 rounded-full text-gold-300 text-sm font-medium mb-8">
              <Satellite size={14} strokeWidth={2} />
              Powered by 30m precision satellite data
            </div>

            {/* Headline */}
            <h1 className="fade-up fade-up-delay-1 font-display text-[2.75rem] md:text-7xl font-bold text-cream-100 leading-[1.08] mb-6 tracking-tight">
              Know your soil.
              <br />
              <span className="text-gold-400">Grow with precision.</span>
            </h1>

            {/* Subheadline */}
            <p className="fade-up fade-up-delay-2 text-lg md:text-xl text-cream-300/90 mb-10 leading-relaxed max-w-2xl">
              Free soil analysis, fertilizer plans, and crop recommendations for
              all 47 Kenyan counties. Data-driven farming for every shamba.
            </p>

            {/* CTAs */}
            <div className="fade-up fade-up-delay-3 flex flex-wrap gap-4">
              <Link
                href="/app"
                className="group px-8 py-4 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-xl text-lg transition-all hover:scale-[1.02] shadow-lg shadow-gold-500/25 flex items-center gap-2"
              >
                Get Free Advice
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/soil"
                className="px-8 py-4 bg-cream-200/10 hover:bg-cream-200/20 text-cream-200 font-semibold rounded-xl text-lg transition-colors border border-cream-200/20 hover:border-cream-200/30"
              >
                Browse Soil Data
              </Link>
            </div>
          </div>

          {/* ─── Stats bar ─── */}
          <div className="fade-up fade-up-delay-4 mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-2xl">
            {[
              { n: "47", label: "Counties", icon: MapPin },
              { n: "25", label: "Crops", icon: Wheat },
              { n: wardCount.toLocaleString(), label: "Wards", icon: Layers },
              { n: "Free", label: "Forever", icon: Leaf },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cream-100/[0.06] mb-3 group-hover:bg-gold-500/10 transition-colors">
                    <Icon size={18} className="text-gold-400" strokeWidth={1.8} />
                  </div>
                  <div className="font-display text-4xl md:text-5xl font-extrabold text-gold-400 leading-none">
                    {s.n}
                  </div>
                  <div className="text-xs text-cream-400 mt-1.5 font-medium tracking-widest uppercase">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURE CARDS ─────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-forest-700 mb-4 leading-tight">
              Everything your shamba needs
            </h2>
            <p className="text-soil-400 max-w-xl mx-auto text-lg">
              Soil reports, fertilizer plans, yield tracking, and crop disease diagnosis — all in one place
            </p>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory gap-5 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible no-scrollbar">
            {([
              { icon: Sprout, title: "Soil & Crop Advice", desc: "Precision fertilizer recommendations matched to your exact local soil chemistry using 30m satellite mapping.", href: "/app", color: "#16a34a" },
              { icon: BarChart3, title: "Yield Tracker", desc: "Log your harvest season by season. Track how precision farming improves your yield over time.", href: "/yields", color: "#2563eb" },
              { icon: Camera, title: "Plant Doctor", desc: "Snap a photo of a sick leaf. AI-powered pest and disease diagnosis with localized treatment advice.", href: "/doctor", color: "#dc2626" },
              { icon: Store, title: "Find Agrovets", desc: "Locate nearby input suppliers by county. Phone numbers, stock lists, and directions to your nearest dealer.", href: "/dealers", color: "#C8860A" },
            ] as const).map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} className="w-[85vw] shrink-0 sm:w-[300px] md:min-w-0 md:w-auto snap-center bg-white rounded-2xl p-7 border-l-4 shadow-sm card-hover group" style={{ borderLeftColor: card.color }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors" style={{ backgroundColor: `${card.color}12` }}>
                    <Icon size={24} strokeWidth={1.8} style={{ color: card.color }} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest-700 mb-2 group-hover:text-gold-600 transition-colors">{card.title}</h3>
                  <p className="text-sm text-soil-400 leading-relaxed">{card.desc}</p>
                  <div className="mt-4 text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: card.color }}>
                    Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-forest-700 mb-4 leading-tight">How ShambaIQ works</h2>
            <p className="text-soil-400 max-w-lg mx-auto text-lg">From satellite to shamba in three steps</p>
          </div>
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
            {([
              { step: "01", title: "Select your location", desc: "Choose your county and ward. We use 30m precision satellite data to check the exact soil health of your local farm area.", icon: MapPin },
              { step: "02", title: "Pick your crop", desc: "25 crops analyzed against your soil\u2019s pH, nitrogen, phosphorus, and potassium. Each scored for suitability.", icon: Wheat },
              { step: "03", title: "Get your plan", desc: "Fertilizer type, bags per acre, timing, budget, and nearest agrovet. Actionable advice you can use today.", icon: ClipboardCheck },
            ] as const).map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative bg-white rounded-2xl p-8 md:p-10 border border-cream-300 hover:border-gold-400 transition-all group card-hover">
                  <div className="absolute -top-5 -left-1 font-display text-7xl font-bold text-cream-300/60 group-hover:text-gold-200/60 transition-colors select-none leading-none">{s.step}</div>
                  <div className="relative pt-4">
                    <div className="w-14 h-14 bg-forest-700/8 rounded-xl flex items-center justify-center text-forest-700 mb-5">
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

      {/* ─── TOP COUNTIES ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 md:mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-forest-700 leading-tight">County Soil Data</h2>
              <p className="text-soil-400 mt-2 text-lg">Tap any county to get your free farm plan</p>
            </div>
            <Link href="/soil" className="hidden sm:flex items-center gap-1 text-gold-600 hover:text-gold-700 font-semibold text-sm transition-colors">
              All 47 counties <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible no-scrollbar">
            {topCounties.map((c) => (
              <Link key={c.slug} href={`/app`} className="w-[85vw] shrink-0 sm:w-[350px] md:min-w-0 md:w-auto snap-center bg-white rounded-2xl p-6 border border-cream-300 hover:border-gold-400 card-hover group relative overflow-hidden">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-display text-xl font-bold text-forest-700 group-hover:text-gold-600 transition-colors">{c.county}</h3>
                    <span className="text-xs text-soil-400 font-medium">{c.zone}</span>
                  </div>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-display text-lg font-bold text-white shadow-md shrink-0" style={{ backgroundColor: scoreColor(c.score) }}>
                    {c.score}
                  </div>
                </div>
                {/* Nutrient micro-bars */}
                <div className="space-y-3">
                  {[
                    { label: "pH", value: c.pH, display: String(c.pH), pct: Math.min(100, ((c.pH - 3) / 5) * 100), color: c.pH >= 5.5 && c.pH <= 7.0 ? "#16a34a" : c.pH >= 5.0 && c.pH <= 7.5 ? "#f59e0b" : "#dc2626" },
                    { label: "Nitrogen", value: c.nitrogen, display: `${c.nitrogen} g/kg`, pct: Math.min(100, (c.nitrogen / 2.5) * 100), color: c.nitrogen >= 1.2 ? "#16a34a" : c.nitrogen >= 0.8 ? "#f59e0b" : "#dc2626" },
                    { label: "Phosphorus", value: c.phosphorus, display: `${c.phosphorus} mg/kg`, pct: Math.min(100, (c.phosphorus / 40) * 100), color: c.phosphorus >= 20 ? "#16a34a" : c.phosphorus >= 12 ? "#f59e0b" : "#dc2626" },
                    { label: "Potassium", value: c.potassium, display: `${c.potassium} mg/kg`, pct: Math.min(100, (c.potassium / 400) * 100), color: c.potassium >= 200 ? "#16a34a" : c.potassium >= 150 ? "#f59e0b" : "#dc2626" },
                  ].map((n) => (
                    <div key={n.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-soil-400">{n.label}</span>
                        <span className="font-semibold text-forest-700">{n.display}</span>
                      </div>
                      <div className="nutrient-bar">
                        <div className="nutrient-bar-fill" style={{ width: `${n.pct}%`, backgroundColor: n.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-600">Get farm plan for {c.county}</span>
                  <ArrowRight size={14} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/soil" className="text-gold-600 hover:text-gold-700 font-semibold text-sm">
              View all 47 counties →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CROPS MARQUEE ─────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-forest-700 overflow-hidden relative grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12">
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-cream-100 mb-3 text-center leading-tight">25 Crops Supported</h2>
          <p className="text-center text-cream-400 text-lg">Every crop matched to your county&apos;s soil</p>
        </div>

        <div className="relative w-full flex overflow-hidden group">
          <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-forest-700 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-forest-700 to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...crops, ...crops].map((c, i) => (
              <Link key={`${c.slug}-${i}`} href={`/crops/${c.slug}`} className="bg-forest-600/40 hover:bg-forest-500 border border-forest-500/30 hover:border-gold-500/40 rounded-full px-7 py-2.5 mx-2 flex items-center transition-all group/link whitespace-nowrap">
                <span className="text-cream-200 group-hover/link:text-gold-300 font-medium text-sm transition-colors">{c.crop}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 md:mt-12 text-center relative z-20">
          <Link href="/crops" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-gold-500/40 text-gold-400 text-sm font-semibold hover:bg-gold-500 hover:text-white transition-all">
            View All 25 Crops <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── AGROECOLOGICAL ZONES ──────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-forest-700 text-center mb-10 md:mb-12 leading-tight">Agroecological Zones</h2>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory gap-4 styled-scrollbar">
            {zones.map((z) => {
              const zoneCounties = counties.filter((c) => c.zone === z);
              const slug = z.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              return (
                <Link key={z} href={`/zones/${slug}`} className="w-[80vw] shrink-0 sm:w-[240px] md:min-w-0 md:w-auto snap-center bg-white rounded-2xl p-6 border border-cream-300 hover:border-gold-400 transition-all group card-hover">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-forest-700/8 flex items-center justify-center">
                      <Layers size={18} className="text-forest-600" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-display font-bold text-forest-700 group-hover:text-gold-600 transition-colors leading-tight">{z}</h3>
                  </div>
                  <p className="text-sm text-soil-400">{zoneCounties.length} counties</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────────────────── */}
      <section className="py-10 bg-cream-200/60 border-y border-cream-300">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-soil-400">
          <div className="flex items-center gap-2"><Satellite size={16} className="text-forest-500" /> 30m precision satellite data</div>
          <div className="flex items-center gap-2"><TrendingUp size={16} className="text-forest-500" /> Updated annually</div>
          <div className="flex items-center gap-2"><MapPin size={16} className="text-forest-500" /> All 47 counties covered</div>
          <div className="flex items-center gap-2"><Leaf size={16} className="text-forest-500" /> 100% free, forever</div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-cream-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-forest-700 mb-5 leading-tight">Ready to farm with data?</h2>
          <p className="text-lg text-soil-400 mb-8 max-w-xl mx-auto">Get a free, personalized soil report and fertilizer plan for your county in under 30 seconds.</p>
          
          <div className="flex justify-center items-center gap-3 mb-8">
            <div className="flex -space-x-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-cream-200 bg-cream-300 flex items-center justify-center overflow-hidden shrink-0">
                  <User size={16} className="text-forest-600/60" strokeWidth={2.5} />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex text-gold-500 text-sm">★★★★★</div>
              <div className="text-xs text-soil-400 font-semibold mt-0.5">Join 15,000+ farmers</div>
            </div>
          </div>

          <Link href="/app" className="group inline-flex items-center gap-2 px-10 py-4 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-xl text-lg transition-all hover:scale-[1.02] shadow-lg shadow-gold-500/25">
            Get Free Soil Advice
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
