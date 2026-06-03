import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("wheat-farming-uasin-gishu-yield-guide")!;

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
  { name: "Wheat farming in uasin gishu", url: `${BASE_URL}/blog/${POST.slug}` },
]);

const faqSchema = makeFAQSchema([
  {
    question: "What is the best fertilizer for wheat in Uasin Gishu?",
    answer: "Uasin Gishu wheat requires a phosphorus-heavy basal fertilizer at planting due to the county's characteristically low extractable phosphorus of 8 to 18 mg/kg. Apply DAP at 75 kg per acre (1.5 bags) at planting, followed by CAN at 50 kg per acre at tillering stage, approximately 30 to 35 days after emergence. High-phosphorus planting compound is non-negotiable — phosphorus drives root development and tiller initiation, both of which directly determine grain yield. Get a farm-specific recommendation at shambaiq.com/app?county=uasin-gishu&crop=wheat.",
  },
  {
    question: "What wheat varieties grow best in Uasin Gishu?",
    answer: "Kenya Fahari and Kenya Shindo are the two KEPHIS-recommended varieties for the Uasin Gishu plateau. Kenya Fahari matures in 120 to 130 days and produces 18 to 24 bags per acre under good management. Kenya Shindo is shorter-season at 110 to 120 days and performs well when short rains arrive late. Eagle 10 is a newer release with higher stem rust tolerance and is gaining adoption among commercial farmers around Eldoret. All three require KEPHIS certification — avoid uncertified seed sold in open bags at markets.",
  },
  {
    question: "How many bags of wheat per acre in Uasin Gishu?",
    answer: "Under a full fertilizer programme with certified seed, Uasin Gishu wheat yields 18 to 26 bags (90 kg each) per acre. The current smallholder average is 10 to 14 bags due to phosphorus underfertilization at planting and delayed top-dressing. Commercial farmers using precision inputs consistently achieve the upper end of this range. The ShambaIQ tool calculates a yield estimate based on your specific soil phosphorus and nitrogen levels.",
  },
  {
    question: "When should I plant wheat in Uasin Gishu?",
    answer: "The primary wheat planting window for Uasin Gishu is March to April at the start of the long rains. The plateau's cool temperatures of 10 to 22 degrees Celsius during this period are ideal for germination and early growth. A secondary planting in September to October is possible but yields are lower and rust pressure is higher in the short rains season. Plant into moist soil — dry planting into dusty seedbeds causes poor establishment and uneven emergence.",
  },
  {
    question: "What diseases affect wheat in Uasin Gishu and how do I control them?",
    answer: "Stem rust (Puccinia graminis) and yellow stripe rust (Puccinia striiformis) are the two primary disease threats on the Uasin Gishu plateau. Both spread rapidly in the cool, humid conditions of the long rains. Use rust-tolerant varieties as the first line of defence — Eagle 10 and Kenya Fahari both carry improved rust resistance. Apply a propiconazole-based fungicide preventively at tillering (Tilt or equivalent) before visible symptoms appear. Curative application after infection is significantly less effective.",
  },
  {
    question: "Is wheat profitable in Uasin Gishu for a smallholder?",
    answer: "At current NCPB buying prices of KES 3,200 to 3,800 per 90 kg bag, a smallholder achieving 20 bags per acre generates KES 64,000 to 76,000 revenue against input costs of approximately KES 22,000 per acre. Net margin of KES 42,000 to 54,000 per acre compares favourably with maize at similar yield levels. The key constraint is the higher seed rate and more demanding fertilizer programme — wheat does not tolerate the nutrient shortcuts that maize occasionally does.",
  },
]);

const howToSchema = makeHowToSchema({
  name: "How to grow wheat in uasin gishu county — precision fertilizer and disease management guide",
  description: "A data-driven step-by-step guide to growing high-yield wheat on the Uasin Gishu plateau, covering soil preparation, phosphorus fertilization, tillering management, and rust control.",
  totalTime: "P130D",
  estimatedCost: { currency: "KES", value: "18000–24000 per acre" },
  supply: [
    "KEPHIS-certified wheat seed (Kenya Fahari, Kenya Shindo, or Eagle 10)",
    "DAP fertilizer (75 kg per acre — 1.5 bags)",
    "CAN fertilizer (50 kg per acre at tillering)",
    "Propiconazole fungicide (Tilt or equivalent)",
    "Pre-emergence herbicide (Brominal or Pallas)",
  ],
  tool: [
    "Seed drill or hand jab planter",
    "Tractor or ox plough",
    "Knapsack or boom sprayer",
    "ShambaIQ precision tool",
  ],
  steps: [
    {
      name: "Check soil phosphorus before buying any inputs",
      text: "Use ShambaIQ at shambaiq.com/app?county=uasin-gishu&crop=wheat to get your farm's exact phosphorus reading. Uasin Gishu's clay loam soils characteristically hold phosphorus tightly — extractable phosphorus of 8 to 18 mg/kg is common across Eldoret and Moiben divisions. This is below wheat's minimum requirement of 20 mg/kg and is the primary reason yields stall at 10 to 14 bags despite adequate rainfall.",
    },
    {
      name: "Plough to 20 cm and form a fine tilth",
      text: "Plough to 20 cm depth at least two weeks before planting to break up the clay loam structure. Wheat requires a finer seedbed than maize — clods larger than 2 cm prevent seed-to-soil contact and result in patchy emergence. If tractor-ploughed, harrow twice to achieve a crumbly, fine surface. On the Eldoret plateau where compaction from machinery is common, sub-soil if hardpan is detected at 15 to 20 cm depth.",
    },
    {
      name: "Apply DAP at 1.5 bags per acre in the seed furrow",
      text: "Apply DAP at 75 kg per acre (1.5 x 50 kg bags) directly into the seed furrow at a depth of 5 to 7 cm, covered with 2 to 3 cm of soil before placing seed. The higher DAP rate than standard maize recommendations reflects Uasin Gishu's specific phosphorus deficiency. Never reduce this to one bag to save cost — phosphorus at planting is the single highest-return investment in Uasin Gishu wheat and cannot be compensated by later top-dressing.",
    },
    {
      name: "Drill certified seed at the correct seed rate",
      text: "Drill certified wheat seed at 50 kg per acre (approximately 100 seeds per square metre) using a seed drill or jab planter at 15 to 20 cm row spacing and 2 to 3 cm seed depth. Plant in March to April into moist soil. Seed drills give more uniform emergence and depth consistency than broadcasting — uneven emergence creates mixed maturity stages at harvest that reduce combine efficiency and grain quality.",
    },
    {
      name: "Apply pre-emergence broadleaf herbicide within 5 days",
      text: "Apply a selective broadleaf herbicide (Brominal or equivalent) within five days of planting on moist soil. Wild oat (Avena fatua) and broadleaf weeds are the primary weed threats on the Uasin Gishu plateau. Wild oat in particular is highly competitive with wheat at the tillering stage and can reduce yields by 30 to 50 percent at high infestation densities. For wild oat-specific control, Pallas 45OD at post-emergence is the most effective registered option.",
    },
    {
      name: "Apply CAN top-dressing at tillering — day 30 to 35",
      text: "Apply CAN at 50 kg per acre when wheat reaches the tillering stage, approximately 30 to 35 days after emergence. Tillering is the yield-determining stage for wheat — each additional productive tiller contributes directly to the final grain count. Nitrogen delivered at this stage promotes maximum tiller number. Applying CAN too early before tillering begins wastes nitrogen to leaching. Applying too late after the tillering window reduces tiller number irreversibly.",
    },
    {
      name: "Apply preventive fungicide at tillering",
      text: "Apply propiconazole (Tilt 250 EC at 500 ml per acre) at the tillering stage alongside or immediately after CAN application. This is a preventive application — applied before rust symptoms are visible. On the Uasin Gishu plateau where stem rust and yellow rust pressure is consistent during the long rains, waiting until visible infection to apply fungicide is significantly less effective than preventive treatment. One preventive application protects through grain fill.",
    },
    {
      name: "Harvest at correct grain moisture — below 14 percent",
      text: "Harvest when grain moisture is below 14 percent, typically 120 to 130 days after planting. On the Uasin Gishu plateau where morning dew is common, combine harvesting should begin after 10 am when surface moisture has dried. Harvesting at above 14 percent moisture risks mycotoxin development during storage and reduces NCPB acceptance. Dry grain in thin layers on tarpaulins before bagging if field moisture is above target.",
    },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "uasin-gishu-wheat", label: "Why uasin gishu dominates Kenya's wheat belt", level: 2 },
  { id: "soil-data", label: "Soil data — the phosphorus deficiency problem", level: 2 },
  { id: "varieties", label: "Certified wheat varieties for the plateau", level: 2 },
  { id: "fertilizer", label: "Phosphorus-first fertilizer programme", level: 2 },
  { id: "disease", label: "Rust disease management", level: 2 },
  { id: "planting-calendar", label: "Planting calendar for uasin gishu", level: 2 },
  { id: "howto", label: "Step-by-step growing guide", level: 2 },
  { id: "budget", label: "Cost and revenue budget per acre", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function WheatUasinGishuPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Wheat farming in uasin gishu", url: `${BASE_URL}/blog/${POST.slug}` }]} />

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />

            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County farming guides</Link>
                <Link href="/soil/uasin-gishu" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Uasin Gishu County</Link>
                <Link href="/crops/wheat" className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors">Wheat</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Wheat farming in uasin gishu:{" "}
                <span className="text-gold-700">Data-driven yield maximization on the Eldoret plateau</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Uasin Gishu County produces more wheat than any other county in Kenya. The Eldoret plateau's cool temperatures, reliable long rains, and heavy clay loam soils create conditions that suit wheat better than almost any other food crop. Yet phosphorus deficiency — consistent, measurable, and almost universally undercorrected — is quietly suppressing yields across the plateau. The difference between 12 bags per acre and 24 bags per acre on the same farm, in the same season, often comes down to one bag of DAP applied correctly at planting.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Golden wheat ready for harvest on the Uasin Gishu plateau near Eldoret. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="uasin-gishu-wheat" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why uasin gishu dominates Kenya's wheat belt</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kenya imports approximately 80 percent of its wheat consumption, making domestic wheat production both a food security priority and a significant commercial opportunity. Uasin Gishu — centred on Eldoret at 2,100 metres above sea level — accounts for over 40 percent of Kenya's domestic wheat harvest, making it the single most important wheat-producing county in the country.</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Cool plateau temperatures suit wheat's temperature requirements", detail: "Wheat is a cool-season cereal requiring temperatures of 10 to 24 degrees Celsius for germination and grain fill. Uasin Gishu's plateau climate averages 14 to 21 degrees during the long rains planting window — precisely within this range. Temperatures above 30 degrees during grain fill cause heat sterility that collapses yield regardless of inputs. The plateau's altitude protects against this risk entirely." },
                  { title: "Clay loam soils retain moisture through dry spells", detail: "The Eldoret plateau's heavy clay loam soils hold significantly more plant-available water than the sandy loams common in lower-altitude counties. This buffering capacity means wheat can bridge short dry spells within the long rains season without the wilting and grain shrivelling that occurs on lighter-textured soils. The same clay loam texture that makes the soil difficult to till also makes it resilient under variable rainfall." },
                  { title: "NCPB buying infrastructure supports a guaranteed market", detail: "The National Cereals and Produce Board maintains active buying depots in Eldoret and across Uasin Gishu, providing a guaranteed offtake market at published floor prices. This market certainty reduces the price risk that discourages smallholder investment in inputs — a critical factor in achieving the higher fertilizer rates that the soil's phosphorus deficiency requires." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Soil data — the phosphorus deficiency problem</h2>
              <p className="text-soil-600 leading-relaxed mb-5">ShambaIQ's precision soil mapping reveals a consistent and yield-limiting pattern across Uasin Gishu: the clay loam soils that make the plateau so good at holding moisture also bind phosphorus tightly in forms that plant roots cannot access. This phosphorus fixation is not caused by low organic carbon or acidity — it is a structural property of the clay mineralogy itself. More DAP at planting is the only correction.</p>

              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Uasin Gishu County soil nutrient values versus wheat requirements</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Nutrient", "Uasin gishu average", "Wheat optimum", "Status", "Implication"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "5.5 – 6.2", "6.0 – 7.0", "Low – Adequate", "Lime if below 5.8"],
                      ["Total Nitrogen (g/kg)", "1.8 – 2.8", "> 1.5 g/kg", "Good", "CAN at tillering sufficient"],
                      ["Phosphorus (mg/kg)", "8 – 18", "> 20 mg/kg", "Deficient", "1.5 bags DAP at planting essential"],
                      ["Potassium (mg/kg)", "200 – 380", "> 120 mg/kg", "Sufficient", "No K supplement needed"],
                      ["Organic Carbon (g/kg)", "20 – 35", "> 15 g/kg", "Good", "Retain straw after harvest"],
                      ["Soil Texture", "Clay loam", "Loam to clay loam", "Good", "Fine tilth required at planting"],
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
              <p className="text-xs text-soil-500 mb-5">Source: ShambaIQ precision soil mapping, 0 to 20 cm depth, Uasin Gishu County average. <Link href="/app?county=uasin-gishu&crop=wheat" className="text-gold-700 hover:underline">Get your farm-specific phosphorus reading here.</Link></p>

              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">Why Phosphorus Fixation Happens in Clay Loam Soils</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Clay minerals — particularly the iron and aluminium oxides common in Uasin Gishu's volcanic-derived soils — have a strong chemical affinity for phosphate ions. When DAP dissolves in soil water, phosphate immediately begins reacting with these mineral surfaces to form insoluble iron and aluminium phosphate compounds. At 8 to 12 mg/kg extractable phosphorus, the soil has already consumed most of its fixation capacity and new applications become more efficient. This is why the higher DAP rate at planting — 75 kg rather than 50 kg per acre — is necessary to overcome fixation and leave enough phosphorus available for roots to absorb.
                </p>
              </div>
            </section>

            <section>
              <h2 id="varieties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Certified wheat varieties for the uasin gishu plateau</h2>
              <p className="text-soil-600 leading-relaxed mb-5">KEPHIS certifies three primary wheat varieties for the Uasin Gishu altitude band. All three are bred specifically for the East African highland environment and carry resistance profiles suited to the rust pressure common on the plateau.</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                {[
                  { variety: "Kenya Fahari", maturity: "120 – 130 days", yield: "18 – 24 bags/acre", rust: "Moderate resistance", notes: "The most widely grown variety in Uasin Gishu. Reliable yield, good grain quality accepted by NCPB and millers. Long season suits the full long rains window." },
                  { variety: "Kenya Shindo", maturity: "110 – 120 days", yield: "16 – 22 bags/acre", rust: "Good resistance", notes: "Shorter season variety. Best choice when long rains arrive late or when planning to follow with a potato or bean crop in the same season." },
                  { variety: "Eagle 10", maturity: "115 – 125 days", yield: "20 – 26 bags/acre", rust: "High resistance", notes: "Newer release. Higher stem rust tolerance than Kenya Fahari. Gaining adoption among commercial farmers. Premium grain size preferred by millers." },
                ].map((v) => (
                  <div key={v.variety} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-3">{v.variety}</h3>
                    <div className="space-y-1.5 text-sm mb-3">
                      {[["Maturity", v.maturity], ["Yield", v.yield], ["Rust resistance", v.rust]].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between gap-2">
                          <span className="text-soil-500">{label}</span>
                          <span className="font-medium text-forest-700 text-right text-xs">{val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-soil-500 border-t border-cream-200 pt-2">{v.notes}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="fertilizer" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Phosphorus-first fertilizer programme for uasin gishu wheat</h2>
              <p className="text-soil-600 leading-relaxed mb-5">Wheat has a narrower fertilization window than maize. Phosphorus must be in the seed zone at germination — it cannot be remedied after emergence. Nitrogen must be delivered precisely at tillering — too early it leaches before the crop can use it, too late the tiller number is already fixed. The two-stage programme below maps to these biological windows.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Fertilizer programme for wheat in Uasin Gishu County Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Stage", "Fertilizer", "Rate per acre", "Timing", "Purpose"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Basal", "DAP 18:46:0", "75 kg (1.5 bags)", "At planting — in seed furrow", "Overcome phosphorus fixation, drive root and tiller development"],
                      ["Top-dressing", "CAN 26%", "50 kg (1 bag)", "Tillering — day 30 to 35", "Maximise productive tiller number and grain count"],
                      ["Preventive", "Propiconazole (Tilt)", "500 ml per acre", "At tillering alongside CAN", "Protect against stem rust and stripe rust through grain fill"],
                    ].map(([stage, fert, rate, timing, purpose], i) => (
                      <tr key={stage as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{stage}</td>
                        <td className="px-4 py-3 font-mono text-xs text-soil-500">{fert}</td>
                        <td className="px-4 py-3 text-soil-600">{rate}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{timing}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="disease" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Rust disease management on the uasin gishu plateau</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Rust diseases are the primary biological constraint on wheat yields in Uasin Gishu. Stem rust (Puccinia graminis Ug99 race) and stripe rust (Puccinia striiformis) both thrive in the plateau's cool, humid long rains conditions. A severe rust epidemic can destroy 50 to 80 percent of yield in an unprotected field within three weeks of initial infection. Management requires two simultaneous lines of defence.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { title: "Line 1 — Variety resistance", body: "Planting a rust-resistant variety is the most cost-effective protection. Eagle 10 carries the strongest current resistance profile for Uasin Gishu. Kenya Fahari has moderate resistance that holds under normal rust pressure. Avoid older varieties like Duma and Mbuni that carry minimal rust resistance — these were bred before the Ug99 stem rust race became dominant in the region." },
                  { title: "Line 2 — Preventive fungicide at tillering", body: "Apply propiconazole at 500 ml per acre (Tilt 250 EC or equivalent) at the tillering stage before symptoms appear. Propiconazole is both preventive and curative, but its efficacy drops significantly once infection is established. A single preventive application at tillering protects through grain fill. Waiting until visible pustules appear means the infection is already systemic in the leaf tissue." },
                ].map((item) => (
                  <div key={item.title} className="bg-forest-50 border border-forest-200 rounded-xl p-5">
                    <h3 className="font-semibold text-forest-800 mb-2 text-sm">{item.title}</h3>
                    <p className="text-sm text-forest-700 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-800 mb-2">Ug99 Stem Rust — Why Resistance Matters in Uasin Gishu</p>
                <p className="text-sm text-red-700 leading-relaxed">The Ug99 race of stem rust, first identified in Uganda in 1999, spread to Kenya's wheat-growing areas by the mid-2000s and continues to evolve new virulence variants. It defeated the Sr31 resistance gene that protected most commercially grown wheat globally, and it spread rapidly through the highland corridor that connects Uganda to Uasin Gishu via Mount Elgon. Varieties released before 2008 should be assumed susceptible unless KEPHIS specifically certifies Ug99 resistance. Eagle 10 and Kenya Fahari were both released after the Ug99 era and carry updated resistance packages.</p>
              </div>
            </section>

            <section>
              <h2 id="planting-calendar" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Planting calendar for uasin gishu</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-6">
                <table className="w-full text-sm">
                  <caption className="sr-only">Wheat planting calendar for Uasin Gishu County Kenya 2026</caption>
                  <thead className="bg-cream-200">
                    <tr>{["Season", "Land prep", "Plant", "Top-dress and spray", "Harvest", "Best variety"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs text-forest-800 uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-forest-700">Long Rains (primary)</td>
                      <td className="px-4 py-3">Jan – Feb</td>
                      <td className="px-4 py-3">March – April</td>
                      <td className="px-4 py-3">April – May</td>
                      <td className="px-4 py-3">July – Aug</td>
                      <td className="px-4 py-3">Kenya Fahari, Eagle 10</td>
                    </tr>
                    <tr className="bg-cream-50">
                      <td className="px-4 py-3 font-semibold text-forest-700">Short Rains (secondary)</td>
                      <td className="px-4 py-3">Aug</td>
                      <td className="px-4 py-3">Sep – Oct</td>
                      <td className="px-4 py-3">Oct – Nov</td>
                      <td className="px-4 py-3">Jan – Feb</td>
                      <td className="px-4 py-3">Kenya Shindo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-step: growing wheat in uasin gishu county</h2>
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
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost and revenue budget per acre — uasin gishu wheat 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Wheat production cost and revenue per acre Uasin Gishu County Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Qty", "Unit cost (KES)", "Total (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Certified wheat seed (Kenya Fahari)", "50 kg", "80", "4,000"],
                      ["DAP fertilizer (50 kg bags x1.5)", "75 kg", "76", "5,700"],
                      ["CAN fertilizer (50 kg bag)", "50 kg", "3,200", "3,200"],
                      ["Propiconazole fungicide (Tilt)", "500 ml", "1,800", "1,800"],
                      ["Pre-emergence herbicide (Brominal)", "1 litre", "1,200", "1,200"],
                      ["Labour — ploughing and harrowing", "1 tractor day", "2,500", "2,500"],
                      ["Labour — drilling or planting", "2 days", "500", "1,000"],
                      ["Labour — top-dressing and spraying", "2 days", "500", "1,000"],
                      ["Labour — harvesting (combine hire)", "1 acre", "4,500", "4,500"],
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
                      <td className="px-4 py-3 font-bold">KES 24,900</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-gold-800">Expected revenue (22 bags x KES 3,500 per 90 kg bag)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 77,000</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-green-800">Net margin</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 52,100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Combine hire cost applies to farms above 2 acres — smaller plots use manual harvest. NCPB floor price used for revenue calculation. Find <Link href="/dealers/uasin-gishu" className="text-gold-700 hover:underline">Uasin Gishu agrovets and current input prices here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ calculates your exact phosphorus deficit, DAP requirement, and full fertilizer budget based on your farm's precise soil data from the Uasin Gishu plateau. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Uasin Gishu Wheat Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/uasin-gishu", label: "Uasin gishu county soil report" },
                  { href: "/crops/wheat", label: "Wheat crop guide — all counties" },
                  { href: "/blog/nakuru-vs-uasin-gishu-best-county-wheat", label: "Nakuru vs uasin gishu — wheat comparison" },
                  { href: "/soil/uasin-gishu/maize", label: "Maize in uasin gishu — rotation crop" },
                  { href: "/dealers/uasin-gishu", label: "Agrovets in uasin gishu county" },
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Uasin gishu quick facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Rift Valley Plateau"], ["Altitude", "1,900 – 2,400 m"], ["Avg Rainfall", "900 – 1,100 mm/yr"], ["Dominant Soil", "Clay loam"], ["Avg Soil pH", "5.5 – 6.2"], ["P Status", "Deficient"], ["K Status", "Sufficient"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500">{k}</span>
                      <span className="font-medium text-forest-700 text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/uasin-gishu" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:text-gold-700 transition-colors">Full Uasin Gishu Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "trans-nzoia", name: "Trans nzoia" }, { slug: "nandi", name: "Nandi" }, { slug: "elgeyo-marakwet", name: "Elgeyo marakwet" }, { slug: "baringo", name: "Baringo" }].map(({ slug, name }) => (
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
