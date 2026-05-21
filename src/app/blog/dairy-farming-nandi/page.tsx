import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Dairy Farming & Fodder in Nandi: Protein Yields & Soil Science",
  description:
    "Boost milk production in Nandi county. Learn how soil chemistry (pH 6.17) fuels high-protein Napier, Boma Rhodes, and fodder maize cultivation.",
  openGraph: { title: "Dairy Farming & Fodder in Nandi: Protein Yields & Soil Science", images: ["/api/og"] },
};

export default function DairyFarmingNandi() {
  const counties = getCountySoils();
  const prices = getPrices();

  const nandi = counties.find((c) => c.county.toLowerCase() === "nandi");

  const canPrice = prices.find((p) => p.fertilizer.toLowerCase() === "can");
  const npkPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("17:17:17") || p.fertilizer.toLowerCase().includes("npk"));
  const ureaPrice = prices.find((p) => p.fertilizer.toLowerCase() === "urea");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dairy Farming & Fodder in Nandi: Protein Yields & Soil Science",
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
        name: "What are the best fodder crops for dairy cows in Nandi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Napier grass (especially the Super Napier / Pakchong 1 variety) is excellent for year-round green chop. Boma Rhodes (Chloris gayana) is outstanding for hay production. Fodder maize (harvested at the milk stage) offers the absolute best energy-density for silage.",
        },
      },
      {
        "@type": "Question",
        name: "How does Nandi's soil suitability affect pasture farming?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nandi possesses highly fertile Rift Valley soils with an optimal average pH of 6.17, high nitrogen (1.37 g/kg), and high phosphorus (26.4 mg/kg). This is highly suitable for fodder, but intensive cutting extracts huge amounts of nitrogen, meaning regular top-dressing is vital to maintain crude protein levels.",
        },
      },
      {
        "@type": "Question",
        name: "How does fodder fertilization affect milk yields?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fodder fertilized with nitrogen-rich compounds (like CAN or Urea) has a significantly higher crude protein content (12–16% compared to 6–8% in unfertilized grass). Higher protein grass translates directly into high rumen activity, boosting dairy cow milk output by 20% to 35%.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Dairy Farming Nandi" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Dairy Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Dairy Farming & Fodder in Nandi: Protein Yields & Soil Science</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Maximizing milk production in Kenya's dairy heartland. We analyze Nandi's premium Rift Valley soils (average pH {nandi?.pH || "6.17"}), high-quality Boma Rhodes and Super Napier husbandry, and nitrogen-led feeding systems.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Nandi County: The Golden Dairy Zone</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Nandi County is one of the highest-producing dairy zones in East Africa. Highland regions like Kapsabet, Nandi Hills, and Kabiyet offer cool, temperate weather and ample rainfall, which are perfect for purebred dairy cattle (Holstein-Friesians, Ayrshires, Guernseys, and Jerseys).
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              However, dairy profitability isn't determined in the milking parlor—it is determined in the shamba. High-producing cows require huge amounts of **Crude Protein** and **Energy**. Relying on natural, unfertilized pastures results in stunted, low-nutrition grazing, which forces farmers to spend fortunes on commercial dairy meals. The secret to high profit margins is high-nutrient fodder production.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Nandi Soil Analysis: Fertile Soils, Intensive Depletion Risk</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Fodder crops are massive nutrient extractors. Every time you cut Napier grass or bale Rhodes grass, you withdraw kilograms of Nitrogen, Phosphorus, and Potassium from the soil. Let's look at Nandi's soil data:
            </p>
            <div className="p-5 bg-white rounded-xl border border-cream-300 mb-6">
              <span className="font-semibold text-forest-700 block text-lg mb-2">Nandi County Soil Chemistry Profile</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Average pH</span>
                  <span className="text-lg font-bold text-forest-700">{nandi?.pH || "6.17"}</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Total Nitrogen</span>
                  <span className="text-lg font-bold text-forest-700">{nandi?.nitrogen || "1.37"} g/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable P</span>
                  <span className="text-lg font-bold text-forest-700">{nandi?.phosphorus || "26.4"} mg/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable K</span>
                  <span className="text-lg font-bold text-forest-700">{nandi?.potassium || "207.0"} mg/kg</span>
                </div>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed mb-4">
              Nandi has some of the healthiest soils in Kenya. With an average pH of **{nandi?.pH || "6.17"}**, the soil is only slightly acidic and sits in the ideal zone for high-yield agriculture. Total nitrogen (**{nandi?.nitrogen || "1.37"} g/kg**) and phosphorus (**{nandi?.phosphorus || "26.4"} mg/kg**) are exceptionally strong.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Unlike the heavily acidic Central Highlands counties (detailed in our <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-semibold">soil acidity guide</Link>), Nandi's pH doesn't lock phosphorus. This allows fodder crops to establish deep, vigorous root networks easily.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              However, high nitrogen extraction from fodder maize or Napier grass quickly depletes this natural reserve. If the extracted nitrogen is not replenished:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>
                Fodder grass turns pale yellow and growth rates stall.
              </li>
              <li>
                The **Crude Protein** content of the grass plummets from an optimal 14% to under 6%.
              </li>
              <li>
                Cows consume large volumes of dry matter but remain protein-deficient, resulting in a **20% to 35% drop in milk yields**.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">High-Yielding Fodder Options for Nandi</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              A balanced dairy farm requires a mix of fiber, protein, and starch fodder options:
            </p>
            <ol className="list-decimal pl-5 my-2 space-y-3 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Super Napier (Pakchong 1)</strong>: A highly yielding hybrid Napier grass containing 16–18% crude protein when harvested at 1.5 meters. It grows extremely fast under Kapsabet's rainfall pattern.
              </li>
              <li>
                <strong className="text-forest-700">Boma Rhodes (Chloris gayana)</strong>: The premium grass for baling hay. It grows exceptionally well in Nandi's loam soils, providing a clean source of digestible dry fiber.
              </li>
              <li>
                <strong className="text-forest-700">Fodder Maize Silage</strong>: Grow specialized high-biomass maize varieties (like H628 or H629). Harvest when the grains are in the "dough/milk" stage. Silage provides the high starch and energy required to sustain peak milk volume.
              </li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Nitrogen Top-Dressing & Fertilization Costs</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              For fodder crops, Nitrogen is the single most critical nutrient. Apply NPK compound at planting, and top-dress with high-nitrogen fertilizers like Urea or CAN immediately after every single harvest cut:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Fertilizer Type</th>
                    <th className="text-left py-2 font-semibold">Application Routine</th>
                    <th className="text-left py-2 font-semibold">Subsidy Cost (50kg)</th>
                    <th className="text-left py-2 font-semibold">Commercial Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Urea (46% Nitrogen)</td>
                    <td className="py-2.5">Top-dress 50kg/acre immediately after a cutting (in wet soil)</td>
                    <td className="py-2.5">KES {ureaPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {ureaPrice?.commercial?.toLocaleString() || "4,000"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">CAN (Calcium Ammonium Nitrate)</td>
                    <td className="py-2.5">Alternative top-dressing, supplies root-protecting calcium</td>
                    <td className="py-2.5">KES {canPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {canPrice?.commercial?.toLocaleString() || "3,800"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">NPK 17:17:17</td>
                    <td className="py-2.5">Basal dressing at planting or during annual field rejuvenation</td>
                    <td className="py-2.5">KES {npkPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {npkPrice?.commercial?.toLocaleString() || "6,000"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              Review our <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-semibold">commercial fertilizer analysis</Link> to compare release speeds, and use our <Link href="/blog/how-much-fertilizer-per-acre-calculator" className="text-gold-600 hover:underline font-semibold">bags per acre calculator</Link> to budget requirements across massive acreage fields.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Maximize your Nandi milk production</h2>
          <p className="text-cream-400 mb-6">Locate certified dairy suppliers and animal feeds, analyze soil coordinates, and find vetted agricultural input dealers in Kapsabet or Nandi Hills.</p>
          <Link href="/app?county=Nandi" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Find Local Input Suppliers →</Link>
        </div>
      </article>
    </>
  );
}
