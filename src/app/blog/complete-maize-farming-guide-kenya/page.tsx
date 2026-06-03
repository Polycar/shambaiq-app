import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("complete-maize-farming-guide-kenya")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Crop guides", url: `${BASE_URL}/blog?category=crop-guides` }, { name: "Complete Maize Farming Guide Kenya", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "How many bags of maize can I get per acre in Kenya?", answer: "With optimal soil pH (6.0–6.8), correct fertilizer application (1 bag DAP at planting + 1 bag CAN top-dress), a certified hybrid variety suited to your altitude, and adequate rainfall or irrigation, Kenyan farmers in highland counties achieve 25 to 35 bags of 90 kg per acre. In highland zones with good management and two seasons, 30 bags per acre is a realistic target. In ASAL zones with drought-tolerant varieties and good management, 12 to 20 bags per acre is achievable. Average Kenyan smallholder maize yield is currently 8 to 12 bags per acre — most of the gap is explained by soil pH, wrong variety, and fertilizer timing errors that ShambaIQ can identify for your specific farm." },
  { question: "What is the best maize variety in Kenya 2026?", answer: "The best maize variety depends on your altitude and county. For the highlands (1,500–2,200m): H614D, DK8031, and WH507 consistently top performance trials. For mid-altitude (1,200–1,500m): DK777, SC403, and Pioneer 3253 perform best. For lowlands and ASAL zones: DUMA 43, WH505, and DK8031 are the most drought-tolerant certified varieties. Never use recycled seed from the previous season's hybrid harvest — hybrid seed loses its yield advantage in the second generation and produces 30 to 40 percent lower yields than fresh certified F1 seed." },
  { question: "When should I apply DAP and CAN fertilizer for maize in Kenya?", answer: "Apply DAP at planting — place it in the furrow 5 cm below and 5 cm beside the seed, never in direct seed contact. Standard rate is 50 kg per acre (1 bag). Apply CAN as a top-dress when maize is knee-high — approximately 4 to 6 weeks after germination when the plants are 45 to 60 cm tall. At this growth stage nitrogen drives the rapid leaf area expansion and tassel development that determines yield potential. Standard CAN rate is 50 kg per acre. Do not apply CAN at planting — it volatilises rapidly from the surface and provides little benefit compared to well-timed knee-high application." },
  { question: "How do I control fall armyworm in maize in Kenya?", answer: "Fall armyworm (Spodoptera frugiperda) is now endemic across Kenya's maize belt. Scout weekly from seedling emergence — look for ragged leaf damage and frass (dark green or brown pellets) in the whorl. At 10 percent infestation, spray with emamectin benzoate (Escort, Proclaim) or chlorantraniliprole (Coragen) into the whorl rather than on leaf surfaces — armyworm feeds in the whorl where it is protected from surface sprays. Early morning spraying (6–9am) reaches larvae when they are feeding rather than sheltering. Spray windows of 7 days are required — a single spray rarely provides complete control." },
  { question: "What causes yellow leaves in maize?", answer: "Yellow maize leaves have multiple causes that require different treatments. Uniform yellowing of lower leaves spreading upward: nitrogen deficiency — apply CAN immediately. V-shaped yellow from leaf tip on lower leaves: potassium deficiency. Interveinal yellowing on young upper leaves: zinc deficiency — common on alkaline soils. Pale yellowing across all leaves with stunted plants: soil pH below 5.5 causing aluminium toxicity or phosphorus lockout — lime required. Yellowing with purple streaks: phosphorus deficiency in cold soils. Irregular yellow patches with wilting: grey leaf spot or northern corn leaf blight — fungicide required. Get a precise diagnosis at shambaiq.com." },
  { question: "Is it worth lime maize fields in Kenya?", answer: "On soils below pH 5.5 — which covers much of Central Kenya, Western Kenya, and the Mount Kenya counties — liming maize fields returns between KES 3 and KES 8 for every KES 1 spent on lime, through improved fertilizer efficiency, elimination of aluminium toxicity, and direct yield increase. At pH 4.8, maize yields 40 to 60 percent below its potential regardless of how much fertilizer is applied. Liming 1 acre to pH 6.0 costs KES 10,000 to 21,000 depending on starting pH, adds 10 to 20 bags of maize at KES 3,500 per bag, and the effect lasts 3 to 4 seasons. The ROI is among the highest of any farm investment available to Kenyan smallholders." },
]);

const howToSchema = makeHowToSchema({
  name: "How to grow maize in Kenya — complete step-by-step guide",
  description: "The complete guide to growing high-yield maize in Kenya covering variety selection, soil preparation, fertilizer application, pest management, and harvest.",
  totalTime: "P120D",
  estimatedCost: { currency: "KES", value: "12000–22000 per acre" },
  supply: ["Certified hybrid maize seed (H614D, DK8031, or DUMA 43 depending on zone)", "DAP fertilizer (50 kg per acre at planting)", "CAN fertilizer (50 kg per acre top-dress)", "Agricultural lime (if pH below 5.8)", "Emamectin benzoate or chlorantraniliprole for fall armyworm"],
  tool: ["Hand jab planter or ox plough", "Knapsack sprayer", "ShambaIQ precision tool"],
  steps: [
    { name: "Get your farm's soil pH and choose the right variety", text: "Use ShambaIQ at shambaiq.com to get your farm's soil pH and recommended maize variety for your altitude and county. Variety selection is the single most impactful decision — a highland variety planted in lowland conditions or vice versa loses 30 to 50 percent of its yield potential before any other management decisions are made." },
    { name: "Lime if soil pH is below 5.8", text: "If ShambaIQ or a soil test shows pH below 5.8, apply agricultural lime at least 3 to 4 weeks before planting. At pH 4.8 to 5.2 apply 2 tonnes of dolomitic lime per acre. At pH 5.2 to 5.5 apply 1 to 1.5 tonnes. At pH 5.5 to 5.8 apply 500 kg to 1 tonne. Incorporate lime to 15 cm depth. Do not apply DAP in the same week as lime — wait at least 3 weeks." },
    { name: "Plant certified seed at onset of rains", text: "Plant certified F1 hybrid seed at the first reliable rains when soil moisture is available at 5 cm depth. Spacing: 75 cm between rows and 25 cm within rows, one seed per hole 3 to 5 cm deep. This gives approximately 53,000 plants per acre. Apply DAP at 50 kg per acre in the furrow 5 cm below and beside the seed — never in direct contact." },
    { name: "Top-dress with CAN at knee height", text: "Apply CAN at 50 kg per acre when maize reaches 45 to 60 cm height — approximately 4 to 6 weeks after planting. Apply in a ring 5 to 10 cm from the stem base. If rainfall is delayed after CAN application, the nitrogen volatilises before uptake — timing CAN application before predicted rain improves efficiency significantly." },
    { name: "Scout for fall armyworm from week 2", text: "Inspect 10 to 20 plants per field twice per week from week 2. Look for ragged whorl damage and frass. Spray emamectin benzoate into the whorl at 10 percent plant infestation. Early intervention at under 20 percent infestation costs less and is more effective than reactive spraying on widespread populations." },
    { name: "Harvest at correct moisture and store properly", text: "Harvest when husks are brown and seeds dent at the crown — approximately 120 days after planting for most highland hybrids. Field-dry on the stalk for 2 to 3 weeks after maturity, then harvest and strip husks. Dry shelled grain to below 13 percent moisture before bagging. Treat with Actellic Super or hermetic bags against weevils before storage." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "why-yields-low", label: "Why most Kenyan maize yields are low", level: 2 },
  { id: "varieties", label: "Choosing the right maize variety by zone", level: 2 },
  { id: "soil-prep", label: "Soil preparation and pH management", level: 2 },
  { id: "fertilizer", label: "DAP and CAN fertilizer programme", level: 2 },
  { id: "pests", label: "Fall armyworm and disease control", level: 2 },
  { id: "howto", label: "Step-by-step growing guide", level: 2 },
  { id: "budget", label: "Cost and revenue budget per acre", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function CompleteMaizeGuidePage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Crop guides", url: `${BASE_URL}/blog?category=crop-guides` }, { name: "Complete Maize Farming Guide Kenya", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=crop-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Crop guides</Link>
                <Link href="/crops/maize" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Maize</Link>
                <span className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full">All counties</span>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Complete maize farming guide Kenya 2026:
                <span className="text-gold-700">From soil to 30 bags per acre</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                The average Kenyan smallholder maize farmer harvests 8 to 12 bags per acre. The precision farmer on the same soil in the same county harvests 25 to 35. The difference is not luck, land size, or expensive equipment. It is four decisions made correctly: soil pH before anything, the right variety for the right altitude, fertilizer applied at the right time, and fall armyworm caught early. This guide covers every step from soil to storage with specific recommendations for Kenya's seven major maize-growing agroecological zones.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">High-yield maize crop in the Rift Valley highlands, Kenya. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="why-yields-low" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why most Kenyan maize yields are low</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kenya's national average maize yield of 1.7 tonnes per hectare (roughly 10 bags per acre) is among the lowest in Sub-Saharan Africa for a country with highland potential. Four fixable problems account for most of the gap between current yields and achievable yields.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { problem: "Wrong soil pH", impact: "40–60% yield loss", detail: "Most maize in Central and Western Kenya is grown on soils at pH 4.8 to 5.5. Aluminium toxicity at this pH destroys root tips before they can absorb fertilizer. The fertilizer is applied — it goes nowhere." },
                  { problem: "Wrong variety for the altitude", impact: "20–40% yield loss", detail: "A highland variety planted in the lowlands fails to silk and set grain properly. A lowland variety in the highlands takes too long to mature. Variety-altitude mismatch is extremely common and almost never discussed by agrovets." },
                  { problem: "CAN applied at planting instead of knee-height", impact: "15–30% efficiency loss", detail: "CAN applied at planting volatilises from the soil surface before root uptake. Knee-height CAN is absorbed by an established root system during rapid growth — the same nitrogen does 3× the work." },
                  { problem: "Fall armyworm left uncontrolled", impact: "20–80% yield loss in outbreak years", detail: "Fall armyworm is now endemic and reaches economic threshold levels on 60 to 70 percent of Kenyan farms in outbreak seasons. A single spray missed at the early whorl stage can destroy 50 percent of a stand within one week." },
                ].map((item) => (
                  <div key={item.problem} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-1 text-sm">{item.problem}</h3>
                    <p className="text-xs font-bold text-red-600 mb-2">{item.impact}</p>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="varieties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Choosing the right maize variety by zone</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Best maize varieties by altitude and agroecological zone Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Zone", "Altitude", "Key counties", "Top varieties", "Days to maturity", "Yield potential"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Highland", "1,800–2,400m", "Nyandarua, Nyeri upper, Meru upper", "H614D, WH507", "140–160 days", "28–38 bags/acre"],
                      ["Upper Midland", "1,500–1,800m", "Nakuru, Uasin Gishu, Trans Nzoia", "DK8031, H614D, SC403", "120–140 days", "25–35 bags/acre"],
                      ["Midland", "1,200–1,500m", "Kakamega, Nandi, Kisii, Embu", "DK777, Pioneer 3253, SC403", "100–120 days", "20–28 bags/acre"],
                      ["Lower Midland", "900–1,200m", "Machakos, Makueni, Kitui lowlands", "WH505, DK8031, DUMA 43", "90–110 days", "14–22 bags/acre"],
                      ["Semi-arid", "600–900m", "Kajiado, Baringo lowlands, Kwale", "DUMA 43, WH505", "85–100 days", "10–18 bags/acre"],
                    ].map(([zone, alt, counties, vars, days, yield_], i) => (
                      <tr key={zone as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-semibold text-forest-800">{zone}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{alt}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{counties}</td>
                        <td className="px-3 py-3 font-mono text-xs text-forest-700">{vars}</td>
                        <td className="px-3 py-3 text-xs">{days}</td>
                        <td className="px-3 py-3 font-semibold text-green-700 text-xs">{yield_}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="fertilizer" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">DAP and CAN fertilizer programme</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Maize fertilizer programme Kenya DAP CAN application timing and rates</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Stage", "Fertilizer", "Rate/acre", "Placement", "Critical timing"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["At planting", "DAP", "50 kg (1 bag)", "5cm below & beside seed in furrow", "Same day as planting — never contact seed directly"],
                      ["Knee height (4–6 wks)", "CAN", "50 kg (1 bag)", "Ring 5–10 cm from stem base", "Apply before rain — within 24 hrs of forecast"],
                      ["Optional: low P soils", "TSP or Rock Phosphate", "25–50 kg", "Broadcast and incorporate before planting", "Soils where P below 10 mg/kg — check ShambaIQ first"],
                      ["Optional: acidic soils", "Dolomitic lime", "1–2.5 t/acre", "Broadcast and incorporate", "At least 3 weeks before DAP application"],
                    ].map(([stage, fert, rate, place, timing], i) => (
                      <tr key={stage as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800">{stage}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gold-700">{fert}</td>
                        <td className="px-4 py-3 text-soil-600">{rate}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{place}</td>
                        <td className="px-4 py-3 text-xs text-red-700 font-medium">{timing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="pests" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Fall armyworm and disease control</h2>
              <div className="space-y-3 mb-6">
                {[
                  { pest: "Fall Armyworm (Spodoptera frugiperda)", timing: "Week 2 onwards", threshold: "10% plant infestation", product: "Emamectin benzoate or Chlorantraniliprole into whorl", note: "Spray into the whorl, not on leaf surfaces. Scout twice weekly. One spray at threshold is far more effective than three sprays on established populations." },
                  { pest: "Stalk borers (Busseola fusca)", timing: "Week 3–8", threshold: "15% dead hearts", product: "Cypermethin or Lambdacyhalothrin into whorl at knee height", note: "Endemic across all Kenyan maize zones. Stalk borer and fall armyworm often co-occur — select products with efficacy against both." },
                  { pest: "Grey Leaf Spot (Cercospora zeae-maydis)", timing: "After tasselling", threshold: "Visible lesions on lower 3 leaves", product: "Propiconazole or Azoxystrobin foliar", note: "Most damaging in humid highland conditions. H614D has moderate tolerance. Single application at early symptom is sufficient in most seasons." },
                  { pest: "Northern Corn Leaf Blight (Exserohilum turcicum)", timing: "After tasselling", threshold: "Lesions on upper canopy leaves", product: "Mancozeb or Propiconazole foliar", note: "Favoured by cool humid conditions in highland maize zones. Variety resistance varies — check KEPHIS variety data for your seed source." },
                ].map((item) => (
                  <div key={item.pest} className="bg-white border border-cream-300 rounded-xl p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-forest-800 text-sm">{item.pest}</h3>
                      <span className="text-xs bg-red-50 border border-red-200 text-red-700 px-2.5 py-0.5 rounded-full">Threshold: {item.threshold}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs mb-2">
                      <div><span className="text-soil-500">Timing: </span><span className="text-soil-600">{item.timing}</span></div>
                      <div><span className="text-soil-500">Product: </span><span className="font-medium text-forest-700">{item.product}</span></div>
                    </div>
                    <p className="text-xs text-soil-500 border-t border-cream-200 pt-2">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-step: growing maize in Kenya</h2>
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
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost and revenue budget per acre — Kenyan maize 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Total (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Certified hybrid seed (2 kg)", "1,600"], ["DAP (1 bag)", "4,200"], ["CAN (1 bag)", "3,500"], ["Lime (if needed — amortised)", "3,000"], ["Fall armyworm sprays x2", "2,500"], ["Labour planting + weeding + harvest", "5,000"]].map(([item, total], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 text-forest-800">{item}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{total}</td>
                      </tr>
                    ))}
                    <tr className="bg-forest-700 text-white"><td className="px-4 py-3 font-bold">TOTAL COST</td><td className="px-4 py-3 font-bold">KES 19,800</td></tr>
                    <tr className="bg-gold-50"><td className="px-4 py-3 font-bold text-gold-800">Revenue (28 bags × KES 3,500)</td><td className="px-4 py-3 font-bold text-gold-800">KES 98,000</td></tr>
                    <tr className="bg-green-50"><td className="px-4 py-3 font-bold text-green-800">Net margin</td><td className="px-4 py-3 font-bold text-green-800">KES 78,200</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ gives you your county's soil pH, phosphorus and nitrogen levels, and the best maize variety for your specific location. Free, no sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Get My Maize Recommendation</Link>
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Maize quick facts</p>
                <div className="space-y-2 text-sm">
                  {[["National avg yield", "8–12 bags/acre"], ["Precision avg yield", "25–35 bags/acre"], ["Key input #1", "Correct variety"], ["Key input #2", "Soil pH ≥ 5.8"], ["Key input #3", "CAN at knee height"], ["Biggest pest", "Fall armyworm"], ["Best certification", "KEPHIS F1 seed"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500 text-xs">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More crop guides" />
      </div>
    </>
  );
}
