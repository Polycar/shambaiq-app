import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("tomato-farming-kirinyaga-mwea-soils")!;

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
  { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` },
  { name: "Tomato Farming in Kirinyaga", url: `${BASE_URL}/blog/${POST.slug}` },
]);

const faqSchema = makeFAQSchema([
  {
    question: "What causes blossom end rot in tomatoes in Kirinyaga?",
    answer: "Blossom end rot in Kirinyaga tomatoes is caused by calcium deficiency at the developing fruit tip — not a lack of calcium in the soil, but the plant's inability to move calcium fast enough to rapidly expanding fruit tissue. Kirinyaga's black cotton soils have adequate total calcium but block its uptake through two mechanisms: high magnesium competition at pH above 7.0 in the Mwea block, and waterlogging that reduces root oxygen and shuts down active calcium transport. The fix is calcium nitrate top-dressing from first fruit set and consistent irrigation without waterlogging. Get a farm-specific calcium assessment at shambaiq.com/app?county=kirinyaga&crop=tomato.",
  },
  {
    question: "What is the best fertilizer for tomatoes in Kirinyaga County?",
    answer: "Kirinyaga tomatoes require a three-stage fertilizer programme. At transplanting, apply NPK 17:17:17 at 50 kg per acre for balanced establishment. At first flowering, switch to calcium nitrate (CAN-with-calcium product such as Yara Winner or equivalent) at 50 kg per acre to prevent blossom end rot. At fruit set and every three weeks through harvest, continue calcium nitrate at 30 kg per acre. Avoid pure CAN (calcium ammonium nitrate without added calcium) as the calcium content is too low to prevent deficiency in black cotton soils.",
  },
  {
    question: "How much can I earn from tomato farming in Kirinyaga per acre?",
    answer: "At 20 tonnes per acre from a well-managed Kirinyaga tomato farm and a market price of KES 30 per kg at Nairobi wholesale, gross revenue is KES 600,000 per acre. Input costs including fertilizer, pesticides, staking, irrigation, and labour run approximately KES 120,000 to 150,000 per acre, giving a net margin of KES 450,000 to 480,000. Tomato prices fluctuate significantly by season — the short rains harvest in December to January typically commands higher prices due to lower overall supply from highland counties.",
  },
  {
    question: "What tomato varieties are best for Kirinyaga County?",
    answer: "For Kirinyaga's Mwea lowland conditions (altitude 1,000 to 1,200 m, high humidity), determinate varieties with compact growth suit the staking constraints of smallholder plots. Rio Grande and Tengeru 97 are open-pollinated varieties with good late blight tolerance. For higher-value production, F1 hybrids Kilele and Cal-J are preferred by commercial growers — they carry improved tolerance to tomato yellow leaf curl virus, which is transmitted by whitefly populations common in the Mwea irrigation scheme.",
  },
  {
    question: "How do I manage late blight in Kirinyaga tomatoes?",
    answer: "Late blight (Phytophthora infestans) thrives in the warm, humid conditions of Kirinyaga's Mwea lowlands, particularly during irrigation cycles that wet the foliage. Management requires three simultaneous actions: apply a preventive copper-based fungicide (copper oxychloride or copper hydroxide) every 7 to 10 days from transplanting before symptoms appear; use drip irrigation rather than overhead sprinklers to keep foliage dry; and stake plants to improve canopy airflow and reduce leaf wetness duration. Curative fungicides including metalaxyl should be used at first symptom appearance and rotated to prevent resistance development.",
  },
  {
    question: "What is the best irrigation method for tomatoes in Mwea?",
    answer: "Drip irrigation is strongly recommended for Kirinyaga tomato production on black cotton soils. Black cotton (vertisol) soils have very low permeability — they swell when wet and crack when dry, creating physical stress on root systems with every wet-dry cycle. Drip irrigation maintains consistent soil moisture without flooding, preventing both the calcium mobility blockage that causes blossom end rot and the root oxygen depletion that increases late blight susceptibility. Overhead sprinklers wet the foliage and dramatically increase late blight infection rates in Mwea's humid lowland climate.",
  },
]);

const howToSchema = makeHowToSchema({
  name: "How to Grow Tomatoes in Kirinyaga County — Black Cotton Soil and Calcium Management Guide",
  description: "A step-by-step guide to growing high-yield tomatoes on Kirinyaga's Mwea black cotton soils, covering calcium nutrition, blossom end rot prevention, drip irrigation, and late blight management.",
  totalTime: "P90D",
  estimatedCost: { currency: "KES", value: "120000–150000 per acre" },
  supply: [
    "KEPHIS-certified tomato seedlings (Kilele F1, Cal-J F1, or Rio Grande)",
    "NPK 17:17:17 fertilizer (50 kg per acre at transplanting)",
    "Calcium nitrate fertilizer (Yara Winner or equivalent — 80 kg per acre total)",
    "Copper-based fungicide (copper oxychloride or copper hydroxide)",
    "Tomato stakes (bamboo or eucalyptus — 1.5 m per plant)",
    "Drip irrigation tape or pipes",
  ],
  tool: [
    "Knapsack or motorised sprayer",
    "Drip irrigation system",
    "Soil moisture meter",
    "ShambaIQ precision tool",
  ],
  steps: [
    {
      name: "Assess soil calcium and pH before transplanting",
      text: "Use ShambaIQ at shambaiq.com/app?county=kirinyaga&crop=tomato to check your farm's calcium status and soil pH. Mwea black cotton soils frequently show pH above 7.0 in irrigated sections — at this pH magnesium competes with calcium for root uptake and blossom end rot risk is high regardless of total soil calcium. Identify whether your farm needs gypsum (calcium sulfate) as a calcium source that does not raise pH further, or calcium nitrate as the primary season programme.",
    },
    {
      name: "Prepare raised beds to manage black cotton drainage",
      text: "Prepare raised beds 30 to 40 cm high and 1 metre wide on black cotton soils. Black cotton (vertisol) soils have very low permeability and waterlog rapidly under flood irrigation. Raised beds elevate the root zone above the waterlogged layer, maintaining root oxygen and enabling calcium transport to developing fruit. Flat planting into Mwea's black cotton soils without raised beds increases blossom end rot incidence by 40 to 60 percent even with adequate calcium fertilization.",
    },
    {
      name: "Transplant seedlings with NPK 17:17:17 in the planting hole",
      text: "Transplant 25 to 30 day old seedlings in the late afternoon or on a cloudy day to reduce transplant shock. Space at 60 cm between rows and 50 cm within rows on raised beds. Place NPK 17:17:17 at one tablespoon per hole (approximately 5 g), covered with soil before placing the seedling. This balanced NPK gives equal phosphorus for root establishment and potassium for early cell development without excess nitrogen that would promote vegetative growth at the expense of fruiting.",
    },
    {
      name: "Install drip irrigation and set moisture targets",
      text: "Install drip irrigation tape at 30 cm spacing along the bed surface before planting if possible, or immediately after transplanting. Set irrigation to maintain soil moisture at 60 to 80 percent field capacity — moist but never saturated. On black cotton soils, allow the surface to dry slightly between irrigations to maintain soil aeration. Never use overhead sprinklers on Mwea tomatoes — wet foliage in Kirinyaga's humid lowland climate guarantees late blight infection within 7 to 10 days.",
    },
    {
      name: "Apply first calcium nitrate top-dressing at flowering",
      text: "Apply calcium nitrate (Yara Winner or equivalent) at 50 kg per acre when the first flowers open, approximately 25 to 30 days after transplanting. This is the most critical intervention for blossom end rot prevention. Calcium moves to fruit tissue only through the transpiration stream — it cannot be redistributed from older plant tissues once deficiency appears in developing fruit. Starting calcium nitrate at first flower ensures calcium is available in the root zone exactly when fruit cells begin dividing.",
    },
    {
      name: "Stake plants at 30 cm height and train to single stem",
      text: "Install bamboo or eucalyptus stakes (1.5 m long) at 30 cm height when plants reach 20 to 25 cm tall. Train to a single main stem by removing all lateral shoots (suckers) below the first flower truss weekly. Single-stem training in Kirinyaga's humid conditions dramatically improves canopy airflow, reduces leaf wetness duration, and lowers late blight pressure. It also concentrates the plant's energy into fruit production rather than vegetative growth.",
    },
    {
      name: "Spray preventive copper fungicide every 7 to 10 days",
      text: "Begin copper fungicide sprays (copper oxychloride at 2.5 g per litre, or copper hydroxide at 2 g per litre) from 14 days after transplanting, before any symptoms appear. Spray every 7 to 10 days through the season, increasing to every 7 days during periods of high humidity or after rainfall. Rotate to metalaxyl at 2 g per litre if late blight symptoms appear, then return to copper for the following spray. Never rely on curative treatments alone in Kirinyaga's high-humidity Mwea conditions.",
    },
    {
      name: "Continue calcium nitrate every three weeks through harvest",
      text: "Apply calcium nitrate at 30 kg per acre every three weeks from first fruit set through the final harvest. This maintains continuous calcium availability throughout the fruiting period, which spans 6 to 8 weeks from first to last pick. Harvest individual fruits when they reach the breaker stage (first colour change) for transportation to Nairobi markets — fully ripe tomatoes deteriorate within 24 hours in Mwea's heat and do not reach market in sellable condition.",
    },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "kirinyaga-tomato", label: "Why Kirinyaga Is Central Kenya's Tomato Hub", level: 2 },
  { id: "black-cotton", label: "Black Cotton Soils — Understanding the Challenge", level: 2 },
  { id: "blossom-end-rot", label: "Blossom End Rot — The Calcium Problem Explained", level: 2 },
  { id: "soil-data", label: "Kirinyaga Soil Data for Tomatoes", level: 2 },
  { id: "varieties", label: "Best Tomato Varieties for Mwea Conditions", level: 2 },
  { id: "fertilizer", label: "Three-Stage Calcium Fertilizer Programme", level: 2 },
  { id: "disease", label: "Late Blight and Virus Management", level: 2 },
  { id: "howto", label: "Step-by-Step Growing Guide", level: 2 },
  { id: "budget", label: "Cost and Revenue Budget Per Acre", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

export default function TomatoKirinyagaPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Tomato Farming in Kirinyaga", url: `${BASE_URL}/blog/${POST.slug}` }]} />

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County Farming Guides</Link>
                <Link href="/soil/kirinyaga" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Kirinyaga County</Link>
                <Link href="/crops/tomato" className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors">Tomato</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Tomato Farming in Kirinyaga:{" "}
                <span className="text-gold-700">Maximizing Yields on Mwea's Black Cotton Soils</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                The Mwea irrigation scheme in Kirinyaga County is one of Kenya's most productive agricultural zones — and one of its most technically demanding environments for tomato production. The same black cotton soils that retain irrigation water so efficiently also create two compounding problems that most Kirinyaga farmers have never been told to connect: calcium mobility blockage that causes blossom end rot, and root oxygen depletion that invites late blight. Solve both and Kirinyaga's tomato potential is exceptional. Ignore either and the season becomes a cycle of losses that feels like bad luck but is actually predictable soil chemistry.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Ripening tomato crop on trellis in Kirinyaga County Mwea irrigation scheme. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="kirinyaga-tomato" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Kirinyaga Is Central Kenya's Tomato Hub</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kenya's tomato production is concentrated in a handful of counties, and Kirinyaga — specifically the Mwea irrigation scheme — plays an outsized role in supplying Nairobi's wholesale markets year-round. Three structural factors explain this concentration.</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Mwea irrigation scheme enables year-round production", detail: "Unlike rain-fed counties where tomato production is seasonal, the Mwea irrigation scheme's canal network allows farmers to plant in any month and produce two to three tomato cycles per year. Year-round production smooths income, allows farmers to time harvests to high-price windows, and provides banks and input suppliers with the repayment reliability needed to extend seasonal credit." },
                  { title: "Warm lowland temperatures accelerate fruit development", detail: "Kirinyaga's Mwea lowlands sit at 1,000 to 1,200 metres above sea level — significantly warmer than highland tomato-growing counties like Kiambu or Nyeri. This warmth shortens the season from transplanting to first harvest from 75 to 90 days in the highlands to 60 to 75 days in Mwea, allowing an additional crop cycle per year on the same land." },
                  { title: "Nairobi market proximity and transport infrastructure", detail: "Kirinyaga County lies 120 kilometres from Nairobi on a tarmac road — close enough for overnight transport delivering fresh tomatoes to Wakulima Market by early morning trading. This transport window is critical: tomatoes harvested at the breaker stage in the evening reach Nairobi in marketable condition. Counties more than 200 kilometres from Nairobi cannot reliably achieve this." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="black-cotton" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Black Cotton Soils — Understanding the Challenge</h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Black cotton soils — technically called vertisols — dominate the Mwea irrigation scheme and much of Kirinyaga's lowland area. They are visually impressive soils: dark, heavy, and rich in organic matter. But their physical behaviour under irrigation makes them one of the most demanding substrates for tomato production in Kenya.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { title: "What black cotton does well", items: ["High water retention — holds moisture between irrigations", "Rich in calcium, magnesium, and potassium by total analysis", "Good organic matter content supports soil biology", "High clay content buffers pH fluctuations"] },
                  { title: "What black cotton does poorly", items: ["Very low permeability — waterlogging occurs rapidly", "Swells when wet, cracks when dry — physical root stress", "Calcium mobility blocked when soil is saturated", "High magnesium competes with calcium uptake above pH 7.0"] },
                ].map((col) => (
                  <div key={col.title} className={`rounded-xl p-4 border ${col.title.includes("well") ? "bg-forest-50 border-forest-200" : "bg-red-50 border-red-200"}`}>
                    <h3 className={`font-semibold text-sm mb-3 ${col.title.includes("well") ? "text-forest-800" : "text-red-800"}`}>{col.title}</h3>
                    <ul className="space-y-1.5">
                      {col.items.map((item) => (
                        <li key={item} className={`text-xs flex items-start gap-2 ${col.title.includes("well") ? "text-forest-700" : "text-red-700"}`}>
                          <span className="mt-1 flex-shrink-0">{col.title.includes("well") ? "+" : "-"}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-soil-600 leading-relaxed">
                The management strategy for Kirinyaga tomatoes is built around compensating for exactly these weaknesses: raised beds to solve permeability, drip irrigation to solve waterlogging, and calcium nitrate to solve mobility blockage. Each intervention addresses a specific black cotton limitation rather than generic tomato advice.
              </p>
            </section>

            <section>
              <h2 id="blossom-end-rot" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Blossom End Rot — The Calcium Problem Explained</h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Blossom end rot (BER) is the single most common yield-reducing problem in Kirinyaga tomato production. It appears as a water-soaked, darkening, and eventually leathery patch on the blossom end of developing fruit — making it unmarketable regardless of size or external condition. Most farmers diagnose it as a disease and spray fungicides. It is not a disease. It is a calcium deficiency disorder, and fungicides have zero effect on it.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-5">
                <p className="text-sm font-bold text-amber-800 mb-2">The physiology behind blossom end rot</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Calcium moves through the plant exclusively via the xylem — the water-conducting tissue — driven by transpiration from leaves. It cannot be loaded into the phloem or redistributed from older tissues. Rapidly expanding fruit tissue transpires very little compared to leaves, so it competes poorly for the limited calcium stream. When calcium supply to the root is interrupted — by waterlogging that reduces root function, by high magnesium competition at elevated pH, or by irregular irrigation — the developing fruit tip is the first tissue to become calcium deficient. The cell walls collapse and the tissue dies. This damage is irreversible once it begins.
                </p>
              </div>
              <p className="text-soil-600 leading-relaxed mb-4">In Kirinyaga's black cotton soils, three simultaneous factors combine to create ideal BER conditions:</p>
              <div className="space-y-2 mb-6">
                {[
                  { n: "1", t: "Irrigation waterlogging reduces root oxygen", d: "When black cotton soil saturates, soil oxygen drops to near zero within hours. Root cells switch from aerobic to anaerobic respiration, energy production drops, and active ion transport — including calcium uptake — shuts down. Even 24 hours of waterlogging can interrupt calcium supply enough to trigger BER in fruit that began forming before the waterlogging event." },
                  { n: "2", t: "High pH above 7.0 increases magnesium competition", d: "In Mwea's irrigated soils, pH frequently rises above 7.0 due to bicarbonate accumulation from canal water. At this pH, magnesium becomes strongly available and competes directly with calcium at root uptake sites. High magnesium-to-calcium ratios in the soil solution reduce calcium uptake efficiency even when total calcium is adequate." },
                  { n: "3", t: "Rapid fruit expansion outpaces calcium supply", d: "Tomato fruit cells divide and expand very rapidly during the first three weeks after fruit set. The calcium demand during this period exceeds what can be supplied through transpiration-driven xylem flow even under good soil conditions. In black cotton soils with the two additional constraints above, the deficit becomes severe." },
                ].map((item) => (
                  <div key={item.n} className="flex gap-3 bg-white border border-cream-300 rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.n}</div>
                    <div>
                      <p className="text-sm font-semibold text-forest-800 mb-1">{item.t}</p>
                      <p className="text-xs text-soil-500 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Kirinyaga Soil Data for Tomatoes</h2>
              <p className="text-soil-600 leading-relaxed mb-5">ShambaIQ's precision soil mapping shows the following nutrient profile for Kirinyaga County's Mwea lowland area, mapped against tomato's agronomic requirements:</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Kirinyaga County Mwea soil nutrient values versus tomato requirements</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Nutrient", "Mwea Average", "Tomato Optimum", "Status", "Action"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "6.8 – 7.4", "6.0 – 6.8", "High", "Monitor — gypsum if above 7.2"],
                      ["Total Nitrogen (g/kg)", "1.6 – 2.4", "> 1.5 g/kg", "Adequate", "NPK at transplant, CaN top-dress"],
                      ["Phosphorus (mg/kg)", "10 – 22", "> 15 mg/kg", "Marginal", "NPK 17:17:17 at planting"],
                      ["Potassium (mg/kg)", "250 – 450", "> 200 mg/kg", "Good", "No K supplement needed"],
                      ["Calcium (mg/kg)", "800 – 1,800", "> 1,000 mg/kg", "Adequate – High total", "Mobility blocked — CaN essential"],
                      ["Organic Carbon (g/kg)", "18 – 28", "> 15 g/kg", "Good", "Retain crop residues"],
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
              <p className="text-xs text-soil-500 mb-4">Source: ShambaIQ precision soil mapping, 0 to 20 cm depth, Kirinyaga County Mwea lowland average. <Link href="/app?county=kirinyaga&crop=tomato" className="text-gold-700 hover:underline">Get your farm-specific calcium and pH reading here.</Link></p>
            </section>

            <section>
              <h2 id="varieties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Best Tomato Varieties for Mwea Conditions</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Variety selection for Kirinyaga must prioritise heat tolerance, humidity resistance, and virus tolerance — the three environmental stresses that distinguish Mwea's lowland conditions from highland tomato zones.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  { variety: "Kilele F1", type: "Determinate hybrid", maturity: "65 – 75 days", yield: "18 – 25 t/acre", notes: "Top choice for Mwea commercial growers. Excellent tolerance to tomato yellow leaf curl virus (TYLCV) transmitted by Bemisia tabaci whitefly. Firm fruit with long shelf life preferred by Nairobi buyers." },
                  { variety: "Cal-J F1", type: "Determinate hybrid", maturity: "70 – 80 days", yield: "20 – 28 t/acre", notes: "Highest yield potential of the recommended varieties. Strong tolerance to late blight. Large, uniform fruit with good colour — preferred for processing and export. Higher seed cost offset by superior yield." },
                  { variety: "Rio Grande", type: "Determinate OPV", maturity: "75 – 85 days", yield: "12 – 18 t/acre", notes: "Open-pollinated variety. Lower seed cost allows self-saving across seasons. Moderate late blight resistance. Suitable for farmers transitioning to commercial tomato production before investing in F1 hybrid costs." },
                  { variety: "Tengeru 97", type: "Determinate OPV", maturity: "70 – 80 days", yield: "14 – 20 t/acre", notes: "Developed in Tanzania specifically for East African conditions. Good adaptation to Mwea's humidity. Less virus tolerance than F1 hybrids but reliable performance under standard pest management." },
                ].map((v) => (
                  <div key={v.variety} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-1">{v.variety}</h3>
                    <p className="text-xs text-gold-700 font-medium mb-3">{v.type}</p>
                    <div className="space-y-1.5 text-sm mb-3">
                      {[["Maturity", v.maturity], ["Expected yield", v.yield]].map(([label, val]) => (
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
              <h2 id="fertilizer" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Three-Stage Calcium Fertilizer Programme</h2>
              <p className="text-soil-600 leading-relaxed mb-5">The fertilizer programme for Kirinyaga tomatoes is designed around the calcium mobility constraint of black cotton soils. Every stage either builds the soil phosphorus foundation, delivers continuous calcium through the fruiting window, or maintains nitrogen for steady growth without the excess that increases disease susceptibility.</p>
              <div className="space-y-3 mb-6">
                {[
                  { stage: "Stage 1 — At transplanting", product: "NPK 17:17:17 at 50 kg/acre", timing: "Day 0", detail: "Balanced NPK in the planting hole establishes the root system with equal phosphorus and potassium alongside a moderate nitrogen dose. Phosphorus drives root architecture in the first three weeks — a deep, well-branched root system is the primary defence against BER because it accesses a larger soil calcium pool. Do not use straight urea or CAN at transplanting — nitrogen without phosphorus at this stage produces weak roots that underperform through the entire season." },
                  { stage: "Stage 2 — At first flower", product: "Calcium nitrate at 50 kg/acre", timing: "Day 25–30", detail: "Switch entirely to calcium nitrate (Yara Winner, Haifa Cal, or equivalent) as the first flowers open. This delivers calcium directly to the root zone precisely as fruit cells begin dividing. The nitrogen component of calcium nitrate (approximately 15 percent N) continues supporting vegetative growth without excess. Do not use pure CAN (calcium ammonium nitrate) — despite the name it contains only 8 percent calcium oxide, insufficient to prevent deficiency on black cotton soils." },
                  { stage: "Stage 3 — Every 3 weeks through harvest", product: "Calcium nitrate at 30 kg/acre", timing: "Every 21 days from fruit set", detail: "Continue calcium nitrate applications every three weeks from first fruit set through the final harvest. Each application maintains the calcium supply to the continuous succession of fruit trusses forming above the earlier ones. Stopping calcium nitrate after the first truss sets leaves subsequent trusses without calcium support and guarantees BER on the second and third picks — the highest-volume harvest windows." },
                  { stage: "Supplemental — Foliar calcium if BER appears", product: "Calcium chloride foliar 0.4%", timing: "Immediate on first symptom", detail: "If blossom end rot appears despite the programme, spray calcium chloride at 4 g per litre directly on developing fruit trusses in the early morning. Foliar calcium is absorbed through the fruit skin and provides rapid but temporary supplementation. It does not replace soil calcium nitrate — it buys time while root uptake is corrected by addressing the underlying waterlogging or irrigation irregularity causing the deficiency." },
                ].map((item) => (
                  <div key={item.stage} className="bg-white border border-cream-300 rounded-xl p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-forest-800 text-sm">{item.stage}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-gold-50 border border-gold-200 text-gold-700 px-2.5 py-0.5 rounded-full font-medium">{item.product}</span>
                        <span className="text-xs bg-cream-100 border border-cream-300 text-soil-500 px-2.5 py-0.5 rounded-full">{item.timing}</span>
                      </div>
                    </div>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="disease" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Late Blight and Virus Management in Kirinyaga</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Beyond blossom end rot, Kirinyaga tomato farmers face two significant biological threats that require active management throughout the season.</p>
              <div className="space-y-4 mb-6">
                {[
                  {
                    threat: "Late blight (Phytophthora infestans)",
                    level: "High risk",
                    color: "red",
                    detail: "Mwea's warm, humid conditions and frequent overhead irrigation create near-ideal conditions for late blight. Lesions appear as water-soaked patches on leaves and stems that rapidly turn brown and produce white sporulation on the underside in humid conditions. A single infected plant can spread to the entire field within five to seven days. Management requires preventive copper fungicide every 7 to 10 days, drip irrigation to avoid wetting foliage, and single-stem training for canopy airflow.",
                    actions: ["Copper oxychloride 2.5 g/L every 7 to 10 days preventively", "Switch to metalaxyl 2 g/L at first symptom appearance", "Drip irrigation only — no overhead sprinklers", "Remove and destroy infected plant material immediately"],
                  },
                  {
                    threat: "Tomato yellow leaf curl virus (TYLCV)",
                    level: "Moderate risk",
                    color: "amber",
                    detail: "TYLCV is transmitted by the whitefly Bemisia tabaci and causes severe stunting, leaf yellowing, and fruit deformation with no curative treatment. Once infected, plants must be removed to prevent spread to healthy plants. Management focuses entirely on whitefly control and using TYLCV-tolerant varieties. Kilele F1 and Cal-J F1 carry the Ty gene for virus tolerance — this single trait justifies their premium seed cost in Kirinyaga's whitefly-prone environment.",
                    actions: ["Plant TYLCV-tolerant varieties (Kilele F1, Cal-J F1)", "Apply systemic insecticide (imidacloprid) at transplanting", "Use yellow sticky traps to monitor whitefly populations", "Remove and destroy any stunted, yellowing plants immediately"],
                  },
                ].map((item) => (
                  <div key={item.threat} className={`rounded-xl border p-5 ${item.color === "red" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`font-semibold text-sm ${item.color === "red" ? "text-red-800" : "text-amber-800"}`}>{item.threat}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.color === "red" ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"}`}>{item.level}</span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-3 ${item.color === "red" ? "text-red-700" : "text-amber-700"}`}>{item.detail}</p>
                    <ul className="space-y-1">
                      {item.actions.map((a) => (
                        <li key={a} className={`text-xs flex items-start gap-2 ${item.color === "red" ? "text-red-700" : "text-amber-700"}`}>
                          <span className="mt-1 flex-shrink-0">→</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-Step: Growing Tomatoes in Kirinyaga County</h2>
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
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost and Revenue Budget Per Acre — Kirinyaga Tomato 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Tomato production cost and revenue per acre Kirinyaga County Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Qty", "Unit Cost (KES)", "Total (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Certified seedlings (Kilele F1)", "14,000 plants", "3", "42,000"],
                      ["NPK 17:17:17 (50 kg bag)", "1 bag", "4,200", "4,200"],
                      ["Calcium nitrate (Yara Winner)", "80 kg total", "5,500", "8,800"],
                      ["Copper fungicide (season supply)", "6 applications", "1,500", "9,000"],
                      ["Metalaxyl fungicide (curative backup)", "2 applications", "1,800", "3,600"],
                      ["Insecticide (whitefly control)", "4 applications", "900", "3,600"],
                      ["Bamboo stakes (1,400 stakes)", "1,400", "20", "28,000"],
                      ["Drip irrigation tape", "per acre", "12,000", "12,000"],
                      ["Labour — land prep and bed forming", "4 days", "500", "2,000"],
                      ["Labour — transplanting and staking", "5 days", "500", "2,500"],
                      ["Labour — spraying and top-dressing", "8 days", "500", "4,000"],
                      ["Labour — harvesting (weekly picks)", "10 days", "500", "5,000"],
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
                      <td className="px-4 py-3 font-bold">KES 124,700</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-gold-800">Expected Revenue (20 t x KES 30/kg at Nairobi wholesale)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 600,000</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-green-800">Net Margin</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 475,300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Drip irrigation cost amortises over 3 to 4 seasons — Year 2 onwards input cost drops by KES 12,000. Tomato price assumes off-peak season; long rains harvest prices can drop to KES 15 to 20/kg. Find <Link href="/dealers/kirinyaga" className="text-gold-700 hover:underline">Kirinyaga agrovets and current calcium nitrate prices here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ checks your Kirinyaga farm's soil pH and calcium status and calculates your calcium nitrate top-dressing intervals to keep blossom end rot out of every truss. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Kirinyaga Tomato Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/kirinyaga", label: "Kirinyaga County Soil Report" },
                  { href: "/crops/tomato", label: "Tomato Crop Guide — All Counties" },
                  { href: "/soil/kirinyaga/beans", label: "Beans in Kirinyaga — Rotation Crop" },
                  { href: "/soil/murang-a/tomato", label: "Tomato in Muranga — Compare" },
                  { href: "/dealers/kirinyaga", label: "Agrovets in Kirinyaga County" },
                  { href: "/zones/central-highlands", label: "Central Highlands Agroecological Zone" },
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Kirinyaga Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Central Kenya Lowland"], ["Altitude", "1,000 – 1,200 m (Mwea)"], ["Avg Rainfall", "900 – 1,100 mm/yr"], ["Irrigation", "Mwea Scheme (canal)"], ["Dominant Soil", "Black cotton (vertisol)"], ["Avg Soil pH", "6.8 – 7.4"], ["Ca Status", "High total — low mobility"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/kirinyaga" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:text-gold-700 transition-colors">Full Kirinyaga Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "murang-a", name: "Muranga" }, { slug: "nyeri", name: "Nyeri" }, { slug: "embu", name: "Embu" }, { slug: "meru", name: "Meru" }].map(({ slug, name }) => (
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
