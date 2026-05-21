import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getPrices } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sweet Potato Farming in Homa Bay: Potassium & OFSP Nutrition",
  description:
    "Maximize sweet potato yields in Homa Bay county. Learn Orange-Fleshed Sweet Potato (OFSP) vine planting, acid-soil tolerance (pH 5.27), and potassium feeding.",
  openGraph: { title: "Sweet Potato Farming in Homa Bay: Potassium & OFSP Nutrition", images: ["/api/og"] },
};

export default function SweetPotatoFarmingHomaBay() {
  const counties = getCountySoils();
  const prices = getPrices();

  const homaBay = counties.find((c) => c.county.toLowerCase() === "homa bay");

  const npkPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("17:17:17") || p.fertilizer.toLowerCase().includes("npk"));
  const mavunoPrice = prices.find((p) => p.fertilizer.toLowerCase().includes("mavuno") || p.fertilizer.toLowerCase().includes("planting"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Sweet Potato Farming in Homa Bay: Potassium & OFSP Nutrition",
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
        name: "What are the best sweet potato varieties for Homa Bay?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Orange-Fleshed Sweet Potato (OFSP) varieties like Kabode, Irene, and Vita are highly recommended due to high Vitamin A content, excellent market prices, and disease resistance. Traditional high-yielding yellow/white varieties like Kembu 10 and Mugande are also extremely popular.",
        },
      },
      {
        "@type": "Question",
        name: "Can sweet potatoes tolerate Homa Bay's acidic soil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, sweet potatoes are remarkably acid-tolerant and can produce reasonable yields at a pH of 5.27. However, high acidity locks phosphorus, which is needed for initial root development. Banding organic manure or using acidic-buffered compounds like Mavuno helps boost early growth.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Potassium critical for sweet potatoes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Potassium is the primary driver for carbohydrate synthesis and translocation. It triggers tuber bulking, determines sweet potato shape/uniformity, and increases starch/sugar concentration. Low potassium results in thin, fibrous roots instead of fat tubers.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Sweet Potato Farming Homa Bay" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Crop Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Sweet Potato Farming in Homa Bay: Potassium & OFSP Nutrition</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Commercial sweet potato production along the Lake Victoria Basin. We analyze Homa Bay's soil suitability (pH {homaBay?.pH || "5.27"}), the rise of nutrition-dense OFSP varieties, ridge farming, and potassium-led fertilizer systems.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Sweet Potato Revolution in Homa Bay</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Sweet potato (*Ipomoea batatas*) is rapidly evolving from a traditional subsistence crop into a high-value commercial cash crop in Homa Bay County. Districts like Kabondo Kasipul, Rachuonyo, and Suba are famous for producing high-quality tubers supplied to major cities like Kisumu, Nakuru, and Nairobi.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              The crop requires minimal inputs, is highly drought-tolerant, and matures in just 4 to 5 months. However, many smallholders still struggle with small, fibrous roots rather than thick, heavy, premium-grade tubers. The difference between an average yield and a record crop comes down to **soil compaction** and **Potassium nutrition**.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Homa Bay Soil Analysis: Heavy Acidity & Potassium Depletion</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Let's look at the satellite soil health data for Homa Bay County:
            </p>
            <div className="p-5 bg-white rounded-xl border border-cream-300 mb-6">
              <span className="font-semibold text-forest-700 block text-lg mb-2">Homa Bay County Soil Chemistry Profile</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Average pH</span>
                  <span className="text-lg font-bold text-red-600">{homaBay?.pH || "5.27"}</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Total Nitrogen</span>
                  <span className="text-lg font-bold text-forest-700">{homaBay?.nitrogen || "1.05"} g/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable P</span>
                  <span className="text-lg font-bold text-amber-600">{homaBay?.phosphorus || "13.8"} mg/kg</span>
                </div>
                <div className="p-3 bg-cream-50 rounded-lg">
                  <span className="text-xs text-soil-400 block">Extractable K</span>
                  <span className="text-lg font-bold text-forest-700">{homaBay?.potassium || "147.0"} mg/kg</span>
                </div>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed mb-4">
              Sweet potatoes thrive in well-drained, sandy-loam soils with a pH between 5.6 and 6.6. Homa Bay's average soil pH of **{homaBay?.pH || "5.27"}** indicates **moderate acidity**. 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              While sweet potato is highly tolerant of acidic soils compared to other tubers like Irish potato, acidic soils induce phosphorus locking. Furthermore, Kajiado and Homa Bay soils often experience nutrient depletion. Homa Bay's potassium level of **{homaBay?.potassium || "147.0"} mg/kg** is only **moderate**.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Potatoes are heavy feeders on **Potassium (K)**. Without sufficient potassium:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>
                Plants produce excessive vine and leaf growth but fail to swell the roots into thick tubers.
              </li>
              <li>
                Harvested tubers are thin, fibrous, and lose water quickly, leading to a poor shelf life.
              </li>
              <li>
                Bulking is delayed, leaving the crop vulnerable to sweet potato weevils.
              </li>
            </ul>
            <p className="text-soil-500 leading-relaxed">
              Mitigating acidity and boosting soil structure is crucial. Review our <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-semibold">soil acidity report</Link> to understand Western Kenya's regional trends, and our <Link href="/blog/organic-soil-enrichment-kenya-soil-carbon" className="text-gold-600 hover:underline font-semibold">organic carbon guide</Link> for methods to build loose, aerated soils using organic matter.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Ridge vs Mound Planting: The Physical Science</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Never plant sweet potatoes on flat ground. Roots need loose, uncompacted soil to expand. In Homa Bay:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-3 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Mound Planting</strong>: Best suited for manual cultivation on smaller scales. Make mounds 30–60cm high and 1 meter apart. Plant 3–4 vines per mound.
              </li>
              <li>
                <strong className="text-forest-700">Ridge Planting</strong>: Recommended for larger commercial plots. Build ridges 30–45cm high, spaced 1 meter apart. Plant vines at 30cm spacing along the ridge. This creates ideal aeration, prevents waterlogging (which rots tubers), and makes harvesting exceptionally easy.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Variety Selection: Orange-Fleshed Sweet Potatoes (OFSP)</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Traditional varieties like *Mugande* and *Kembu 10* are white-fleshed and high in dry matter. However, **OFSP** varieties have become highly profitable due to premium institutional demand:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-3 text-soil-500 leading-relaxed">
              <li>
                <strong className="text-forest-700">Kabode</strong>: The most popular OFSP variety. Highly resistant to Sweet Potato Virus Disease (SPVD), produces blocky, deep-orange tubers with high dry matter, and matures in 4 months.
              </li>
              <li>
                <strong className="text-forest-700">Irene</strong>: Produces high yields of uniform, smooth, round bulbs. Excellent for peeling and commercial processing.
              </li>
              <li>
                <strong className="text-forest-700">Vita</strong>: Very high in beta-carotene. Semi-spreading vines that cover the ground quickly, suppressing weeds. Excellent under rain-fed conditions.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Potassium Management & Costs</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              To trigger sweet potato bulking, avoid high-nitrogen fertilizers like Urea, which force vine growth instead of tuber development. Instead, use balanced compound NPK fertilizers:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Fertilizer Type</th>
                    <th className="text-left py-2 font-semibold">Purpose & Application</th>
                    <th className="text-left py-2 font-semibold">Subsidy Cost (50kg)</th>
                    <th className="text-left py-2 font-semibold">Commercial Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Mavuno Planting</td>
                    <td className="py-2.5">Banded inside ridges at planting (low nitrogen, high P & trace minerals)</td>
                    <td className="py-2.5">KES {mavunoPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {mavunoPrice?.commercial?.toLocaleString() || "5,800"}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">NPK 17:17:17 (or high Potassium)</td>
                    <td className="py-2.5">Apply at Week 6–8 during early tuber bulking</td>
                    <td className="py-2.5">KES {npkPrice?.subsidized?.toLocaleString() || "2,500"}</td>
                    <td className="py-2.5">KES {npkPrice?.commercial?.toLocaleString() || "6,000"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              Check our complete <Link href="/blog/how-much-fertilizer-per-acre-calculator" className="text-gold-600 hover:underline font-semibold">bags per acre calculator</Link> for exact soil feeding parameters, and review the commercial pros and cons in our <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-semibold">fertilizer guide</Link>.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Maximize your Homa Bay sweet potato yield</h2>
          <p className="text-cream-400 mb-6">Locate certified clean-virus vine suppliers in Kabondo, check dealer inventories, and map soil coordinates.</p>
          <Link href="/app?county=Homa%20Bay&crop=Sweet%20Potato" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Find Local Vine Suppliers →</Link>
        </div>
      </article>
    </>
  );
}
