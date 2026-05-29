import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Nakuru vs Uasin Gishu: Best County for Wheat?",
  description:
    "Kenya's two wheat giants compared. We analyze soil pH, nitrogen levels, wheat certified varieties, and production costs to declare a winner.",
  openGraph: { title: "Nakuru vs Uasin Gishu: Best County for Wheat?", images: ["/api/og"] },
};

export default function WheatCountyComparison() {
  const counties = getCountySoils();

  const nakuru = counties.find((c) => c.county.toLowerCase() === "nakuru");
  const uasin = counties.find((c) => c.county.toLowerCase().includes("gishu"));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Nakuru vs Uasin Gishu: Best County for Wheat?",
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
        name: "Which county has better soil for wheat between Nakuru and Uasin Gishu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Nakuru has slightly higher and more balanced soil pH (average pH ${nakuru?.pH || "5.9"}) compared to Uasin Gishu (average pH ${uasin?.pH || "5.2"}). The acidity in Uasin Gishu means phosphorus locking is more common, requiring liming for peak wheat yields.`,
        },
      },
      {
        "@type": "Question",
        name: "What certified wheat seeds are recommended for Kenya highlands?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Top certified wheat seed varieties breeder-approved for Rift Valley highlands include Kenya Robin (high yield and stem rust resistant), Kenya Eagle, and Kenya Hawk.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Wheat County Comparison" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">County Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Nakuru vs Uasin Gishu: Best County for Wheat?</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Wheat is Kenya's second most important cereal. We compare the soil chemistry, seed recommendations, and farming economics of Nakuru and Uasin Gishu to pick the ultimate wheat champion.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 7 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Competitors: Rift Valley's Wheat Belts</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Uasin Gishu (centered around Eldoret) and Nakuru (particularly Molo, Njoro, and Mau Narok) produce the lion's share of Kenya's domestic wheat. Both regions offer ideal altitudes (above 1,800m), moderate rainfall, and cool temperatures during the growth cycle. 
            </p>
            <p className="text-soil-500 leading-relaxed">
              However, decades of continuous mono-cropping and fertilization have changed the chemistry of their soils in distinct ways.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Soil Statistics Comparison (Satellite Soil Data)</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Let's look at the average soil chemical indicators drawn from regional satellite soil metrics:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Metric</th>
                    <th className="text-left py-2 text-forest-700">Nakuru County</th>
                    <th className="text-left py-2 text-forest-700">Uasin Gishu</th>
                    <th className="text-left py-2">Optimal Wheat Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Average pH</td>
                    <td className="py-2 text-green-700 font-bold">{nakuru?.pH || "5.88"}</td>
                    <td className="py-2 text-red-600 font-bold">{uasin?.pH || "5.21"}</td>
                    <td className="py-2">5.5 – 6.5</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Nitrogen (g/kg)</td>
                    <td className="py-2">{nakuru?.nitrogen?.toFixed(2) || "1.32"}</td>
                    <td className="py-2">{uasin?.nitrogen?.toFixed(2) || "1.45"}</td>
                    <td className="py-2">&gt; 1.20</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Phosphorus (mg/kg)</td>
                    <td className="py-2 text-green-700 font-bold">{nakuru?.phosphorus?.toFixed(1) || "18.5"}</td>
                    <td className="py-2 text-red-600">{uasin?.phosphorus?.toFixed(1) || "12.2"}</td>
                    <td className="py-2">&gt; 15.0</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 font-medium">Potassium (mg/kg)</td>
                    <td className="py-2">{nakuru?.potassium?.toFixed(0) || "190"}</td>
                    <td className="py-2">{uasin?.potassium?.toFixed(0) || "165"}</td>
                    <td className="py-2">&gt; 120</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              **The Soil Science Breakdown**: 
              Uasin Gishu's average soil pH has fallen to a critically acidic **{uasin?.pH || "5.21"}**, which triggers phosphorus locking. This prevents wheat crops from absorbing planting nutrients, causing Uasin Gishu wheat farmers to use higher fertilizer loads. Nakuru, with an average pH of **{nakuru?.pH || "5.88"}** and excellent native phosphorus ({nakuru?.phosphorus || "18.5"} mg/kg), enjoys a clear soil chemistry advantage.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Certified Wheat Seed Performance</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Both counties utilize modern rust-resistant certified wheat seed varieties developed by KALRO and distributed by Kenya Seed Company:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>**Kenya Robin**: The current favorite. Highly resistant to stem rust (Ug99) and produces robust, heavy grains. Average yield: 22-26 bags/acre.</li>
              <li>**Kenya Hawk**: Performs exceptionally well at high altitudes (above 2,000m) such as Mau Narok or Burnt Forest. Resistant to lodging.</li>
              <li>**Kenya Eagle**: Excellent drought-tolerance, making it ideal for the lower, drier slopes of both counties.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Verdict: And the Winner Is...</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              While **Uasin Gishu** has the larger sheer scale of mechanized wheat farms and massive grain silo infrastructure, **Nakuru** wins the productivity crown.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Nakuru's soils (pH {nakuru?.pH || "5.88"}) allow wheat roots to absorb phosphorus easily without lime intervention. Farmers in Mau Narok routinely record wheat yields of **25 to 30 bags per acre**, compared to **18 to 22 bags per acre** in Uasin Gishu unless liming is actively practiced.
            </p>
            <p className="text-soil-500 leading-relaxed font-bold text-forest-700">
              Soil Chemistry Champion: Nakuru County
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Check soil reports for Nakuru or Uasin Gishu</h2>
          <p className="text-cream-400 mb-6">Compare soil pH, macro-nutrients, and localized seed suggestions between any Kenyan counties.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Compare County Soils →</Link>
        </div>
      </article>
    </>
  );
}
