import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Kakamega Soil: Why Western Kenya Needs Mavuno, Not DAP",
  description:
    "Western Kenya's highly acidic soils chemically lock standard DAP fertilizer. Learn why data-driven farming suggests using Mavuno for planting instead.",
  openGraph: { title: "Kakamega Soil: Why Western Kenya Needs Mavuno, Not DAP", images: ["/api/og"] },
};

export default function KakamegaMavunoGuide() {
  const counties = getCountySoils();
  const prices = getPrices();

  const kakamega = counties.find((c) => c.county.toLowerCase() === "kakamega");
  const bungoma = counties.find((c) => c.county.toLowerCase() === "bungoma");
  const vihiga = counties.find((c) => c.county.toLowerCase() === "vihiga");
  const busia = counties.find((c) => c.county.toLowerCase() === "busia");

  const mavunoPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("mavuno"));
  const dapPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("dap"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Kakamega Soil: Why Western Kenya Needs Mavuno, Not DAP",
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
        name: "Why is standard DAP fertilizer ineffective in Kakamega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kakamega's soils are highly acidic (pH below 5.5). In acidic soils, the phosphorus in DAP chemically bonds with aluminium and iron, creating insoluble compounds that plant roots cannot absorb. This is called 'phosphorus locking'.",
        },
      },
      {
        "@type": "Question",
        name: "What makes Mavuno planting fertilizer different?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mavuno contains essential calcium, magnesium, sulphur, and key micronutrients (boron, zinc). Its compound structure is specifically designed not to acidify the soil further, keeping the phosphorus active and plant-available.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Kakamega Mavuno Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Soil Science</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Kakamega Soil: Why Western Kenya Needs Mavuno, Not DAP</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Acidity in Western Kenya soils is severely reducing the efficiency of standard fertilizers. Agricultural data reveals why Mavuno vastly outperforms DAP in Western shambas.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 7 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Chemical Trap: Phosphorus Locking in Acidic Soils</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Western Kenya, particularly Kakamega County, is known for its excellent rainfall and agricultural potential. However, decades of continuous maize farming and heavy applications of Diammonium Phosphate (DAP) have severely acidified the soil. 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              When the soil pH drops below <strong>5.5</strong>, a critical chemical reaction occurs. The phosphorus contained in standard DAP becomes chemically locked by active aluminium and iron ions. Even though a farmer purchases and spreads the fertilizer, their crops are unable to absorb the phosphorus, leading to stunted roots, purplish leaves, and poor yields.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Western Kenya soil pH Profile</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Based on recent satellite soil tests covering the region, the average soil pH across Western Kenya's major counties indicates critical acidity:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700">Kakamega County</span>
                <span className="text-sm font-bold text-red-600 block">pH {kakamega?.pH || "5.10"} (Highly Acidic)</span>
              </div>
              <div className="p-3 rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700">Vihiga County</span>
                <span className="text-sm font-bold text-red-600 block">pH {vihiga?.pH || "5.02"} (Highly Acidic)</span>
              </div>
              <div className="p-3 rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700">Bungoma County</span>
                <span className="text-sm font-bold text-red-600 block">pH {bungoma?.pH || "5.32"} (Highly Acidic)</span>
              </div>
              <div className="p-3 rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700">Busia County</span>
                <span className="text-sm font-bold text-red-600 block">pH {busia?.pH || "5.45"} (Acidic Boundary)</span>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed">
              Because Vihiga (pH {vihiga?.pH || "5.02"}) and Kakamega (pH {kakamega?.pH || "5.10"}) are heavily leached by tropical rains, using traditional acidifying fertilizers like DAP makes the soil increasingly uncooperative with each passing season.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Solution: Why Mavuno Outperforms DAP</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              <strong>Mavuno (Planting) Fertilizer</strong> is specifically blended to mitigate soil acidity. Unlike DAP, which has an acidifying effect on the soil, Mavuno contains:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li><strong>Calcium (Ca)</strong>: Directly neutralizes soil acids and improves cell wall strength in maize.</li>
              <li><strong>Magnesium (Mg)</strong>: Restores active photosynthesis, correcting the yellowing leaves common in Western shambas.</li>
              <li><strong>Sulphur (S)</strong>: Promotes protein synthesis and optimal crop vigor.</li>
              <li><strong>Micronutrients (Boron, Zinc)</strong>: Crucial for uniform pollination and high grain density.</li>
            </ul>
            <p className="text-soil-500 leading-relaxed mt-4">
              By using Mavuno instead of DAP, the phosphorus remains fully available even in highly acidic soils, resulting in thicker roots, stronger stalks, and a yield improvement of up to 40%. For detailed, crop-specific practices in the Western zone, consult our <Link href="/blog/bean-farming-kakamega" className="text-gold-600 hover:underline font-semibold">Kakamega bean farming guide</Link> which highlights crucial seed inoculation methods.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Savings and Economics Comparison</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Let's look at the financial comparison for a typical 1-acre shamba in Kakamega using subsidized or commercial prices:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Fertilizer Type</th>
                    <th className="text-left py-2">Subsidized Price</th>
                    <th className="text-left py-2">Commercial Price</th>
                    <th className="text-left py-2 text-green-700">Yield Potential (Bags/Acre)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">DAP (Diammonium Phosphate)</td>
                    <td className="py-2">KES {dapPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2">KES {dapPrice?.commercial?.toLocaleString() || "6,200"}</td>
                    <td className="py-2">12 – 16 bags</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-bold text-green-700">Mavuno (Planting)</td>
                    <td className="py-2 font-bold">KES {mavunoPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2 font-bold">KES {mavunoPrice?.commercial?.toLocaleString() || "5,800"}</td>
                    <td className="py-2 font-bold text-green-700">22 – 28 bags</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              At identical subsidized prices (KES {dapPrice?.subsidized?.toLocaleString() || "2,500"} per 50kg bag), choosing Mavuno is a zero-cost upgrade that unlocks an extra 6 to 12 bags of maize per acre. Over a single season, that amounts to an additional KES 25,000 to KES 50,000 in net profit.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Check soil recommendations for Western Kenya</h2>
          <p className="text-cream-400 mb-6">See exactly how Vihiga, Kakamega, or Bungoma soils match against certified seed and fertilizer brands.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Check Western Soils →</Link>
        </div>
      </article>
    </>
  );
}
