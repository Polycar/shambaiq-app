import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cabbage Farming in Kiambu: Clubroot Defense & Soil Chemistry",
  description:
    "Grow heavier cabbages in Kiambu county. Learn Copenhagen and Gloria F1 cultivation, acidic soil management (pH 5.28), and lime-fertilizer applications.",
  openGraph: { title: "Cabbage Farming in Kiambu: Clubroot Defense & Soil Chemistry", images: ["/api/og"] },
};

export default function CabbageFarmingKiambu() {
  const counties = getCountySoils();
  const prices = getPrices();

  const kiambu = counties.find((c) => c.county.toLowerCase() === "kiambu");

  const canPrice = prices.find((p) => p.fertilizer.toLowerCase() === "can");
  const npkPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("17:17:17") || p.fertilizer.toLowerCase().includes("npk"));
  const mavunoPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("mavuno") || p.fertilizer.toLowerCase().includes("planting"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cabbage Farming in Kiambu: Clubroot Defense & Soil Chemistry",
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
        name: "What is the best cabbage variety for Kiambu county?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gloria F1 is highly recommended for commercial farming in Kiambu due to its excellent head firmness, transportability, resistance to black rot, and high yield. Copenhagen Market is popular for smaller scales and home consumption, while Queen F1 offers heat tolerance in drier sub-counties.",
        },
      },
      {
        "@type": "Question",
        name: "How does soil acidity affect cabbages in Kiambu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kiambu soils are moderately acidic (average pH 5.28). Under pH 5.5, cabbages are highly susceptible to Clubroot disease (Plasmodiophora brassicae) and molybdenum deficiency (whip-tail). Applying agricultural lime or alkaline fertilizers like Mavuno is essential to raise the pH.",
        },
      },
      {
        "@type": "Question",
        name: "Which fertilizer is best for cabbage planting and top-dressing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "At planting, use an acidic-buffered compound like Mavuno Planting or NPK 17:17:17 rather than pure DAP. Top-dress with CAN (Calcium Ammonium Nitrate) at weeks 3 and 6 to supply crucial calcium, which prevents internal tip-burn.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Cabbage Farming Kiambu" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Crop Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Cabbage Farming in Kiambu: Clubroot Defense & Soil Chemistry</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Unlocking commercial cabbage yields in Limuru, Gatundu, and Kikuyu. We analyze Kiambu's acidic soil chemistry (average pH {kiambu?.pH || "5.28"}), variety selection, and nitrogen-calcium balancing.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Commercial Potential of Cabbages in Kiambu</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Cabbage (<em>Brassica oleracea var. capitata</em>) is one of the most profitable short-season cash crops in Kiambu County. High demand from nearby Nairobi markets, coupled with optimal high-altitude rainfall in sub-counties like Limuru, Gatundu, Githunguri, and Lari, makes Kiambu a cabbage-growing powerhouse.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              However, despite excellent climate conditions, many farmers struggle with head splitting, light heads, and devastating outbreaks of <strong>Clubroot disease</strong>. The secret to overcoming these challenges lies in understanding and modifying Kiambu's soil profile.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Kiambu Soil Analysis: Acidity & Calcium Locking</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Cabbages are heavy feeders that require neutral to slightly acidic soils (pH 6.0 to 6.8). They also have a very high demand for <strong>Calcium</strong> to build firm, crisp, rot-resistant heads. Let's look at the actual data for Kiambu County:
            </p>
            <div className="p-5 bg-white rounded-xl border border-cream-300 mb-6">
              <span className="font-semibold text-forest-700 block text-lg mb-2">Kiambu County Soil Chemistry Profile</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Average pH</span>
                  <span className="text-lg font-bold text-red-600">{kiambu?.pH || "5.28"}</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Total Nitrogen</span>
                  <span className="text-lg font-bold text-forest-700">{kiambu?.nitrogen || "1.01"} g/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable P</span>
                  <span className="text-lg font-bold text-amber-600">{kiambu?.phosphorus || "13.7"} mg/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable K</span>
                  <span className="text-lg font-bold text-forest-700">{kiambu?.potassium || "169.0"} mg/kg</span>
                </div>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed mb-4">
              With an average pH of <strong>{kiambu?.pH || "5.28"}</strong>, Kiambu's Central Highlands volcanic soils are <strong>moderately to strongly acidic</strong>. In such acidic environments:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Clubroot Disease (Plasmodiophora brassicae)</strong> thrives. The soil-borne fungus spreads rapidly in acidic, wet soils, causing swollen, distorted roots that choke the plant.
              </li>
              <li>
                <strong className="text-forest-700">Calcium Deficiency</strong> is induced, causing <em>internal tip-burn</em> (blackening inside the head) and soft, light heads that split easily.
              </li>
              <li>
                <strong className="text-forest-700">Phosphorus locking</strong> occurs, leaving young cabbage transplants stunted. Learn why in our <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-semibold">soil acidity guide</Link>.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Clubroot Defeat Strategy</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              To defend your crop against Clubroot, you must alter the soil pH. The fungus cannot germinate or infect roots when the soil pH is above <strong>6.2</strong>.
            </p>
            <ol className="list-decimal pl-5 my-2 space-y-3 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Agricultural Liming</strong>: Apply agricultural lime (calcium carbonate or dolomitic lime) at a rate of 500g to 1kg per square meter, depending on exact acidity. Apply at least 4 weeks before transplanting to allow it to react.
              </li>
              <li>
                <strong className="text-forest-700">Alkaline Fertilizers</strong>: Avoid using DAP at planting, as it increases soil acidity. Instead, use compound fertilizers with high calcium and magnesium contents, like Mavuno Planting.
              </li>
              <li>
                <strong className="text-forest-700">Crop Rotation</strong>: Never plant cabbages, kales, or canola back-to-back. Rotate with potatoes, beans, or maize to starve the clubroot fungus.
              </li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Optimal Variety Selection</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Choosing the right cultivar ensures you match the market's demand for transport and shelf life:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-3 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Gloria F1</strong>: The dominant commercial hybrid. It matures in 85–90 days, produces very hard heads (2.5–3.5 kg) that do not split easily, and has an outstanding shelf life. Excellent for long-distance transport to Nairobi.
              </li>
              <li>
                <strong className="text-forest-700">Copenhagen Market</strong>: An open-pollinated variety (OPV). It matures fast (70–75 days) but has softer heads. It is best suited for local home consumption or quick sales.
              </li>
              <li>
                <strong className="text-forest-700">Riana F1</strong>: Highly uniform, disease-tolerant hybrid producing dark blue-green heads with excellent wrapper leaves that protect the cabbage during farm-to-market handling.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Cabbage Feeding Guide & Costs</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Cabbages require a continuous supply of <strong>Nitrogen</strong> for foliage growth and <strong>Calcium</strong> for head firmness.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              For top-dressing, <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-semibold">Calcium Ammonium Nitrate (CAN)</Link> is the gold standard. It provides fast-acting nitrogen and crucial calcium without making the soil more acidic.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Fertilizer Type</th>
                    <th className="text-left py-2 font-semibold">Application Stage</th>
                    <th className="text-left py-2 font-semibold">Subsidy Cost (50kg)</th>
                    <th className="text-left py-2 font-semibold">Commercial Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Mavuno Planting</td>
                    <td className="py-2.5">At transplanting (in the planting hole)</td>
                    <td className="py-2.5">KES {mavunoPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {mavunoPrice?.commercial?.toLocaleString() || "5,800"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">CAN (Calcium Ammonium Nitrate)</td>
                    <td className="py-2.5">Top-dress at Week 3 & Week 6</td>
                    <td className="py-2.5">KES {canPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {canPrice?.commercial?.toLocaleString() || "3,800"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">NPK compound (e.g. 17:17:17)</td>
                    <td className="py-2.5">Optional split application (mid-stage)</td>
                    <td className="py-2.5">KES {npkPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {npkPrice?.commercial?.toLocaleString() || "6,000"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              Wondering how many bags you need to buy for your acreage? Try our <Link href="/blog/how-much-fertilizer-per-acre-calculator" className="text-gold-600 hover:underline font-semibold">fertilizer bags per acre calculator</Link> for exact commercial requirements.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Maximize your Kiambu cabbage harvest</h2>
          <p className="text-cream-400 mb-6">Analyze your shamba's exact chemical requirements and locate licensed agricultural input dealers in Limuru or Thika.</p>
          <Link href="/app?county=Kiambu&crop=Cabbage" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Get Precision Recommendation →</Link>
        </div>
      </article>
    </>
  );
}
