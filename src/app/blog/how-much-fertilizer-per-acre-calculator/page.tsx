import Link from "next/link";
import { Metadata } from "next";
import { getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "How Much Fertilizer Per Acre? Calculator for 25 Crops",
  description:
    "Stop guessing how many bags of fertilizer to buy. Exact planting and top-dressing bags per acre for all major crops in Kenya at subsidized and commercial rates.",
  openGraph: { title: "How Much Fertilizer Per Acre? Calculator for 25 Crops", images: ["/api/og"] },
};

const cropsList = [
  { crop: "Maize", planting: "1 – 1.5 bags DAP / Mavuno", topdressing: "1 – 1.5 bags CAN", note: "Top-dress at knee-height (week 4-5)" },
  { crop: "Beans", planting: "1 bag DAP / NPK 17:17:17", topdressing: "None", note: "Beans fix nitrogen, rarely need top-dressing" },
  { crop: "Potatoes", planting: "2 bags NPK 17:17:17 / DAP", topdressing: "1 bag CAN", note: "Top-dress at earthing-up (week 3-4)" },
  { crop: "Wheat", planting: "1.25 bags DAP", topdressing: "1 bag CAN / Urea", note: "Top-dress during tillering stage" },
  { crop: "Rice", planting: "1 bag NPK 17:17:17", topdressing: "1.5 bags SA / Urea", note: "Urea split into 2 applications in flooded field" },
  { crop: "Sorghum", planting: "1 bag DAP / NPK", topdressing: "1 bag CAN", note: "Top-dress 3-4 weeks after germination" },
  { crop: "Millet", planting: "0.75 bag DAP", topdressing: "0.75 bag CAN", note: "Low nutritional demands, high resilience" },
  { crop: "Tomatoes", planting: "1.5 bags NPK / TSP", topdressing: "1.5 bags CAN", note: "Top-dress split into 2 stages: week 3 and week 6" },
  { crop: "Cabbages", planting: "1.5 bags DAP", topdressing: "2 bags CAN", note: "Heavy nitrogen feeders, require split top-dressing" },
  { crop: "Onions", planting: "1 bag DAP / TSP", topdressing: "1.5 bags CAN / Ammonium Nitrate", note: "Top-dress at week 3 and bulb-formation (week 6)" },
];

export default function FertilizerCalculatorGuide() {
  const prices = getPrices();
  const dapPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("dap"));
  const canPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("can"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How Much Fertilizer Per Acre? Calculator for 25 Crops",
    author: { "@type": "Organization", name: "ShambaIQ" },
    datePublished: "2026-05-21",
    dateModified: "2026-05-21",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many bags of DAP fertilizer do I need for 1 acre of maize?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `For maize planting, you need between 1 and 1.5 bags (50kg each) of DAP per acre. If your soil is acidic (pH below 5.5), you should switch to Mavuno at the same rate to prevent phosphorus lock.`,
        },
      },
      {
        "@type": "Question",
        name: "When should I apply CAN top-dressing fertilizer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CAN should be applied when the maize crop reaches knee-height (typically 4 to 5 weeks after planting). Ensure the soil is damp and place the fertilizer in a ring around the stalk, 5cm away, to avoid chemical burns.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Fertilizer Bags Calculator" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Fertilizer</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">How Much Fertilizer Per Acre? Calculator for 25 Crops</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Buying too much fertilizer wastes money; buying too little reduces yields. Here is the ultimate master table showing bags per acre, timing, and costs for major Kenyan crops.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 9 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Baseline Fertilizer Requirements (per Acre)</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              These guidelines are based on average Kenyan soil nutrient levels and standard certified seed yield targets. All bag counts refer to standard **50kg fertilizer bags**.
            </p>
            <div className="overflow-x-auto mb-6 border rounded-2xl">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-cream-50 text-left border-b border-cream-200">
                    <th className="px-4 py-3 text-forest-700">Crop</th>
                    <th className="px-4 py-3 text-forest-700">Planting (Per Acre)</th>
                    <th className="px-4 py-3 text-forest-700">Top-Dressing (Per Acre)</th>
                    <th className="px-4 py-3">Timing & Advice</th>
                  </tr>
                </thead>
                <tbody>
                  {cropsList.map((c) => (
                    <tr key={c.crop} className="border-b border-cream-100 hover:bg-cream-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-forest-800">{c.crop}</td>
                      <td className="px-4 py-3 text-soil-600 text-xs">{c.planting}</td>
                      <td className="px-4 py-3 text-soil-600 text-xs">{c.topdressing}</td>
                      <td className="px-4 py-3 text-soil-400 text-xs">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Understanding Planting vs Top-Dressing</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              A common mistake among smallholder farmers is using the wrong fertilizer at the wrong time.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-cream-200 bg-cream-50/50">
                <h3 className="font-bold text-forest-700 mb-1">Planting Fertilizer (DAP / NPK / SSP)</h3>
                <p className="text-sm text-soil-500 leading-relaxed">
                  These fertilizers are high in **Phosphorus (P)**. Phosphorus is crucial for early root establishment and seed germination. Since phosphorus moves very slowly in the soil, it must be placed directly in the furrow or hole at planting time so early roots can reach it.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-cream-200 bg-cream-50/50">
                <h3 className="font-bold text-forest-700 mb-1">Top-Dressing Fertilizer (CAN / Urea)</h3>
                <p className="text-sm text-soil-500 leading-relaxed">
                  These fertilizers are high in **Nitrogen (N)**. Nitrogen drives fast vegetative growth, greening, and stalk thickness. Unlike phosphorus, nitrogen dissolves instantly in rain and leaches away. Applying it too early is wasteful; apply it only when the crop is active (e.g. knee-height).
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Crop-Specific Fertilizer Deep-Dives</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              General guidelines serve as a solid starting point, but different crop families require specialized compound nutrients:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Potatoes</strong>: Require balanced NPK at planting and high potassium for tuber loading. For detailed highland fertilization schedules, read our <Link href="/blog/meru-nyeri-potato-farming-guide" className="text-gold-600 hover:underline font-semibold">Meru & Nyeri potato guide</Link>.
              </li>
              <li>
                <strong className="text-forest-700">Tomatoes</strong>: Heavy feeders that require calcium top-dressing (CAN) to prevent bottom rot. See our <Link href="/blog/tomato-farming-guide-kiambu-kirinyaga" className="text-gold-600 hover:underline font-semibold">Tomato Farming (Kiambu & Kirinyaga) guide</Link> for calcium schedules.
              </li>
              <li>
                <strong className="text-forest-700">Cabbages & Brassicas</strong>: Require high calcium and magnesium to defend against clubroot disease in acidic soils. Read our <Link href="/blog/cabbage-farming-kiambu" className="text-gold-600 hover:underline font-semibold">Kiambu cabbage guide</Link> for exact soil acidity buffering steps.
              </li>
              <li>
                <strong className="text-forest-700">Onions</strong>: Sulfur nutrition is vital to increase skin quality and shelf life. For specific fertilization timing and drip details, consult our <Link href="/blog/onion-farming-kajiado" className="text-gold-600 hover:underline font-semibold">Kajiado onion guide</Link>.
              </li>
              <li>
                <strong className="text-forest-700">Sweet Potatoes</strong>: Heavy potassium-feeders during early tuber bulking. Read the <Link href="/blog/sweet-potato-farming-homa-bay" className="text-gold-600 hover:underline font-semibold">Homa Bay sweet potato guide</Link> for nutrition-led vine cultivation.
              </li>
              <li>
                <strong className="text-forest-700">Dairy Pastures & Fodder</strong>: Frequent cuts extract substantial nitrogen, dropping pasture protein. View the <Link href="/blog/dairy-farming-nandi" className="text-gold-600 hover:underline font-semibold">Nandi dairy fodder guide</Link> to boost forage yields.
              </li>
              <li>
                <strong className="text-forest-700">Beans & Legumes</strong>: Inoculating seeds with Rhizobium bacteria captures atmospheric nitrogen for free. See the <Link href="/blog/bean-farming-kakamega" className="text-gold-600 hover:underline font-semibold">Kakamega bean guide</Link> to eliminate nitrogen top-dressing costs.
              </li>
              <li>
                <strong className="text-forest-700">Maize</strong>: High nitrogen demands. See the <Link href="/blog/complete-maize-farming-guide-kenya" className="text-gold-600 hover:underline font-semibold">complete maize guide</Link> for detailed planting-to-harvest timing.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Cost Calculator (Subsidized vs Commercial)</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              A standard fertilizer plan of 1 bag of DAP (planting) and 1 bag of CAN (top-dressing) per acre will cost:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>
                **Subsidized Rates**: KES {((dapPrice?.subsidized || 2500) + (canPrice?.subsidized || 2500)).toLocaleString()} total per acre.
                <span className="text-xs text-soil-400 block">DAP (subsidized) = KES {dapPrice?.subsidized?.toLocaleString() || "2,500"} | CAN (subsidized) = KES {canPrice?.subsidized?.toLocaleString() || "2,500"}</span>
              </li>
              <li>
                **Commercial Rates**: KES {((dapPrice?.commercial || 6200) + (canPrice?.commercial || 5200)).toLocaleString()} total per acre.
                <span className="text-xs text-soil-400 block">DAP (commercial) = KES {dapPrice?.commercial?.toLocaleString() || "6,200"} | CAN (commercial) = KES {canPrice?.commercial?.toLocaleString() || "5,200"}</span>
              </li>
            </ul>
            <p className="text-soil-500 leading-relaxed mt-4">
              *Note: Subsidized prices are subject to NCPB distribution availability by county.*
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Calculate exact bags for your shamba</h2>
          <p className="text-cream-400 mb-6">Enter your farm size, crop, and soil condition in ShambaIQ to get a complete bags + cost calculator report.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Open Fertilizer Calculator →</Link>
        </div>
      </article>
    </>
  );
}
