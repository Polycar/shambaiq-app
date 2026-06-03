import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("cabbage-farming-kiambu-highland-soils")!;

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

const breadcrumbSchema = makeBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` },
  { name: "Cabbage farming in Kiambu", url: `${BASE_URL}/blog/${POST.slug}` },
]);

const faqSchema = makeFAQSchema([
  {
    question: "What is the best fertilizer for cabbage in Kiambu County?",
    answer: "Kiambu cabbage farming requires a three-stage fertilizer programme. At transplanting, apply DAP at 50 kg per acre in the planting hole. At three weeks, top-dress with CAN at 50 kg per acre to drive leaf development. At six weeks, apply a second CAN top-dressing at 50 kg per acre as the head begins forming. Avoid excessive nitrogen beyond this point — it promotes leafy growth at the expense of head density and marketable weight. Get a farm-specific plan at shambaiq.com/app?county=kiambu&crop=cabbage.",
  },
  {
    question: "Why does cabbage fail in Kiambu despite fertile-looking soils?",
    answer: "The most common cause of cabbage failure in Kiambu is clubroot disease (Plasmodiophora brassicae), which thrives in the acidic soils common across Limuru, Githunguri, and Lari. Clubroot distorts and rots the root system below ground while the plant looks stressed above. The second cause is planting into soil with pH below 6.0 without lime correction — cabbage cannot absorb calcium and boron at low pH, causing tip burn and loose heads. Checking soil pH before planting and applying dolomitic lime is the single most important intervention.",
  },
  {
    question: "How much lime does cabbage need in Kiambu?",
    answer: "On Kiambu soils with pH 5.0 to 5.5 — which is common in Limuru and upper Githunguri — apply 1.5 to 2 tonnes of dolomitic lime per acre at least three weeks before transplanting. On soils with pH 5.5 to 6.0, 750 kg to 1 tonne per acre is sufficient. Dolomitic lime is preferred over calcitic lime because it also supplies magnesium, which Kiambu's heavily leached highland soils are often deficient in. Recheck pH one season after liming.",
  },
  {
    question: "How long does cabbage take to mature in Kiambu?",
    answer: "At Kiambu's highland altitudes of 1,600 to 2,000 metres, cabbage takes 90 to 120 days from transplanting to harvest depending on variety. Gloria F1 and Star 3301 mature in 85 to 95 days and are preferred for the Nairobi fresh market. Farakalla and Pruktor are longer-season varieties at 110 to 120 days but produce larger, denser heads preferred by processors.",
  },
  {
    question: "What spacing is recommended for cabbage in Kiambu?",
    answer: "Plant cabbage at 60 cm between rows and 45 cm within rows, giving approximately 14,800 plants per acre. Wider spacing of 75 x 60 cm (approximately 9,600 plants per acre) suits larger-headed varieties and produces heads above 2 kg that command premium prices at Nairobi wholesale markets. Closer spacing than 60 x 45 cm increases humidity within the canopy and raises the risk of black rot and Alternaria leaf spot.",
  },
  {
    question: "How do I prevent clubroot in my Kiambu cabbage farm?",
    answer: "Clubroot prevention requires four simultaneous actions: raise soil pH above 6.5 using dolomitic lime applied three weeks before transplanting; implement a three-year crop rotation avoiding all brassicas (cabbage, kale, sukuma wiki, broccoli, cauliflower); use certified clubroot-resistant varieties where available; and avoid moving soil or transplanting equipment between infected and clean fields. Once clubroot is established in a field, it persists in soil for up to 20 years. Prevention is the only effective strategy.",
  },
]);

const howToSchema = makeHowToSchema({
  name: "How to grow cabbage in Kiambu county — soil preparation and fertilizer guide",
  description: "A step-by-step guide to growing high-yield cabbage on Kiambu's acidic highland soils, covering lime application, transplanting, fertilizer timing, and pest management.",
  totalTime: "P120D",
  estimatedCost: { currency: "KES", value: "18000–24000 per acre" },
  supply: [
    "Certified cabbage seedlings (Gloria F1, Star 3301, or equivalent)",
    "Dolomitic lime (750 kg to 2 tonnes per acre depending on soil pH)",
    "DAP fertilizer (50 kg per acre at transplanting)",
    "CAN fertilizer (100 kg per acre — two applications of 50 kg)",
    "Foliar boron supplement",
    "Registered fungicide (metalaxyl or copper-based)",
  ],
  tool: [
    "Hand hoe or ridger",
    "Soil pH meter or ShambaIQ precision tool",
    "Knapsack sprayer",
    "Transplanting dibber",
  ],
  steps: [
    {
      name: "Test soil pH and order lime three weeks before transplanting",
      text: "Use ShambaIQ at shambaiq.com/app?county=kiambu&crop=cabbage to get your farm's soil pH reading. If pH is below 6.0 — which covers most of Limuru and upper Githunguri — order dolomitic lime immediately. Lime must be incorporated into the soil at least three weeks before transplanting to begin raising pH. Transplanting into uncorrected acidic soil is the single most common reason cabbage fails in Kiambu highland farms.",
    },
    {
      name: "Incorporate dolomitic lime and prepare beds",
      text: "Broadcast dolomitic lime evenly across the entire planting area and work it into the top 20 cm of soil using a fork or rotovator. Do not apply lime and DAP at the same time — lime reacts with phosphorus and reduces its availability. Apply lime, wait three weeks, then apply DAP at transplanting. Prepare raised beds 1 metre wide with 60 cm pathways to improve drainage on Kiambu's high-rainfall highland soils.",
    },
    {
      name: "Raise seedlings in a nursery for 25 to 30 days",
      text: "Sow cabbage seed in a nursery bed at 10 g per square metre, covered with a thin layer of fine soil. Water daily and apply a light fungicide drench (metalaxyl) at 10 days to prevent damping-off. Seedlings are ready for transplanting when they reach 10 to 15 cm height with four to five true leaves. Harden seedlings by reducing water for three days before transplanting.",
    },
    {
      name: "Transplant at correct spacing with DAP in the hole",
      text: "Transplant seedlings at 60 cm between rows and 45 cm within rows in the late afternoon or on a cloudy day to reduce transplant shock. Place a tablespoon of DAP (approximately 5 g) in each planting hole, covered with a thin soil layer before placing the seedling. Water immediately after transplanting. Avoid transplanting into waterlogged soil — root oxygen stress at this stage causes permanent stunting.",
    },
    {
      name: "Apply first CAN top-dressing at three weeks",
      text: "Apply CAN at 50 kg per acre in a ring 10 cm from the stem at three weeks after transplanting. This drives the rapid leaf expansion phase that determines final head size. Water after application if rainfall is not expected within 24 hours — CAN needs moisture to dissolve and reach the root zone.",
    },
    {
      name: "Apply boron foliar spray at four weeks",
      text: "Spray a soluble boron product (borax at 1 g per litre or a commercial boron foliar) at four weeks after transplanting. Boron deficiency is common in Kiambu's leached highland soils and causes hollow stem, tip burn, and failure of the head to form densely. This is a low-cost intervention — one foliar application per season at approximately KES 300 per acre — that significantly improves head quality.",
    },
    {
      name: "Apply second CAN top-dressing at six weeks",
      text: "Apply a second CAN top-dressing at 50 kg per acre at six weeks, when the head is beginning to form. Do not apply additional nitrogen after this point. Late nitrogen application delays maturity, softens heads, and increases susceptibility to post-harvest rot — a particular risk given Kiambu's high humidity.",
    },
    {
      name: "Scout for pests weekly and harvest at correct maturity",
      text: "Scout weekly for diamondback moth (look for windowed leaves), aphids (check the inner leaves of forming heads), and black rot (yellow V-shaped lesions from leaf margins). Harvest when heads feel firm under hand pressure and before splitting occurs. Harvesting at 90 to 95 percent maturity reduces field losses significantly in Kiambu's wet conditions.",
    },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "kiambu-cabbage-potential", label: "Why Kiambu leads Kenya's cabbage production", level: 2 },
  { id: "soil-data", label: "Kiambu soil data and the pH problem", level: 2 },
  { id: "lime-guide", label: "Lime application guide for Kiambu soils", level: 2 },
  { id: "clubroot", label: "Clubroot — the disease that destroys silently", level: 2 },
  { id: "variety-guide", label: "Best certified cabbage varieties for Kiambu", level: 2 },
  { id: "fertilizer-programme", label: "Three-stage fertilizer programme", level: 2 },
  { id: "planting-calendar", label: "Planting calendar for Kiambu", level: 2 },
  { id: "howto", label: "Step-by-step growing guide", level: 2 },
  { id: "budget", label: "Cost and revenue budget per acre", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function CabbageKiambuPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Cabbage farming in Kiambu", url: `${BASE_URL}/blog/${POST.slug}` }]} />

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County farming guides</Link>
                <Link href="/soil/kiambu" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Kiambu County</Link>
                <Link href="/crops/cabbage" className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors">Cabbage</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Cabbage farming in Kiambu:{" "}
                <span className="text-gold-700">A high-yield guide for highland soils</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Kiambu County supplies more fresh cabbage to Nairobi's markets than any other single county in Kenya. Its cool highland temperatures, abundant rainfall, and proximity to the city's wholesale markets give Kiambu farmers a structural advantage that is difficult to replicate. But that advantage is being eroded farm by farm — by acidic soils that were never limed, by clubroot disease that spreads silently through transplanting equipment, and by fertilizer programmes designed for maize being applied unchanged to a crop with completely different nutritional requirements. This guide addresses all three.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Dense cabbage crop in Kiambu highland farm. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="kiambu-cabbage-potential" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Kiambu leads Kenya's cabbage production</h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Three factors combine to make Kiambu uniquely suited to commercial cabbage production, and all three are structural — they cannot be easily replicated by lowland counties regardless of input spend.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Cool highland temperatures suppress pest pressure", detail: "Kiambu's altitude range of 1,500 to 2,100 metres keeps average temperatures between 14 and 22 degrees Celsius — below the optimal reproduction range of many cabbage pests. Diamondback moth populations, which devastate cabbage in warmer lowland counties, cycle more slowly at Kiambu altitudes, reducing insecticide frequency and cost." },
                  { title: "High rainfall reduces irrigation dependency", detail: "Kiambu receives 900 to 1,100 mm of rainfall annually across two seasons, distributed relatively evenly. The Aberdare catchment creates reliable moisture that reduces irrigation infrastructure needs — a significant capital saving compared to drier counties where cabbage requires drip or sprinkler systems to be viable." },
                  { title: "Nairobi market access means same-day delivery", detail: "Kiambu cabbage reaches Wakulima Market in Nairobi within two hours of harvest. This eliminates the post-harvest deterioration that erodes margins for farmers in more distant counties. A Kiambu farmer can wait for market prices to rise before harvesting and respond within the same day — a market advantage that distance removes entirely." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Kiambu soil data and the pH problem</h2>
              <p className="text-soil-600 leading-relaxed mb-5">
                ShambaIQ's high-resolution soil mapping shows a consistent pattern across Kiambu's highland sub-counties: soils are nitrogen-rich and have adequate organic carbon, but pH is systematically too low for optimal cabbage production. Cabbage belongs to the brassica family and is more sensitive to soil acidity than most food crops — it needs pH above 6.0 to absorb calcium and boron, and above 6.5 to suppress clubroot disease spore germination.
              </p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Kiambu County soil nutrient values versus cabbage requirements</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Nutrient", "Kiambu average", "Cabbage optimum", "Status", "Action required"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "4.8 – 5.8", "6.0 – 7.0", "Acidic — Critical", "Dolomitic lime essential"],
                      ["Total Nitrogen (g/kg)", "2.0 – 3.2", "> 1.5 g/kg", "Good", "DAP + CAN programme sufficient"],
                      ["Phosphorus (mg/kg)", "6 – 15", "> 15 mg/kg", "Deficient", "DAP at transplanting non-negotiable"],
                      ["Potassium (mg/kg)", "80 – 160", "> 120 mg/kg", "Low – Adequate", "Monitor — supplement if below 100"],
                      ["Calcium (mg/kg)", "200 – 500", "> 1000 mg/kg", "Deficient", "Corrected by dolomitic lime application"],
                      ["Organic Carbon (g/kg)", "18 – 30", "> 15 g/kg", "Good", "Maintain with crop residue retention"],
                    ].map(([n, v, o, s, a], i) => (
                      <tr key={n as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{n}</td>
                        <td className="px-4 py-3 text-soil-600">{v}</td>
                        <td className="px-4 py-3 text-soil-500">{o}</td>
                        <td className="px-4 py-3 font-medium text-sm">{s}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-5">Source: ShambaIQ precision soil mapping, 0 to 20 cm depth, Kiambu County average. <Link href="/app?county=kiambu&crop=cabbage" className="text-gold-700 hover:underline">Get your farm-specific reading here.</Link></p>

              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-800 mb-2">The pH Crisis Across Kiambu Highlands</p>
                <p className="text-sm text-red-700 leading-relaxed">
                  At pH 4.8 to 5.4 — which covers significant portions of Limuru, Lari, and upper Githunguri — cabbage cannot access calcium regardless of how much fertilizer is applied. Calcium is immobile in the plant: once a leaf is formed without adequate calcium, tip burn cannot be corrected by foliar sprays. The entire leaf is lost. At the same pH range, aluminium and manganese become soluble and reach toxic concentrations in soil water, directly damaging root tips and blocking water uptake. Lime is not optional for these soils. It is the precondition for everything else.
                </p>
              </div>
            </section>

            <section>
              <h2 id="lime-guide" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Lime application guide for Kiambu soils</h2>
              <p className="text-soil-600 leading-relaxed mb-5">
                Dolomitic lime is the preferred product for Kiambu highland soils because it supplies both calcium and magnesium — two nutrients that Kiambu's heavily leached soils are deficient in simultaneously. Calcitic lime supplies only calcium and will not correct magnesium deficiency, which manifests as interveinal chlorosis in older cabbage leaves.
              </p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Dolomitic lime application rates for cabbage in Kiambu County by soil pH</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Current soil pH", "Lime rate per acre", "Product", "Timing", "Expected pH after"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Below 5.0", "2,000 kg (2 tonnes)", "Dolomitic lime", "6 weeks before transplanting", "5.8 – 6.2"],
                      ["5.0 – 5.4", "1,500 kg (1.5 tonnes)", "Dolomitic lime", "4 weeks before transplanting", "5.8 – 6.3"],
                      ["5.5 – 5.9", "750 – 1,000 kg", "Dolomitic lime", "3 weeks before transplanting", "6.2 – 6.6"],
                      ["6.0 – 6.4", "500 kg maintenance", "Dolomitic lime", "Once per year after harvest", "Maintain above 6.0"],
                      ["Above 6.5", "No lime needed", "—", "Recheck after two seasons", "Monitor only"],
                    ].map(([ph, rate, prod, timing, after], i) => (
                      <tr key={ph as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{ph}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{rate}</td>
                        <td className="px-4 py-3 text-soil-500">{prod}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{timing}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">Never Apply Lime and DAP Together</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Lime and DAP applied simultaneously in the same soil volume react chemically — calcium from the lime combines with phosphate from DAP to form insoluble calcium phosphate that neither plant roots nor soil microbes can access. The phosphorus is locked out entirely. Apply lime first, wait at least three weeks, then apply DAP at transplanting. This sequencing is non-negotiable.
                </p>
              </div>
            </section>

            <section>
              <h2 id="clubroot" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Clubroot — the disease that destroys silently</h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Clubroot (Plasmodiophora brassicae) is a soil-borne pathogen that infects brassica roots at the seedling stage, forming galls that block water and nutrient uptake while remaining invisible above ground until irreversible damage has occurred. By the time a Kiambu cabbage farmer sees wilting, yellowing, and stunted growth in the field, the root system is already destroyed.
              </p>
              <p className="text-soil-600 leading-relaxed mb-4">
                The pathogen thrives specifically in the conditions common across Kiambu: cool temperatures, high soil moisture, and — critically — acidic soil below pH 6.5. Raising soil pH above 6.5 through lime application does not kill clubroot spores, but it suppresses their germination and infection rate by over 80 percent. This is why lime is both a soil correction and a disease prevention tool simultaneously.
              </p>
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-forest-800 mb-3">Four-Point Clubroot Prevention Protocol</p>
                <div className="space-y-2">
                  {[
                    { n: "1", t: "Raise pH above 6.5", d: "Apply dolomitic lime at rates shown above, at least three to six weeks before transplanting. pH above 6.5 suppresses clubroot infection by over 80 percent." },
                    { n: "2", t: "Implement a three-year brassica-free rotation", d: "Rotate through maize, beans, or potatoes for three seasons before returning to any brassica crop (cabbage, kale, broccoli, sukuma wiki, cauliflower). Clubroot spores survive in soil for up to 20 years but require a host to reproduce." },
                    { n: "3", t: "Use clean transplanting equipment between fields", d: "Clubroot spreads on soil particles attached to tools, boots, and transplanting trays. Wash equipment with clean water and allow to dry completely before moving between fields. Never share seedling trays between farms." },
                    { n: "4", t: "Source seedlings from a certified clubroot-free nursery", d: "Most clubroot introductions into new fields come from infected nursery seedlings. Buy from nurseries that can show clean soil test results. Raise your own seedlings in sterilised growing media where possible." },
                  ].map((item) => (
                    <div key={item.n} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-forest-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.n}</div>
                      <div>
                        <p className="text-sm font-semibold text-forest-800">{item.t}</p>
                        <p className="text-xs text-soil-500 leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 id="variety-guide" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Best certified cabbage varieties for Kiambu</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Variety choice in Kiambu must balance maturity period, head weight, market preference, and disease tolerance. The Nairobi fresh market prefers round, dense heads of 1.5 to 2.5 kg. Processors and institutions favour larger heads above 3 kg. Both markets exist within Kiambu's reach.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  { variety: "Gloria F1", maturity: "85 – 95 days", headWeight: "1.5 – 2.5 kg", yield: "16 – 22 t/acre", notes: "Most popular in Kiambu for Nairobi fresh market. Dense, round head. Good field-holding ability — can stay in field 2 weeks after maturity without splitting." },
                  { variety: "Star 3301 F1", maturity: "90 – 100 days", headWeight: "2.0 – 3.0 kg", yield: "18 – 26 t/acre", notes: "Tolerant to black rot. Slightly larger than Gloria. Preferred by Kiambu farmers targeting Wakulima wholesale buyers who pay per head rather than per kg." },
                  { variety: "Farakalla F1", maturity: "110 – 120 days", headWeight: "3.0 – 4.5 kg", yield: "22 – 30 t/acre", notes: "Large-headed, dense. Preferred by institutions and processors. Longer season means higher production cost but premium price per head from bulk buyers." },
                  { variety: "Pruktor F1", maturity: "100 – 115 days", headWeight: "2.5 – 3.5 kg", yield: "20 – 28 t/acre", notes: "Strong outer wrapper leaves reduce post-harvest damage during transport. Good for farms further from Nairobi where handling time is longer." },
                ].map((v) => (
                  <div key={v.variety} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-3">{v.variety}</h3>
                    <div className="space-y-1.5 text-sm mb-3">
                      {[["Maturity", v.maturity], ["Head weight", v.headWeight], ["Expected yield", v.yield]].map(([label, val]) => (
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
            </section>

            <section>
              <h2 id="fertilizer-programme" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Three-stage fertilizer programme for Kiambu cabbage</h2>
              <p className="text-soil-600 leading-relaxed mb-5">
                Cabbage has a higher nitrogen demand than maize but requires it in a staged programme that tracks the crop's growth phases. Front-loading all nitrogen at transplanting produces excessive leaf growth, delays head formation, and produces loose, unmarketable heads. The three-stage programme below synchronises nutrient delivery with crop demand.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { stage: "Stage 1 — At transplanting", fert: "DAP (50 kg/acre)", timing: "Day 0", detail: "Apply DAP in the planting hole, covered with soil before placing the seedling. DAP provides phosphorus for root establishment and early shoot development. Do not substitute with CAN or urea at this stage — nitrogen without phosphorus at planting produces poor root architecture that limits the entire season's potential." },
                  { stage: "Stage 2 — At three weeks", fert: "CAN (50 kg/acre)", timing: "21 days after transplanting", detail: "Apply CAN in a ring 10 cm from the stem. This drives the rapid leaf expansion phase. Leaf number and leaf area at this stage directly determines the photosynthetic capacity available for head formation. A poorly fertilized plant at three weeks produces a small, loose head regardless of what happens later." },
                  { stage: "Stage 3 — At six weeks", fert: "CAN (50 kg/acre)", timing: "42 days after transplanting", detail: "Apply a second CAN top-dressing as head formation begins. This fuels the cell division and compaction that creates a dense, heavy, marketable head. Do not apply additional nitrogen after this point — it delays maturity and softens head texture, reducing shelf life and market value." },
                  { stage: "Supplemental — At four weeks", fert: "Foliar boron (1 g/L borax)", timing: "28 days after transplanting", detail: "Spray a soluble boron foliar across the entire canopy. Boron deficiency is endemic in Kiambu's leached highland soils and causes hollow stem syndrome and tip burn — two quality defects that cannot be corrected once they appear. This single application costs approximately KES 300 per acre and eliminates a major quality risk." },
                ].map((item) => (
                  <div key={item.stage} className="bg-white border border-cream-300 rounded-xl p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-forest-800 text-sm">{item.stage}</h3>
                      <div className="flex gap-2">
                        <span className="text-xs bg-gold-50 border border-gold-200 text-gold-700 px-2.5 py-0.5 rounded-full font-medium">{item.fert}</span>
                        <span className="text-xs bg-cream-100 border border-cream-300 text-soil-500 px-2.5 py-0.5 rounded-full">{item.timing}</span>
                      </div>
                    </div>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="planting-calendar" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Planting calendar for Kiambu county</h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Kiambu's bimodal rainfall supports two main cabbage planting windows. The long rains season produces the highest volumes and lowest prices at Nairobi markets. Farmers who time planting for the short rains often achieve better prices due to reduced market supply from other counties.
              </p>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-6">
                <table className="w-full text-sm">
                  <caption className="sr-only">Cabbage planting calendar for Kiambu County Kenya 2026</caption>
                  <thead className="bg-cream-200">
                    <tr>{["Season", "Sow nursery", "Transplant", "Harvest window", "Market outlook"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs text-forest-800 uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-forest-700">Long Rains</td>
                      <td className="px-4 py-3">Late January</td>
                      <td className="px-4 py-3">Late February – March</td>
                      <td className="px-4 py-3">May – June</td>
                      <td className="px-4 py-3 text-xs text-soil-500">High supply, competitive prices. Volume is key.</td>
                    </tr>
                    <tr className="bg-cream-50">
                      <td className="px-4 py-3 font-semibold text-forest-700">Short Rains</td>
                      <td className="px-4 py-3">Late August</td>
                      <td className="px-4 py-3">Late September – October</td>
                      <td className="px-4 py-3">December – January</td>
                      <td className="px-4 py-3 text-xs text-soil-500">Lower supply, stronger prices. Target this window.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-step: growing cabbage in Kiambu county</h2>
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
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost and revenue budget per acre — Kiambu cabbage 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Cabbage production cost and revenue per acre Kiambu County Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Qty", "Unit cost (KES)", "Total (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Certified seedlings (Gloria F1 or Star 3301)", "14,800 plants", "2", "29,600"],
                      ["Dolomitic lime (50 kg bags)", "20 bags (1,000 kg)", "700", "14,000"],
                      ["DAP fertilizer (50 kg bag)", "1 bag", "3,800", "3,800"],
                      ["CAN fertilizer (50 kg bag x2)", "2 bags", "3,200", "6,400"],
                      ["Foliar boron", "1 application", "300", "300"],
                      ["Fungicide (metalaxyl)", "2 applications", "1,200", "2,400"],
                      ["Insecticide (diamondback moth)", "3 applications", "900", "2,700"],
                      ["Labour — land prep and liming", "3 days", "500", "1,500"],
                      ["Labour — transplanting", "4 days", "500", "2,000"],
                      ["Labour — weeding and spraying", "6 days", "500", "3,000"],
                      ["Labour — harvest and transport", "4 days", "500", "2,000"],
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
                      <td className="px-4 py-3 font-bold">KES 67,700</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-gold-800">Expected revenue (20 t x KES 18/kg at Wakulima)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 360,000</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-green-800">Net margin</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 292,300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">
                Lime cost assumes pH 5.5 to 5.9 requiring 1,000 kg per acre. Higher-acidity farms will have higher lime costs in Year 1 but lower maintenance rates thereafter. Seedling cost assumes purchase from a certified Kiambu nursery. Find <Link href="/dealers/kiambu" className="text-gold-700 hover:underline">Kiambu agrovets and current input prices here.</Link>
              </p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ gives you your Kiambu farm's exact soil pH, phosphorus status, and calcium levels — and calculates the precise lime dosage and fertilizer programme before you spend anything on inputs. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Kiambu Cabbage Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/kiambu", label: "Kiambu county soil report" },
                  { href: "/crops/cabbage", label: "Cabbage crop guide — all counties" },
                  { href: "/soil/kiambu/kale", label: "Kale (sukuma wiki) in Kiambu" },
                  { href: "/soil/murang-a/cabbage", label: "Cabbage in muranga — compare" },
                  { href: "/dealers/kiambu", label: "Agrovets in Kiambu county" },
                  { href: "/zones/central-highlands", label: "Central Highlands agroecological zone" },
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Kiambu quick facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Central Highlands"], ["Altitude", "1,500 – 2,100 m"], ["Avg Rainfall", "900 – 1,100 mm/yr"], ["Dominant Soil", "Humic nitisol"], ["Avg Soil pH", "4.8 – 5.8"], ["pH Status", "Acidic — lime needed"], ["Nearest Market", "Nairobi (1–2 hrs)"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500">{k}</span>
                      <span className="font-medium text-forest-700 text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/kiambu" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:text-gold-700 transition-colors">Full Kiambu Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "murang-a", name: "Muranga" }, { slug: "nyeri", name: "Nyeri" }, { slug: "nairobi", name: "Nairobi" }, { slug: "kajiado", name: "Kajiado" }].map(({ slug, name }) => (
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
