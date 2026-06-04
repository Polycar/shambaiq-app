import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("kenya-county-soil-rankings-2026")!;

export const metadata: Metadata = {
  title: POST.metaTitle,
  description: POST.metaDescription,
  alternates: { canonical: `${BASE_URL}/blog/${POST.slug}` },
  openGraph: { type: "article", url: `${BASE_URL}/blog/${POST.slug}`, title: POST.metaTitle, description: POST.metaDescription, images: [{ url: `${BASE_URL}/api/og?type=blog&slug=${POST.slug}`, width: 1200, height: 630, alt: POST.imageAlt }], publishedTime: POST.datePublished, modifiedTime: POST.dateModified, authors: [`${BASE_URL}/about`], section: POST.section, tags: POST.secondaryKeywords, siteName: "ShambaIQ", locale: "en_KE" },
  twitter: { card: "summary_large_image", site: "@shambaiq_ke", creator: "@polycarp_agri", title: POST.metaTitle, description: POST.metaDescription, images: [`${BASE_URL}/api/og?type=blog&slug=${POST.slug}`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  keywords: [POST.focusKeyword, ...POST.secondaryKeywords, ...(POST.kiswahiliKeywords ?? [])],
  authors: [{ name: "Polycarp Andabwa", url: `${BASE_URL}/about` }],
};

const articleSchema = makeArticleSchema({ headline: POST.title, description: POST.metaDescription, slug: POST.slug, datePublished: POST.datePublished, dateModified: POST.dateModified, image: `/api/og?type=blog&slug=${POST.slug}`, keywords: [POST.focusKeyword, ...POST.secondaryKeywords], wordCount: POST.wordCount, section: POST.section });
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil intelligence", url: `${BASE_URL}/blog?category=soil-intelligence` }, { name: "Kenya county soil rankings 2026", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "Which county has the best soil in Kenya?", answer: "Kiambu, Murang'a, and Nyeri consistently rank among Kenya's top-performing counties for soil fertility based on pH proximity to optimum, organic carbon levels, and balanced NPK ratios. Their volcanic nitisol soils derived from Mount Kenya and Aberdare geology have naturally high nutrient-holding capacity. However, 'best soil' depends on the crop — Uasin Gishu ranks highest for wheat, Kirinyaga for irrigated rice, and Kajiado for onions despite its alkaline soils. Use ShambaIQ to see your county's ranking for your specific crop at shambaiq.com." },
  { question: "Which Kenyan counties have the worst soil quality?", answer: "Counties in the ASAL (arid and semi-arid land) zone — Turkana, Marsabit, Mandera, Wajir, and Garissa — have the lowest soil productivity scores due to extreme aridity, low organic matter, and saline or alkaline conditions that limit crop diversity. Within agricultural zones, Kwale, Kilifi, and Taita Taveta's coastal sandy soils score low on nutrient retention. However, soil quality is not fixed — targeted management dramatically improves productivity in all these counties for appropriate crops." },
  { question: "What does ShambaIQ use to rank county soils?", answer: "ShambaIQ's county soil rankings are based on precision soil mapping combining satellite-derived predictions and ground-truth calibration data across all 47 counties. The ranking scores five parameters: soil pH proximity to optimum (6.0–6.5), total nitrogen, extractable phosphorus, extractable potassium, and organic carbon percentage. Each parameter is weighted by its agronomic impact and the scores are aggregated into a County Soil Quality Index (CSQI) for each county and crop combination. The rankings update annually as new calibration data is incorporated." },
  { question: "Does having good soil mean I do not need fertilizer?", answer: "No — even Kenya's highest-ranked soils require targeted fertilizer inputs for high-yield crop production. Kiambu's excellent volcanic soils are phosphorus-deficient for cabbages due to phosphorus fixation by iron oxides. Uasin Gishu's productive wheat soils require phosphorus and sulfur inputs every season. Good soil means a lower correction burden — you spend less on lime, need less phosphorus to overcome fixation, and have more natural nitrogen cycling. But no Kenyan agricultural soil produces optimal yields of cash crops without any fertilizer input." },
  { question: "How often do soil quality rankings change?", answer: "Soil quality changes slowly — organic carbon builds at 0.1 to 0.2 percent per season with good management and declines at similar rates under degrading practices. Soil pH shifts more measurably: unlimed soils under intensive nitrogen fertilization can drop 0.2 to 0.3 pH units per season. ShambaIQ updates county rankings annually to reflect cumulative management trends. Farm-level rankings can shift significantly within 2 to 3 seasons when lime is applied to strongly acidic soils or intensive compost programmes rebuild organic matter." },
  { question: "Can I see my specific farm's soil ranking rather than county average?", answer: "Yes — ShambaIQ provides farm-specific soil intelligence rather than county averages alone. Enter your county and crop at shambaiq.com and ShambaIQ returns your farm's predicted pH, nitrogen, phosphorus, potassium, and organic carbon from precision soil mapping at 30-metre resolution, along with a Soil Quality Index score for your selected crop and a comparison against your county's average. Farm-level data is significantly more actionable than county averages, which mask the substantial variation that exists within every county." },
]);

const TOC_ITEMS: TOCItem[] = [
  { id: "methodology", label: "How we rank Kenya's county soils", level: 2 },
  { id: "top-counties", label: "Top 10 counties by soil quality index", level: 2 },
  { id: "by-crop", label: "Best counties by crop type", level: 2 },
  { id: "asal-counties", label: "ASAL counties — managing low-ranked soils", level: 2 },
  { id: "improve", label: "How to improve your county's soil rank", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

const TOP_COUNTIES = [
  { rank: 1, county: "Kiambu", zone: "Central Highlands", ph: "5.2–6.0", nitrogen: "High", phosphorus: "Moderate", oc: "High", bestCrop: "Cabbage, Tomato, Tea", csqi: 82 },
  { rank: 2, county: "Murang'a", zone: "Central Highlands", ph: "5.0–6.2", nitrogen: "High", phosphorus: "Moderate", oc: "High", bestCrop: "Maize, Coffee, Avocado", csqi: 80 },
  { rank: 3, county: "Uasin Gishu", zone: "Rift Valley Highlands", ph: "5.5–6.5", nitrogen: "High", phosphorus: "Moderate", oc: "High", bestCrop: "Wheat, Maize, Potato", csqi: 79 },
  { rank: 4, county: "Nyeri", zone: "Central Highlands", ph: "4.8–5.8", nitrogen: "High", phosphorus: "Low–Moderate", oc: "High", bestCrop: "Coffee, Tea, Potato", csqi: 77 },
  { rank: 5, county: "Nakuru", zone: "Rift Valley", ph: "5.8–6.8", nitrogen: "Moderate–High", phosphorus: "Moderate", oc: "Moderate–High", bestCrop: "Maize, Wheat, Vegetables", csqi: 76 },
  { rank: 6, county: "Nandi", zone: "Western Highlands", ph: "5.2–6.0", nitrogen: "Moderate–High", phosphorus: "Moderate", oc: "High", bestCrop: "Tea, Maize, Dairy Fodder", csqi: 74 },
  { rank: 7, county: "Kirinyaga", zone: "Central Highlands", ph: "5.5–6.5", nitrogen: "Moderate–High", phosphorus: "Moderate", oc: "Moderate–High", bestCrop: "Rice, Tomato, Maize", csqi: 73 },
  { rank: 8, county: "Meru", zone: "Central Highlands", ph: "4.5–5.5", nitrogen: "High", phosphorus: "Low", oc: "High", bestCrop: "Miraa, Tea, Maize (with lime)", csqi: 71 },
  { rank: 9, county: "Trans Nzoia", zone: "Rift Valley Highlands", ph: "5.5–6.5", nitrogen: "High", phosphorus: "Moderate", oc: "High", bestCrop: "Maize, Potato, Sunflower", csqi: 71 },
  { rank: 10, county: "Kakamega", zone: "Western Highlands", ph: "4.8–5.5", nitrogen: "Moderate–High", phosphorus: "Low", oc: "Moderate–High", bestCrop: "Maize, Beans, Sugarcane", csqi: 69 },
];

export default function KenyaCountySoilRankingsPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil intelligence", url: `${BASE_URL}/blog?category=soil-intelligence` }, { name: "Kenya county soil rankings 2026", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=soil-intelligence" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Soil intelligence</Link>
                <span className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full">All 47 Counties</span>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Kenya county soil rankings 2026:
                <span className="text-gold-700">Which counties have the best farming soil?</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Not all Kenyan soils are equal — and the gap between the best and worst counties is not a matter of luck. It is geology, rainfall, land management history, and the accumulated effect of farming decisions made over decades. ShambaIQ has mapped soil quality across all 47 counties using precision soil prediction models calibrated against ground-truth data, scoring each county on pH, nitrogen, phosphorus, potassium, and organic carbon. Here is what the data shows.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-500 pb-6 border-b border-cream-300">
                <AuthorCard compact />
                <span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span className="text-soil-300">·</span>
                <span>{POST.readingTimeMin} min read</span>
              </div>
            </header>

            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img src={POST.image} alt={POST.imageAlt} width={1200} height={630} className="w-full h-72 object-cover" itemProp="image" loading="eager" />
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">ShambaIQ soil quality index mapped across Kenya's 47 counties. Source: ShambaIQ precision soil mapping 2026.</figcaption>
            </figure>

            <section>
              <h2 id="methodology" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">How we rank Kenya's county soils</h2>
              <p className="text-soil-600 leading-relaxed mb-4">The County Soil Quality Index (CSQI) aggregates five soil parameters, each scored against agronomic optima for general crop production and weighted by impact on yield.</p>
              <div className="grid sm:grid-cols-5 gap-3 mb-6">
                {[
                  { param: "Soil pH", weight: "30%", why: "Controls nutrient availability and aluminium toxicity" },
                  { param: "Organic Carbon", weight: "25%", why: "Water retention, microbial activity, nutrient cycling" },
                  { param: "Nitrogen", weight: "20%", why: "Primary yield-limiting nutrient across most crops" },
                  { param: "Phosphorus", weight: "15%", why: "Root development and energy transfer" },
                  { param: "Potassium", weight: "10%", why: "Disease resistance and water regulation" },
                ].map((item) => (
                  <div key={item.param} className="bg-cream-50 border border-cream-300 rounded-xl p-3 text-center">
                    <p className="font-bold text-forest-800 text-sm mb-1">{item.param}</p>
                    <p className="text-2xl font-display font-bold text-gold-700 mb-1">{item.weight}</p>
                    <p className="text-xs text-soil-500 leading-tight">{item.why}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="top-counties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Top 10 counties by soil quality index — 2026</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Kenya county soil quality rankings 2026 by ShambaIQ</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Rank", "County", "Zone", "pH range", "N", "P", "Oc", "Best crop", "Csqi"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {TOP_COUNTIES.map((c, i) => (
                      <tr key={c.county} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-bold text-gold-700">#{c.rank}</td>
                        <td className="px-3 py-3 font-semibold text-forest-800">
                          <Link href={`/soil/${c.county.toLowerCase().replace(/'/g, "").replace(/ /g, "-")}`} className="hover:text-gold-700 transition-colors">{c.county}</Link>
                        </td>
                        <td className="px-3 py-3 text-xs text-soil-500">{c.zone}</td>
                        <td className="px-3 py-3 font-mono text-xs">{c.ph}</td>
                        <td className="px-3 py-3 text-xs">{c.nitrogen}</td>
                        <td className="px-3 py-3 text-xs">{c.phosphorus}</td>
                        <td className="px-3 py-3 text-xs">{c.oc}</td>
                        <td className="px-3 py-3 text-xs text-forest-700">{c.bestCrop}</td>
                        <td className="px-3 py-3 font-bold text-forest-700">{c.csqi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">CSQI = County Soil Quality Index (0–100). Source: ShambaIQ precision soil mapping 2026. <Link href="/app" className="text-gold-700 hover:underline">Check your farm's specific score here.</Link></p>
            </section>

            <section>
              <h2 id="by-crop" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Best counties by crop type</h2>
              <p className="text-soil-600 leading-relaxed mb-5">The overall CSQI is useful but the crop-specific rankings tell a more practical story. A county that ranks 15th overall may rank 1st for a specific crop if its soil chemistry matches that crop's requirements precisely.</p>
              <div className="space-y-3 mb-6">
                {[
                  { crop: "Maize", topCounties: "Uasin Gishu, Trans Nzoia, Nakuru, Bungoma, Nandi", why: "Deep fertile soils, pH 5.8–6.8, adequate phosphorus, reliable long rains above 900mm" },
                  { crop: "Wheat", topCounties: "Uasin Gishu, Nakuru, Laikipia, Trans Nzoia", why: "Cool highland temperatures, low humidity during grain fill, pH 6.0–7.0, low disease pressure" },
                  { crop: "Tea", topCounties: "Kiambu, Murang'a, Nyeri, Kericho, Nandi, Bomet", why: "Acidic soils pH 4.5–5.5, high rainfall above 1,400mm, cool temperatures, free-draining slopes" },
                  { crop: "Tomato", topCounties: "Kirinyaga, Kiambu, Kajiado (irrigated), Taita Taveta", why: "Well-drained soils, warm days, calcium availability, proximity to Nairobi processing market" },
                  { crop: "Onion", topCounties: "Kajiado, Machakos, Narok, Taita Taveta", why: "Dry conditions for bulb curing, irrigation access, low humidity that reduces fungal disease" },
                  { crop: "Potato", topCounties: "Nyandarua, Nyeri, Meru, Trans Nzoia, Uasin Gishu", why: "Cool temperatures, well-drained loam soils, altitude above 1,800m, low late blight pressure" },
                  { crop: "Beans", topCounties: "Kakamega, Bungoma, Kisii, Nyamira, Murang'a", why: "Two reliable seasons, moderate temperatures, soils that support Rhizobium activity after liming" },
                  { crop: "Rice", topCounties: "Kirinyaga (Mwea), Kisumu, Homabay, Siaya, Tana River", why: "Flat terrain, irrigation infrastructure, vertisol clay soils that retain water for paddy conditions" },
                ].map((item) => (
                  <div key={item.crop} className="bg-white border border-cream-300 rounded-xl p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-forest-800">{item.crop}</h3>
                      <span className="text-xs text-gold-700 font-semibold bg-gold-50 border border-gold-200 px-2 py-0.5 rounded-full">{item.topCounties.split(",")[0].trim()} leads</span>
                    </div>
                    <p className="text-xs text-forest-700 font-medium mb-1">Top: {item.topCounties}</p>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.why}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="asal-counties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">ASAL counties — managing low-ranked soils</h2>
              <p className="text-soil-600 leading-relaxed mb-4">The 23 ASAL counties — covering 80 percent of Kenya's land area — rank lower on the CSQI not because farming is impossible but because the crops and management strategies required are different. Matching crop to soil and climate is the core precision principle.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { county: "Kajiado", strategy: "Onions and tomatoes under drip irrigation. Alkaline soils are an advantage for onion post-harvest curing. Proximity to Nairobi is a market advantage that compensates for the input cost of irrigation." },
                  { county: "Machakos / Makueni / Kitui", strategy: "Sorghum, pigeon peas, cowpeas, cassava, and green grams as primary crops. Zai pits and tied ridges for water harvesting. Organic matter restoration as the 3-season investment before intensifying with vegetables." },
                  { county: "Laikipia", strategy: "Dryland wheat and barley on the higher plateaux. Ranch-integrated farming combining livestock and fodder crops. Export horticulture under irrigation where groundwater access exists." },
                  { county: "Tana River / Kilifi", strategy: "Coastal cashew nuts, coconuts, and cassava on sandy soils. Irrigation-based horticulture along the Tana River. Mangrove-adjacent aquaculture integration with smallholder farming." },
                ].map((item) => (
                  <div key={item.county} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-2 text-sm">{item.county}</h3>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.strategy}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="improve" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">How to improve your county's soil rank</h2>
              <p className="text-soil-600 leading-relaxed mb-5">County averages mask huge farm-level variation. A farm in Kakamega (ranked 10th overall) can outperform a farm in Kiambu (ranked 1st) if the Kakamega farmer has limed to pH 6.0, applied Rhizobium, and built organic matter while the Kiambu farmer has done nothing. The ranking is a starting point — management determines the outcome.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Interventions to improve farm soil quality score in Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Intervention", "Csqi impact", "Time to result", "Cost/acre", "Priority"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Lime acidic soils to pH 6.0–6.5", "+15 to +25 points", "1–2 seasons", "KES 7,000–28,000", "Critical for pH below 5.5"],
                      ["Apply compost 3–5 t/acre/season", "+5 to +10 points", "2–4 seasons", "KES 3,000–8,000", "High — all counties"],
                      ["Incorporate crop residues (no burning)", "+3 to +7 points", "2–3 seasons", "Labour only", "High — especially ASAL"],
                      ["Legume cover crop rotation", "+5 to +12 points", "1–3 seasons", "KES 1,500–4,000", "High for low-N soils"],
                      ["Correct phosphorus application", "+3 to +5 points", "Immediate", "KES 2,000–5,000", "Medium — check first"],
                    ].map(([int, impact, time, cost, pri], i) => (
                      <tr key={int as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{int}</td>
                        <td className="px-4 py-3 font-bold text-green-700 text-xs">{impact}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{time}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{cost}</td>
                        <td className="px-4 py-3 text-xs font-medium text-gold-700">{pri}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free precision tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">See your county's soil score and your farm's specific pH, nitrogen, phosphorus, potassium, and organic carbon values. Free, no sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Check my county soil score</Link>
            </div>

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }, i: number) => (
                  <details key={i} className="group bg-white border border-cream-300 rounded-xl" itemScope itemType="https://schema.org/Question">
                    <summary className="flex justify-between items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-forest-800 hover:text-forest-600" itemProp="name">
                      {item.name}<span className="text-gold-500 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="px-5 pb-4 text-sm text-soil-600 leading-relaxed border-t border-cream-200" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                      <div itemProp="text">{item.acceptedAnswer.text}</div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
            <AuthorCard />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <TableOfContents items={TOC_ITEMS} />
              <div className="bg-cream-100 border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Top 5 counties</p>
                <div className="space-y-2">
                  {TOP_COUNTIES.slice(0, 5).map((c) => (
                    <Link key={c.county} href={`/soil/${c.county.toLowerCase().replace(/'/g, "").replace(/ /g, "-")}`} className="flex items-center justify-between text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>#{c.rank} {c.county}</span>
                      <span className="font-bold text-forest-700 text-xs">{c.csqi}/100</span>
                    </Link>
                  ))}
                </div>
                <Link href="/app" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:text-gold-700 transition-colors">Check your county →</Link>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More soil intelligence guides" />
      </div>
    </>
  );
}
