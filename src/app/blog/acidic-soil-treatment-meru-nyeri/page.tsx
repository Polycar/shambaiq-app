import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("acidic-soil-treatment-meru-nyeri")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil Health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Acidic Soil Treatment Meru Nyeri", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What is the soil pH in Meru and Nyeri counties?", answer: "Meru County's volcanic highland soils commonly range from pH 4.5 to 5.5 across the upper slopes of Mount Kenya. Nyeri County is similar, with pH 4.8 to 5.6 across the Aberdare footzones and Kieni areas. Both counties contain pockets below pH 4.5 where aluminium toxicity severely limits crop production. ShambaIQ's precision mapping shows your exact farm pH at shambaiq.com/app?county=meru." },
  { question: "How much agricultural lime does Meru soil need?", answer: "At pH 4.5 to 5.0, Meru soils require 2 to 2.5 tonnes of agricultural lime per acre to reach the target pH of 6.0 to 6.5. At pH 5.0 to 5.5, 1 to 1.5 tonnes per acre is sufficient. Dolomitic lime is preferred over calcitic lime because Meru's leached volcanic soils are frequently magnesium-deficient — dolomitic lime corrects both pH and magnesium simultaneously. Apply at least 4 to 6 weeks before planting and incorporate to 15 cm depth." },
  { question: "What causes acidic soil in Meru and Nyeri?", answer: "Three factors combine to create Meru and Nyeri's strongly acidic soils. First, the volcanic parent material weathers to produce naturally acidic clay minerals. Second, heavy rainfall on Mount Kenya's slopes leaches calcium, magnesium, and potassium from the topsoil over time, leaving hydrogen and aluminium ions dominant. Third, continuous application of nitrogen fertilizers — particularly urea and CAN — releases acid as they nitrify, progressively lowering pH with each season of intensive cropping. Reversing this requires both lime application and switching to less acidifying nitrogen sources." },
  { question: "Can I use wood ash instead of lime in Meru?", answer: "Wood ash raises soil pH and supplies potassium and calcium, making it a useful supplementary treatment on moderately acidic Meru soils at pH 5.5 to 6.0. Apply at 1 to 2 tonnes per acre. However, wood ash has a much lower neutralising value than agricultural lime — roughly 40 percent compared to 100 percent — and its potassium content can cause potassium-calcium imbalances at high rates. On strongly acidic soils below pH 5.0, agricultural lime is necessary. Wood ash alone cannot achieve the pH correction required." },
  { question: "Which crops can grow on acidic soil in Meru without liming?", answer: "A small number of crops tolerate strongly acidic conditions. Tea grows well at pH 4.5 to 5.5 and is already the dominant crop in Meru's acidic highland zones. Potatoes tolerate pH 4.8 to 5.5 reasonably well. Sweet potatoes perform adequately at pH 5.0 to 5.5. Cassava tolerates pH down to 4.5. However, the staple crops — maize, beans, and vegetables — all require pH above 5.5 for adequate yield. Liming is necessary for any farmer who wants to diversify beyond tea and tubers." },
  { question: "How long does lime take to work in Meru soils?", answer: "Agricultural lime begins neutralising soil acidity within 2 to 4 weeks of incorporation in moist soil, but full pH stabilisation takes 3 to 6 months as the lime reacts progressively through the soil profile. Crops planted immediately after liming benefit less than those planted in the following season after full pH stabilisation. For best results, apply lime at least 4 to 6 weeks before planting, and plan liming as a seasonal investment before the following planting rather than an emergency treatment in the current season." },
]);

const howToSchema = makeHowToSchema({
  name: "How to Treat Acidic Soil in Meru and Nyeri Counties — Lime Application Guide",
  description: "A step-by-step guide to diagnosing, treating, and managing acidic volcanic soils in Meru and Nyeri counties for improved crop production.",
  totalTime: "P180D",
  estimatedCost: { currency: "KES", value: "8000–18000 per acre depending on acidity level" },
  supply: ["Dolomitic agricultural lime (1 to 2.5 tonnes per acre)", "Soil pH meter or ShambaIQ soil data", "Compost or farmyard manure (optional — improves lime efficiency)"],
  tool: ["Ox plough or hand hoe for incorporation", "Lime broadcaster or bucket for spreading", "ShambaIQ precision tool"],
  steps: [
    { name: "Get your exact soil pH before ordering lime", text: "Use ShambaIQ at shambaiq.com/app?county=meru or shambaiq.com/app?county=nyeri to get your farm's exact pH reading from precision soil mapping. Lime rate varies significantly — a farm at pH 4.5 needs 2.5 times more lime than one at pH 5.5. Over-liming beyond pH 6.5 causes manganese and iron deficiency. Know your starting pH before spending on inputs." },
    { name: "Calculate your lime requirement from the table", text: "At pH below 4.5: apply 2.5 tonnes of dolomitic lime per acre. At pH 4.5 to 5.0: apply 2 tonnes per acre. At pH 5.0 to 5.5: apply 1 to 1.5 tonnes per acre. At pH 5.5 to 6.0: apply 500 kg to 1 tonne per acre for maintenance. These rates target a final pH of 6.0 to 6.5 — optimal for maize, beans, and vegetables." },
    { name: "Apply lime at least 4 to 6 weeks before planting", text: "Broadcast lime evenly across the entire planting area. On sloping Meru and Nyeri farmland, apply on still days to prevent lime dust from concentrating in low spots. Incorporate immediately by ploughing or hoeing to 15 cm depth. Lime left on the surface without incorporation reacts very slowly and unevenly." },
    { name: "Do not apply lime and DAP at the same time", text: "Never apply lime and DAP simultaneously. Calcium from lime reacts with phosphate from DAP to form insoluble calcium phosphate — locking out the phosphorus entirely. Apply lime, wait at least 3 weeks, then apply DAP or other phosphorus fertilizer at planting. This sequencing is mandatory." },
    { name: "Monitor pH response after one season", text: "Check soil pH one season after lime application using ShambaIQ or a soil pH meter. On strongly acidic soils below pH 4.5, a single lime application may only achieve partial correction — a second application the following season may be needed to reach the pH 6.0 target. Liming is a multi-season investment, not a one-off fix." },
    { name: "Maintain pH with annual maintenance liming", text: "Once target pH is achieved, apply 300 to 500 kg of agricultural lime per acre annually to offset the acidifying effect of nitrogen fertilizers and rainfall leaching. Without maintenance liming, soils under continuous cropping reacidify at approximately 0.1 to 0.2 pH units per year." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "why-meru-nyeri-acidic", label: "Why Meru and Nyeri Soils Are So Acidic", level: 2 },
  { id: "aluminium-toxicity", label: "Aluminium Toxicity — The Hidden Yield Killer", level: 2 },
  { id: "soil-data", label: "Soil pH Data Across Meru and Nyeri", level: 2 },
  { id: "lime-types", label: "Dolomitic vs Calcitic Lime — Which to Use", level: 2 },
  { id: "lime-rates", label: "Lime Application Rates by pH Level", level: 2 },
  { id: "phosphorus-fixation", label: "Phosphorus Fixation at Low pH", level: 2 },
  { id: "howto", label: "Step-by-Step Lime Treatment Guide", level: 2 },
  { id: "cost", label: "Cost of Liming Per Acre", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

export default function AcidicSoilMeruNyeriPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil Health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Acidic Soil Treatment Meru Nyeri", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=soil-health" className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Soil Health</Link>
                <Link href="/soil/meru" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Meru County</Link>
                <Link href="/soil/nyeri" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Nyeri County</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Acidic Soil Treatment: <span className="text-gold-600">Restoring Crop Vitality in Meru and Nyeri</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                The volcanic highland soils of Meru and Nyeri counties are among the most naturally fertile in Kenya by total nutrient content. Yet large portions of both counties produce consistently poor yields of maize, beans, and vegetables — not because the nutrients are absent, but because soil pH below 5.0 locks them out entirely. Aluminium and manganese, soluble at low pH, accumulate to levels that poison root tips before they can absorb anything. Liming these soils is not a minor management tweak. It is the difference between farming and not farming productively.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Farmer applying dolomitic lime on acidic volcanic soil in Meru County. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="why-meru-nyeri-acidic" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Meru and Nyeri Soils Are So Acidic</h2>
              <p className="text-soil-600 leading-relaxed mb-4">The acidity of Mount Kenya's highland soils has both geological and agronomic causes — and understanding both is necessary for managing it correctly.</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Volcanic parent material weathers to acidic minerals", detail: "Mount Kenya's lava flows and volcanic ash deposits weather over thousands of years to produce kandic clays — iron and aluminium oxide minerals that are inherently acidic. These minerals dominate the subsoil across Meru's upper slopes and Nyeri's Aberdare footzones, creating a naturally acidic baseline that predates any farming." },
                  { title: "Heavy rainfall leaches alkaline cations from topsoil", detail: "Meru and Nyeri receive 900 to 1,400 mm of annual rainfall. This water percolates through the soil profile, carrying calcium, magnesium, and potassium downward into the subsoil and groundwater while leaving hydrogen ions behind. The longer a soil has been under high rainfall, the more leached and acidic it becomes. Meru's highland volcanic soils have been leaching for thousands of years." },
                  { title: "Nitrogen fertilizers acidify soils with each application", detail: "Every kilogram of urea or CAN applied adds to soil acidity through the nitrification process — ammonia converts to nitrate, releasing two hydrogen ions per nitrogen molecule. Under continuous intensive cropping with high nitrogen inputs, Meru and Nyeri soils can lose 0.1 to 0.3 pH units per season. Farmers who have been applying urea for 10 to 15 seasons without liming have progressively acidified their soils beyond what the original volcanic parent material would have produced naturally." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="aluminium-toxicity" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Aluminium Toxicity — The Hidden Yield Killer</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Below pH 5.0, aluminium becomes soluble in soil water and accumulates to concentrations that are directly toxic to plant roots. This aluminium toxicity is the primary mechanism through which strongly acidic Meru and Nyeri soils reduce yields — not nutrient deficiency itself, but physical destruction of the root system that would absorb nutrients.</p>
              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-800 mb-2">What Aluminium Does to Plant Roots</p>
                <p className="text-sm text-red-700 leading-relaxed">Soluble aluminium (Al3+) binds to the growing tips of roots within hours of exposure, blocking cell division and elongation. Root tips thicken, turn brown, and stop growing. The plant compensates by producing more lateral roots, creating a stubby, shallow root system that cannot access deep soil moisture or nutrients. Affected maize plants look yellow and stunted from the earliest growth stages, and no amount of fertilizer applied to the surface soil can be absorbed by roots that cannot grow downward. Liming raises pH above 5.5, where aluminium converts to insoluble aluminium hydroxide and ceases to be toxic.</p>
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Soil pH Data Across Meru and Nyeri</h2>
              <p className="text-soil-600 leading-relaxed mb-5">ShambaIQ's precision soil mapping shows significant pH variation within both counties, with the most severe acidity concentrated in the higher-altitude zones closest to Mount Kenya.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Soil pH ranges by sub-location in Meru and Nyeri counties Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Sub-location", "pH Range", "Aluminium Toxicity Risk", "Lime Requirement", "Priority"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Meru — Igembe North/South (upper slopes)", "4.2 – 4.8", "Severe", "2.0 – 2.5 t/acre", "Critical"],
                      ["Meru — Buuri (Mt Kenya foothills)", "4.5 – 5.2", "High", "1.5 – 2.0 t/acre", "High"],
                      ["Meru — Imenti (mid-altitude)", "5.0 – 5.6", "Moderate", "1.0 – 1.5 t/acre", "Medium"],
                      ["Nyeri — Kieni (upper Aberdare)", "4.5 – 5.0", "High", "1.5 – 2.0 t/acre", "High"],
                      ["Nyeri — Tetu/Othaya (mid-altitude)", "5.0 – 5.8", "Low – Moderate", "0.5 – 1.0 t/acre", "Low – Medium"],
                      ["Nyeri — Mukurweini (lower slopes)", "5.5 – 6.2", "Low", "Maintenance only", "Low"],
                    ].map(([loc, ph, al, lime, pri], i) => (
                      <tr key={loc as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{loc}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{ph}</td>
                        <td className="px-4 py-3 text-sm">{al}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{lime}</td>
                        <td className="px-4 py-3 font-medium text-xs">{pri}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">Source: ShambaIQ precision soil mapping averages. Individual farm values may differ significantly. <Link href="/app?county=meru" className="text-gold-600 hover:underline">Get your exact farm pH here.</Link></p>
            </section>

            <section>
              <h2 id="lime-types" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Dolomitic vs Calcitic Lime — Which to Use in Meru and Nyeri</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Both lime types neutralise soil acidity, but they have different nutrient profiles that matter specifically for Meru and Nyeri's leached volcanic soils.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { type: "Dolomitic lime", formula: "CaMg(CO3)2", calcium: "21% Ca", magnesium: "13% Mg", rec: "Strongly recommended for Meru and Nyeri", detail: "Supplies both calcium and magnesium. Meru and Nyeri's heavily leached volcanic soils are frequently magnesium-deficient — a deficiency that appears as interveinal yellowing on older maize leaves. Dolomitic lime corrects pH, calcium, and magnesium simultaneously. The preferred choice for most Meru and Nyeri farms." },
                  { type: "Calcitic lime", formula: "CaCO3", calcium: "38% Ca", magnesium: "< 1% Mg", rec: "Use only if soil magnesium is adequate", detail: "Higher calcium content per tonne and slightly faster pH response. However it provides no magnesium — if applied to magnesium-deficient soils it can worsen the Ca:Mg imbalance. Only appropriate if a soil test confirms adequate magnesium. At similar market prices, dolomitic lime provides more value for Meru and Nyeri conditions." },
                ].map((item) => (
                  <div key={item.type} className="bg-white border border-cream-300 rounded-xl p-5">
                    <h3 className="font-semibold text-forest-800 mb-1">{item.type}</h3>
                    <p className="font-mono text-xs text-soil-400 mb-1">{item.formula}</p>
                    <div className="flex gap-3 mb-3">
                      <span className="text-xs bg-forest-50 text-forest-700 border border-forest-200 px-2 py-0.5 rounded-full">{item.calcium}</span>
                      <span className="text-xs bg-gold-50 text-gold-700 border border-gold-200 px-2 py-0.5 rounded-full">{item.magnesium}</span>
                    </div>
                    <p className="text-xs font-semibold text-forest-700 mb-2">{item.rec}</p>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="lime-rates" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Lime Application Rates by Soil pH</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Dolomitic lime application rates for Meru and Nyeri soils by current pH</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Current pH", "Lime Rate (tonnes/acre)", "Cost at KES 700/50kg bag", "Apply Before Planting", "Target pH"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Below 4.5", "2.5 tonnes (50 bags)", "KES 35,000", "6+ weeks before", "5.8 – 6.2"],
                      ["4.5 – 5.0", "2.0 tonnes (40 bags)", "KES 28,000", "6 weeks before", "5.8 – 6.2"],
                      ["5.0 – 5.5", "1.5 tonnes (30 bags)", "KES 21,000", "4 weeks before", "6.0 – 6.5"],
                      ["5.5 – 6.0", "0.75 tonnes (15 bags)", "KES 10,500", "3 weeks before", "6.2 – 6.5"],
                      ["Annual maintenance", "0.25 – 0.5 tonnes", "KES 3,500 – 7,000", "After harvest", "Maintain above 6.0"],
                    ].map(([ph, rate, cost, timing, target], i) => (
                      <tr key={ph as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800">{ph}</td>
                        <td className="px-4 py-3 text-soil-600">{rate}</td>
                        <td className="px-4 py-3 font-semibold text-gold-700">{cost}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{timing}</td>
                        <td className="px-4 py-3 text-forest-600 font-medium text-xs">{target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="phosphorus-fixation" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Phosphorus Fixation at Low pH — Why Your DAP Is Disappearing</h2>
              <p className="text-soil-600 leading-relaxed mb-4">At pH below 5.5, iron and aluminium oxides — which dominate Meru and Nyeri's volcanic soils — react aggressively with phosphate ions to form insoluble compounds. A farmer applying one bag of DAP to an unlimed Meru soil at pH 4.8 may be wasting 60 to 80 percent of that phosphorus within days of application. The phosphorus is in the soil — it simply cannot be accessed by roots.</p>
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">The return on liming exceeds the return on fertilizer on acidic soils</p>
                <p className="text-sm text-amber-700 leading-relaxed">On a Meru farm at pH 4.8, raising pH to 6.2 through liming before planting can double the effectiveness of the DAP already in the soil from previous seasons, in addition to correcting aluminium toxicity and improving nitrogen utilisation. The lime investment pays for itself in the first season through improved fertilizer efficiency alone — before any yield improvement from better root development is counted. The two investments are not comparable — liming unlimes soil, fertilizer feeds it. Soil that cannot absorb fertilizer is soil where fertilizer investment is wasted.</p>
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-Step: Treating Acidic Soil in Meru and Nyeri</h2>
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
              <h2 id="cost" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost of Liming Per Acre in Meru and Nyeri 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Liming cost versus yield benefit per acre in Meru and Nyeri counties Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Scenario", "Lime Cost", "Expected Maize Yield (bags/acre)", "Revenue at KES 3,500/bag", "Net Gain from Liming"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Unlimed soil pH 4.8", "KES 0", "6 – 10 bags", "KES 21,000 – 35,000", "Baseline"],
                      ["Limed to pH 6.0 (1.5 t)", "KES 21,000", "20 – 28 bags", "KES 70,000 – 98,000", "KES 28,000 – 42,000 net"],
                      ["Limed to pH 6.0 (2.0 t)", "KES 28,000", "22 – 30 bags", "KES 77,000 – 105,000", "KES 21,000 – 42,000 net"],
                    ].map(([scenario, cost, yield_, rev, gain], i) => (
                      <tr key={scenario as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{scenario}</td>
                        <td className="px-4 py-3 text-soil-600">{cost}</td>
                        <td className="px-4 py-3 text-soil-500">{yield_}</td>
                        <td className="px-4 py-3 text-soil-500">{rev}</td>
                        <td className="px-4 py-3 font-bold text-green-700">{gain}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">Liming cost amortises over 3 to 4 seasons with annual maintenance top-ups. Find <Link href="/dealers/meru" className="text-gold-600 hover:underline">Meru County agrovets and current lime prices here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ calculates your exact lime requirement based on your farm's precision soil pH data and shows you the cost breakdown before you spend anything. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Acidic Soil Checker</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/meru", label: "Meru County Soil Report" },
                  { href: "/soil/nyeri", label: "Nyeri County Soil Report" },
                  { href: "/soil/meru/maize", label: "Maize in Meru — After Liming" },
                  { href: "/blog/why-your-soil-is-acidic-kenya", label: "Why Your Soil Is Acidic — Kenya Guide" },
                  { href: "/dealers/meru", label: "Agrovets in Meru County" },
                  { href: "/zones/central-highlands", label: "Central Highlands Zone" },
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Meru Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Central Highlands"], ["Altitude", "1,000 – 3,200 m"], ["Avg Rainfall", "900 – 1,400 mm/yr"], ["Soil Type", "Volcanic nitisol"], ["Avg Soil pH", "4.5 – 5.5"], ["Al Toxicity", "High above 1,800 m"], ["Priority", "Lime before anything"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-400">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/meru" className="mt-4 block text-center text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors">Full Meru Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Related Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "nyeri", name: "Nyeri" }, { slug: "kirinyaga", name: "Kirinyaga" }, { slug: "tharaka-nithi", name: "Tharaka Nithi" }, { slug: "embu", name: "Embu" }].map(({ slug, name }) => (
                    <Link key={slug} href={`/soil/${slug}`} className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>{name} County</span><span className="text-gold-500 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More Soil Health Guides" />
      </div>
    </>
  );
}
