import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "DAP vs CAN vs NPK: Which Fertilizer Does Your Farm Need?",
  description:
    "Stop guessing which fertilizer to buy. Compare DAP, CAN, NPK, Urea, Mavuno, and lime — when to use each, how much per acre, and current Kenyan prices for subsidized and commercial rates.",
  openGraph: { title: "DAP vs CAN vs NPK — Kenya Fertilizer Guide", images: ["/api/og"] },
};

export default function FertilizerGuide() {
  const counties = getCountySoils();
  const prices = getPrices();
  const acidic = counties.filter((c) => c.pH < 5.5);
  const lowN = counties.filter((c) => c.nitrogen < 0.2);
  const lowP = counties.filter((c) => c.phosphorus < 15);

  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "DAP vs CAN vs NPK: Which Fertilizer Does Your Farm Need?", author: { "@type": "Organization", name: "ShambaIQ" }, datePublished: "2026-05-01", dateModified: "2026-05-16" };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "When should I use DAP fertilizer?", acceptedAnswer: { "@type": "Answer", text: "Use DAP at planting time for soils with pH above 5.5. DAP provides phosphorus for root establishment and a small amount of nitrogen. For acidic soils (pH below 5.5), use Mavuno or YaraMila instead — standard DAP is less effective in acidic conditions." } },
    { "@type": "Question", name: "When should I use CAN fertilizer?", acceptedAnswer: { "@type": "Answer", text: "Use CAN for top dressing 4-6 weeks after planting, when crops reach knee height. CAN provides nitrogen for vegetative growth and grain fill. Apply when soil is moist — never on dry soil as it won't dissolve." } },
    { "@type": "Question", name: "How much DAP per acre for maize?", acceptedAnswer: { "@type": "Answer", text: "For maize, the standard rate is 1-1.5 bags (50-75kg) of DAP per acre at planting, depending on soil phosphorus levels. Soils with phosphorus below 10 mg/kg need 1.5 bags; soils with 10-20 mg/kg need 1 bag; soils above 20 mg/kg may need only 0.5 bags or none." } },
    { "@type": "Question", name: "What is the price of DAP fertilizer in Kenya 2026?", acceptedAnswer: { "@type": "Answer", text: `DAP costs approximately KES ${prices.find(p => p.fertilizer === "DAP")?.subsidized?.toLocaleString() || "2,500"} per 50kg bag at subsidized rates, or KES ${prices.find(p => p.fertilizer === "DAP")?.commercial?.toLocaleString() || "6,500"} at commercial rates.` } },
  ]};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Fertilizer Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Fertilizer</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">DAP vs CAN vs NPK: Which Fertilizer Does Your Farm Need?</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">Every season, Kenyan farmers spend billions on fertilizer. Much of it is wasted because the wrong type is applied to the wrong soil. This guide matches each fertilizer to the soil conditions where it actually works.</p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 9 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Rule: Soil pH Decides Your Fertilizer</h2>
            <p className="text-soil-500 leading-relaxed mb-4">Before comparing products, understand this principle: your soil&apos;s pH determines which fertilizers your crops can actually use. A farmer in <Link href="/soil/nakuru" className="text-gold-600 hover:underline font-medium">Nakuru</Link> (pH 6.28) and a farmer in <Link href="/soil/kiambu" className="text-gold-600 hover:underline font-medium">Kiambu</Link> (pH 5.28) should not buy the same fertilizer, even if they grow the same crop. The Kiambu farmer&apos;s acidic soil will lock up standard DAP phosphorus, wasting money. The Nakuru farmer&apos;s neutral soil can use DAP efficiently.</p>
            <p className="text-soil-500 leading-relaxed">Don&apos;t know your soil pH? <Link href="/soil" className="text-gold-600 hover:underline font-medium">Check your county&apos;s soil report</Link> — we have data for all 47 counties from precision satellite soil mapping.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Fertilizer Comparison Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-cream-100">
                    <th className="px-3 py-3 text-left font-semibold text-forest-700">Fertilizer</th>
                    <th className="px-3 py-3 text-left font-semibold text-forest-700">What It Does</th>
                    <th className="px-3 py-3 text-left font-semibold text-forest-700">When to Apply</th>
                    <th className="px-3 py-3 text-left font-semibold text-forest-700">Best Soil pH</th>
                    <th className="px-3 py-3 text-left font-semibold text-forest-700">Rate/Acre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-cream-200">
                    <td className="px-3 py-3 font-bold text-forest-700">DAP</td>
                    <td className="px-3 py-3 text-soil-400">Phosphorus (46%) + some nitrogen (18%)</td>
                    <td className="px-3 py-3 text-soil-400">At planting</td>
                    <td className="px-3 py-3 text-soil-400">pH 5.5+</td>
                    <td className="px-3 py-3 text-soil-400">1–1.5 bags</td>
                  </tr>
                  <tr className="border-t border-cream-200">
                    <td className="px-3 py-3 font-bold text-forest-700">CAN</td>
                    <td className="px-3 py-3 text-soil-400">Nitrogen (26%) + calcium</td>
                    <td className="px-3 py-3 text-soil-400">Top dressing (week 4–6)</td>
                    <td className="px-3 py-3 text-soil-400">Any</td>
                    <td className="px-3 py-3 text-soil-400">1–1.5 bags</td>
                  </tr>
                  <tr className="border-t border-cream-200">
                    <td className="px-3 py-3 font-bold text-forest-700">NPK</td>
                    <td className="px-3 py-3 text-soil-400">Balanced nitrogen, phosphorus, potassium</td>
                    <td className="px-3 py-3 text-soil-400">At planting</td>
                    <td className="px-3 py-3 text-soil-400">pH 5.5+</td>
                    <td className="px-3 py-3 text-soil-400">1–2 bags</td>
                  </tr>
                  <tr className="border-t border-cream-200">
                    <td className="px-3 py-3 font-bold text-forest-700">Urea</td>
                    <td className="px-3 py-3 text-soil-400">High nitrogen (46%)</td>
                    <td className="px-3 py-3 text-soil-400">Top dressing</td>
                    <td className="px-3 py-3 text-soil-400">Any (volatile — incorporate quickly)</td>
                    <td className="px-3 py-3 text-soil-400">0.5–1 bag</td>
                  </tr>
                  <tr className="border-t border-cream-200">
                    <td className="px-3 py-3 font-bold text-forest-700">Mavuno</td>
                    <td className="px-3 py-3 text-soil-400">Phosphorus + micronutrients for acidic soils</td>
                    <td className="px-3 py-3 text-soil-400">At planting</td>
                    <td className="px-3 py-3 text-soil-400">pH below 5.5</td>
                    <td className="px-3 py-3 text-soil-400">1–1.5 bags</td>
                  </tr>
                  <tr className="border-t border-cream-200">
                    <td className="px-3 py-3 font-bold text-forest-700">Lime</td>
                    <td className="px-3 py-3 text-soil-400">Raises pH, unlocks trapped phosphorus</td>
                    <td className="px-3 py-3 text-soil-400">2–4 weeks before planting</td>
                    <td className="px-3 py-3 text-soil-400">Only if pH below 5.5</td>
                    <td className="px-3 py-3 text-soil-400">2 bags</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {prices.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Current Prices (2026)</h2>
              <p className="text-soil-500 leading-relaxed mb-4">Kenya has both government-subsidized and commercial fertilizer prices. The subsidy program caps prices at approximately KES 2,500 per 50kg bag for eligible farmers. Commercial rates vary by region and season.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead><tr className="bg-cream-100"><th className="px-3 py-3 text-left font-semibold text-forest-700">Fertilizer</th><th className="px-3 py-3 text-left font-semibold text-forest-700">Subsidized (50kg)</th><th className="px-3 py-3 text-left font-semibold text-forest-700">Commercial (50kg)</th><th className="px-3 py-3 text-left font-semibold text-forest-700">Savings</th></tr></thead>
                  <tbody>
                    {prices.map((p) => (
                      <tr key={p.fertilizer} className="border-t border-cream-200">
                        <td className="px-3 py-3 font-medium text-forest-700">{p.fertilizer}</td>
                        <td className="px-3 py-3 text-green-600 font-semibold">KES {p.subsidized.toLocaleString()}</td>
                        <td className="px-3 py-3 text-soil-400">KES {p.commercial.toLocaleString()}</td>
                        <td className="px-3 py-3 text-gold-600 font-semibold">{Math.round(((p.commercial - p.subsidized) / p.commercial) * 100)}% saved</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-300 mt-2">Prices as of 2026. Find your nearest verified dealer at <Link href="/dealers" className="text-gold-600 hover:underline">shambaiq.com/dealers</Link>.</p>
            </section>
          )}

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Decision Guide: Which Fertilizer for Your County</h2>
            <p className="text-soil-500 leading-relaxed mb-4">Here is a simplified decision tree based on your soil data:</p>

            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4">
                <h3 className="font-bold text-red-700 mb-1">Acidic soil (pH below 5.5) — {acidic.length} counties</h3>
                <p className="text-sm text-red-600 mb-2">Apply Lime first (2 bags/acre), then use Mavuno at planting instead of DAP. Top dress with CAN.</p>
                <p className="text-xs text-red-500">Counties: {acidic.slice(0, 8).map(c => c.county).join(", ")}{acidic.length > 8 ? `, +${acidic.length - 8} more` : ""}. <Link href="/blog/why-soil-is-acidic-kenya" className="underline">Full list and guide →</Link></p>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4">
                <h3 className="font-bold text-amber-700 mb-1">Low nitrogen (N below 0.2 g/kg)</h3>
                <p className="text-sm text-amber-600 mb-2">Your soil has very little nitrogen. Use DAP or NPK at planting, AND top dress with CAN at 1.5 bags/acre (heavier than usual). Consider Urea if CAN is unavailable.</p>
                <p className="text-xs text-amber-500">Most affected: {lowN.slice(0, 5).map(c => c.county).join(", ") || "Check your county"}</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 rounded-r-xl p-4">
                <h3 className="font-bold text-green-700 mb-1">Healthy soil (pH 5.5–7.0, adequate nutrients)</h3>
                <p className="text-sm text-green-600 mb-2">Standard program: DAP at planting (1 bag/acre), CAN for top dressing (1 bag/acre). You are in the sweet spot where standard recommendations work well.</p>
                <p className="text-xs text-green-500">Includes most Rift Valley counties: <Link href="/soil/nakuru" className="underline">Nakuru</Link>, <Link href="/soil/uasin-gishu" className="underline">Uasin Gishu</Link>, <Link href="/soil/trans-nzoia" className="underline">Trans Nzoia</Link></p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-4">
                <h3 className="font-bold text-blue-700 mb-1">Alkaline soil (pH above 7.5)</h3>
                <p className="text-sm text-blue-600 mb-2">High pH locks phosphorus differently — use acidifying fertilizers like ammonium sulphate. Standard lime is NOT needed (it would make the problem worse). Focus on drought-tolerant crops.</p>
                <p className="text-xs text-blue-500">Counties: {counties.filter(c => c.pH > 7.5).slice(0, 5).map(c => c.county).join(", ")}</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Common Mistakes</h2>
            <div className="space-y-3">
              <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                <p className="font-semibold text-forest-700 mb-1">Using DAP on acidic soil</p>
                <p className="text-sm text-soil-400">The phosphorus in DAP gets locked by aluminium in acidic soils. Switch to Mavuno or apply lime first. This single change can improve yields by 30-50% in counties like <Link href="/soil/kiambu" className="text-gold-600 hover:underline">Kiambu</Link> and <Link href="/soil/meru" className="text-gold-600 hover:underline">Meru</Link>. For crop-specific examples, see our <Link href="/blog/cabbage-farming-kiambu" className="text-gold-600 hover:underline font-semibold">Kiambu cabbage guide</Link> and our <Link href="/blog/bean-farming-kakamega" className="text-gold-600 hover:underline font-semibold">Kakamega bean guide</Link>.</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                <p className="font-semibold text-forest-700 mb-1">Applying CAN on dry soil</p>
                <p className="text-sm text-soil-400">CAN needs moisture to dissolve and reach roots. Applying on dry soil means the granules sit on the surface and volatilize as ammonia gas. Apply when rain is expected within 24 hours or irrigate after application. For intensive nitrogen feeding examples, see our <Link href="/blog/dairy-farming-nandi" className="text-gold-600 hover:underline font-semibold">Nandi fodder guide</Link> and our <Link href="/blog/onion-farming-kajiado" className="text-gold-600 hover:underline font-semibold">Kajiado onion guide</Link> for bulb-forming sulfur top-dressing.</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                <p className="font-semibold text-forest-700 mb-1">Using the same fertilizer every season</p>
                <p className="text-sm text-soil-400">Soil chemistry changes. Continuous DAP without lime in acidic areas makes pH worse every year. Test or check your <Link href="/soil" className="text-gold-600 hover:underline">county report</Link> before each season.</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                <p className="font-semibold text-forest-700 mb-1">Skipping top dressing to save money</p>
                <p className="text-sm text-soil-400">Planting fertilizer (DAP) provides phosphorus for roots. But maize, wheat, and sorghum need a nitrogen boost at the vegetative stage. Skipping CAN top dressing can reduce maize yields by 40-60%.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Get a Personalized Fertilizer Plan</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              This guide gives general rules. For exact quantities, timing, and budget matched to your specific county and crop, use ShambaIQ&apos;s <Link href="/app" className="text-gold-600 hover:underline font-medium">recommendation tool</Link>. It calculates the nutrient gap between your soil&apos;s current levels and your chosen crop&apos;s requirements, then tells you exactly how many bags of which fertilizer to buy and what it will cost.
            </p>
            <p className="text-soil-500 leading-relaxed">
              See also: our <Link href="/blog/kenya-soil-health-rankings-2026" className="text-gold-600 hover:underline font-medium">2026 county soil rankings</Link> for the full picture of soil health across Kenya, and our <Link href="/blog/complete-maize-farming-guide-kenya" className="text-gold-600 hover:underline font-medium">complete maize farming guide</Link> for the most popular crop in the country.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Which fertilizer does your farm need?</h2>
          <p className="text-cream-400 mb-6">Enter your county and crop. Get a fertilizer plan with exact bags and budget in 30 seconds.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Get My Fertilizer Plan →</Link>
        </div>
      </article>
    </>
  );
}
