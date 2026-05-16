import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Why Your Soil Is Acidic — And What To Do About It",
  description:
    "Soil acidity affects 15+ Kenyan counties, locking nutrients away from crops. We identify the most acidic counties, explain the science, and show you how lime fixes the problem.",
  openGraph: { title: "Why Kenyan Soil Is Acidic — And How To Fix It", images: ["/api/og"] },
};

export default function AcidicSoilGuide() {
  const counties = getCountySoils();
  const acidic = counties.filter((c) => c.pH < 5.5).sort((a, b) => a.pH - b.pH);
  const moderate = counties.filter((c) => c.pH >= 5.5 && c.pH < 6.0).sort((a, b) => a.pH - b.pH);
  const prices = getPrices();
  const limePrice = prices.find((p) => p.fertilizer.toLowerCase().includes("lime"));

  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "Why Your Soil Is Acidic — And What To Do About It", author: { "@type": "Organization", name: "ShambaIQ" }, datePublished: "2026-05-01", dateModified: "2026-05-16" };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Why is my soil acidic in Kenya?", acceptedAnswer: { "@type": "Answer", text: "High rainfall leaches calcium and magnesium from topsoil over time, leaving behind hydrogen and aluminium ions that lower pH. This is why the wettest parts of Kenya (Central Highlands, Western, Lake Victoria Basin) have the most acidic soils." } },
    { "@type": "Question", name: "How do I fix acidic soil?", acceptedAnswer: { "@type": "Answer", text: "Apply agricultural lime (calcium carbonate) at 2 bags per acre for soils with pH below 5.5. Lime neutralizes the acid and unlocks phosphorus that was chemically trapped. Apply 2-4 weeks before planting for best results." } },
    { "@type": "Question", name: "How much does lime cost in Kenya?", acceptedAnswer: { "@type": "Answer", text: `Agricultural lime costs approximately KES ${limePrice?.subsidized?.toLocaleString() || "1,500"} per 50kg bag (subsidized) or KES ${limePrice?.commercial?.toLocaleString() || "1,800"} at commercial rates. At 2 bags per acre, that is KES ${((limePrice?.subsidized || 1500) * 2).toLocaleString()} per acre.` } },
  ]};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Acidic Soil Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Soil Science</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Why Your Soil Is Acidic — And What To Do About It</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">Soil acidity is the single biggest hidden problem in Kenyan agriculture. It affects {acidic.length} counties and silently reduces yields even when fertilizer is applied correctly.</p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 7 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Problem: Nutrients Are Locked, Not Missing</h2>
            <p className="text-soil-500 leading-relaxed mb-4">Most farmers in acidic-soil counties apply DAP every season expecting good results. The phosphorus in DAP enters the soil, but at pH below 5.5, it immediately bonds with aluminium and iron oxides, forming compounds that plant roots cannot absorb. The nutrient is physically present but chemically unavailable. You pay for fertilizer that your crops never receive.</p>
            <p className="text-soil-500 leading-relaxed mb-4">This is why liming must come before fertilizing. Raising pH to 5.5 or above releases trapped phosphorus and allows new applications to remain plant-available. A KES {((limePrice?.subsidized || 1500) * 2).toLocaleString()} investment in lime can double the effectiveness of your existing fertilizer spend.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Kenya&apos;s {acidic.length} Most Acidic Counties</h2>
            <p className="text-soil-500 leading-relaxed mb-4">These counties have average soil pH below 5.5, the critical threshold where phosphorus availability drops sharply. High rainfall is the common factor — it leaches calcium and magnesium from the topsoil, leaving acidic hydrogen ions behind.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {acidic.map((c) => (
                <Link key={c.slug} href={`/soil/${c.slug}`} className="flex items-center justify-between p-3 rounded-xl border border-cream-300 hover:border-gold-400 transition-colors">
                  <div><span className="font-semibold text-forest-700">{c.county}</span><span className="text-xs text-soil-400 ml-2">{c.zone}</span></div>
                  <span className="text-sm font-bold text-red-600">pH {c.pH}</span>
                </Link>
              ))}
            </div>
            <p className="text-soil-500 leading-relaxed mb-4">
              The <Link href="/zones/central-highlands" className="text-gold-600 hover:underline font-medium">Central Highlands</Link> zone is the most affected, with all six counties (including <Link href="/soil/kiambu" className="text-gold-600 hover:underline font-medium">Kiambu</Link>, <Link href="/soil/muranga" className="text-gold-600 hover:underline font-medium">Murang&apos;a</Link>, and <Link href="/soil/nyeri" className="text-gold-600 hover:underline font-medium">Nyeri</Link>) falling below pH 5.5. The <Link href="/zones/mt-kenya" className="text-gold-600 hover:underline font-medium">Mt. Kenya</Link> zone is equally affected, with <Link href="/soil/meru" className="text-gold-600 hover:underline font-medium">Meru</Link> recording one of the lowest pH levels in the country at {counties.find(c => c.county === "Meru")?.pH || "4.88"}.
            </p>
          </section>

          {moderate.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Counties at Risk (pH 5.5–6.0)</h2>
              <p className="text-soil-500 leading-relaxed mb-4">
                These {moderate.length} counties are not yet critically acidic but are trending in that direction. Continued farming without lime application will push them below the 5.5 threshold within a few seasons: {moderate.map((c, i) => (
                  <span key={c.slug}>{i > 0 && ", "}<Link href={`/soil/${c.slug}`} className="text-gold-600 hover:underline font-medium">{c.county} (pH {c.pH})</Link></span>
                ))}.
              </p>
            </section>
          )}

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Fix: Agricultural Lime</h2>
            <p className="text-soil-500 leading-relaxed mb-4">Agricultural lime (calcium carbonate) neutralizes soil acidity by replacing hydrogen ions with calcium. Apply 2 bags (100kg) per acre for soils with pH 4.5–5.0, or 1–1.5 bags for pH 5.0–5.5. Spread evenly and incorporate into the top 15cm of soil. Allow 2–4 weeks before planting for the lime to react.</p>
            <p className="text-soil-500 leading-relaxed mb-4">At subsidized rates, lime costs KES {limePrice?.subsidized?.toLocaleString() || "1,500"} per 50kg bag. For a 2-acre shamba in <Link href="/soil/kiambu" className="text-gold-600 hover:underline font-medium">Kiambu</Link> (pH {counties.find(c => c.county === "Kiambu")?.pH}), that is 4 bags = KES {((limePrice?.subsidized || 1500) * 4).toLocaleString()}. This one-time investment can improve yields for 2–3 seasons before re-application is needed.</p>
            <p className="text-soil-500 leading-relaxed mb-4">If your soil is acidic, you should also use Mavuno or YaraMila instead of standard DAP for planting fertilizer. These blends are formulated for acidic conditions and include micronutrients that help mitigate aluminium toxicity. See our <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-medium">fertilizer comparison guide</Link> for details.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Crops That Tolerate Acidity</h2>
            <p className="text-soil-500 leading-relaxed mb-4">While liming is the long-term solution, some crops handle acidic soil better than others. <Link href="/crops/tea" className="text-gold-600 hover:underline font-medium">Tea</Link> actually prefers acidic conditions (pH 4.5–5.5), which is why it thrives in the Central Highlands. <Link href="/crops/potatoes" className="text-gold-600 hover:underline font-medium">Potatoes</Link> tolerate pH as low as 5.2, and <Link href="/crops/sweet-potato" className="text-gold-600 hover:underline font-medium">sweet potatoes</Link> can handle even lower. <Link href="/crops/cassava" className="text-gold-600 hover:underline font-medium">Cassava</Link> is another strong option for acidic soils.</p>
            <p className="text-soil-500 leading-relaxed">For a full analysis of which crops match your county&apos;s soil, check your <Link href="/soil" className="text-gold-600 hover:underline font-medium">county soil report</Link> or use the <Link href="/app" className="text-gold-600 hover:underline font-medium">ShambaIQ recommendation tool</Link> which scores all 25 crops against your specific soil conditions.</p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Is your soil acidic?</h2>
          <p className="text-cream-400 mb-6">Check your county&apos;s pH and get a lime + fertilizer plan tailored to your farm.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Check My Soil →</Link>
        </div>
      </article>
    </>
  );
}
