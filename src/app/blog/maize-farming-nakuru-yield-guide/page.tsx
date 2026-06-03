import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("maize-farming-nakuru-yield-guide")!;

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

const articleSchema = makeArticleSchema({ headline: POST.title, description: POST.metaDescription, slug: POST.slug, datePublished: POST.datePublished, dateModified: POST.dateModified, image: POST.image, keywords: [POST.focusKeyword, ...POST.secondaryKeywords], wordCount: POST.wordCount, section: POST.section });
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Maize farming in Nakuru", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What is the best fertilizer for maize in Nakuru County?", answer: "Nakuru loam soils respond best to DAP or NPK 23:21:0 at one bag per acre at planting, followed by CAN at one bag per acre at knee height. Soils with phosphorus below 15 mg/kg need 1.5 bags of DAP at planting. Get a farm-specific plan at shambaiq.com/app?county=nakuru&crop=maize." },
  { question: "When is the best time to plant maize in Nakuru?", answer: "Long rains: late February to mid-March. Short rains: late September to early October. Long rains give higher yields in Rongai, Njoro, and Molo. Naivasha basin farmers can plant slightly earlier due to lower altitude." },
  { question: "How many bags of maize per acre in Nakuru?", answer: "With certified hybrid seed and full fertilizer programme, 25 to 35 bags of 90 kg per acre is achievable. The average smallholder currently gets 12 to 18 bags due to underfertilization and recycled seed. The ShambaIQ precision plan closes that gap." },
  { question: "Which maize variety suits Nakuru County?", answer: "For 1,800 to 2,400 m altitude: H614D and DK8031. For Nakuru Town and surrounds at 1,700 to 2,100 m: Pioneer PH1. For Naivasha basin below 1,900 m: H513. Always buy KEPHIS-certified seed from a registered agrovet." },
  { question: "Does Nakuru soil need lime for maize?", answer: "Most of Nakuru sits at pH 6.0 to 6.8 — optimal for maize and no lime needed. High-altitude Molo and parts of Kuresoi occasionally drop below pH 5.8. Check your exact farm location on ShambaIQ before spending on lime." },
  { question: "What causes low maize yields in Nakuru despite good rainfall?", answer: "The three most common causes are: insufficient phosphorus at planting, delayed CAN top-dressing past knee height, and planting uncertified recycled seed. Potassium is generally adequate in Nakuru loam soils and is rarely the limiting factor." },
]);

const howToSchema = makeHowToSchema({
  name: "How to grow maize in Nakuru county — precision fertilizer guide",
  description: "Science-backed guide to planting and fertilizing maize on Nakuru County loam soils for maximum yield.",
  totalTime: "P120D",
  estimatedCost: { currency: "KES", value: "12000–16000 per acre" },
  supply: ["KEPHIS-certified hybrid maize seed", "DAP or NPK 23:21:0 (1 bag per acre)", "CAN 26% (1 bag per acre)", "Pre-emergence herbicide"],
  tool: ["Hand hoe or tractor", "Planting stick or jab planter", "Knapsack sprayer", "ShambaIQ precision tool"],
  steps: [
    { name: "Run your soil check before buying inputs", text: "Use ShambaIQ at shambaiq.com/app?county=nakuru&crop=maize to pull precision soil data for your exact farm location. Nakuru soils vary significantly between Rongai, Molo, and Naivasha — a plan built for one sub-location can be wrong for another." },
    { name: "Prepare land two weeks before planting", text: "Plough to 20 to 25 cm depth at least two weeks before planting to allow residue to break down. Plant when soil at 10 cm depth holds moisture without being waterlogged." },
    { name: "Apply basal fertilizer at planting", text: "Apply DAP or NPK 23:21:0 at one bag (50 kg) per acre directly into the planting furrow, covered by a thin soil layer before placing the seed. Never allow fertilizer to touch the seed directly." },
    { name: "Plant certified hybrid seed at correct spacing", text: "Plant at 75 cm between rows and 25 cm within rows, two seeds per hole thinned to one at two weeks. This gives approximately 53,000 plants per acre — the population needed to fully use the fertilizer applied." },
    { name: "Apply pre-emergence herbicide within 72 hours", text: "Apply Atrazine 80WP at 2 kg per acre on moist soil within 72 hours of planting. This suppresses broadleaf weeds and grasses during the critical first six weeks of establishment." },
    { name: "Top-dress with CAN at knee height", text: "Apply CAN at one bag (50 kg) per acre when maize reaches 30 to 40 cm height, approximately four to six weeks after planting. Place CAN in a ring 10 cm from the stem — not against the stem." },
    { name: "Scout for fall armyworm weekly from week 3", text: "Check 20 plants per acre weekly. At 10 percent infestation apply emamectin benzoate directed into the whorl early morning or evening. Act within 48 hours of visible damage." },
    { name: "Harvest at correct moisture", text: "Harvest when grain moisture is below 20 percent, typically 120 days after planting. Dry to below 13 percent before bagging for storage or sale to avoid aflatoxin contamination." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "nakuru-maize-advantage", label: "Why Nakuru is Kenya's maize heartland", level: 2 },
  { id: "soil-data", label: "Nakuru soil data for maize", level: 2 },
  { id: "variety-selection", label: "Certified variety selection by sub-location", level: 2 },
  { id: "fertilizer-programme", label: "The precision fertilizer programme", level: 2 },
  { id: "planting-calendar", label: "Planting calendar for Nakuru", level: 2 },
  { id: "weed-pest-management", label: "Weed and pest management", level: 2 },
  { id: "howto", label: "Step-by-step growing guide", level: 2 },
  { id: "budget", label: "Full cost and revenue budget per acre", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function MaizeNakuruPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Maize farming in Nakuru", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County farming guides</Link>
                <Link href="/soil/nakuru" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Nakuru County</Link>
                <Link href="/crops/maize" className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors">Maize</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Maize farming in Nakuru county:
                <span className="text-gold-700">A precision guide to maximum yields</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Nakuru County sits at the heart of Kenya's maize belt. Its loam soils, reliable bimodal rainfall, and altitude range of 1,700 to 2,400 metres create near-ideal conditions for maize production. Yet the average smallholder here harvests barely half of what the same farm is capable of producing. The gap is not rainfall, not seed, not labour. It is precision: applying the right fertilizer, at the right amount, at the right time, based on what the soil actually contains.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Maize crop at flowering stage, Nakuru County, Rift Valley. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="nakuru-maize-advantage" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Nakuru is Kenya's maize heartland</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kenya produces approximately 3.6 million tonnes of maize annually, and the Rift Valley region — anchored by Nakuru — accounts for nearly a quarter of national output. Nakuru's position is not accidental. The county combines four structural advantages that few Kenyan counties can match simultaneously.</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Loam soils with strong nutrient-holding capacity", detail: "Nakuru's dominant soil type is a sandy clay loam derived from volcanic parent material. These soils hold applied fertilizer efficiently — draining enough to prevent waterlogging but retaining moisture long enough for roots to absorb nutrients between rainfall events." },
                  { title: "Bimodal rainfall totalling 800 to 1,200 mm per year", detail: "Two reliable rain seasons — long rains from February to May and short rains from September to November — allow two maize crops per year in most of Nakuru. The Molo and Njoro highlands receive the higher end of this range." },
                  { title: "Altitude range suits mid-altitude maize varieties", detail: "Nakuru's 1,700 to 2,400 metre altitude range aligns precisely with the optimal conditions for Kenya's highest-yielding certified hybrids including H614D and DK8031, which consistently outperform varieties used in lowland counties." },
                  { title: "Market infrastructure and buyer access", detail: "Proximity to the Nakuru grain market, NCPB depot access, and road connections to Nairobi give Nakuru farmers negotiating power that remote counties lack. Dried maize at 13 percent moisture commands premium prices from millers who prefer Rift Valley grain." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Nakuru soil data and what it means for maize</h2>
              <p className="text-soil-600 leading-relaxed mb-5">ShambaIQ uses high-resolution satellite soil prediction models at 30-metre resolution to generate nutrient estimates at farm level across all 47 counties. Here is what the data shows for Nakuru, mapped against maize's agronomic requirements:</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Nakuru County soil nutrient values versus maize requirements</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Nutrient", "Nakuru average", "Maize optimum", "Status", "Implication"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "6.0 – 6.8", "5.8 – 7.0", "Optimal", "No lime needed in most farms"],
                      ["Total Nitrogen (g/kg)", "1.4 – 2.1", "> 1.5 g/kg", "Adequate – Low", "CAN top-dressing always required"],
                      ["Phosphorus (mg/kg)", "12 – 28", "> 20 mg/kg", "Marginal – Good", "DAP at planting non-negotiable"],
                      ["Potassium (mg/kg)", "180 – 320", "> 100 mg/kg", "Sufficient", "No K supplement needed"],
                      ["Organic Carbon (g/kg)", "15 – 25", "> 12 g/kg", "Good", "Maintain with crop residue retention"],
                    ].map(([n, v, o, s, i], idx) => (
                      <tr key={n as string} className={idx % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{n}</td>
                        <td className="px-4 py-3 text-soil-600">{v}</td>
                        <td className="px-4 py-3 text-soil-500">{o}</td>
                        <td className="px-4 py-3 font-medium">{s}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Source: ShambaIQ precision soil mapping, 0 to 20 cm depth, Nakuru County average. Farm-level values vary by sub-location. <Link href="/app?county=nakuru&crop=maize" className="text-gold-700 hover:underline">Get your exact farm reading here.</Link></p>
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">The Key Insight for Nakuru Maize Farmers</p>
                <p className="text-sm text-amber-700 leading-relaxed">Phosphorus is the variable nutrient in Nakuru. At 12 mg/kg in lower-rainfall sub-locations, DAP underdosing directly limits root development. At 28 mg/kg in high-organic-matter Molo soils, DAP rates can be reduced without yield penalty. This 2.3-fold range is why a county-average recommendation is less accurate than a farm-level one.</p>
              </div>
            </section>

            <section>
              <h2 id="variety-selection" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Certified variety selection by sub-location</h2>
              <p className="text-soil-600 leading-relaxed mb-5">A certified hybrid on well-fertilized Nakuru soil consistently yields 25 to 35 bags per acre. The same soil with recycled seed yields 10 to 15 bags regardless of fertilizer input. The genetics set the ceiling — choose accordingly.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  { variety: "H614D", altitude: "1,800 – 2,400 m", maturity: "120 – 130 days", yield: "28 – 35 bags/acre", notes: "Best for Molo, Njoro, and Kuresoi highlands. Tolerant to grey leaf spot common at high altitude." },
                  { variety: "DK8031", altitude: "1,700 – 2,200 m", maturity: "115 – 125 days", yield: "26 – 33 bags/acre", notes: "Strong stalk, wind-resistant. Preferred in Rongai and Subukia where wind damage is common." },
                  { variety: "Pioneer PH1", altitude: "1,700 – 2,100 m", maturity: "110 – 120 days", yield: "25 – 32 bags/acre", notes: "Earlier maturity suits the shorter short-rains season. Good for Nakuru Town environs and Naivasha north." },
                  { variety: "H513", altitude: "1,600 – 1,900 m", maturity: "100 – 110 days", yield: "20 – 28 bags/acre", notes: "Short-season for Naivasha basin and lower Gilgil. Not suitable above 2,000 m." },
                ].map((v) => (
                  <div key={v.variety} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-3">{v.variety}</h3>
                    <div className="space-y-1.5 text-sm mb-3">
                      {[["Altitude range", v.altitude], ["Maturity", v.maturity], ["Expected yield", v.yield]].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between gap-2">
                          <span className="text-soil-500">{label}</span>
                          <span className="font-medium text-forest-700 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-soil-500 border-t border-cream-200 pt-2">{v.notes}</p>
                  </div>
                ))}
              </div>
              <p className="text-soil-500 text-sm leading-relaxed">Always purchase from a KEPHIS-registered agrovet and verify the lot number on the KEPHIS website. Counterfeit seed is a documented problem in Nakuru — it looks identical to certified seed but contains no genetic improvement and often carries pathogen contamination.</p>
            </section>

            <section>
              <h2 id="fertilizer-programme" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">The precision fertilizer programme for Nakuru maize</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Nakuru soils need two fertilizer applications per season. The basal application at planting builds root architecture. The top-dressing at knee height drives rapid vegetative growth and grain fill. Skipping either application cuts yield by 30 to 45 percent.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Fertilizer programme for maize in Nakuru County Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Application", "Fertilizer", "Rate per acre", "Timing", "Placement"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Basal (standard soil)", "DAP 18:46:0", "1 bag (50 kg)", "At planting", "In furrow, covered before seed"],
                      ["Basal (P-deficient soil)", "DAP 18:46:0", "1.5 bags (75 kg)", "At planting", "In furrow, covered before seed"],
                      ["Alternative basal", "NPK 23:21:0", "1 bag (50 kg)", "At planting", "In furrow, covered before seed"],
                      ["Top-dressing", "CAN 26%", "1 bag (50 kg)", "Knee height (4–6 wks)", "Ring 10 cm from stem"],
                    ].map(([app, fert, rate, timing, placement], i) => (
                      <tr key={app as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{app}</td>
                        <td className="px-4 py-3 font-mono text-xs text-soil-500">{fert}</td>
                        <td className="px-4 py-3 text-soil-600">{rate}</td>
                        <td className="px-4 py-3 text-soil-500">{timing}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{placement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-forest-800 mb-2">NPK 23:21:0 vs DAP — Which to Choose in Nakuru?</p>
                <p className="text-sm text-forest-700 leading-relaxed">Both work well on Nakuru loam soils. NPK 23:21:0 provides nitrogen at planting alongside phosphorus, giving a slight early growth advantage. DAP provides more phosphorus per bag, making it the better choice when ShambaIQ shows phosphorus below 15 mg/kg. At current Nakuru agrovet prices, DAP is typically 200 to 400 KES cheaper per bag.</p>
              </div>
            </section>

            <section>
              <h2 id="planting-calendar" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Planting calendar for Nakuru county</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-6">
                <table className="w-full text-sm">
                  <caption className="sr-only">Maize planting calendar for Nakuru County Kenya 2026</caption>
                  <thead className="bg-cream-200">
                    <tr>{["Season", "Land prep", "Plant", "Top-dress", "Harvest", "Best variety"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs text-forest-800 uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-forest-700">Long Rains</td>
                      <td className="px-4 py-3">Jan – Feb</td>
                      <td className="px-4 py-3">Late Feb – Mid March</td>
                      <td className="px-4 py-3">April</td>
                      <td className="px-4 py-3">June – July</td>
                      <td className="px-4 py-3">H614D, DK8031</td>
                    </tr>
                    <tr className="bg-cream-50">
                      <td className="px-4 py-3 font-semibold text-forest-700">Short Rains</td>
                      <td className="px-4 py-3">Aug – Sep</td>
                      <td className="px-4 py-3">Late Sep – Early Oct</td>
                      <td className="px-4 py-3">November</td>
                      <td className="px-4 py-3">Jan – Feb</td>
                      <td className="px-4 py-3">Pioneer PH1, H513</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="weed-pest-management" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Weed and pest management in Nakuru maize</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Weed competition in the first six weeks after planting can reduce yields by 40 to 60 percent independent of fertilizer. On Nakuru's productive loam soils, weeds grow as aggressively as the crop. Three management windows matter.</p>
              <div className="space-y-3 mb-6">
                {[
                  { window: "Days 1–3 after planting", action: "Pre-emergence herbicide", detail: "Apply Atrazine 80WP at 2 kg per acre on moist soil within 72 hours of planting. This suppresses broadleaf weeds and grasses during the critical first six weeks of establishment." },
                  { window: "Weeks 3–4", action: "Post-emergence weeding", detail: "If pre-emergence failed due to dry weather, hand weed thoroughly at weeks 3 to 4 before canopy closure. Post-emergence options include Callisto plus Atrazine mix for broadleaf control without damaging the maize plant." },
                  { window: "Weekly from week 3", action: "Fall armyworm scouting", detail: "Check 20 plants per acre weekly. At 10 percent infestation apply emamectin benzoate (Escort or equivalent) directed into the whorl early morning or evening. Resistance to older pyrethroids is now widespread in Nakuru — do not use lambda-cyhalothrin as a first-line treatment." },
                ].map((item) => (
                  <div key={item.window} className="bg-white border border-cream-300 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-xs font-bold text-gold-700 bg-gold-50 border border-gold-200 px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5">{item.window}</div>
                      <div>
                        <p className="font-semibold text-forest-800 text-sm mb-1">{item.action}</p>
                        <p className="text-xs text-soil-500 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-step: growing maize in Nakuru county</h2>
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
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Full cost and revenue budget per acre — Nakuru 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Maize production cost and revenue per acre Nakuru County Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Qty", "Unit cost (KES)", "Total (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Certified hybrid seed (2 kg pack)", "1", "1,200", "1,200"],
                      ["DAP fertilizer (50 kg bag)", "1", "3,800", "3,800"],
                      ["CAN fertilizer (50 kg bag)", "1", "3,200", "3,200"],
                      ["Pre-emergence herbicide", "2 kg", "600", "1,200"],
                      ["Insecticide (armyworm)", "500 ml", "800", "800"],
                      ["Labour — land preparation", "1 tractor day", "1,500", "1,500"],
                      ["Labour — planting and fertilizing", "3 days", "500", "1,500"],
                      ["Labour — weeding", "4 days", "500", "2,000"],
                      ["Labour — harvest and shelling", "4 days", "500", "2,000"],
                    ].map(([item, qty, unit, total], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 text-forest-800">{item}</td>
                        <td className="px-4 py-3 text-soil-500">{qty}</td>
                        <td className="px-4 py-3 text-soil-500">{unit}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{total}</td>
                      </tr>
                    ))}
                    <tr className="bg-forest-700 text-white">
                      <td colSpan={3} className="px-4 py-3 font-bold">TOTAL INPUT COST</td>
                      <td className="px-4 py-3 font-bold">KES 17,200</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-gold-800">Expected revenue (30 bags x KES 3,500)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 105,000</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-green-800">Net margin</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 87,800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Prices are indicative 2026 Nakuru market rates. Yield assumes certified hybrid seed and full fertilizer programme. Find <Link href="/dealers/nakuru" className="text-gold-700 hover:underline">Nakuru agrovets and current input prices here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ calculates your exact fertilizer bags, application timing, and KES cost per acre based on your farm's precise soil data. Built for Nakuru County. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Nakuru Maize Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/nakuru", label: "Nakuru county soil report" },
                  { href: "/crops/maize", label: "Maize guide — all 47 counties" },
                  { href: "/soil/nakuru/beans", label: "Beans in Nakuru — rotation crop" },
                  { href: "/soil/nakuru/wheat", label: "Wheat in Nakuru — compare yields" },
                  { href: "/dealers/nakuru", label: "Agrovets in Nakuru county" },
                  { href: "/zones/rift-valley", label: "Rift valley agroecological zone" },
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
                      {item.name}
                      <span className="text-gold-500 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Nakuru quick facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Rift Valley"], ["Altitude", "1,700 – 2,400 m"], ["Avg Rainfall", "800 – 1,200 mm/yr"], ["Dominant Soil", "Sandy clay loam"], ["Avg Soil pH", "6.0 – 6.8"], ["K Status", "Sufficient"], ["P Status", "Marginal to Good"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500">{k}</span>
                      <span className="font-medium text-forest-700 text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/nakuru" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:text-gold-700 transition-colors">Full Nakuru Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "narok", name: "Narok" }, { slug: "baringo", name: "Baringo" }, { slug: "nyandarua", name: "Nyandarua" }, { slug: "laikipia", name: "Laikipia" }].map(({ slug, name }) => (
                    <Link key={slug} href={`/soil/${slug}`} className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>{name} County</span>
                      <span className="text-gold-500 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More county farming guides" />
      </div>
    </>
  );
}
