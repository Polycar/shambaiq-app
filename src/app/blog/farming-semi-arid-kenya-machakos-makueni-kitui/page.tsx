import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Farming in Semi-Arid Kenya: Machakos, Makueni, Kitui Guide",
  description:
    "Machakos, Makueni, and Kitui soils are highly fertile with near-perfect pH, but lack water. Learn how to unlock their high yields using moisture-saving techniques.",
  openGraph: { title: "Farming in Semi-Arid Kenya: Machakos, Makueni, Kitui Guide", images: ["/api/og"] },
};

export default function SemiAridFarmingGuide() {
  const counties = getCountySoils();

  const machakos = counties.find((c) => c.county.toLowerCase() === "machakos");
  const makueni = counties.find((c) => c.county.toLowerCase() === "makueni");
  const kitui = counties.find((c) => c.county.toLowerCase() === "kitui");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Farming in Semi-Arid Kenya: Machakos, Makueni, Kitui Guide",
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
        name: "Is soil fertility low in Machakos, Makueni, and Kitui?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The satellite soil tests show that the soil in these Eastern counties is actually highly optimal, with perfect pH levels ranging between 6.0 and 6.6. The primary agricultural constraint is moisture, not nutrients.",
        },
      },
      {
        "@type": "Question",
        name: "What are the best crops to farm in semi-arid Kenya?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Drought-tolerant crops are ideal, including green grams (ndengu), sorghum, pearl millet, pigeon peas, cowpeas, dolichos (lablab), and dryland certified maize varieties like Katumani or DH04.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Semi-Arid Farming Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">County Guide</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Farming in Semi-Arid Kenya: Machakos, Makueni, Kitui Guide</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Eastern Kenya is often dismissed as dry and barren, but the satellite data tells a very different story. The soil chemistry is excellent — the challenge is moisture retention.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Hidden Truth: Optimal Soil pH and Nutrient Content</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Many farmers believe that dry regions automatically have poor soil. However, because rainfall is relatively low in Eastern Kenya, the soil has not suffered from leaching. Calcium, magnesium, potassium, and phosphorus remain in the topsoil instead of washing away into the deep layers.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              In fact, counties in the **Semi-Arid Eastern** zone boast some of the most balanced soil pH levels in all of Kenya, perfect for crop nutrient absorption. Let's look at the data:
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl border border-cream-300 text-center">
                <span className="font-semibold text-forest-700 block">Machakos</span>
                <span className="text-sm font-bold text-green-700">pH {machakos?.pH || "6.22"}</span>
                <span className="text-xs text-soil-400 block mt-1">Highly Balanced</span>
              </div>
              <div className="p-3 rounded-xl border border-cream-300 text-center">
                <span className="font-semibold text-forest-700 block">Makueni</span>
                <span className="text-sm font-bold text-green-700">pH {makueni?.pH || "6.45"}</span>
                <span className="text-xs text-soil-400 block mt-1">Near Perfect</span>
              </div>
              <div className="p-3 rounded-xl border border-cream-300 text-center">
                <span className="font-semibold text-forest-700 block">Kitui</span>
                <span className="text-sm font-bold text-green-700">pH {kitui?.pH || "6.55"}</span>
                <span className="text-xs text-soil-400 block mt-1">Excellent pH</span>
              </div>
            </div>
            <p className="text-soil-500 leading-relaxed">
              At a pH level around **6.2 to 6.6**, all major and secondary plant nutrients are at their peak availability. If you can provide water, these soils will yield as well as any premium zone in the country.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Water-Saving Techniques: The Core Strategy</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Because rainfall is erratic in Machakos, Makueni, and Kitui, your entire farming system must focus on capturing and storing every single drop of water.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-cream-50 border border-cream-200 rounded-xl">
                <h3 className="font-bold text-forest-700 mb-1">1. Zai Pits (Tumbukiza)</h3>
                <p className="text-sm text-soil-500">
                  Dig pits of 60cm wide and 30cm deep. Fill them with a mixture of topsoil and plenty of well-rotted manure/compost. The manure acts like a sponge, absorbing water and retaining moisture up to 3 times longer than flat soil. Plant your maize or sorghum inside the pit.
                </p>
              </div>
              <div className="p-4 bg-cream-50 border border-cream-200 rounded-xl">
                <h3 className="font-bold text-forest-700 mb-1">2. Dryland Mulching</h3>
                <p className="text-sm text-soil-500">
                  Never leave your soil bare. Cover it with dry grass, crop residue (maize stalks), or straw. Mulching blocks direct sunlight, reducing evaporation from the soil surface by up to 70%, keeping the root zone damp between rains.
                </p>
              </div>
              <div className="p-4 bg-cream-50 border border-cream-200 rounded-xl">
                <h3 className="font-bold text-forest-700 mb-1">3. Minimal Tillage</h3>
                <p className="text-sm text-soil-500">
                  Every time you plow the soil, it dries out. Utilize rip lines or direct seedling planting holes rather than plowing the entire shamba. This maintains the natural capillary structure of the soil, ensuring deep moisture remains undisturbed.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Best Crops to Farm for Maximum Profit</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Stop fighting the climate with high-moisture crops. Instead, leverage Eastern's fertile soils with highly adaptive, drought-resistant varieties:
            </p>
            <ul className="list-disc pl-5 my-2 space-y-2 text-soil-500 leading-relaxed">
              <li>**Sorghum (Gadam/Sila)**: Incredibly drought-resistant and in high demand by commercial brewers (KES 45-55/kg).</li>
              <li>**Green Grams (Ndengu - KSV20)**: Matures rapidly (60-70 days) and thrives in low-rainfall settings, returning excellent local prices.</li>
              <li>**Pigeon Peas (Mbaazi - Mtekateka)**: Deep root systems tap water far beneath the soil, and they naturally fix nitrogen, enriching your soil.</li>
              <li>**Dryland Maize (Katumani / DH04)**: If you must plant maize, select short-maturity certified seeds that tassel before the rain ceases.</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Map dryland recommendations</h2>
          <p className="text-cream-400 mb-6">Use ShambaIQ to match the perfect certified dryland seed varieties to your specific sub-county weather profile.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Check Dryland Soils →</Link>
        </div>
      </article>
    </>
  );
}
