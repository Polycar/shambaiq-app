import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Bean Farming in Kakamega: Rhizobium Inoculation & Acid Soil Strategy",
  description:
    "Grow higher bean yields in Western Kenya. Learn Rosecoco and Chelalang management, Rhizobium inoculation, and acidic soil buffering (pH 5.63).",
  openGraph: { title: "Bean Farming in Kakamega: Rhizobium Inoculation & Acid Soil Strategy", images: ["/api/og"] },
};

export default function BeanFarmingKakamega() {
  const counties = getCountySoils();
  const prices = getPrices();

  const kakamega = counties.find((c) => c.county.toLowerCase() === "kakamega");

  const npkPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("17:17:17") || p.fertilizer.toLowerCase().includes("npk"));
  const mavunoPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("mavuno") || p.fertilizer.toLowerCase().includes("planting"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bean Farming in Kakamega: Rhizobium Inoculation & Acid Soil Strategy",
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
        name: "What are the best bean varieties for Kakamega county?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rosecoco (GLP 2) is the traditional market favorite. Chelalang is an outstanding, newer high-yielding variety with high resistance to bean rust and angular leaf spot. KAT B1 (yellow beans) is highly profitable due to extremely high local demand and low flatulence levels.",
        },
      },
      {
        "@type": "Question",
        name: "How does soil acidity affect bean yields in Kakamega?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kakamega has moderately acidic soils (average pH 5.63). Beans are sensitive to acidity, which locks phosphorus (limiting root development) and prevents Rhizobium bacteria from establishing active nitrogen-fixing nodules. Using calcium-rich fertilizers or lime is highly recommended.",
        },
      },
      {
        "@type": "Question",
        name: "What is Rhizobium inoculation and how does it save money?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rhizobium inoculation involves coating bean seeds with a commercial inoculant powder (like Biofix) before planting. The bacteria form nodules on bean roots that capture free nitrogen from the air. This extremely cheap treatment (approx. KES 300 per acre) completely eliminates the need for expensive nitrogen top-dressing.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Bean Farming Kakamega" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Crop Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Bean Farming in Kakamega: Rhizobium Inoculation & Acid Soil Strategy</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Unlocking commercial bean yields in Western Kenya. We analyze Kakamega's moderately acidic soils (average pH {kakamega?.pH || "5.63"}), the biological power of Rhizobium seed inoculation, and optimal fertilizer protocols.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Commercial Potential of Dry Beans in Kakamega</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Common beans (<em>Phaseolus vulgaris</em>) are the primary source of plant-based protein and the second most widely grown crop in Kakamega County. Grown either as a pure stand or intercropped with maize in sub-counties like Lurambi, Malava, Mumias, and Butere, beans provide quick cash and food security.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              However, average bean harvests in Kakamega remain disappointingly low—often under <strong>2 to 3 bags per acre</strong>—compared to the crop's genetic potential of <strong>8 to 12 bags</strong>. This performance gap is driven by a lack of phosphorus, poor nitrogen-fixation biology, and acidic soil management.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Kakamega Soil Analysis: Moderate Acidity & DAP Locking</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              To grow high-yielding beans, let's look at the satellite soil chemical data for Kakamega County:
            </p>
            <div className="p-5 bg-white rounded-xl border border-cream-300 mb-6">
              <span className="font-semibold text-forest-700 block text-lg mb-2">Kakamega County Soil Chemistry Profile</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Average pH</span>
                  <span className="text-lg font-bold text-forest-700">{kakamega?.pH || "5.63"}</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Total Nitrogen</span>
                  <span className="text-lg font-bold text-forest-700">{kakamega?.nitrogen || "1.01"} g/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable P</span>
                  <span className="text-lg font-bold text-amber-600">{kakamega?.phosphorus || "14.0"} mg/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable K</span>
                  <span className="text-lg font-bold text-forest-700">{kakamega?.potassium || "147.0"} mg/kg</span>
                </div>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed mb-4">
              Beans prefer a soil pH of 6.0 to 7.0. Kakamega's average soil pH of <strong>{kakamega?.pH || "5.63"}</strong> is <strong>moderately acidic</strong>.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Under this acidity level, applying traditional Diammonium Phosphate (DAP) fertilizer backfires. The highly acidic soil locks up the phosphorus in DAP, stunting bean roots, while the ammonium in DAP continues to acidify the soil further. 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              To learn why DAP fails in Western soils, read our specialized report: <Link href="/blog/kakamega-soil-mavuno-not-dap" className="text-gold-600 hover:underline font-semibold">Kakamega Soil: Why Western Kenya Needs Mavuno, Not DAP</Link>. For a broader view of regional soil acidity, consult our <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-semibold">soil acidity guide</Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Biological Secret: Rhizobium Inoculation</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Beans are legumes that have a unique cooperative relationship with soil bacteria called <em>Rhizobium</em>. The bacteria form tiny nodules on bean roots, capturing free nitrogen from the atmosphere and converting it into natural plant fertilizer.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              However, in Kakamega's acidic soils, native <em>Rhizobium</em> populations are extremely low, and the plants remain nitrogen-deficient. 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              The solution is seed inoculation:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">The Inoculant</strong>: Purchase a commercial <em>Rhizobium</em> powder (such as Biofix, manufactured by MIRCEN or MEA). A single 100g packet costs under KES 350 and covers enough seeds for one acre.
              </li>
              <li>
                <strong className="text-forest-700">Application</strong>: Dissolve two tablespoons of sugar in a cup of warm water (to act as a sticker). Mix this sticky syrup with bean seeds, then sprinkle the inoculant powder over them until every seed is coated.
              </li>
              <li>
                <strong className="text-forest-700">Result</strong>: Seeds must be planted immediately in moist soil, away from direct sunlight. The inoculated beans will fix up to <strong>80% of their nitrogen requirements naturally</strong>, eliminating the need for expensive top-dressing nitrogen.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">High-Yielding Varieties for Western Kenya</h2>
            <ul className="list-disc pl-5 my-2 space-y-3 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Chelalang</strong>: An exceptional dwarf bean variety. Matures in 75–80 days, producing heavy clusters of red mottled seeds. Highly tolerant of acid soils and resistant to leaf rust and root rot.
              </li>
              <li>
                <strong className="text-forest-700">Rosecoco (GLP 2)</strong>: The undisputed commercial standard. Highly demanded by local boarding schools, markets, and processors. Requires well-drained, fertile soil.
              </li>
              <li>
                <strong className="text-forest-700">KAT B1 (Yellow Bean)</strong>: An extremely popular round yellow bean variety. Highly marketable due to low flatulence (easy on the stomach) and rapid cooking times. Extremely drought-resilient.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Optimal Planting Fertilizers & Costs</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Legumes need a strong initial dose of <strong>Phosphorus</strong> to grow roots and support nitrogen nodulation, but very little nitrogen. Acidic-buffered, multi-nutrient fertilizers like Mavuno Planting or compound NPK are far superior to DAP:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Fertilizer Type</th>
                    <th className="text-left py-2 font-semibold">Purpose & Timing</th>
                    <th className="text-left py-2 font-semibold">Subsidy Cost (50kg)</th>
                    <th className="text-left py-2 font-semibold">Commercial Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Mavuno Planting</td>
                    <td className="py-2.5">At planting, supplies buffered Phosphorus, Calcium, and Sulphur</td>
                    <td className="py-2.5">KES {mavunoPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {mavunoPrice?.commercial?.toLocaleString() || "5,800"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">NPK 17:17:17</td>
                    <td className="py-2.5">Alternative basal dressing at planting</td>
                    <td className="py-2.5">KES {npkPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {npkPrice?.commercial?.toLocaleString() || "6,000"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              For complete yield projections and calculations, check our <Link href="/blog/how-much-fertilizer-per-acre-calculator" className="text-gold-600 hover:underline font-semibold">bags per acre calculator</Link> or learn more about fertilizer attributes in our <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-semibold">commercial fertilizer guide</Link>.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Maximize your Kakamega bean harvest</h2>
          <p className="text-cream-400 mb-6">Access professional soil advice tailored to your ward, locate certified seeds, and find vetted agricultural input dealers in Malava or Mumias.</p>
          <Link href="/app?county=Kakamega&crop=Beans" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Generate Precision Report →</Link>
        </div>
      </article>
    </>
  );
}
