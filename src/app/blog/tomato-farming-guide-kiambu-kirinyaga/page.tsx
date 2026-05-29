import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Tomato Farming in Kiambu & Kirinyaga: Blossom End Rot & Yields",
  description:
    "Grow highly profitable open-field or greenhouse tomatoes in Kirinyaga & Kiambu. Learn county soil conditions, fertilizer guides, and calcium nutrition.",
  openGraph: { title: "Tomato Farming in Kiambu & Kirinyaga: Blossom End Rot & Yields", images: ["/api/og"] },
};

export default function TomatoFarmingGuide() {
  const counties = getCountySoils();
  const prices = getPrices();

  const kiambu = counties.find((c) => c.county.toLowerCase() === "kiambu");
  const kirinyaga = counties.find((c) => c.county.toLowerCase() === "kirinyaga");

  const canPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("can"));
  const npkPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("15:15:15") || p.fertilizer.toLowerCase().includes("npk"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tomato Farming in Kiambu & Kirinyaga: Blossom End Rot & Yields",
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
        name: "What causes Blossom End Rot in tomatoes and how do I prevent it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Blossom End Rot is a physiological disorder caused by calcium deficiency in the fruit. It results in dark, leathery spots at the bottom of tomatoes. Prevent it by ensuring uniform soil moisture (irrigation) and applying Calcium Ammonium Nitrate (CAN) or specialized foliar calcium fertilizers.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best fertilizer program for commercial tomatoes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "At planting, use a compound fertilizer high in phosphorus (like NPK 15:15:15 or specialized planting blends). Top-dress with Calcium Ammonium Nitrate (CAN) 3 to 4 weeks later, and switch to a potassium-rich compound (like YaraMila Winner) during fruit setting and maturation.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Tomato Farming Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Crop Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Tomato Farming in Kiambu & Kirinyaga: Blossom End Rot & Yields</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Commercial tomato cultivation under irrigation and greenhouse systems. We analyze Kirinyaga and Kiambu soils, calcium nutrition, and fertilizer selection.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Tomato Goldmine: Kenya's Most Demanded Horticrop</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Tomato (<em>Solanum lycopersicum</em>) is the absolute crown jewel of commercial vegetable farming in Kenya. Counties like Kirinyaga (specifically the Mwea irrigation plains) and Kiambu supply the bulk of tomatoes consumed in Nairobi's major markets.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Because of high consumption rates, tomato farming can be incredibly lucrative, with net profits exceeding <strong>KES 200,000 per acre</strong> under optimal management. However, tomatoes are also highly sensitive crops. A single physiological mistake or pest outbreak (like Tomato Leafminer / <em>Tuta absoluta</em>) can destroy an entire field within days.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">County Soils Suitability Profile</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Tomatoes require deep, fertile sandy loam soils with moderate acidity (pH 6.0 to 6.8) and good drainage to prevent bacterial wilt. Let's look at the soil profiles:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700 block text-lg">Kirinyaga County</span>
                <span className="text-sm font-bold text-amber-600 block mt-1">Average pH: {kirinyaga?.pH || "6.12"}</span>
                <p className="text-xs text-soil-400 mt-2">
                  Excellent soil structure in Mwea plains, but continuous cultivation of tomatoes and rice has depleted trace elements (Calcium and Zinc). Good moisture retention, but drainage is critical.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700 block text-lg">Kiambu County</span>
                <span className="text-sm font-bold text-amber-600 block mt-1">Average pH: {kiambu?.pH || "5.72"}</span>
                <p className="text-xs text-soil-400 mt-2">
                  Moderately acidic volcanic soils. Tomatoes thrive here, but high organic acidity can lock calcium absorption. Applying lime or compound NPKs with added calcium is essential.
                </p>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed">
              If your Kiambu shamba has severe acidity, chemical locking can occur. See our <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-semibold">DAP vs CAN vs NPK guide</Link> to select fertilizers that do not acidify your soil further.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Calcium Connection: Preventing Blossom End Rot</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Ask any tomato farmer in Mwea or Limuru about their biggest heartbreak, and they will tell you about <strong>Blossom End Rot</strong>. 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              This condition appears as a flat, dark, leathery patch at the bottom of the tomato fruit. It is caused by <strong>Calcium (Ca) deficiency</strong>. However, the root cause is rarely a lack of calcium in the soil itself. Instead, it is usually caused by <strong>irregular watering</strong>. 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Calcium is translocated through the plant solely via water evaporation (transpiration). If the soil dries out completely and is then heavily flooded, the plant cannot absorb calcium uniformly, causing cells in developing fruit to collapse.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-soil-500">
              <strong className="text-amber-800 font-bold block mb-1">Blossom End Rot Prevention Protocol:</strong>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li>Maintain uniform soil moisture using <strong>drip irrigation</strong>. Don't let your soil alternate between desert-dry and flooded.</li>
                <li>Apply <strong>Calcium Ammonium Nitrate (CAN)</strong> as your primary nitrogen top-dresser. CAN contains soluble calcium that immediately stabilizes fruit cell walls.</li>
                <li>Apply foliar calcium sprays during early flowering and fruit set.</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Tomato Fertilizer Schedule</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Tomatoes require a three-stage nutritional program to achieve maximum yield density:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Growth Stage</th>
                    <th className="text-left py-2 font-semibold">Best Fertilizer</th>
                    <th className="text-left py-2 font-semibold">Primary Nutrient Focus</th>
                    <th className="text-left py-2 font-semibold">Subsidy Cost (50kg)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Planting (Week 1)</td>
                    <td className="py-2.5">Compound NPK (e.g. 15:15:15)</td>
                    <td className="py-2.5">Phosphorus (Root development)</td>
                    <td className="py-2.5">KES {npkPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Vegetative Growth (Week 3–4)</td>
                    <td className="py-2.5">CAN (Calcium Ammonium Nitrate)</td>
                    <td className="py-2.5">Nitrogen & Calcium (Vigor & Strength)</td>
                    <td className="py-2.5">KES {canPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Flowering & Fruiting (Week 6+)</td>
                    <td className="py-2.5">NPK High-K (e.g. YaraMila Winner)</td>
                    <td className="py-2.5">Potassium (Fruit size & sweetness)</td>
                    <td className="py-2.5">Commercial Blends (~KES 6,200)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              To calculate the exact number of bags required for your planting area (e.g. 1/4 acre or 2 acres), check our <Link href="/blog/how-much-fertilizer-per-acre-calculator" className="text-gold-600 hover:underline font-semibold">fertilizer bags per acre calculator</Link>.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Maximize your tomato profits today</h2>
          <p className="text-cream-400 mb-6">See exactly how Kiambu or Kirinyaga soils match up against compound fertilizers and water requirements.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Check Tomato Inputs →</Link>
        </div>
      </article>
    </>
  );
}
