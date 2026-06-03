import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("dairy-fodder-farming-nandi-county")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Dairy farming in Nandi", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What is the best fodder crop for dairy farming in Nandi County?", answer: "Napier grass (Pennisetum purpureum) is the most productive fodder crop for Nandi County's red clay loam soils and 1,400 to 1,800 mm annual rainfall. It yields 40 to 80 tonnes of fresh matter per acre per year under good management, provides year-round cutting every 6 to 8 weeks, and responds strongly to nitrogen top-dressing with CAN. Silage maize is the second-best option — it produces higher dry matter per acre than Napier in a single harvest and is easier to preserve for the dry season. Get a Nandi-specific fodder plan at shambaiq.com/app?county=nandi&crop=maize." },
  { question: "How much fertilizer does Napier grass need in Nandi?", answer: "Napier grass in Nandi responds strongly to nitrogen but requires phosphorus at establishment. At planting, apply DAP at 50 kg per acre in the planting furrow. After each harvest (every 6 to 8 weeks), apply CAN at 30 to 50 kg per acre — Napier's rapid regrowth has a high nitrogen demand that sustains yield across multiple cuts per year. Nandi's red clay loam soils have adequate potassium and do not require potassium supplementation for Napier under standard management." },
  { question: "How do I make silage from maize in Nandi County?", answer: "Harvest silage maize at the dough stage — when the grain has formed and the whole-plant moisture is 60 to 65 percent, typically 90 to 110 days after planting. Chop immediately to 2 to 3 cm length using a stationary or tractor-mounted chopper. Pack tightly into a silage pit or bunker, compacting in 15 cm layers to exclude air. Cover with a heavy-duty polythene sheet weighted with soil or tyres. Silage is ready after 3 to 4 weeks of anaerobic fermentation. Good silage smells pleasantly acidic — spoiled silage smells putrid and should not be fed to dairy animals." },
  { question: "What is the NPK value of cow dung manure in Nandi?", answer: "Fresh cow dung manure averages approximately 0.5 percent nitrogen, 0.25 percent phosphorus, and 0.5 percent potassium — expressed as N-P-K 0.5:0.25:0.5 on a fresh weight basis. Dried cattle manure concentrates to approximately 1.5:1.0:1.5. A dairy cow producing 15 to 20 kg of manure per day generates approximately 5 to 7 tonnes of manure per year. At the NPK content above, one dairy cow's annual manure production supplies approximately 75 kg of nitrogen, 35 kg of phosphorus, and 75 kg of potassium — equivalent to approximately 1.5 bags of CAN, 0.75 bags of DAP, and 1 bag of muriate of potash." },
  { question: "How many litres of milk can a dairy cow produce in Nandi?", answer: "Well-managed Friesian or Friesian-cross cows in Nandi County under zero-grazing systems with good fodder quality produce 15 to 25 litres per day per cow. Farmers achieving this production consistently use quality Napier grass or silage supplemented with dairy concentrates at 1 kg per 2.5 litres of milk produced above 5 litres per day. Poorly managed zero-grazing systems with unfertigised Napier and no concentrate supplementation typically produce 8 to 12 litres per day — below the profitability threshold for most smallholder operations." },
]);

const howToSchema = makeHowToSchema({
  name: "How to establish Napier grass and make silage maize in Nandi county",
  description: "A step-by-step guide to establishing high-yield Napier grass and silage maize for dairy farming on Nandi County's red clay loam soils.",
  totalTime: "P365D",
  estimatedCost: { currency: "KES", value: "18000–28000 per acre for Napier establishment" },
  supply: ["Napier grass splits or tissue-culture plantlets", "DAP fertilizer (50 kg/acre at planting)", "CAN fertilizer (50 kg/acre per cut — 4 to 6 cuts per year)", "Silage polythene sheet (if making silage)"],
  tool: ["Panga or slasher for Napier harvesting", "Fodder chopper (hired or cooperative)", "Silage pit or bunker", "ShambaIQ precision tool"],
  steps: [
    { name: "Test Nandi soil phosphorus before Napier establishment", text: "Use ShambaIQ at shambaiq.com/app?county=nandi&crop=napier-grass to confirm your soil's phosphorus status. Nandi's red clay loam soils commonly show phosphorus of 10 to 22 mg/kg — marginal to adequate. DAP at establishment is essential regardless of existing phosphorus levels because Napier requires high phosphorus at root establishment to develop the extensive root system that supports 10 to 15 years of productive life." },
    { name: "Prepare land and plant Napier splits or plantlets", text: "Plough to 25 cm depth and form furrows 90 cm apart. Plant Napier splits (stem cuttings with 2 to 3 nodes) or tissue-culture plantlets at 50 cm within the furrow. Apply DAP at 50 kg per acre in the furrow before planting, covered with soil before placing the splits. Tissue-culture plantlets from certified nurseries have higher yield potential and are free from stunt disease — worth the higher initial cost for a long-term fodder stand." },
    { name: "Apply CAN after every harvest", text: "Apply CAN at 30 to 50 kg per acre immediately after each harvest, when stumps are 5 to 10 cm high. Napier's rapid regrowth has a very high nitrogen demand — yield per cut drops progressively without post-harvest nitrogen replacement. On Nandi soils, 4 to 6 cuts per year at 50 kg CAN per cut equates to 200 to 300 kg CAN per acre per year — a significant input cost that must be factored into dairy enterprise profitability." },
    { name: "Harvest Napier at correct height for quality", text: "Harvest Napier at 1.0 to 1.2 metres height, approximately every 6 to 8 weeks. Harvesting too young reduces total dry matter yield. Harvesting too old — above 1.5 metres — significantly reduces crude protein content from 12 to 15 percent to below 8 percent as stems lignify. Cattle will eat over-mature Napier but its nutritional contribution to milk production drops sharply." },
    { name: "Plant silage maize for dry season reserves", text: "Plant silage maize at the start of the long rains at 75 x 25 cm spacing with DAP at 1 bag per acre and CAN top-dressing at knee height. Harvest at the dough stage (90 to 110 days) when whole-plant moisture is 60 to 65 percent. Chop to 2 to 3 cm and ensile immediately. Silage maize on Nandi soils consistently produces 15 to 20 tonnes of dry matter per acre — the highest dry matter yield of any single-harvest fodder crop." },
    { name: "Manage boma manure for soil fertility return", text: "Collect manure from the zero-grazing unit daily. Compost in a covered pit for 6 to 8 weeks before application to Napier or cropland. Well-composted boma manure applied at 5 to 10 tonnes per acre per year progressively builds soil organic matter, reduces purchased fertilizer requirements, and returns the nutrients removed by high-yield Napier and silage maize back to the soil." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "nandi-dairy-opportunity", label: "Why Nandi is a natural dairy county", level: 2 },
  { id: "soil-data", label: "Nandi soil data for fodder crops", level: 2 },
  { id: "napier-guide", label: "Napier grass — establishment and management", level: 2 },
  { id: "silage", label: "Silage maize — making and feeding", level: 2 },
  { id: "manure-value", label: "Boma manure — the hidden fertilizer asset", level: 2 },
  { id: "howto", label: "Step-by-step fodder guide", level: 2 },
  { id: "budget", label: "Dairy enterprise budget per cow", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function DairyFodderNandiPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Dairy farming in Nandi", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County farming guides</Link>
                <Link href="/soil/nandi" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Nandi County</Link>
                <Link href="/crops/napier-grass" className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors">Dairy / Fodder</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Dairy farming in Nandi county:
                <span className="text-gold-700">Integrating fodder crops and organic manures</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Nandi County's red clay loam soils and 1,400 to 1,800 mm annual rainfall create ideal conditions for year-round fodder production — the foundation of productive dairy farming. Yet most Nandi dairy farmers operate below 50 percent of their herd's genetic potential because they treat fodder as an afterthought to crop farming rather than as a precision agricultural system in its own right. Napier grass under-fertilized produces poor-quality forage. Silage made at the wrong moisture destroys its nutritional value before the dry season arrives. Boma manure composted correctly eliminates 40 percent of annual fertilizer costs. This guide covers all three.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Napier grass fodder crop on red clay loam soil in Nandi Hills. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="nandi-dairy-opportunity" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Nandi is a natural dairy county</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Three structural conditions make Nandi County one of Kenya's highest-potential dairy zones outside the established Rift Valley dairy belt.</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Red clay loam soils support year-round fodder production", detail: "Nandi's red clay loam soils — derived from Tertiary volcanic rocks — hold moisture well enough to support Napier grass production through dry spells without irrigation. The same soils that make Nandi excellent for tea production also produce high-yield fodder crops. Unlike the sandy soils of Coast or the shallow rocky soils of parts of Baringo, Nandi soils give Napier roots the depth and moisture they need for rapid regrowth after every cut." },
                  { title: "High rainfall eliminates dry-season irrigation costs", detail: "Nandi receives 1,400 to 1,800 mm per year with a relatively even distribution — two wet seasons with no severely dry months. This eliminates the irrigation infrastructure cost that makes dairy farming in drier counties expensive. Year-round green fodder from Napier reduces dependence on purchased dairy meal, cutting the single largest variable cost in dairy production." },
                  { title: "Proximity to Eldoret milk processors and New KCC", detail: "Nandi County sits adjacent to Uasin Gishu and within 60 kilometres of Eldoret — Kenya's second-largest milk processing hub. New KCC, Brookside, and smaller processors all operate collection routes through Nandi, providing reliable offtake and reducing the post-harvest loss from milk that cannot reach a market quickly enough." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Nandi soil data for fodder crops</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Nandi County soil nutrient values versus Napier grass and silage maize requirements</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Nutrient", "Nandi average", "Napier/silage optimum", "Status", "Action"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "5.2 – 6.0", "5.5 – 7.0", "Low – Adequate", "Lime if below 5.5"],
                      ["Total Nitrogen (g/kg)", "1.4 – 2.2", "> 1.5 g/kg", "Adequate – Good", "CAN after every Napier cut"],
                      ["Phosphorus (mg/kg)", "10 – 22", "> 15 mg/kg", "Marginal – Adequate", "DAP at Napier establishment"],
                      ["Potassium (mg/kg)", "160 – 320", "> 120 mg/kg", "Adequate", "Replaced by boma manure application"],
                      ["Organic Carbon (g/kg)", "16 – 28", "> 15 g/kg", "Good", "Maintain with manure application"],
                    ].map(([n, v, o, s, a], i) => (
                      <tr key={n as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{n}</td>
                        <td className="px-4 py-3 text-soil-600">{v}</td>
                        <td className="px-4 py-3 text-soil-500">{o}</td>
                        <td className="px-4 py-3 font-medium">{s}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Source: ShambaIQ precision soil mapping, Nandi County average. <Link href="/app?county=nandi&crop=maize" className="text-gold-700 hover:underline">Get your farm-specific Nandi reading here.</Link></p>
            </section>

            <section>
              <h2 id="napier-guide" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Napier grass — establishment and management in Nandi</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Napier grass is a perennial crop that, once established, produces fodder for 10 to 15 years with annual replanting only when stand density drops. Getting establishment right is a decade-long investment.</p>
              <div className="space-y-3 mb-6">
                {[
                  { phase: "Establishment (Month 1)", detail: "Plant splits or tissue-culture plantlets at 90 cm between rows and 50 cm within rows. Apply DAP at 50 kg per acre in the furrow. First harvest at 3 to 4 months after planting when plants reach 1.0 metre height. Establishment is the only time DAP is needed — all subsequent nutrition comes from CAN after each cut." },
                  { phase: "Production phase (Year 1 onwards)", detail: "Harvest every 6 to 8 weeks at 1.0 to 1.2 metre height. Apply CAN at 30 to 50 kg per acre immediately after each cut. 4 to 6 cuts per year is achievable in Nandi's rainfall conditions. Yield per cut ranges from 3 to 6 tonnes of fresh material per acre, giving 15 to 30 tonnes per acre per year." },
                  { phase: "Quality management", detail: "Cut at 1.0 to 1.2 metres — not taller. Over-mature Napier (above 1.5 m) has crude protein below 8 percent, compared to 12 to 15 percent in correctly-timed cuts. Feed immediately after cutting where possible — wilted Napier loses palatability within 24 hours in Nandi's humidity." },
                  { phase: "Pest management — Napier stunt disease", detail: "Napier stunt disease (phytoplasma) causes stunted, bushy growth with numerous small leaves and no productive fodder yield. It is spread by leafhopper insects and has no cure — infected stools must be removed and burned. The primary prevention is planting tissue-culture plantlets certified disease-free rather than splits from unknown-origin stands." },
                ].map((item) => (
                  <div key={item.phase} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 text-sm mb-2">{item.phase}</h3>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="silage" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Silage maize — dry season feed security in Nandi</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Napier grass provides green fodder year-round, but dry season quality declines as growth slows. Silage maize, made during the long rains and stored, provides high-energy, consistent-quality feed that maintains milk production through the driest months.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Silage maize production stages and targets for Nandi County Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Stage", "Timing", "Target", "Why it matters"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Harvest stage", "90 – 110 days", "Dough stage — grain visible, plant 60–65% moisture", "Higher moisture ferments poorly; lower moisture is difficult to compact"],
                      ["Chop length", "At harvest", "2 – 3 cm pieces", "Long chop leaves air pockets that cause spoilage"],
                      ["Compaction", "During filling", "Every 15 cm layer firmly compacted", "Air exclusion is critical — oxygen causes aerobic spoilage"],
                      ["Cover", "Immediately after filling", "Heavy polythene sealed with soil or tyres", "Delays of over 30 minutes after covering allow surface spoilage"],
                      ["Fermentation", "3 – 4 weeks sealed", "pH should reach 3.8 – 4.2", "Lactic acid fermentation preserves nutrients for 6 to 12 months"],
                      ["Feeding rate", "Daily during dry season", "5 – 8 kg per cow per day (as supplement)", "Silage is a supplement — always feed alongside Napier or other roughage"],
                    ].map(([stage, timing, target, why], i) => (
                      <tr key={stage as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800 text-xs">{stage}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{timing}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{target}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="manure-value" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Boma manure — quantifying the fertilizer asset</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Most Nandi dairy farmers treat boma manure as a waste disposal problem rather than an asset. Correctly composted and applied, boma manure from two dairy cows can supply 40 to 50 percent of the nitrogen, phosphorus, and potassium needed for 1 acre of Napier grass — significantly reducing the CAN and DAP bill.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Boma manure nutrient value compared to chemical fertilizers</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Manure source", "N (%)", "P2o5 (%)", "K2o (%)", "Equivalent fertilizer per tonne"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Fresh cattle dung", "0.5", "0.25", "0.5", "5 kg CAN + 2.5 kg DAP + 5 kg MOP"],
                      ["Composted cattle manure", "1.5", "1.0", "1.5", "15 kg CAN + 10 kg DAP + 15 kg MOP"],
                      ["Fresh chicken manure", "1.6", "1.5", "0.9", "16 kg CAN + 15 kg DAP + 9 kg MOP"],
                      ["Composted chicken manure", "3.0", "2.5", "1.8", "30 kg CAN + 25 kg DAP + 18 kg MOP"],
                    ].map(([source, n, p, k, equiv], i) => (
                      <tr key={source as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{source}</td>
                        <td className="px-4 py-3 text-soil-600">{n}</td>
                        <td className="px-4 py-3 text-soil-600">{p}</td>
                        <td className="px-4 py-3 text-soil-600">{k}</td>
                        <td className="px-4 py-3 text-xs text-forest-700">{equiv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-step: Napier establishment and silage making in Nandi</h2>
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
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Dairy enterprise budget per cow — Nandi county 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Dairy cow enterprise budget Nandi County Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Monthly cost (KES)", "Annual cost (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Dairy meal/concentrates (2 kg/day)", "3,600", "43,200"],
                      ["Napier grass fertilizer (CAN for 0.25 acre)", "1,500", "18,000"],
                      ["Veterinary costs (AI, vaccines, deworming)", "1,200", "14,400"],
                      ["Labour — zero-grazing unit", "1,000", "12,000"],
                      ["Silage maize input (amortised)", "800", "9,600"],
                    ].map(([item, monthly, annual], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 text-forest-800">{item}</td>
                        <td className="px-4 py-3 text-soil-600">{monthly}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{annual}</td>
                      </tr>
                    ))}
                    <tr className="bg-forest-700 text-white">
                      <td className="px-4 py-3 font-bold">TOTAL ANNUAL COST</td>
                      <td className="px-4 py-3 font-bold">KES 8,100</td>
                      <td className="px-4 py-3 font-bold">KES 97,200</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td className="px-4 py-3 font-bold text-gold-800">Revenue (18 L/day x KES 45/L x 365 days)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 24,300</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 295,650</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="px-4 py-3 font-bold text-green-800">Net margin Per Cow</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 16,200</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 198,450</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Milk price assumes New KCC or Brookside collection at farm gate. Find <Link href="/dealers/nandi" className="text-gold-700 hover:underline">Nandi County agrovets and current dairy input prices here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ calculates your Nandi soil's phosphorus status for Napier establishment and gives you the complete fertilizer programme for your fodder system. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Nandi Silage Tool</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/nandi", label: "Nandi county soil report" },
                  { href: "/crops/napier-grass", label: "Napier grass crop guide" },
                  { href: "/soil/nandi/maize", label: "Silage maize in Nandi" },
                  { href: "/soil/uasin-gishu", label: "Uasin gishu — neighbouring county" },
                  { href: "/dealers/nandi", label: "Agrovets in Nandi county" },
                  { href: "/zones/western-highlands", label: "Western highlands zone" },
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Nandi quick facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Western Highlands"], ["Altitude", "1,500 – 2,100 m"], ["Avg Rainfall", "1,400 – 1,800 mm/yr"], ["Dominant Soil", "Red clay loam"], ["Avg Soil pH", "5.2 – 6.0"], ["Best Fodder", "Napier + Silage Maize"], ["Dairy Processor", "New KCC / Brookside"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/nandi" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:text-gold-700 transition-colors">Full Nandi Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "uasin-gishu", name: "Uasin gishu" }, { slug: "kakamega", name: "Kakamega" }, { slug: "kericho", name: "Kericho" }, { slug: "elgeyo-marakwet", name: "Elgeyo marakwet" }].map(({ slug, name }) => (
                    <Link key={slug} href={`/soil/${slug}`} className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>{name} County</span><span className="text-gold-500 text-xs">→</span>
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
