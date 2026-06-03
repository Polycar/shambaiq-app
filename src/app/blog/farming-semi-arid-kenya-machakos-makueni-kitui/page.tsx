import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("farming-semi-arid-kenya-machakos-makueni-kitui")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Regional guides", url: `${BASE_URL}/blog?category=regional-guides` }, { name: "Semi-arid Kenya farming", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What crops grow well in Machakos, Makueni, and Kitui?", answer: "The most reliable crops ranked by drought tolerance: sorghum (produces at 400 mm), cowpeas, pigeon peas, green grams, cassava, millet, and sweet potatoes. Maize is feasible with drought-tolerant varieties like DUMA 43 and conservation farming but fails in drought years. Onions under drip irrigation produce exceptional returns due to dry conditions favouring bulb curing. Get a county-specific crop plan at shambaiq.com." },
  { question: "How much rainfall is needed for farming in Machakos?", answer: "Machakos County averages 700 to 900 mm of annual rainfall in two unreliable seasons. The lower zones at 900 to 1,100 m experience high inter-annual variability — a bad year can bring 400 mm, a good year over 900 mm. Water harvesting through zai pits, tied ridges, and farm ponds is the technology that converts unreliable rainfall into reliable crop production." },
  { question: "What fertilizer should I use in semi-arid Kenya?", answer: "Semi-arid alfisol soils are phosphorus-deficient (6 to 16 mg/kg) and low in organic carbon (0.6 to 1.2 percent). Apply DAP at 25 to 50 kg per acre at planting. Reduce CAN top-dressing in drought years — nitrogen applied to moisture-stressed crops volatilises without uptake. Compost at 2 to 3 tonnes per acre per season is the highest-return single investment because it simultaneously improves water retention, phosphorus availability, and nitrogen cycling." },
  { question: "Is drip irrigation viable for small farms in Kitui?", answer: "Drip irrigation is viable for Kitui smallholders at 0.1 to 0.5 acres using gravity-fed systems from elevated tanks or simple solar-pumped systems. At 0.25 acres of drip-irrigated tomatoes or onions, revenue of KES 60,000 to 150,000 per season is achievable against investment of KES 20,000 to 40,000. The payback period is one to two seasons. Community sand dam projects have enabled drip irrigation clusters benefiting groups of 5 to 15 households sharing infrastructure costs." },
  { question: "How do farmers in Makueni County manage drought?", answer: "Experienced Makueni farmers manage drought through five integrated strategies: crop diversification across drought-tolerance levels, staggered planting dates to spread risk, water harvesting infrastructure, on-farm food reserves from drought-tolerant crops like cassava and pigeon peas, and income diversification through livestock and off-farm employment to reduce dependence on a single crop season." },
]);

const howToSchema = makeHowToSchema({
  name: "How to farm profitably in semi-arid Machakos, Makueni, and Kitui counties",
  description: "A step-by-step guide to precision dryland farming across Kenya's semi-arid lower eastern counties, covering water harvesting, crop selection, and soil organic matter restoration.",
  totalTime: "P365D",
  estimatedCost: { currency: "KES", value: "8000–20000 per acre depending on irrigation" },
  supply: ["Drought-tolerant crop seed (sorghum, cowpeas, pigeon peas, green grams)", "DAP fertilizer (25–50 kg per acre)", "Compost or farmyard manure (2–5 tonnes per acre)", "Drip irrigation tape (if irrigating)"],
  tool: ["Hand hoe for zai pits", "Ox plough for tied ridges", "Soil moisture probe or visual assessment", "ShambaIQ precision tool"],
  steps: [
    { name: "Check soil data for your specific sub-county", text: "Use ShambaIQ at shambaiq.com to get your farm's exact soil pH, organic carbon, phosphorus, and nitrogen values. Machakos, Makueni, and Kitui each have significant internal variation — highland Machakos at 1,400 m altitude has different soil and rainfall than lowland Kitui at 700 m. A single county recommendation is insufficient — sub-county precision matters." },
    { name: "Build water harvesting structures before the rains", text: "During the dry season before expected rains, dig zai pits (20 cm diameter, 15 cm deep, 60 cm apart) and build tied ridges across slope contours. Fill each zai pit with a double handful of compost. These structures capture 40 to 70 percent of rainfall that would otherwise run off the field surface. On a 1-acre plot, zai pits require 3 to 5 days of labour — the single highest-return investment for dryland farming." },
    { name: "Select crops by your rainfall zone, not by neighbour's choice", text: "Match your crop to your specific location's average rainfall. Below 500 mm: sorghum, millet, cowpeas, and cassava only. At 500 to 700 mm: add pigeon peas, green grams, sweet potatoes, and drought-tolerant maize (DUMA 43). Above 700 mm: standard maize, beans, and vegetables become viable with water harvesting. Never plant maize in zones below 500 mm — it will fail in 3 out of 5 years." },
    { name: "Apply compost and low-rate DAP at planting", text: "Apply compost at 2 to 3 tonnes per acre into zai pits or along planting furrows. Add DAP at 25 to 50 kg per acre in the planting furrow. Do not apply CAN top-dress unless rains are clearly established and consistent — nitrogen applied to drought-stressed crops volatilises from the soil surface without root uptake, wasting the input entirely." },
    { name: "Practise staggered planting to spread risk", text: "Do not plant the entire farm on the same day. Plant 40 percent of the acreage at the first reliable rain, 30 percent one week later, and the remaining 30 percent two weeks later. If the season fails early, the last planting may still produce. If the season is good, all three plantings succeed. This simple risk management technique costs nothing and dramatically reduces the probability of total crop failure." },
    { name: "Integrate livestock and crop residues for organic matter cycling", text: "After crop harvest, feed residues to livestock and return the manure to the cropping fields as compost. This closed nutrient loop is the only sustainable way to build organic carbon from 0.8 percent to the 2 percent target that transforms water retention, soil structure, and long-term productivity on Machakos, Makueni, and Kitui's degraded alfisol soils." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "three-counties", label: "Three counties, one challenge — different solutions", level: 2 },
  { id: "soil-comparison", label: "Soil data comparison: Machakos vs Makueni vs Kitui", level: 2 },
  { id: "crop-selection", label: "Crop selection by rainfall zone", level: 2 },
  { id: "water-harvesting", label: "Water harvesting — zai pits, tied ridges, sand dams", level: 2 },
  { id: "fertilizer", label: "Fertilizer strategy for semi-arid soils", level: 2 },
  { id: "irrigation", label: "Drip irrigation for smallholders", level: 2 },
  { id: "howto", label: "Step-by-step dryland farming guide", level: 2 },
  { id: "budget", label: "Cost comparison: rainfed vs irrigated", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function SemiAridKenyaPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Regional guides", url: `${BASE_URL}/blog?category=regional-guides` }, { name: "Semi-arid Kenya farming", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=regional-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Regional guides</Link>
                <Link href="/soil/machakos" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Machakos</Link>
                <Link href="/soil/makueni" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Makueni</Link>
                <Link href="/soil/kitui" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Kitui</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Farming in semi-arid Kenya:
                <span className="text-gold-700">Precision strategies for Machakos, Makueni, and Kitui</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Machakos, Makueni, and Kitui counties cover Kenya's largest contiguous dryland farming zone — over 36,000 square kilometres of alfisol soils receiving 400 to 800 mm of erratic annual rainfall. Conventional extension advice fails here because it was developed for highland conditions and assumes rainfall regularity that does not exist. Precision farming in semi-arid Kenya starts from a different premise: work with the rainfall that arrives rather than managing for the rainfall you hope for. These three counties share the same challenges — low organic carbon, phosphorus deficiency, and unpredictable moisture — but each has distinct sub-county variation that demands targeted rather than blanket recommendations.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Dryland farming landscape in Makueni County showing terraced hillside with pigeon pea intercropping. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="three-counties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Three counties, one challenge — different solutions</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Machakos, Makueni, and Kitui share the lower eastern Kenya dryland belt but differ meaningfully in altitude, rainfall, and market access. Understanding these differences determines which precision strategies apply to your specific sub-county.</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { county: "Machakos", altitude: "1,000 – 1,700 m", rainfall: "700 – 900 mm", soilType: "Alfisol, sandy-clay loam", market: "Nairobi 60 km — strong vegetable demand", advantage: "Highest altitude of the three. Highland sub-counties (Mwala, Kangundo) viable for maize. Closest to Nairobi's premium vegetable markets." },
                  { county: "Makueni", altitude: "600 – 1,500 m", rainfall: "500 – 800 mm", soilType: "Alfisol, red sandy loam", market: "Nairobi 150 km — strong fruit market (mango, pawpaw)", advantage: "Kenya's largest mango-producing county. Wote and Emali sub-counties have irrigation potential from Athi River catchment. Strong fruit processing infrastructure." },
                  { county: "Kitui", altitude: "400 – 1,400 m", rainfall: "400 – 700 mm", soilType: "Alfisol, sandy to sandy-clay", market: "Nairobi 180 km — road quality variable", advantage: "Largest of the three counties by area. Significant groundwater in seasonal rivers. Sand dam technology most advanced here — over 3,000 sand dams built by community groups." },
                ].map((c) => (
                  <div key={c.county} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-bold text-forest-800 mb-2">{c.county} County</h3>
                    <div className="space-y-1.5 text-xs mb-3">
                      {[["Altitude", c.altitude], ["Rainfall", c.rainfall], ["Soil", c.soilType], ["Market", c.market]].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between gap-2">
                          <span className="text-soil-500">{label}</span>
                          <span className="font-medium text-forest-700 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-soil-500 border-t border-cream-200 pt-2">{c.advantage}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-comparison" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Soil data comparison: Machakos vs Makueni vs Kitui</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Soil nutrient comparison across Machakos Makueni and Kitui counties Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Parameter", "Machakos", "Makueni", "Kitui", "Crop optimum"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "6.0 – 6.8", "5.8 – 6.8", "6.2 – 7.5", "6.0 – 6.5"],
                      ["Organic Carbon (%)", "0.6 – 1.4", "0.5 – 1.0", "0.4 – 0.9", "> 2.0%"],
                      ["Total Nitrogen (g/kg)", "0.6 – 1.2", "0.5 – 1.0", "0.4 – 0.8", "> 1.2 g/kg"],
                      ["Phosphorus (mg/kg)", "8 – 18", "5 – 14", "4 – 12", "> 15 mg/kg"],
                      ["Potassium (mg/kg)", "120 – 280", "100 – 220", "80 – 200", "> 100 mg/kg"],
                      ["Water retention (mm/100mm)", "8 – 14", "6 – 11", "5 – 10", "> 18 mm"],
                    ].map(([param, mach, mak, kit, opt], i) => (
                      <tr key={param as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{param}</td>
                        <td className="px-4 py-3 text-soil-600">{mach}</td>
                        <td className="px-4 py-3 text-soil-600">{mak}</td>
                        <td className="px-4 py-3 text-soil-600">{kit}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700 text-xs">{opt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Source: ShambaIQ precision soil mapping, county averages at 0–20 cm depth. <Link href="/app?county=machakos" className="text-gold-700 hover:underline">Get your farm-specific values here.</Link></p>
            </section>

            <section>
              <h2 id="crop-selection" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Crop selection by rainfall zone</h2>
              <p className="text-soil-600 leading-relaxed mb-5">The single most important precision decision in semi-arid farming is matching crop to rainfall — not applying more fertilizer to the wrong crop. This table ranks crops by minimum viable rainfall and expected return.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Drought tolerant crop selection for semi-arid Kenya by rainfall zone</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Crop", "Min rainfall", "Season length", "Yield/acre", "Revenue/acre", "Best county zone"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Sorghum", "350 mm", "90–120 days", "8–15 bags", "KES 24,000–45,000", "All three — most reliable"],
                      ["Cowpeas", "400 mm", "60–75 days", "4–8 bags", "KES 32,000–64,000", "All three — fastest cash"],
                      ["Pigeon peas", "450 mm", "150–200 days", "3–6 bags", "KES 30,000–60,000", "Machakos, Makueni highlands"],
                      ["Green grams", "450 mm", "60–70 days", "3–5 bags", "KES 36,000–60,000", "All three — premium market price"],
                      ["Cassava", "400 mm", "9–18 months", "5–12 tonnes", "KES 50,000–120,000", "Kitui lowlands, Makueni"],
                      ["Mango", "500 mm", "Perennial", "2–6 tonnes", "KES 60,000–180,000", "Makueni — established value chain"],
                      ["Maize (DUMA 43)", "550 mm", "85–100 days", "8–16 bags", "KES 28,000–56,000", "Machakos highlands only"],
                      ["Onion (irrigated)", "Drip", "110–120 days", "15–20 tonnes", "KES 300,000–500,000", "Kajiado border, Makueni irrigated"],
                    ].map(([crop, rain, season, yield_, rev, zone], i) => (
                      <tr key={crop as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-semibold text-forest-800">{crop}</td>
                        <td className="px-3 py-3 text-soil-600">{rain}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{season}</td>
                        <td className="px-3 py-3 text-soil-500 text-xs">{yield_}</td>
                        <td className="px-3 py-3 font-medium text-green-700 text-xs">{rev}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{zone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="water-harvesting" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Water harvesting — the technology that makes semi-arid farming viable</h2>
              <p className="text-soil-600 leading-relaxed mb-5">In semi-arid Kenya, the limiting factor is not total annual rainfall — it is rainfall capture. Without water harvesting, 30 to 60 percent of every rainfall event runs off the surface and leaves the farm before roots can absorb it.</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { technique: "Zai pits", cost: "Labour only — KES 2,000–4,000/acre", result: "40–60% runoff reduction", detail: "Small planting basins (20–30 cm diameter, 15 cm deep) filled with compost concentrate water and nutrients at the root zone. Each pit captures 3 to 5 litres per rainfall event. After 2 to 3 seasons of compost additions, the pit zone develops dramatically better soil structure than surrounding soil — creating permanent micro-zones of fertility.", timeframe: "Dig during dry season. Benefits from first rain." },
                  { technique: "Tied ridges", cost: "Ox plough — KES 1,500–2,500/acre", result: "40–70% runoff reduction", detail: "Ridges across slope contour with cross-ties every 3 to 4 metres create connected water storage basins across the entire field. Water is intercepted before it can flow downhill. Most effective on slopes of 2 to 15 percent — the gradient range covering most farmland in all three counties.", timeframe: "Build at season start. Rebuild annually." },
                  { technique: "Sand dams", cost: "Community — KES 200,000–500,000 per dam", result: "Year-round shallow water table", detail: "Concrete weirs across seasonal rivers that trap sand during floods. The sand stores water that can be accessed via shallow wells for months after the last rain. Kitui County has over 3,000 sand dams — more than anywhere else in Africa — enabling drip irrigation, livestock watering, and domestic use in areas that would otherwise be waterless for 6 months per year.", timeframe: "Multi-year community investment. 20+ year lifespan." },
                ].map((item) => (
                  <div key={item.technique} className="bg-forest-50 border border-forest-200 rounded-xl p-4">
                    <h3 className="font-bold text-forest-800 mb-1">{item.technique}</h3>
                    <p className="text-xs text-gold-700 font-medium mb-1">{item.cost}</p>
                    <div className="bg-white rounded-lg p-2 text-xs text-green-700 font-medium mb-2">{item.result}</div>
                    <p className="text-xs text-soil-500 leading-relaxed mb-2">{item.detail}</p>
                    <p className="text-xs text-forest-600 font-medium">{item.timeframe}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="fertilizer" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Fertilizer strategy for semi-arid soils</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Fertilizer management in semi-arid conditions requires a fundamentally different approach from highland farming. The key principle: organic matter first, phosphorus second, nitrogen only when moisture is assured.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Fertilizer programme for semi-arid Machakos Makueni Kitui Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Input", "Rate/acre", "When", "Why in semi-arid context"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Compost / manure", "2–5 tonnes", "Before planting into zai pits", "Builds water retention — the primary yield constraint. Each 1% OC increase = 20 L/m² more water held"],
                      ["DAP", "25–50 kg", "In planting furrow at planting", "Phosphorus for root development. Lower rate than highland — half the fertilizer at half the moisture produces similar P availability"],
                      ["CAN", "25–50 kg", "At knee height — ONLY if rains established", "Skip entirely in dry years. N applied to moisture-stressed crops volatilises without root uptake. Wasted money."],
                      ["Rock phosphate", "50–100 kg", "Pre-plant broadcast", "Slow-release P alternative to DAP. Cheaper per unit P. Better suited to single-application semi-arid systems where farmers cannot return to field for top-dress"],
                    ].map(([input, rate, when, why], i) => (
                      <tr key={input as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800">{input}</td>
                        <td className="px-4 py-3 text-soil-600">{rate}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{when}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">The compost-first principle for semi-arid soils</p>
                <p className="text-sm text-amber-700 leading-relaxed">On Machakos, Makueni, and Kitui soils at 0.6 to 1.0 percent organic carbon, spending KES 5,000 on compost and KES 2,000 on DAP will outperform spending KES 7,000 on DAP and CAN alone. The compost improves water retention — the primary yield constraint — while DAP and CAN only supply nutrients that cannot be absorbed without adequate soil moisture. Fix the water problem first and the fertilizer works harder.</p>
              </div>
            </section>

            <section>
              <h2 id="irrigation" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Drip irrigation for smallholders — economics and setup</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Where water is available — from sand dams, boreholes, farm ponds, or seasonal rivers — drip irrigation transforms semi-arid smallholder farming economics from subsistence to commercial.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Drip irrigation economics for smallholder farms in semi-arid Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "0.25 Acre system", "0.5 Acre system", "1 Acre system"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Drip tape and fittings", "KES 8,000", "KES 15,000", "KES 25,000"],
                      ["Water tank (elevated)", "KES 5,000", "KES 8,000", "KES 12,000"],
                      ["Pump (solar or manual)", "KES 8,000", "KES 12,000", "KES 20,000"],
                      ["Total infrastructure", "KES 21,000", "KES 35,000", "KES 57,000"],
                      ["Annual operating cost", "KES 4,000", "KES 7,000", "KES 12,000"],
                      ["Revenue (tomato/onion)", "KES 60,000–150,000", "KES 120,000–300,000", "KES 250,000–500,000"],
                      ["Payback period", "1 season", "1 season", "1–2 seasons"],
                    ].map(([item, q, h, a], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{item}</td>
                        <td className="px-4 py-3 text-soil-600">{q}</td>
                        <td className="px-4 py-3 text-soil-600">{h}</td>
                        <td className="px-4 py-3 text-soil-600">{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-step: dryland farming in Machakos, Makueni, and Kitui</h2>
              <ol className="space-y-4">
                {howToSchema.step.map((step: { name: string; text: string }, i: number) => (
                  <li key={i} className="flex gap-4 bg-white border border-cream-300 rounded-xl p-5" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                    <div className="w-9 h-9 rounded-full bg-forest-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <div>
                      <h3 className="font-semibold text-forest-800 mb-1" itemProp="name">{step.name}</h3>
                      <p className="text-sm text-soil-500 leading-relaxed" itemProp="text">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost comparison: rainfed vs irrigated semi-arid farming per acre</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-forest-700 text-white">
                    <tr>{["", "Rainfed sorghum + cowpea", "Drip-irrigated onion"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Seed / seedlings", "KES 2,000", "KES 8,000"],
                      ["Fertilizer (DAP + compost)", "KES 5,000", "KES 12,000"],
                      ["Water / irrigation", "KES 0", "KES 15,000"],
                      ["Drip infrastructure (amortised)", "KES 0", "KES 9,000"],
                      ["Labour", "KES 4,000", "KES 8,000"],
                      ["Pesticide / fungicide", "KES 1,000", "KES 5,000"],
                    ].map(([item, rainfed, irrigated], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 text-forest-800">{item}</td>
                        <td className="px-4 py-3 text-soil-600">{rainfed}</td>
                        <td className="px-4 py-3 text-soil-600">{irrigated}</td>
                      </tr>
                    ))}
                    <tr className="bg-forest-700 text-white"><td className="px-4 py-3 font-bold">Total Cost</td><td className="px-4 py-3 font-bold">KES 12,000</td><td className="px-4 py-3 font-bold">KES 57,000</td></tr>
                    <tr className="bg-gold-50"><td className="px-4 py-3 font-bold text-gold-800">Revenue</td><td className="px-4 py-3 font-bold text-gold-800">KES 56,000–109,000</td><td className="px-4 py-3 font-bold text-gold-800">KES 300,000–500,000</td></tr>
                    <tr className="bg-green-50"><td className="px-4 py-3 font-bold text-green-800">Net margin</td><td className="px-4 py-3 font-bold text-green-800">KES 44,000–97,000</td><td className="px-4 py-3 font-bold text-green-800">KES 243,000–443,000</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Rainfed budget assumes good season. In drought years, rainfed income drops to KES 15,000–30,000 while irrigated income is stable. Find <Link href="/dealers/machakos" className="text-gold-700 hover:underline">agrovets and input prices across all three counties here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ maps your specific sub-county's soil data and rainfall zone, then recommends the crops and inputs that match your conditions — not a county average. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Semi-Arid Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and zone pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/machakos", label: "Machakos county soil report" },
                  { href: "/soil/makueni", label: "Makueni county soil report" },
                  { href: "/soil/kitui", label: "Kitui county soil report" },
                  { href: "/blog/organic-soil-restoration-machakos", label: "Machakos organic restoration guide" },
                  { href: "/zones/semi-arid", label: "Semi-arid zone overview" },
                  { href: "/dealers/machakos", label: "Agrovets in Machakos county" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 text-soil-500 hover:text-forest-700 transition-colors py-1">
                    <span className="text-gold-500 flex-shrink-0">→</span>{label}
                  </Link>
                ))}
              </div>
            </aside>

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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Region quick facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Semi-Arid / ASAL"], ["Area", "36,000+ km²"], ["Avg Rainfall", "400–900 mm/yr"], ["Soil Type", "Alfisol"], ["Avg OC", "0.4–1.4%"], ["Best Strategy", "Water harvest first"], ["Top Crop", "Sorghum + cowpeas"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">County Soil Reports</p>
                <div className="space-y-1.5">
                  {[{ slug: "machakos", name: "Machakos" }, { slug: "makueni", name: "Makueni" }, { slug: "kitui", name: "Kitui" }, { slug: "kajiado", name: "Kajiado" }].map(({ slug, name }) => (
                    <Link key={slug} href={`/soil/${slug}`} className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>{name} County</span><span className="text-gold-500 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More regional farming guides" />
      </div>
    </>
  );
}
