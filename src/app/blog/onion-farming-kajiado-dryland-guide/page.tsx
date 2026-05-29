import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("onion-farming-kajiado-dryland-guide")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Onion Farming in Kajiado", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What fertilizer should I use for onions in Kajiado?", answer: "Kajiado's alkaline soils above pH 7.5 require ammonium sulfate rather than urea or CAN as the nitrogen source, because ammonium sulfate acidifies the soil slightly with every application, gradually correcting the alkalinity that blocks zinc and iron uptake. At planting apply NPK 17:17:17 at 50 kg per acre. Top-dress with ammonium sulfate at 50 kg per acre at three weeks and again at six weeks. Avoid DAP on highly alkaline soils — it raises pH further. Get a farm-specific plan at shambaiq.com/app?county=kajiado&crop=onion." },
  { question: "Why do my onions have yellow tips in Kajiado?", answer: "Yellow leaf tips in Kajiado onions are almost always zinc deficiency caused by the county's naturally alkaline soils. At pH above 7.5, zinc becomes chemically unavailable to roots regardless of how much total zinc the soil contains. Apply a zinc sulfate foliar spray at 2 g per litre at three and six weeks after planting. If yellowing is interveinal on younger leaves rather than tip burn, the cause is iron deficiency — apply iron chelate (EDTA-Fe) foliar at 1 g per litre." },
  { question: "How much water do onions need in Kajiado semi-arid conditions?", answer: "Onions in Kajiado require consistent moisture at 60 to 70 percent field capacity throughout the growing season. Under drip irrigation in semi-arid conditions, this translates to approximately 4 to 6 mm per day during bulb formation, applied daily or every two days depending on soil moisture monitoring. Irregular irrigation — wetting and drying cycles — is the primary cause of bolting and split bulbs in Kajiado onion farms. Drip irrigation with a timer is strongly recommended over manual flood irrigation." },
  { question: "What onion varieties are best for Kajiado County?", answer: "For Kajiado's semi-arid, high-temperature conditions, short-day onion varieties perform best. Jere F1 is the most popular among Kajiado commercial growers — it tolerates heat, produces large uniform bulbs of 150 to 250 g, and has good shelf life for the Nairobi market. Red Bombay is an open-pollinated alternative with lower seed cost. Avoid long-day varieties bred for temperate climates — they will not bulb properly in Kajiado's near-equatorial daylength conditions." },
  { question: "How do I correct alkaline soil for onions in Kajiado?", answer: "Correcting Kajiado's alkaline soils requires a multi-season approach. In the short term, apply ammonium sulfate as your nitrogen source — every 50 kg bag lowers soil pH slightly through sulfate acidification. In the medium term, incorporate elemental sulfur at 200 to 400 kg per acre before planting on soils above pH 8.0 — sulfur oxidises to sulfuric acid over 4 to 6 weeks and provides sustained pH reduction. Do not expect single-season correction — alkaline soil management is a 2 to 3 season programme." },
  { question: "Is onion farming profitable in Kajiado?", answer: "At 15 to 20 tonnes per acre with drip irrigation and precision fertilization, Kajiado onion farming generates KES 300,000 to 500,000 revenue per acre at market prices of KES 20 to 25 per kg. Input costs including drip infrastructure, fertilizer, and labour run approximately KES 80,000 to 100,000 per acre in Year 1, reducing to KES 50,000 in subsequent seasons as drip infrastructure amortises. Net margins of KES 200,000 to 400,000 per acre make onions one of Kajiado's highest-value crops when managed correctly." },
]);

const howToSchema = makeHowToSchema({
  name: "How to Grow Onions in Kajiado County — Alkaline Soil and Drip Irrigation Guide",
  description: "A step-by-step guide to growing high-yield onions on Kajiado's alkaline semi-arid soils, covering soil acidification, zinc correction, drip irrigation scheduling, and variety selection.",
  totalTime: "P120D",
  estimatedCost: { currency: "KES", value: "80000–100000 per acre" },
  supply: ["KEPHIS-certified Jere F1 onion seed or seedlings", "NPK 17:17:17 (50 kg at planting)", "Ammonium sulfate (100 kg — two top-dressings)", "Zinc sulfate foliar", "Elemental sulfur (if pH above 8.0)", "Drip irrigation tape"],
  tool: ["Drip irrigation system with timer", "Knapsack sprayer", "Soil pH meter", "ShambaIQ precision tool"],
  steps: [
    { name: "Check soil pH and zinc status before planting", text: "Use ShambaIQ at shambaiq.com/app?county=kajiado&crop=onion to get your farm's exact pH reading. Kajiado soils commonly show pH 7.5 to 8.5 — above 8.0 requires elemental sulfur incorporated 6 weeks before planting. Zinc deficiency is endemic at these pH levels and must be addressed proactively." },
    { name: "Incorporate elemental sulfur if pH is above 8.0", text: "Broadcast elemental sulfur at 300 to 400 kg per acre and incorporate to 15 cm depth at least 6 weeks before planting. Soil bacteria oxidise elemental sulfur to sulfuric acid over this period, lowering pH by 0.5 to 1.0 units. This is the most cost-effective soil acidification method available to Kajiado smallholders." },
    { name: "Install drip irrigation before planting", text: "Install drip tape at 30 cm spacing along the bed surface. Connect to a water source with a simple timer or manual schedule. Drip irrigation is non-negotiable for Kajiado onions — flood irrigation causes the wet-dry cycles that trigger bolting and split bulbs, and wastes scarce water in semi-arid conditions." },
    { name: "Transplant seedlings with NPK 17:17:17 at planting", text: "Transplant 35-day-old onion seedlings at 15 cm within rows and 30 cm between rows, giving approximately 88,000 plants per acre. Apply NPK 17:17:17 at 50 kg per acre in a band along the transplanting furrow. Water immediately after transplanting. Transplant in the late afternoon to reduce heat stress on newly set plants." },
    { name: "Apply ammonium sulfate top-dressing at 3 weeks", text: "Apply ammonium sulfate at 50 kg per acre in a ring 5 cm from the stem at three weeks after transplanting. Ammonium sulfate provides nitrogen while its sulfate component gradually acidifies the root zone — addressing the alkalinity problem with every feeding. Do not substitute urea or CAN which raise pH further." },
    { name: "Spray zinc sulfate foliar at 3 and 6 weeks", text: "Spray zinc sulfate at 2 g per litre across the entire canopy at three and six weeks after planting. Zinc deficiency in alkaline soils causes stunted growth and tip yellowing that cannot be corrected through soil application alone — foliar delivery bypasses the soil chemistry that blocks zinc uptake at high pH." },
    { name: "Apply second ammonium sulfate at 6 weeks and stop nitrogen", text: "Apply a second ammonium sulfate top-dressing at 50 kg per acre at six weeks. Stop all nitrogen applications after this point — late nitrogen delays bulb maturation, produces necky, poorly-cured bulbs that rot in storage, and dramatically reduces shelf life at Nairobi wholesale markets." },
    { name: "Harvest at 75 percent top fall and cure before selling", text: "Harvest when 75 percent of tops have fallen naturally. Pull bulbs and leave them on the soil surface for 7 to 10 days for field curing, then move to a shaded, well-ventilated store for 2 weeks before selling. Properly cured Kajiado onions store for 3 to 4 months — a significant market timing advantage over fresh vegetables." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "kajiado-onion-opportunity", label: "Why Kajiado Is an Onion Goldmine", level: 2 },
  { id: "alkaline-soil-problem", label: "Alkaline Soils — The Core Challenge", level: 2 },
  { id: "soil-data", label: "Kajiado Soil Data for Onions", level: 2 },
  { id: "zinc-iron-deficiency", label: "Zinc and Iron Deficiency — Diagnosis and Fix", level: 2 },
  { id: "varieties", label: "Best Onion Varieties for Kajiado", level: 2 },
  { id: "fertilizer", label: "Ammonium Sulfate Fertilizer Programme", level: 2 },
  { id: "irrigation", label: "Drip Irrigation in Semi-Arid Conditions", level: 2 },
  { id: "howto", label: "Step-by-Step Growing Guide", level: 2 },
  { id: "budget", label: "Cost and Revenue Budget Per Acre", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

export default function OnionKajiadoPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Onion Farming in Kajiado", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County Farming Guides</Link>
                <Link href="/soil/kajiado" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Kajiado County</Link>
                <Link href="/crops/onion" className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors">Onion</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                High-Yield Onion Farming in Kajiado: <span className="text-gold-600">A Drylands Goldmine</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Kajiado County's semi-arid conditions, alkaline soils, and water scarcity make it one of the more challenging farming environments in Kenya. Yet onions — when managed with precision — consistently outperform almost every other crop in this landscape. The dry conditions that stress other crops are exactly what onions need for bulb formation and post-harvest curing. The challenge is not the climate. It is the soil chemistry: Kajiado's naturally alkaline soils lock out zinc and iron, and standard fertilizer programmes designed for acidic highland soils make the alkalinity worse rather than better.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-400 pb-6 border-b border-cream-300">
                <AuthorCard compact />
                <span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span className="text-soil-300">·</span>
                <span>{POST.readingTimeMin} min read</span>
              </div>
            </header>

            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img src={POST.image} alt={POST.imageAlt} width={1200} height={630} className="w-full h-72 object-cover" itemProp="image" loading="eager" />
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Onion crop under drip irrigation in semi-arid Kajiado County. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="kajiado-onion-opportunity" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Kajiado Is an Onion Goldmine</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kenya imports significant volumes of onions from Tanzania, Ethiopia, and Egypt to meet demand — yet Kajiado, sitting on Nairobi's doorstep with ideal onion-growing climate, remains underutilised for onion production. Three structural advantages make the case compelling.</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Dry conditions favour bulb formation and curing", detail: "Onions require dry conditions during the final third of their growing season for proper bulb maturation. Kajiado's low humidity and high temperatures during the dry season accelerate the natural curing process that concentrates sugars and firms the outer skins — producing bulbs with 3 to 4 month shelf life compared to 4 to 6 weeks for onions grown in humid highland counties." },
                  { title: "Year-round production with irrigation", detail: "Unlike rain-dependent highland counties limited to two planting windows, Kajiado's irrigation-based farming allows planting in any month. Farmers who stagger plantings can achieve three onion crops per year and time harvests to the highest-price windows — particularly December to February when national onion supply tightens." },
                  { title: "Proximity to Nairobi's wholesale markets", detail: "Kajiado County borders Nairobi and Machakos, with tarmac road access to Wakulima Market within two hours. This proximity eliminates the post-harvest losses from long transport that reduce margins for onion farmers in more distant counties. It also allows Kajiado farmers to sell directly to Nairobi hotels, supermarkets, and restaurants that pay premium prices for consistent supply." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="alkaline-soil-problem" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Alkaline Soils — The Core Challenge</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Most Kenyan farming advice is written for highland acidic soils — the soils of Kiambu, Nyeri, Kakamega, and the Central Highlands where the majority of smallholder farmers operate. This advice is actively harmful when applied to Kajiado's alkaline soils, because the fertilizers and lime recommendations designed for acidic soils push Kajiado's pH even higher.</p>
              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-800 mb-2">The Standard Advice That Damages Kajiado Soils</p>
                <p className="text-sm text-red-700 leading-relaxed">DAP is the default basal fertilizer across Kenya. In acidic highland soils it is appropriate. In Kajiado's soils at pH 7.5 to 8.5, DAP raises pH further because its diammonium component hydrolyses to release hydroxide ions. Every bag of DAP applied to alkaline Kajiado soil makes the zinc and iron lockout worse. The correct substitution is NPK 17:17:17 at planting and ammonium sulfate for all top-dressings — both of which have mild acidifying effects that work with Kajiado's soil chemistry rather than against it.</p>
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Kajiado Soil Data for Onions</h2>
              <p className="text-soil-600 leading-relaxed mb-5">ShambaIQ's precision soil mapping reveals a consistent profile across Kajiado's onion-growing sub-counties of Kajiado Central, Isinya, and Ngong:</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Kajiado County soil nutrient values versus onion requirements</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Nutrient", "Kajiado Average", "Onion Optimum", "Status", "Action"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "7.5 – 8.5", "6.0 – 7.0", "Alkaline — Critical", "Elemental sulfur + ammonium sulfate"],
                      ["Total Nitrogen (g/kg)", "0.8 – 1.4", "> 1.2 g/kg", "Low", "Ammonium sulfate top-dressings"],
                      ["Phosphorus (mg/kg)", "8 – 20", "> 15 mg/kg", "Marginal", "NPK 17:17:17 at planting"],
                      ["Potassium (mg/kg)", "180 – 380", "> 150 mg/kg", "Adequate", "No K supplement needed"],
                      ["Zinc (mg/kg)", "0.3 – 0.8", "> 1.0 mg/kg", "Deficient", "Zinc sulfate foliar essential"],
                      ["Organic Carbon (g/kg)", "5 – 12", "> 10 g/kg", "Low", "Incorporate crop residues and compost"],
                    ].map(([n, v, o, s, a], i) => (
                      <tr key={n as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{n}</td>
                        <td className="px-4 py-3 text-soil-600">{v}</td>
                        <td className="px-4 py-3 text-soil-500">{o}</td>
                        <td className="px-4 py-3 font-medium text-sm">{s}</td>
                        <td className="px-4 py-3 text-xs text-soil-400">{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">Source: ShambaIQ precision soil mapping, 0 to 20 cm depth, Kajiado County average. <Link href="/app?county=kajiado&crop=onion" className="text-gold-600 hover:underline">Get your farm-specific pH and zinc reading here.</Link></p>
            </section>

            <section>
              <h2 id="zinc-iron-deficiency" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Zinc and Iron Deficiency — Diagnosis and Fix</h2>
              <p className="text-soil-600 leading-relaxed mb-5">At pH above 7.5, zinc and iron form insoluble hydroxide compounds that plant roots cannot absorb regardless of total soil content. The symptoms are distinctive and allow field diagnosis without a soil test.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { deficiency: "Zinc deficiency", symptoms: "Stunted plants with shortened internodes, yellowing of leaf tips spreading inward, striped or mottled pattern on younger leaves. Plants look uniformly small and pale.", fix: "Zinc sulfate foliar at 2 g per litre, applied at 3 and 6 weeks after transplanting. Soil application of zinc sulfate at 10 kg per acre also provides season-long correction.", urgency: "High — zinc is essential for enzyme function and cell division. Deficiency in the first 4 weeks permanently limits bulb size." },
                  { deficiency: "Iron deficiency", symptoms: "Interveinal chlorosis — leaves turn yellow between the veins while veins remain green. Affects youngest leaves first. Distinct from zinc deficiency which affects tips rather than interveinal tissue.", fix: "Iron chelate (EDTA-Fe) foliar at 1 g per litre. Soil-applied iron is not effective on alkaline soils — the pH immediately converts it to insoluble form. Foliar delivery is the only practical correction.", urgency: "Moderate — less common than zinc deficiency but occurs on highly alkaline soils above pH 8.0. Check with ShambaIQ for your exact iron status." },
                ].map((item) => (
                  <div key={item.deficiency} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-2 text-sm">{item.deficiency}</h3>
                    <div className="space-y-2 text-xs">
                      <div><span className="font-medium text-soil-500">Symptoms: </span><span className="text-soil-500">{item.symptoms}</span></div>
                      <div><span className="font-medium text-forest-700">Fix: </span><span className="text-soil-500">{item.fix}</span></div>
                      <div className="bg-amber-50 rounded-lg p-2 text-amber-700">{item.urgency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="varieties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Best Onion Varieties for Kajiado County</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Only short-day varieties bulb reliably at Kajiado's near-equatorial latitude of 1.5 to 2.5 degrees south. Long-day varieties bred for temperate climates will produce abundant leaf growth but fail to form bulbs at all.</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                {[
                  { variety: "Jere F1", type: "Short-day hybrid", bulbWeight: "150 – 250 g", yield: "15 – 22 t/acre", notes: "Most popular in Kajiado. Heat tolerant, large uniform bulbs, excellent shelf life. Preferred by Nairobi wholesale buyers." },
                  { variety: "Red Bombay", type: "Short-day OPV", bulbWeight: "80 – 150 g", yield: "10 – 16 t/acre", notes: "Lower seed cost. Good flavour preferred for retail market. Smaller bulb size means lower per-tonne price at wholesale." },
                  { variety: "Jambar F1", type: "Short-day hybrid", bulbWeight: "120 – 200 g", yield: "13 – 19 t/acre", notes: "Good fusarium basal rot resistance. Useful on farms with previous disease history. Slightly less heat tolerant than Jere." },
                ].map((v) => (
                  <div key={v.variety} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-1">{v.variety}</h3>
                    <p className="text-xs text-gold-600 font-medium mb-3">{v.type}</p>
                    <div className="space-y-1.5 text-sm mb-3">
                      {[["Bulb weight", v.bulbWeight], ["Yield", v.yield]].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between gap-2">
                          <span className="text-soil-400">{label}</span>
                          <span className="font-medium text-forest-700 text-right text-xs">{val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-soil-400 border-t border-cream-200 pt-2">{v.notes}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="fertilizer" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Ammonium Sulfate Fertilizer Programme for Kajiado Onions</h2>
              <p className="text-soil-600 leading-relaxed mb-5">The fertilizer programme for Kajiado onions is built around the principle of acidifying nutrition — every input chosen not just for its NPK content but for its effect on soil pH. This distinguishes Kajiado management from standard Kenyan onion programmes.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Fertilizer programme for onions in Kajiado County Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Stage", "Product", "Rate/Acre", "Timing", "pH Effect"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Pre-plant (if pH > 8.0)", "Elemental sulfur", "300 kg", "6 weeks before planting", "Lowers pH 0.5 – 1.0 units"],
                      ["At transplanting", "NPK 17:17:17", "50 kg", "In transplant furrow", "Neutral to slight acidification"],
                      ["Top-dress 1", "Ammonium sulfate", "50 kg", "3 weeks after transplant", "Mild acidification per application"],
                      ["Top-dress 2", "Ammonium sulfate", "50 kg", "6 weeks after transplant", "Cumulative acidification"],
                      ["Foliar 1", "Zinc sulfate (2 g/L)", "Per spray", "3 weeks after transplant", "Bypasses pH lockout"],
                      ["Foliar 2", "Zinc sulfate (2 g/L)", "Per spray", "6 weeks after transplant", "Maintains zinc supply"],
                    ].map(([stage, prod, rate, timing, ph], i) => (
                      <tr key={stage as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{stage}</td>
                        <td className="px-4 py-3 font-mono text-xs text-soil-500">{prod}</td>
                        <td className="px-4 py-3 text-soil-600">{rate}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{timing}</td>
                        <td className="px-4 py-3 text-xs text-gold-700 font-medium">{ph}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="irrigation" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Drip Irrigation in Kajiado's Semi-Arid Conditions</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Drip irrigation is not optional for commercial onion production in Kajiado — it is the technology that makes the system viable. The semi-arid climate provides the dry curing conditions that produce premium onions, but those same conditions require precise water management to maintain bulb development without moisture stress.</p>
              <div className="space-y-3 mb-6">
                {[
                  { phase: "Establishment (weeks 1–3)", water: "5–6 mm/day", frequency: "Daily", detail: "Newly transplanted seedlings have minimal root systems and cannot tolerate any soil moisture deficit. Maintain consistently moist but not waterlogged conditions. Avoid surface drying between irrigations during this phase." },
                  { phase: "Vegetative growth (weeks 3–7)", water: "4–5 mm/day", frequency: "Every 1–2 days", detail: "Leaf development and root expansion phase. Consistent moisture supports rapid leaf growth that determines the photosynthetic capacity available for bulb fill. Moisture stress at this stage permanently reduces final bulb size." },
                  { phase: "Bulb formation (weeks 7–14)", water: "4–6 mm/day", frequency: "Daily", detail: "Peak water demand. Bulb cells are dividing and expanding rapidly. This is the highest-return irrigation period — water stress during bulb formation reduces yield by 20 to 40 percent. Maintain strict moisture targets." },
                  { phase: "Maturation (weeks 14–16)", water: "Reduce by 50%", frequency: "Every 3–4 days", detail: "Begin reducing irrigation as tops start yellowing. Dry-down concentrates sugars, firms outer skins, and initiates the curing process. Do not irrigate in the final week before harvest — wet soils produce poorly-cured bulbs that rot in storage." },
                ].map((item) => (
                  <div key={item.phase} className="bg-white border border-cream-300 rounded-xl p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-forest-800 text-sm">{item.phase}</h3>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{item.water}</span>
                        <span className="text-xs bg-cream-100 border border-cream-300 text-soil-500 px-2.5 py-0.5 rounded-full">{item.frequency}</span>
                      </div>
                    </div>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-Step: Growing Onions in Kajiado County</h2>
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
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost and Revenue Budget Per Acre — Kajiado Onion 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Onion production cost and revenue per acre Kajiado County Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Qty", "Unit Cost (KES)", "Total (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Certified Jere F1 seed", "500 g", "8,000", "8,000"],
                      ["Elemental sulfur (if pH > 8.0)", "300 kg", "2,500", "7,500"],
                      ["NPK 17:17:17 (50 kg bag)", "1 bag", "4,200", "4,200"],
                      ["Ammonium sulfate (50 kg bag x2)", "2 bags", "2,800", "5,600"],
                      ["Zinc sulfate foliar (2 applications)", "2", "600", "1,200"],
                      ["Fungicide (purple blotch prevention)", "3 applications", "900", "2,700"],
                      ["Insecticide (thrips control)", "3 applications", "800", "2,400"],
                      ["Drip irrigation tape (amortised Year 1)", "per acre", "12,000", "12,000"],
                      ["Water cost (borehole/pan)", "per season", "8,000", "8,000"],
                      ["Labour — nursery and transplanting", "5 days", "500", "2,500"],
                      ["Labour — weeding and spraying", "6 days", "500", "3,000"],
                      ["Labour — harvest and curing", "4 days", "500", "2,000"],
                    ].map(([item, qty, unit, total], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 text-forest-800">{item}</td>
                        <td className="px-4 py-3 text-soil-500">{qty}</td>
                        <td className="px-4 py-3 text-soil-500">{unit}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{total}</td>
                      </tr>
                    ))}
                    <tr className="bg-forest-700 text-white">
                      <td colSpan={3} className="px-4 py-3 font-bold">TOTAL INPUT COST (Year 1)</td>
                      <td className="px-4 py-3 font-bold">KES 59,100</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-gold-800">Expected Revenue (18 t x KES 22/kg)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 396,000</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-green-800">Net Margin Year 1</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 336,900</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">Drip tape amortises over 3 seasons — Year 2 cost drops by KES 12,000. Elemental sulfur only required on soils above pH 8.0. Find <Link href="/dealers/kajiado" className="text-gold-600 hover:underline">Kajiado agrovets and current input prices here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ checks your Kajiado farm's exact soil pH and zinc status and calculates whether you need elemental sulfur, the right fertilizer programme, and your irrigation schedule for the season. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Kajiado Onion Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/kajiado", label: "Kajiado County Soil Report" },
                  { href: "/crops/onion", label: "Onion Crop Guide — All Counties" },
                  { href: "/soil/kajiado/tomato", label: "Tomato in Kajiado — Dryland Guide" },
                  { href: "/soil/machakos/onion", label: "Onion in Machakos — Compare" },
                  { href: "/dealers/kajiado", label: "Agrovets in Kajiado County" },
                  { href: "/zones/semi-arid", label: "Semi-Arid Agroecological Zone" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 text-soil-500 hover:text-forest-700 transition-colors py-1">
                    <span className="text-gold-500 flex-shrink-0">→</span>{label}
                  </Link>
                ))}
              </div>
            </aside>

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Frequently Asked Questions</h2>
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Kajiado Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Semi-Arid"], ["Altitude", "1,500 – 1,900 m"], ["Avg Rainfall", "400 – 700 mm/yr"], ["Dominant Soil", "Alkaline sandy loam"], ["Avg Soil pH", "7.5 – 8.5"], ["Zinc Status", "Deficient"], ["Irrigation", "Required"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-400">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/kajiado" className="mt-4 block text-center text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors">Full Kajiado Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "nairobi", name: "Nairobi" }, { slug: "machakos", name: "Machakos" }, { slug: "kiambu", name: "Kiambu" }, { slug: "narok", name: "Narok" }].map(({ slug, name }) => (
                    <Link key={slug} href={`/soil/${slug}`} className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>{name} County</span><span className="text-gold-500 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More County Farming Guides" />
      </div>
    </>
  );
}
