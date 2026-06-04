import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import {
  makeArticleSchema,
  makeBreadcrumbSchema,
  makeFAQSchema,
  makeHowToSchema,
  BASE_URL,
  WEBSITE_SCHEMA,
  ORGANIZATION,
} from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE: /blog/sweet-potato-farming-homa-bay
// CALENDAR: Day 16–18 | seo_content_calendar.xlsx + ShambaIQ_SEO_Strategy.md
// INTENT: Informational & Sustainable
// FOCUS KW: "sweet potato farming Homa Bay"
// ─────────────────────────────────────────────────────────────────────────────

const POST = getPostBySlug("sweet-potato-farming-homa-bay")!;

// ── 1. Next.js Metadata (title, meta description, OG, Twitter, canonical, hreflang) ──

export const metadata: Metadata = {
  // ── Title: 30–60 chars, keyword-first (SEO checklist item 1) ──
  title: POST.metaTitle,

  // ── Meta description: 80–160 chars, contains focus keyword (checklist item 2) ──
  description: POST.metaDescription,

  // ── Canonical ──
  alternates: {
    canonical: `${BASE_URL}/blog/${POST.slug}`,
    languages: {
      "sw-KE": `${BASE_URL}/sw/blogu/kilimo-cha-viazi-vitamu-homa-bay`,
      "en-KE": `${BASE_URL}/blog/${POST.slug}`,
    },
  },

  // ── Open Graph ──
  openGraph: {
    type: "article",
    url: `${BASE_URL}/blog/${POST.slug}`,
    title: POST.metaTitle,
    description: POST.metaDescription,
    images: [
      {
        url: `${BASE_URL}${POST.image}`,
        width: 1200,
        height: 630,
        alt: POST.imageAlt,
      },
    ],
    publishedTime: POST.datePublished,
    modifiedTime: POST.dateModified,
    authors: [`${BASE_URL}/about`],
    section: POST.section,
    tags: POST.secondaryKeywords,
    siteName: "ShambaIQ",
    locale: "en_KE",
  },

  // ── Twitter / X Card ──
  twitter: {
    card: "summary_large_image",
    site: "@shambaiq_ke",
    creator: "@polycarp_agri",
    title: POST.metaTitle,
    description: POST.metaDescription,
    images: [`${BASE_URL}${POST.image}`],
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },

  // ── Keywords (supplementary signal) ──
  keywords: [POST.focusKeyword, ...POST.secondaryKeywords, ...(POST.kiswahiliKeywords ?? [])],

  // ── Author ──
  authors: [{ name: "Polycarp Andabwa", url: `${BASE_URL}/about` }],
};

// ── 2. Structured Data Schemas ────────────────────────────────────────────────

const articleSchema = makeArticleSchema({
  headline: POST.title,
  description: POST.metaDescription,
  slug: POST.slug,
  datePublished: POST.datePublished,
  dateModified: POST.dateModified,
  image: POST.image,
  keywords: [POST.focusKeyword, ...POST.secondaryKeywords],
  wordCount: POST.wordCount,
  section: POST.section,
});

const breadcrumbSchema = makeBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` },
  { name: POST.title, url: `${BASE_URL}/blog/${POST.slug}` },
]);

const faqSchema = makeFAQSchema([
  {
    question: "What is the best fertilizer for sweet potatoes in Homa Bay?",
    answer:
      "In Homa Bay's sandy-loam soils, sweet potatoes need high-potassium, low-nitrogen fertilizer. Mavuno Sweet Potato (a compound fertilizer with elevated K) is ideal at 50 kg per acre at planting. Avoid urea or CAN top-dressing — excess nitrogen pushes leafy growth at the expense of tuber development. Check your county-specific recommendation at shambaiq.com/app?county=homa-bay&crop=sweet-potato.",
  },
  {
    question: "What type of soil do sweet potatoes need in Kenya?",
    answer:
      "Sweet potatoes thrive in well-drained, loose sandy-loam soils with a pH between 5.5 and 6.5 and good aeration for tuber expansion. Homa Bay's Lake Victoria shore soils are naturally sandy-loam and well-suited. Heavy clay soils restrict tuber growth and increase rotting risk. Waterlogged soils cause root rot and should be avoided or drained.",
  },
  {
    question: "How many bags of sweet potatoes can I harvest per acre in Homa Bay?",
    answer:
      "With optimal potassium fertilization and orange-fleshed certified varieties (Kabode, SPK004), Homa Bay farmers can expect 8–12 tonnes per acre (roughly 160–240 x 50 kg bags). Poor potassium nutrition halves this. The ShambaIQ tool at shambaiq.com/app provides a yield estimate based on your actual soil nutrient levels.",
  },
  {
    question: "Why do my sweet potatoes have small tubers despite healthy leaves?",
    answer:
      "Over-lush green foliage with tiny tubers is the classic sign of excess nitrogen. Nitrogen drives vegetative (leaf and vine) growth, not tuber development. This is common when farmers apply urea or CAN intended for maize to their sweet potato rotation without adjusting the fertilizer type. Switch to a high-K compound and avoid nitrogen top-dressing after the first 3 weeks.",
  },
  {
    question: "Is sweet potato a good rotation crop after maize in Homa Bay?",
    answer:
      "Yes — it is one of the best rotations for Homa Bay. Maize is a heavy nitrogen feeder and leaves residual organic matter. Sweet potatoes fix no nitrogen themselves but benefit from residual soil nitrogen while contributing organic matter from vine mulch. The rotation also breaks the striga weed cycle common in continuous maize. ShambaIQ recommends a maize → sweet potato → beans three-crop rotation for Homa Bay soils.",
  },
  {
    question: "What are the best sweet potato varieties in Kenya?",
    answer:
      "Kenya Plant Health Inspectorate (KEPHIS)-certified orange-fleshed varieties recommended for Western Kenya include: Kabode (high beta-carotene, drought-tolerant), SPK004/Vita (sweetest, preferred for fresh market), and Kakamega Farmer Choice. White-fleshed varieties like Tanzania and White Star have higher dry matter and suit the chips/crisps market. Avoid uncertified planting material which carries virus disease.",
  },
]);

const howToSchema = makeHowToSchema({
  name: "How to grow sweet potatoes in Homa Bay — step-by-step guide",
  description:
    "A science-backed planting guide for orange-fleshed sweet potatoes on Homa Bay's sandy-loam Lake Victoria soils using ShambaIQ precision data nutrient data.",
  totalTime: "P90D",
  estimatedCost: { currency: "KES", value: "4500–6000 per acre" },
  supply: [
    "KEPHIS-certified orange-fleshed sweet potato vines",
    "Mavuno Sweet Potato fertilizer (50 kg/acre)",
    "Agricultural lime (if pH < 5.5)",
    "Organic compost or farmyard manure",
  ],
  tool: [
    "Hand hoe or ox plough",
    "Watering can or drip line",
    "Soil thermometer (optional)",
    "ShambaIQ precision tool (shambaiq.com/app)",
  ],
  steps: [
    {
      name: "Test your soil and get a nutrient baseline",
      text: "Run your Homa Bay farm location through the ShambaIQ tool at shambaiq.com/app?county=homa-bay&crop=sweet-potato. This gives you precision satellite soil data for your exact location — pH, potassium, nitrogen, and phosphorus — so you know your exact fertilizer deficit before buying anything.",
    },
    {
      name: "Prepare land: plough deep and build ridges",
      text: "Sweet potato tubers need loose, aerated soil to expand. Plough to 30 cm depth. Form ridges 1 m apart and 30 cm high for good drainage and tuber room. On Homa Bay's sandy soils, ridges also reduce soil erosion during Lake Victoria rainfall events.",
    },
    {
      name: "Apply basal fertilizer at planting",
      text: "Apply Mavuno Sweet Potato at 50 kg per acre into the ridge at planting. Do NOT use DAP (too high in nitrogen and phosphorus relative to potassium). Do NOT use CAN or Urea at this stage. If your ShambaIQ result shows pH below 5.5, incorporate 300–500 kg agricultural lime per acre 2 weeks before planting.",
    },
    {
      name: "Plant certified vine cuttings",
      text: "Plant certified KEPHIS vine cuttings (15–20 cm) at 30 cm spacing on ridges. Bury at least 2 nodes. Plant at the onset of rains — March/April for long rains, October for short rains. Avoid planting during dry spells as vine establishment fails without moisture in sandy soils.",
    },
    {
      name: "Weed at 2 and 6 weeks — then let vines cover",
      text: "Weed thoroughly at 2 and 6 weeks after planting. After 6 weeks the vine canopy suppresses weeds naturally — do not disturb ridges after this point or you risk breaking developing tubers from the root system.",
    },
    {
      name: "No nitrogen top-dressing",
      text: "Do not apply CAN, Urea, or any nitrogen-rich top-dresser after planting. This is the single most common mistake in Homa Bay sweet potato production. Nitrogen pushes vine and leaf growth at the direct expense of tuber bulking. Your Mavuno basal fertilizer provides sufficient nutrients for the full season.",
    },
    {
      name: "Harvest at 3–4 months",
      text: "Harvest when vines begin yellowing and dying back (90–120 days). Check tuber size by gently digging one ridge first. Delay harvest past 120 days risks cracking and increased starch-to-sugar conversion which reduces market value. Target early-morning harvest to reduce field heat damage on the Lake Victoria lowlands.",
    },
  ],
});

// ── 3. Table of Contents ──────────────────────────────────────────────────────

const TOC_ITEMS: TOCItem[] = [
  { id: "why-homa-bay", label: "Why Homa Bay is ideal for sweet potatoes", level: 2 },
  { id: "soil-data", label: "Homa Bay soil data (ShambaIQ precision data)", level: 2 },
  { id: "nitrogen-mistake", label: "The nitrogen mistake halving your yields", level: 2 },
  { id: "fertilizer-guide", label: "Fertilizer guide: what to use and when", level: 2 },
  { id: "varieties", label: "Best certified varieties for Western Kenya", level: 2 },
  { id: "planting-calendar", label: "Planting calendar for Homa Bay", level: 2 },
  { id: "rotation", label: "Maize–sweet potato rotation strategy", level: 2 },
  { id: "howto", label: "Step-by-step growing guide", level: 2 },
  { id: "budget", label: "Budget: KES cost per acre", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

// ── 4. Page Component ─────────────────────────────────────────────────────────

export default function SweetPotatoHomaBayPage() {
  const relatedPosts = getRelatedPosts(POST, 3);

  return (
    <>
      {/* ── JSON-LD Schema Stack ── */}
      <JsonLd
        schemas={[
          WEBSITE_SCHEMA,
          ORGANIZATION,
          articleSchema,
          breadcrumbSchema,
          faqSchema,
          howToSchema,
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Breadcrumbs ── */}
        <Breadcrumbs
          items={[
            { name: "Home", url: BASE_URL },
            { name: "Blog", url: `${BASE_URL}/blog` },
            { name: "County farming guides", url: `${BASE_URL}/blog?category=county-farming-guides` },
            { name: "Sweet potato farming Homa Bay", url: `${BASE_URL}/blog/${POST.slug}` },
          ]}
        />

        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">

          {/* ── Main Article ── */}
          <article itemScope itemType="https://schema.org/BlogPosting">

            {/* Hidden meta for Microdata ── (belt-and-suspenders with JSON-LD) */}
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />

            {/* ── Post Header ── */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href="/blog?category=county-farming-guides"
                  className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors"
                >
                  County farming guides
                </Link>
                <Link
                  href={`/soil/homa-bay`}
                  className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors"
                >
                  Homa Bay County
                </Link>
                <Link
                  href={`/crops/sweet-potato`}
                  className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors"
                >
                  Sweet potato
                </Link>
              </div>

              {/* H1 — contains focus keyword in first 60 chars */}
              <h1
                itemProp="headline"
                className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4"
              >
                Sweet potato farming in Homa Bay:{" "}
                <span className="text-gold-600">The complete Lake Victoria shore guide</span>
              </h1>

              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Homa Bay&rsquo;s sandy-loam soils along the Lake Victoria shore are uniquely suited
                to sweet potato production — but most farmers here are halving their yields with one
                avoidable mistake: treating sweet potatoes like maize with nitrogen-heavy fertilizers.
                This guide fixes that, with soil data, certified variety rankings, and a full
                KES-costed plan per acre.
              </p>

              {/* Post meta bar */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-400 pb-6 border-b border-cream-300">
                <AuthorCard compact />
                <span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>
                  {new Date(POST.datePublished).toLocaleDateString("en-KE", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </time>
                <span className="text-soil-300">·</span>
                <span>{POST.readingTimeMin} min read</span>
                <span className="text-soil-300">·</span>
                <span>{POST.wordCount.toLocaleString()} words</span>
              </div>
            </header>

            {/* ── Hero Image ── */}
            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img
                src={POST.image}
                alt={POST.imageAlt}
                width={1200}
                height={630}
                className="w-full h-72 object-cover"
                itemProp="image"
                loading="eager"
              />
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">
                Orange-fleshed sweet potato harvest in Homa Bay County. Source: ShambaIQ field data.
              </figcaption>
            </figure>

            {/* ── SECTION 1: Why Homa Bay ── */}
            <section>
              <h2 id="why-homa-bay" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                Why Homa Bay is one of Kenya&rsquo;s best sweet potato counties
              </h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Kenya produces over <strong>900,000 tonnes of sweet potatoes annually</strong>, making
                it the third-largest crop by volume after maize and beans. But production is
                unevenly distributed — and Homa Bay, despite ideal soil conditions, is consistently
                under-performing relative to its potential.
              </p>
              <p className="text-soil-600 leading-relaxed mb-4">
                Three structural advantages make Homa Bay exceptional for sweet potato production:
              </p>
              <ul className="list-none space-y-3 mb-6">
                {[
                  {
                    title: "Sandy-loam texture",
                    detail:
                      "The Lake Victoria shoreline soils are naturally loose and well-drained — exactly the tilth sweet potato tubers need to expand without deformation or rotting. Unlike the heavy black cotton soils of the Mwea or the clay loams of the Central Highlands, Homa Bay soils offer minimal resistance to tuber bulking.",
                  },
                  {
                    title: "Bimodal rainfall",
                    detail:
                      "Homa Bay receives two reliable rain seasons (March–May and September–November) with average annual rainfall of 900–1,200 mm. This allows two sweet potato crops per year, compared to one in semi-arid counties like Kajiado or Machakos.",
                  },
                  {
                    title: "Established market access",
                    detail:
                      "Proximity to Kisumu City (Kenya's third-largest urban market), cross-border trade to Uganda and Tanzania, and growing demand for orange-fleshed varieties from NGO nutrition programmes all create premium buyers within reach.",
                  },
                ].map((item) => (
                  <li key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── SECTION 2: Soil Data ── */}
            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                Homa Bay soil data — what ShambaIQ precision data satellite mapping shows
              </h2>
              <p className="text-soil-600 leading-relaxed mb-5">
                ShambaIQ pulls soil nutrient data from{" "}
                <Link href="/about" className="text-gold-600 hover:underline">
                  ShambaIQ precision data
                </Link>
                {" "}— 30-metre resolution satellite predictions trained on 130,000+ African soil
                samples. Here is what the data shows for Homa Bay County:
              </p>

              {/* Soil data table */}
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Homa Bay County Average Soil Nutrient Values from ShambaIQ precision data</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>
                      {["Nutrient", "Homa Bay value", "Sweet potato optimum", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "5.6 – 6.2", "5.5 – 6.5", "Optimal"],
                      ["Total Nitrogen (g/kg)", "1.2 – 1.8", "Low N preferred", "Good (no excess)"],
                      ["Extractable Phosphorus (mg/kg)", "8 – 18", "> 10 mg/kg", "Marginal"],
                      ["Extractable Potassium (mg/kg)", "60 – 110", "> 150 mg/kg", "Deficient — supplement"],
                      ["Organic Carbon (g/kg)", "8 – 15", "> 10 g/kg", "Adequate"],
                    ].map(([nutrient, value, optimum, status], i) => (
                      <tr key={nutrient} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{nutrient}</td>
                        <td className="px-4 py-3 text-soil-600">{value}</td>
                        <td className="px-4 py-3 text-soil-500">{optimum}</td>
                        <td className="px-4 py-3 font-medium">{status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">
                Source: high-resolution satellite prediction, 0–20 cm depth, Homa Bay County average.
                Individual farm values may vary.{" "}
                <Link href="/app?county=homa-bay&crop=sweet-potato" className="text-gold-600 hover:underline">
                  Get your exact farm data →
                </Link>
              </p>
              <p className="text-soil-600 leading-relaxed">
                The critical insight: <strong>potassium is the limiting nutrient</strong> in Homa
                Bay for sweet potato production. Soil potassium averages 60–110 mg/kg — well below
                the 150 mg/kg optimum. This is the single most important soil chemistry fact for
                any Homa Bay sweet potato farmer, and it directly dictates fertilizer choice.
              </p>
            </section>

            {/* ── SECTION 3: The Nitrogen Mistake ── */}
            <section>
              <h2 id="nitrogen-mistake" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                The nitrogen mistake that&rsquo;s halving yields across Homa Bay
              </h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Walk through any sweet potato farm in Nyanza and you&rsquo;ll see the same
                pattern: <strong>lush, dark-green, sprawling vines</strong> — and disappointingly
                small tubers at harvest. Farmers assume the crop is doing well because the foliage
                looks healthy. It isn&rsquo;t. It&rsquo;s burning nitrogen on leaves instead of
                building tubers.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">The Science in Plain Language</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Sweet potatoes are tuber crops. Their productivity is measured underground, not
                  above it. Nitrogen (N) is the growth driver for shoots, leaves, and stems — the
                  vegetative parts of the plant. Potassium (K) is the yield driver for storage organs
                  — roots and tubers. When N is high and K is low, the plant directs all
                  photoassimilates (sugars produced by photosynthesis) to vegetative growth instead
                  of tuber storage. You get a beautiful canopy and a terrible harvest.
                </p>
              </div>

              <p className="text-soil-600 leading-relaxed mb-4">
                The root cause is a reasonable but wrong analogy: maize follows a fertilize-with-CAN
                logic that is deeply embedded in Kenyan farming culture. Farmers who have grown
                maize for generations transfer that fertilizer behaviour to sweet potatoes — and
                it backfires entirely. Unlike{" "}
                <Link href="/soil/homa-bay/maize" className="text-gold-600 hover:underline">
                  maize in Homa Bay
                </Link>
                {" "}which responds well to nitrogen top-dressing, sweet potatoes need the
                opposite: <strong>high potassium, minimal nitrogen, no CAN after planting</strong>.
              </p>
            </section>

            {/* ── SECTION 4: Fertilizer Guide ── */}
            <section>
              <h2 id="fertilizer-guide" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                Fertilizer guide: what to use, when, and how much
              </h2>

              {/* Fertilizer comparison table */}
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Fertilizer comparison for sweet potato farming in Homa Bay Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>
                      {["Fertilizer", "N-P-K", "Use for sweet potato?", "Why"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Mavuno Sweet Potato", "4-14-27", "Best choice", "High K exactly matches Homa Bay deficiency"],
                      ["NPK 17:17:17", "17-17-17", "Acceptable", "Balanced but K still lower than ideal"],
                      ["DAP (18:46:0)", "18-46-0", "Avoid", "Zero potassium — useless for tubers"],
                      ["CAN (26% N)", "26-0-0", "Never use", "Pure nitrogen — causes vine excess, kills yield"],
                      ["Urea (46% N)", "46-0-0", "Never use", "Same as CAN, worse effect on tubers"],
                      ["Organic compost", "Variable", "Excellent base", "Improves K availability and soil structure"],
                    ].map(([fert, npk, use, why], i) => (
                      <tr key={fert as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800">{fert}</td>
                        <td className="px-4 py-3 font-mono text-xs text-soil-500">{npk}</td>
                        <td className="px-4 py-3 font-medium">{use}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-forest-800 mb-3">Application schedule</h3>
              <div className="space-y-3 mb-6">
                {[
                  { time: "At planting (Day 0)", action: "Apply Mavuno Sweet Potato at 50 kg/acre into the ridge. Incorporate organic compost at 2 tonnes/acre if available." },
                  { time: "Week 3", action: "Check vine establishment. Rogue out any diseased or virus-infected plants. Do NOT apply any fertilizer." },
                  { time: "Week 6", action: "Final weeding. Vines should be covering ridges. Still no additional fertilizer needed. The Mavuno basal is sufficient for the full season." },
                  { time: "Month 3–4", action: "Harvest when vines yellow and die back. Early-morning harvest reduces field heat damage in Homa Bay's lowland climate." },
                ].map((row) => (
                  <div key={row.time} className="flex gap-4 bg-cream-50 border border-cream-200 rounded-xl p-4">
                    <div className="text-xs font-bold text-gold-600 w-28 flex-shrink-0 pt-0.5">{row.time}</div>
                    <p className="text-sm text-soil-600">{row.action}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 5: Varieties ── */}
            <section>
              <h2 id="varieties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                Best certified sweet potato varieties for Western Kenya
              </h2>
              <p className="text-soil-600 leading-relaxed mb-5">
                Only plant{" "}
                <Link href="https://www.kephis.org" className="text-gold-600 hover:underline" rel="noopener noreferrer" target="_blank">
                  KEPHIS-certified
                </Link>
                {" "}material. Uncertified vines carry Sweet Potato Feathery Mottle Virus (SPFMV)
                and Sweet Potato Chlorotic Stunt Virus (SPCSV) — together causing Sweetpotato Virus
                Disease (SPVD) which destroys up to 90% of yield and for which there is no cure.
                Certified vines are virus-tested. This is non-negotiable.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { name: "Kabode", flesh: "Orange", dry: "28–32%", yield: "10–14 t/acre", notes: "High beta-carotene. Drought-tolerant. Best for nutrition programmes." },
                  { name: "SPK004 (Vita)", flesh: "Orange", dry: "25–28%", yield: "8–12 t/acre", notes: "Sweetest flavour. Preferred for fresh Kisumu market." },
                  { name: "Kakamega farmer choice", flesh: "Cream/orange", dry: "26–30%", yield: "9–13 t/acre", notes: "Adapted to Western Kenya humidity. Good storability." },
                  { name: "White Star", flesh: "White", dry: "32–36%", yield: "8–11 t/acre", notes: "High dry matter. Chips and crisps market. Lower beta-carotene." },
                ].map((v) => (
                  <div key={v.name} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-2">{v.name}</h3>
                    <div className="space-y-1 text-sm">
                      {[
                        ["Flesh colour", v.flesh],
                        ["Dry matter", v.dry],
                        ["Expected yield", v.yield],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-soil-400">{label}</span>
                          <span className="font-medium text-forest-700">{val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-soil-400 mt-3 border-t border-cream-200 pt-2">{v.notes}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION 6: Planting Calendar ── */}
            <section>
              <h2 id="planting-calendar" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                Planting calendar for Homa Bay
              </h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-6">
                <table className="w-full text-sm">
                  <caption className="sr-only">Sweet potato planting calendar for Homa Bay County Kenya</caption>
                  <thead className="bg-cream-200">
                    <tr>
                      {["Season", "Plant", "Weed / establish", "Harvest", "Notes"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-xs text-forest-800 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-forest-700">Long Rains</td>
                      <td className="px-4 py-3">March – April</td>
                      <td className="px-4 py-3">April – May</td>
                      <td className="px-4 py-3">June – July</td>
                      <td className="px-4 py-3 text-soil-500 text-xs">Main season. Highest yields.</td>
                    </tr>
                    <tr className="bg-cream-50">
                      <td className="px-4 py-3 font-semibold text-forest-700">Short Rains</td>
                      <td className="px-4 py-3">October – November</td>
                      <td className="px-4 py-3">November – December</td>
                      <td className="px-4 py-3">January – February</td>
                      <td className="px-4 py-3 text-soil-500 text-xs">Good season. Lower rainfall risk.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── SECTION 7: Rotation ── */}
            <section>
              <h2 id="rotation" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                Maize–sweet potato rotation: the smartest sequence for Homa Bay
              </h2>
              <p className="text-soil-600 leading-relaxed mb-4">
                Continuous maize on Homa Bay soils progressively depletes nitrogen and organic
                carbon while allowing striga (<em>Striga hermonthica</em>) weed buildup — the
                single biggest yield thief in Western Kenya maize. Sweet potatoes break this cycle
                completely: they are not a striga host, their vine canopy suppresses weeds, and
                their vine residues add organic matter back to the soil.
              </p>
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-forest-800 mb-3">ShambaIQ recommended 3-season rotation for Homa Bay</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    { season: "Season 1", crop: "Maize + Beans", note: "Long rains. DAP + CAN." },
                    { sep: "→" },
                    { season: "Season 2", crop: "Sweet Potato", note: "Short rains. Mavuno Sweet Potato only." },
                    { sep: "→" },
                    { season: "Season 3", crop: "Beans / Cowpeas", note: "Long rains. Rhizobium inoculant. No fertilizer." },
                  ].map((item, i) =>
                    "sep" in item ? (
                      <span key={i} className="text-forest-400 font-bold text-lg">→</span>
                    ) : (
                      <div key={item.season} className="bg-white border border-forest-200 rounded-lg p-3 text-center min-w-[120px]">
                        <p className="text-xs text-forest-500 font-semibold mb-1">{item.season}</p>
                        <p className="text-sm font-bold text-forest-800">{item.crop}</p>
                        <p className="text-xs text-soil-400 mt-1">{item.note}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
              <p className="text-soil-600 leading-relaxed">
                This rotation improves soil organic matter progressively across all three seasons,
                reduces external fertilizer inputs by ~30% by Year 2, and eliminates striga. See
                the full rotation analysis for Homa Bay at{" "}
                <Link href="/soil/homa-bay" className="text-gold-600 hover:underline">
                  Homa Bay County Soil Report
                </Link>
                .
              </p>
            </section>

            {/* ── SECTION 8: HowTo Steps ── */}
            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">
                Step-by-step: how to grow sweet potatoes in Homa Bay
              </h2>
              <ol className="space-y-4">
                {howToSchema.step.map((step: { name: string; text: string }, i: number) => (
                  <li
                    key={i}
                    className="flex gap-4 bg-white border border-cream-300 rounded-xl p-5"
                    itemProp="step"
                    itemScope
                    itemType="https://schema.org/HowToStep"
                  >
                    <div className="w-9 h-9 rounded-full bg-forest-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-800 mb-1" itemProp="name">
                        {step.name}
                      </h3>
                      <p className="text-sm text-soil-500 leading-relaxed" itemProp="text">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── SECTION 9: Budget ── */}
            <section>
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">
                Budget: total KES cost per acre in Homa Bay
              </h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Sweet potato production cost per acre in Homa Bay Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>
                      {["Item", "Qty", "Unit cost (KES)", "Total (KES)"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Certified vines (bundles)", "50", "50", "2,500"],
                      ["Mavuno Sweet Potato (50 kg)", "1 bag", "3,200", "3,200"],
                      ["Agricultural lime (50 kg)", "2 bags*", "600", "1,200"],
                      ["Labour — land prep & planting", "4 days", "500", "2,000"],
                      ["Labour — weeding (×2)", "4 days", "500", "2,000"],
                      ["Labour — harvest", "3 days", "500", "1,500"],
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
                      <td className="px-4 py-3 font-bold">~KES 12,400</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-gold-800">Expected revenue (10 t/acre @ KES 20/kg)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 200,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">
                * Lime only required if ShambaIQ shows pH below 5.5 for your specific farm.
                Prices are indicative 2026 market rates. Use{" "}
                <Link href="/dealers/homa-bay" className="text-gold-600 hover:underline">
                  Homa Bay agrovets
                </Link>{" "}
                for current pricing.
              </p>
            </section>

            {/* ── CTA Block ── */}
            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">
                Free Precision Tool
              </p>
              <h3 className="text-xl font-display font-bold mb-3">
                {POST.ctaText}
              </h3>
              <p className="text-forest-200 text-sm mb-5">
                ShambaIQ pulls your farm&rsquo;s exact soil data from precision satellite soil
                mapping and calculates the precise bags, application timing, and KES cost per acre
                — personalised to your county and crop. Free. No sign-up required.
              </p>
              <Link
                href={POST.ctaLink}
                className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors"
              >
                Open ShambaIQ Advisory Tool →
              </Link>
            </div>

            {/* ── Internal links: related county/crop pages ── */}
            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/homa-bay", label: "Homa Bay county soil report" },
                  { href: "/crops/sweet-potato", label: "Sweet potato crop guide (all counties)" },
                  { href: "/soil/homa-bay/maize", label: "Maize in Homa Bay — compare rotation" },
                  { href: "/soil/homa-bay/beans", label: "Beans in Homa Bay — rotation crop 3" },
                  { href: "/dealers/homa-bay", label: "Agrovets in Homa Bay county" },
                  { href: "/zones/lake-victoria-basin", label: "Lake Victoria Basin agroecological zone" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 text-soil-500 hover:text-forest-700 transition-colors py-1"
                  >
                    <span className="text-gold-500 flex-shrink-0">→</span>
                    {label}
                  </Link>
                ))}
              </div>
            </aside>

            {/* ── FAQ Section ── */}
            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map(
                  (item: { name: string; acceptedAnswer: { text: string } }, i: number) => (
                    <details
                      key={i}
                      className="group bg-white border border-cream-300 rounded-xl"
                      itemScope
                      itemType="https://schema.org/Question"
                    >
                      <summary
                        className="flex justify-between items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-forest-800 hover:text-forest-600"
                        itemProp="name"
                      >
                        {item.name}
                        <span className="text-gold-500 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <div
                        className="px-5 pb-4 text-sm text-soil-600 leading-relaxed border-t border-cream-200"
                        itemProp="acceptedAnswer"
                        itemScope
                        itemType="https://schema.org/Answer"
                      >
                        <div itemProp="text">{item.acceptedAnswer.text}</div>
                      </div>
                    </details>
                  )
                )}
              </div>
            </section>

            {/* ── Author Card (full bio) ── */}
            <AuthorCard />

          </article>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <TableOfContents items={TOC_ITEMS} />

              {/* Quick county facts */}
              <div className="bg-cream-100 border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">
                  Homa Bay quick facts
                </p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Zone", "Lake Victoria Basin"],
                    ["Avg Rainfall", "900–1,200 mm/yr"],
                    ["Sweet Potato Rank", "Top 5 counties"],
                    ["Soil Texture", "Sandy-loam"],
                    ["Avg Soil pH", "5.6–6.2"],
                    ["K Status", "Deficient"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-400">{k}</span>
                      <span className="font-medium text-forest-700 text-right">{v}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/soil/homa-bay"
                  className="mt-4 block text-center text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors"
                >
                  Full Homa Bay Soil Report →
                </Link>
              </div>

              {/* Neighboring counties */}
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">
                  Neighbouring counties
                </p>
                <div className="space-y-1.5">
                  {[
                    { slug: "kisumu", name: "Kisumu" },
                    { slug: "migori", name: "Migori" },
                    { slug: "siaya", name: "Siaya" },
                    { slug: "nyamira", name: "Nyamira" },
                  ].map(({ slug, name }) => (
                    <Link
                      key={slug}
                      href={`/soil/${slug}`}
                      className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5"
                    >
                      <span>{name} County</span>
                      <span className="text-gold-500 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

        </div>

        {/* ── Related Posts ── */}
        <RelatedPosts
          posts={relatedPosts}
          heading="More county farming guides"
        />

      </div>
    </>
  );
}
