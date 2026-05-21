import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Potato Farming in Meru & Nyeri: Shangi Guide & Soil Science",
  description:
    "Grow higher potato yields in Mt. Kenya's highlands. Learn Meru & Nyeri county soil suitability, Shangi seed selection, and optimum compound fertilizers.",
  openGraph: { title: "Potato Farming in Meru & Nyeri: Shangi Guide & Soil Science", images: ["/api/og"] },
};

export default function PotatoFarmingGuide() {
  const counties = getCountySoils();
  const prices = getPrices();

  const meru = counties.find((c) => c.county.toLowerCase() === "meru");
  const nyeri = counties.find((c) => c.county.toLowerCase() === "nyeri");

  const npkPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("17:17:17") || p.fertilizer.toLowerCase().includes("npk"));
  const mavunoPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("mavuno") || p.fertilizer.toLowerCase().includes("planting"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Potato Farming in Meru & Nyeri: Shangi Guide & Soil Science",
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
        name: "What is the best potato variety for Meru and Nyeri?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Shangi variety is the most popular due to its fast maturity (3 months), high market demand, and ease of cooking. Other excellent options include Dutch Robijn (ideal for processing crisps) and Unica (high tolerance to heat and blight).",
        },
      },
      {
        "@type": "Question",
        name: "How does soil acidity affect potato production?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Potatoes thrive in moderately acidic soils (pH 5.5 to 6.5). If the pH drops below 5.0, it induces nutrient locking and increases susceptibility to bacterial wilt and scab. Liming or compound organic fertilizers are highly recommended to balance the pH.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Potato Farming Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Crop Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Potato Farming in Meru & Nyeri: Shangi Guide & Soil Science</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Unlocking potato yields in Mt. Kenya's cold highlands. We analyze Meru and Nyeri soil chemistry, seed selection, and optimized fertilization systems.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Why the Mt. Kenya Region Dominates Potato Production</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Irish potato (*Solanum tuberosum*) is Kenya's second most important food crop after maize. The cold highland climates of Meru and Nyeri counties offer the absolute ideal environment for potatoes—abundant rainfall, high altitudes (above 1,500m), and rich volcanic soils.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              However, despite these premium natural conditions, many smallholder potato farmers in Nyeri and Meru harvest under **5 to 8 tonnes per acre**, whereas the crop's genetic potential exceeds **15 to 20 tonnes**. The primary barrier isn't weather—it is a combination of recycled low-grade seeds, high soil acidity, and improper fertilizer choices.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Soil Suitability Profile: Meru vs Nyeri</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Potatoes require well-drained, aerated soils with a moderately acidic pH range (5.5 to 6.5). Let's review the actual regional soil data:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700 block text-lg">Meru County</span>
                <span className="text-sm font-bold text-amber-600 block mt-1">Average pH: {meru?.pH || "5.65"}</span>
                <p className="text-xs text-soil-400 mt-2">
                  Highly suitable, rich deep red volcanic soils. However, heavy rains in districts like Kianjai and Timau leach out critical calcium, leading to increased acidity.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-cream-300">
                <span className="font-semibold text-forest-700 block text-lg">Nyeri County</span>
                <span className="text-sm font-bold text-amber-600 block mt-1">Average pH: {nyeri?.pH || "5.52"}</span>
                <p className="text-xs text-soil-400 mt-2">
                  Suitable, but border districts near the Aberdares face high organic acidity. Liming or compound organic fertilizers are highly recommended to prevent nutrient deficiency.
                </p>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed">
              If your shamba's pH drops below **5.2**, phosphorus becomes locked by aluminum ions, depriving the growing tubers of rooting energy. If you suspect severe acidity, review our <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-semibold">soil acidity guide</Link> to understand mitigation techniques.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Variety Selection: The Reign of Shangi Potatoes</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Choosing the right variety determines your farm's marketability and shelf life:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-3 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Shangi</strong>: The unchallenged champion of the Kenyan market. It matures incredibly fast (80 to 90 days), cooks easily, and is highly sought after by local traders. However, it has a short dormancy period and is susceptible to Late Blight.
              </li>
              <li>
                <strong className="text-forest-700">Dutch Robijn</strong>: A red-skinned variety with a long dormancy period. Extremely popular in Nyeri for processing into high-quality potato chips due to low sugar accumulation.
              </li>
              <li>
                <strong className="text-forest-700">Unica</strong>: A newer, climate-resilient variety that is highly resistant to viruses and Late Blight. It yields incredibly well under both highland and dry conditions.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Optimal Fertilization: Yielding Smartly</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Potatoes are heavy feeders, requiring balanced nutrition for leaf development (Nitrogen) and tuber growth (Phosphorus & Potassium). 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Many farmers use standard NPK or DAP at planting. However, potatoes require a high amount of **Potassium** during tuber formation to ensure heavy, high-grade potatoes. Using balanced blends or adding a top-dressing fertilizer can double your grades:
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
                    <td className="py-2.5 font-medium">Mavuno Potato / Planting</td>
                    <td className="py-2.5">At planting (5cm below seed tuber)</td>
                    <td className="py-2.5">KES {mavunoPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {mavunoPrice?.commercial?.toLocaleString() || "5,800"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">NPK compound (e.g. YaraMila Unik 17)</td>
                    <td className="py-2.5">At planting or early hilling</td>
                    <td className="py-2.5">KES {npkPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {npkPrice?.commercial?.toLocaleString() || "6,000"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              For an exact analysis of bags required per acre based on your target harvest, use our <Link href="/blog/how-much-fertilizer-per-acre-calculator" className="text-gold-600 hover:underline font-semibold">fertilizer bags per acre calculator</Link>.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Maximize your potato yields today</h2>
          <p className="text-cream-400 mb-6">Check your Nyeri or Meru shamba's exact volcanic soil composition and find registered certified seed suppliers.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Find Local Inputs →</Link>
        </div>
      </article>
    </>
  );
}
