import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getCrops, computeSoilHealthScore, getSeedsByCrop, getCropCalendars, getTopDressing, getPrices, slugify } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "The Complete Maize Farming Guide for Kenya — Soil, Seeds, Fertilizer",
  description:
    "Everything you need to grow maize in Kenya. Best counties ranked by soil suitability, certified seed varieties, fertilizer plans with budget, and planting calendar for all seasons.",
  openGraph: { title: "Complete Maize Farming Guide — Kenya", images: ["/api/og/crop/maize"] },
};

export default function MaizeFarmingGuide() {
  const counties = getCountySoils();
  const maizeCrop = getCrops().find((c) => c.crop === "Maize");
  const seeds = getSeedsByCrop("Maize");
  const calendars = getCropCalendars().filter((c) => c.crop === "Maize");
  const topDressing = getTopDressing().filter((c) => c.crop === "Maize");
  const prices = getPrices();

  const rankedCounties = counties
    .map((c) => {
      let score = 100;
      if (c.pH < 5.5) score -= Math.min(40, (5.5 - c.pH) * 20);
      else if (c.pH > 7.5) score -= Math.min(40, (c.pH - 7.5) * 20);
      if (c.nitrogen < 1.2) score -= Math.min(20, ((1.2 - c.nitrogen) / 1.2) * 30);
      if (c.phosphorus < 20) score -= Math.min(20, ((20 - c.phosphorus) / 20) * 25);
      if (c.potassium < 150) score -= Math.min(20, ((150 - c.potassium) / 150) * 25);
      return { ...c, maizeScore: Math.max(0, Math.round(score)) };
    })
    .sort((a, b) => b.maizeScore - a.maizeScore);

  const bestCounties = rankedCounties.slice(0, 10);
  const worstCounties = rankedCounties.slice(-5);

  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    headline: "The Complete Maize Farming Guide for Kenya",
    author: { "@type": "Organization", name: "ShambaIQ" },
    datePublished: "2026-05-01", dateModified: "2026-05-16",
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is the best county for growing maize in Kenya?", acceptedAnswer: { "@type": "Answer", text: `Based on soil analysis, ${bestCounties[0]?.county} County scores highest for maize suitability with a score of ${bestCounties[0]?.maizeScore}, thanks to its pH of ${bestCounties[0]?.pH} and nitrogen level of ${bestCounties[0]?.nitrogen} g/kg.` } },
      { "@type": "Question", name: "How many bags of fertilizer per acre for maize?", acceptedAnswer: { "@type": "Answer", text: "For maize, the standard recommendation is 1-1.5 bags of DAP (or Mavuno for acidic soils) at planting, plus 1-1.5 bags of CAN for top dressing at knee-height stage. Exact amounts depend on your specific soil nutrient levels." } },
      { "@type": "Question", name: "What is the best maize seed variety in Kenya?", acceptedAnswer: { "@type": "Answer", text: `Popular certified varieties include ${seeds.slice(0, 3).map(s => s.variety).join(", ")}. The best choice depends on your altitude, rainfall, and desired maturity period.` } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Maize Farming Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Crop Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">The Complete Maize Farming Guide for Kenya</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">Soil requirements, best counties, seed varieties, fertilizer plans, and seasonal timing — backed by satellite data for all 47 counties.</p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 10 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">What Maize Needs From Your Soil</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Maize thrives in soil with a pH between {maizeCrop?.ph_min} and {maizeCrop?.ph_max}. Below pH 5.5, phosphorus becomes chemically locked in the soil and unavailable to roots — even if your soil test shows adequate P levels. This is why counties in the <Link href="/zones/central-highlands" className="text-gold-600 hover:underline font-medium">Central Highlands</Link> often struggle with maize despite having otherwise decent nutrient levels.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              For nitrogen, maize is a heavy feeder. Soils with less than 1.2 g/kg of total nitrogen will show yellowing leaves by the tasseling stage unless supplemented with top dressing. Phosphorus above 20 mg/kg and potassium above 150 mg/kg complete the picture for a healthy maize crop.
            </p>
            <p className="text-soil-500 leading-relaxed">
              For the full technical breakdown of all <Link href="/crops/maize" className="text-gold-600 hover:underline font-medium">maize soil requirements</Link>, see our crop page with certified seed varieties and economics.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Best Counties for Maize</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              We scored all 47 counties against maize&apos;s specific soil requirements. The <Link href="/zones/rift-valley" className="text-gold-600 hover:underline font-medium">Rift Valley</Link> dominates, with <Link href={`/soil/${bestCounties[0]?.slug}`} className="text-gold-600 hover:underline font-medium">{bestCounties[0]?.county}</Link> and <Link href={`/soil/${bestCounties[1]?.slug}`} className="text-gold-600 hover:underline font-medium">{bestCounties[1]?.county}</Link> leading the pack.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {bestCounties.map((c, i) => (
                <Link key={c.slug} href={`/soil/${c.slug}/maize`} className="flex items-center gap-3 p-3 rounded-xl border border-cream-300 hover:border-gold-400 transition-colors">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-green-600">{i + 1}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-forest-700">{c.county}</span>
                    <span className="text-xs text-soil-400 ml-2">pH {c.pH}</span>
                  </div>
                  <span className="font-bold text-forest-700">{c.maizeScore}</span>
                </Link>
              ))}
            </div>
            <p className="text-soil-500 leading-relaxed">
              Notice that even top-ranked counties don&apos;t score a perfect 100. This is because the sigmoid scoring model accounts for diminishing returns — having pH 6.5 is only marginally better than 6.3 for maize, not dramatically so. What matters is being within the acceptable range, not hitting an exact number.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Counties to Avoid (Or Amend Heavily)</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              The most challenging counties for maize are in the arid zones where alkaline pH locks nutrients. {worstCounties.slice(0, 3).map((c, i) => (
                <span key={c.slug}>{i > 0 && ", "}<Link href={`/soil/${c.slug}`} className="text-gold-600 hover:underline font-medium">{c.county} (pH {c.pH})</Link></span>
              ))} all score below {worstCounties[2]?.maizeScore} for maize. If you farm in these counties, consider drought-tolerant alternatives like <Link href="/crops/sorghum" className="text-gold-600 hover:underline font-medium">sorghum</Link> or <Link href="/crops/cowpeas" className="text-gold-600 hover:underline font-medium">cowpeas</Link>.
            </p>
          </section>

          {seeds.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Certified Seed Varieties</h2>
              <p className="text-soil-500 leading-relaxed mb-4">
                Choosing the right variety for your altitude and season is as important as soil preparation. Here are certified maize varieties for Kenya:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="bg-cream-100"><th className="px-3 py-2 text-left font-semibold text-forest-700">Variety</th><th className="px-3 py-2 text-left font-semibold text-forest-700">Breeder</th><th className="px-3 py-2 text-left font-semibold text-forest-700">Altitude</th><th className="px-3 py-2 text-left font-semibold text-forest-700">Maturity</th><th className="px-3 py-2 text-left font-semibold text-forest-700">Yield</th></tr></thead>
                  <tbody>
                    {seeds.map((s, i) => (
                      <tr key={i} className="border-t border-cream-200"><td className="px-3 py-2 font-medium text-forest-700">{s.variety}</td><td className="px-3 py-2 text-soil-400">{s.breeder}</td><td className="px-3 py-2 text-soil-400">{s.altitude_zone}</td><td className="px-3 py-2 text-soil-400">{s.maturity_days}</td><td className="px-3 py-2 text-soil-400">{s.yield_bags} bags</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Fertilizer Plan</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Maize fertilization happens in two stages. At planting, apply DAP (for soils with pH above 5.5) or Mavuno (for acidic soils) to provide phosphorus for root establishment. At knee-height (week 4-5), top dress with CAN to supply the nitrogen burst needed for tasseling and grain fill.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              For a detailed comparison of all fertilizer options, see our guide on <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-medium">DAP vs CAN vs NPK</Link>. If your soil is acidic, read <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-medium">why your soil is acidic and how to fix it</Link> before choosing your planting fertilizer.
            </p>
            {prices.length > 0 && (
              <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                <h3 className="font-semibold text-forest-700 mb-2 text-sm">Current Fertilizer Prices (2026)</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <span className="font-semibold text-soil-400">Fertilizer</span><span className="font-semibold text-soil-400">Subsidized</span><span className="font-semibold text-soil-400">Commercial</span>
                  {prices.slice(0, 5).map((p) => (
                    <><span key={p.fertilizer} className="text-forest-700">{p.fertilizer}</span><span className="text-green-600">KES {p.subsidized.toLocaleString()}</span><span className="text-soil-400">KES {p.commercial.toLocaleString()}</span></>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Planting Calendar</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Kenya has two main planting seasons for maize. The Long Rains (March–May) are the primary season for most of the country. The Short Rains (October–December) offer a second crop opportunity in areas with bimodal rainfall. Timing your planting to coincide with the first reliable rains is critical — late planting reduces yield by approximately 2% per day of delay.
            </p>
            {calendars.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="bg-cream-100"><th className="px-3 py-2 text-left font-semibold text-forest-700">Season</th><th className="px-3 py-2 text-left font-semibold text-forest-700">Month 1</th><th className="px-3 py-2 text-left font-semibold text-forest-700">Month 2</th><th className="px-3 py-2 text-left font-semibold text-forest-700">Month 3</th></tr></thead>
                  <tbody>
                    {calendars.map((cal, i) => (
                      <tr key={i} className="border-t border-cream-200"><td className="px-3 py-2 font-medium text-forest-700">{cal.season}</td><td className="px-3 py-2 text-soil-400">{cal.month1}</td><td className="px-3 py-2 text-soil-400">{cal.month2}</td><td className="px-3 py-2 text-soil-400">{cal.month3}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Get a Plan for Your Specific Farm</h2>
            <p className="text-soil-500 leading-relaxed">
              This guide covers maize farming at a national level. For advice tailored to your specific county, ward, and farm size — including exact bag quantities, costs, and nearest dealers — use ShambaIQ&apos;s <Link href="/app" className="text-gold-600 hover:underline font-medium">recommendation tool</Link>. It takes 30 seconds and covers all 47 counties with data from iSDAsoil satellite mapping.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Plan your maize season</h2>
          <p className="text-cream-400 mb-6">Get a personalized maize fertilizer plan with budget for your county.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Get Free Advice →</Link>
        </div>
      </article>
    </>
  );
}
