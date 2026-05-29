import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Onion Farming in Kajiado: Sulfur Nutrition & Drip Irrigation",
  description:
    "Master bulb onion farming in Kajiado county. Learn Red Coach F1 nursery setup, alkaline-neutral soil biology (pH 6.55), and sulfur fertilization.",
  openGraph: { title: "Onion Farming in Kajiado: Sulfur Nutrition & Drip Irrigation", images: ["/api/og"] },
};

export default function OnionFarmingKajiado() {
  const counties = getCountySoils();
  const prices = getPrices();

  const kajiado = counties.find((c) => c.county.toLowerCase() === "kajiado");

  const canPrice = prices.find((p) => p.fertilizer.toLowerCase() === "can");
  const npkPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("17:17:17") || p.fertilizer.toLowerCase().includes("npk"));
  const ureaPrice = prices.find((p) => p.fertilizer.toLowerCase() === "urea");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Onion Farming in Kajiado: Sulfur Nutrition & Drip Irrigation",
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
        name: "What is the best onion variety for Kajiado county?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Red Coach F1 is the absolute market champion for Kajiado. It produces medium to large, deep-red bulbs with compact skins, which gives it an extraordinary shelf life of up to 5 months. Other options include Red Pinoy and Texas Grano (yellow onion with high yields but shorter shelf life).",
        },
      },
      {
        "@type": "Question",
        name: "Does Kajiado soil suit onion farming?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Kajiado has an outstanding average soil pH of 6.55, which is perfectly within the onion's preferred range (6.0 to 6.8). However, organic carbon is relatively low (13.4 g/kg), meaning organic manure and humic substances are crucial for moisture retention and soil structure.",
        },
      },
      {
        "@type": "Question",
        name: "Why is sulfur important for onions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sulfur is the key nutrient responsible for onion pungency (the strong smell/taste) and skin firmness. Ample sulfur prevents skin cracking and rot, which dramatically extends the bulb's shelf life.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Onion Farming Kajiado" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Crop Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Onion Farming in Kajiado: Sulfur Nutrition & Drip Irrigation</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Commercial bulb onion production under semi-arid conditions. We explore Kajiado's optimal soil pH (average {kajiado?.pH || "6.55"}), organic carbon restoration, drip irrigation design, and sulfur-led nutrition.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Kajiado Onion Boom</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Onions (<em>Allium cepa</em>) have transformed Kajiado County—specifically districts like Isinya, Loitokitok, Kimana, and Kajiado Central—into lucrative farming hubs. The abundant solar radiation, high temperatures, and vast flat plains are ideal for high-yield bulb formation.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              However, farming in a semi-arid zone comes with technical requirements. Success hinges on a precise balance between <strong>Drip Irrigation management</strong>, soil organic carbon conservation, and targeted mineral fertilization.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Kajiado Soil Analysis: Optimal pH, Low Carbon</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Let's evaluate the satellite soil data for Kajiado County to understand what the bulb crop is interacting with:
            </p>
            <div className="p-5 bg-white rounded-xl border border-cream-300 mb-6">
              <span className="font-semibold text-forest-700 block text-lg mb-2">Kajiado County Soil Chemistry Profile</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Average pH</span>
                  <span className="text-lg font-bold text-forest-700">{kajiado?.pH || "6.55"}</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Total Nitrogen</span>
                  <span className="text-lg font-bold text-amber-600">{kajiado?.nitrogen || "0.97"} g/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable P</span>
                  <span className="text-lg font-bold text-forest-700">{kajiado?.phosphorus || "20.6"} mg/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable K</span>
                  <span className="text-lg font-bold text-forest-700">{kajiado?.potassium || "257.0"} mg/kg</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Attention:</strong> Organic Carbon in Kajiado is only <strong>{kajiado?.organicCarbon || "13.4"} g/kg</strong>. This is below the optimal threshold (20 g/kg) and indicates a high risk of soil compaction and rapid moisture evaporation.
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed mb-4">
              Kajiado's average soil pH of <strong>{kajiado?.pH || "6.55"}</strong> is outstanding. Onions struggle in highly acidic soils (under 5.5) where aluminum toxicity limits roots, but thrive in Kajiado's neutral range. However, the low Organic Carbon limits water-holding capacity.
            </p>
            <p className="text-soil-500 leading-relaxed">
              Before planting, it is mandatory to incorporate high volumes of composted farmyard manure (at least 5–10 tonnes per acre). Read our <Link href="/blog/organic-soil-enrichment-kenya-soil-carbon" className="text-gold-600 hover:underline font-semibold">organic carbon enrichment guide</Link> to learn proper carbon restoration strategies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Drip Irrigation Factor</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Onions are shallow-rooted crops with high water sensitivity. Overhead furrow irrigation in Kajiado leads to soil crusting and high weed pressure. Drip irrigation is the gold standard:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Drip Lines</strong>: Install double-row drip lines per bed, with drippers spaced at 10cm or 15cm.
              </li>
              <li>
                <strong className="text-forest-700">Watering Schedule</strong>: Water frequently but in light amounts (15 to 20 minutes daily or every other day) rather than heavy weekly waterings. This prevents bulb cracking.
              </li>
              <li>
                <strong className="text-forest-700">Curing Stage</strong>: Stop irrigation completely 2 to 3 weeks before harvesting. This allows the onion necks to fall over naturally, letting the bulbs dry and form thick protective paper skins.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Sulfur-Led Nutrition & Fertilizer Selection</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Onions need sulfur to build defensive oils and pungency. Applying standard CAN and Urea is good for foliage, but sulfur-containing compounds are what build top-grade bulbs:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Fertilizer Product</th>
                    <th className="text-left py-2 font-semibold">Recommended Timing</th>
                    <th className="text-left py-2 font-semibold">Subsidy Cost (50kg)</th>
                    <th className="text-left py-2 font-semibold">Commercial Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">NPK 17:17:17</td>
                    <td className="py-2.5">At transplanting (basal dressing)</td>
                    <td className="py-2.5">KES {npkPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {npkPrice?.commercial?.toLocaleString() || "6,000"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">CAN (Calcium Nitrogen)</td>
                    <td className="py-2.5">Top-dress at Week 3 (foliar development)</td>
                    <td className="py-2.5">KES {canPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {canPrice?.commercial?.toLocaleString() || "3,800"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Urea (or Ammonium Sulfate)</td>
                    <td className="py-2.5">Top-dress at Week 6 (bulb swelling stage)</td>
                    <td className="py-2.5">KES {ureaPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {ureaPrice?.commercial?.toLocaleString() || "4,000"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              For complete details on application frequencies, check our <Link href="/blog/how-much-fertilizer-per-acre-calculator" className="text-gold-600 hover:underline font-semibold">fertilizer per acre calculator</Link> or review <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-semibold">fertilizer selections</Link> to ensure you purchase sulfate-based options.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Optimize your Kajiado onion farm</h2>
          <p className="text-cream-400 mb-6">Access professional soil recommendations and find vetted drip-irrigation technicians and certified seeds in Loitokitok or Isinya.</p>
          <Link href="/app?county=Kajiado&crop=Onion" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Generate Precision Report →</Link>
        </div>
      </article>
    </>
  );
}
