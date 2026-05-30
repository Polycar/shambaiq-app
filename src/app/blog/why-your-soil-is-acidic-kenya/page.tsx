import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("why-your-soil-is-acidic-kenya")!;

export const metadata: Metadata = {
  title: POST.metaTitle, description: POST.metaDescription,
  alternates: { canonical: `${BASE_URL}/blog/${POST.slug}` },
  openGraph: { type: "article", url: `${BASE_URL}/blog/${POST.slug}`, title: POST.metaTitle, description: POST.metaDescription, images: [{ url: `${BASE_URL}/api/og?type=blog&slug=${POST.slug}`, width: 1200, height: 630, alt: POST.imageAlt }], publishedTime: POST.datePublished, modifiedTime: POST.dateModified, authors: [`${BASE_URL}/about`], section: POST.section, tags: POST.secondaryKeywords, siteName: "ShambaIQ", locale: "en_KE" },
  twitter: { card: "summary_large_image", site: "@shambaiq_ke", creator: "@polycarp_agri", title: POST.metaTitle, description: POST.metaDescription, images: [`${BASE_URL}/api/og?type=blog&slug=${POST.slug}`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  keywords: [POST.focusKeyword, ...POST.secondaryKeywords, ...(POST.kiswahiliKeywords ?? [])], authors: [{ name: "Polycarp Andabwa", url: `${BASE_URL}/about` }],
};

const articleSchema = makeArticleSchema({ headline: POST.title, description: POST.metaDescription, slug: POST.slug, datePublished: POST.datePublished, dateModified: POST.dateModified, image: `/api/og?type=blog&slug=${POST.slug}`, keywords: [POST.focusKeyword, ...POST.secondaryKeywords], wordCount: POST.wordCount, section: POST.section });
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil Health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Why Your Soil Is Acidic Kenya", url: `${BASE_URL}/blog/${POST.slug}` }]);
const faqSchema = makeFAQSchema([
  { question: "What causes soil acidity in Kenya?", answer: "Three mechanisms combine: volcanic parent material weathers to inherently acidic clay minerals across highland Kenya; heavy rainfall (900 to 1,800 mm per year) leaches calcium, magnesium, and potassium from topsoil leaving hydrogen and aluminium dominant; and nitrogen fertilizers like urea and CAN acidify soil with each application through the nitrification process. Most Kenyan highland soils experience all three simultaneously." },
  { question: "How do I know if my soil is acidic?", answer: "Use ShambaIQ precision mapping at shambaiq.com for your farm-specific pH reading. Without a test, field indicators suggesting pH below 5.5 include: stunted yellowing maize despite fertilizer application, plants that respond poorly to CAN top-dressing, and short stubby root systems with brown tips when you pull plants. These symptoms indicate aluminium toxicity caused by low pH." },
  { question: "How do I fix acidic soil in Kenya?", answer: "Apply dolomitic lime at 1 to 2.5 tonnes per acre depending on starting pH. Incorporate to 15 cm depth at least 4 weeks before planting. For maintenance, apply 300 to 500 kg per acre annually after harvest to offset ongoing acidification. Wood ash at 1 to 2 tonnes per acre provides supplementary correction on moderately acidic soils. Compost also raises pH slightly while building soil structure." },
  { question: "Does CAN make soil more acidic?", answer: "Yes. CAN acidifies soil with each application — the ammonium component nitrifies, releasing hydrogen ions. At 50 kg per acre per season, CAN lowers pH by approximately 0.1 to 0.2 units per season. Over 10 seasons without liming, this cumulative acidification equals 1 to 2 pH units. Urea acidifies even more strongly than CAN per unit of nitrogen." },
  { question: "What pH should Kenya farm soil be?", answer: "For most Kenya food crops the target is pH 6.0 to 6.5. At this range aluminium is non-toxic, phosphorus availability is maximised, nitrogen cycling by microbes is optimal, and calcium and magnesium are available. Tea performs best at pH 4.5 to 5.5. Onions on Kajiado's alkaline soils perform well at pH 6.5 to 7.5. For maize, beans, vegetables, coffee, and potato, pH 6.0 to 6.5 is the universal starting point." },
]);
const howToSchema = makeHowToSchema({
  name: "How to Test and Correct Acidic Soil in Kenya",
  description: "Step-by-step guide to identifying, testing, and correcting soil acidity on Kenyan farms using lime, wood ash, and organic matter.",
  totalTime: "P180D", estimatedCost: { currency: "KES", value: "7000–28000 per acre" },
  supply: ["Dolomitic agricultural lime", "Wood ash (supplementary)", "Compost or farmyard manure", "Soil pH meter or ShambaIQ data"],
  tool: ["Ox plough or hand hoe", "Lime spreader or bucket", "ShambaIQ precision tool"],
  steps: [
    { name: "Get your exact farm pH from ShambaIQ", text: "Visit shambaiq.com and enter your county and crop. ShambaIQ returns your farm's predicted pH from precision soil mapping at 30-metre resolution. Lime rate varies enormously — a farm at pH 4.5 needs 2.5 times more lime than one at pH 5.5. Know your starting pH before spending on inputs." },
    { name: "Calculate lime requirement from pH reading", text: "Below pH 4.5: 2.5 tonnes dolomitic lime per acre. pH 4.5 to 5.0: 2 tonnes. pH 5.0 to 5.5: 1 to 1.5 tonnes. pH 5.5 to 6.0: 500 kg to 1 tonne for maintenance. Target pH 6.0 to 6.5 for maize, beans, and vegetables." },
    { name: "Apply lime 4 to 6 weeks before planting", text: "Broadcast lime evenly and incorporate to 15 cm depth by ploughing or hoeing. Lime left on the surface reacts very slowly. On sloping land, apply on still days to prevent uneven distribution from wind." },
    { name: "Wait 3 weeks before applying DAP", text: "Calcium from lime reacts with phosphate from DAP to form insoluble calcium phosphate, locking out the phosphorus entirely. The 3-week separation is mandatory, not optional." },
    { name: "Apply maintenance lime annually after harvest", text: "Once target pH is reached, apply 300 to 500 kg per acre annually to offset the acidifying effect of nitrogen fertilizers. Without maintenance liming, soils under continuous cropping reacidify at 0.1 to 0.2 pH units per year." },
  ],
});
const TOC_ITEMS: TOCItem[] = [
  { id: "cause-1-geology", label: "Cause 1: Volcanic Parent Material", level: 2 },
  { id: "cause-2-leaching", label: "Cause 2: Rainfall Leaching", level: 2 },
  { id: "cause-3-fertilizer", label: "Cause 3: Nitrogen Fertilizer Acidification", level: 2 },
  { id: "county-ph-map", label: "Soil pH Across Kenya's Counties", level: 2 },
  { id: "symptoms", label: "Recognising Acidity in the Field", level: 2 },
  { id: "lime-programme", label: "The Lime Treatment Programme", level: 2 },
  { id: "howto", label: "Step-by-Step Correction Guide", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];
export default function WhySoilAcidicPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil Health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Why Your Soil Is Acidic", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=soil-health" className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Soil Health</Link>
                <span className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full">All Counties</span>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">Why Your Soil Is Acidic in Kenya: <span className="text-gold-600">3 Causes and How to Fix Them</span></h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">Soil acidity is Kenya's most widespread and most under-diagnosed crop yield problem. Across the Central Highlands, Western Kenya, and the Mount Kenya counties, more than 60 percent of agricultural land has soil pH below 5.5 — a threshold where aluminium becomes toxic, phosphorus locks out, and nitrogen fertilizer efficiency drops by 30 to 50 percent. Most farmers know their soil is poor but not why, or what specifically to do about it. This guide explains the three causes and three solutions for Kenya's specific context.</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-400 pb-6 border-b border-cream-300">
                <AuthorCard compact /><span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span className="text-soil-300">·</span><span>{POST.readingTimeMin} min read</span>
              </div>
            </header>
            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img src={POST.image} alt={POST.imageAlt} width={1200} height={630} className="w-full h-72 object-cover" itemProp="image" loading="eager" />
            </figure>

            <section>
              <h2 id="cause-1-geology" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cause 1: Volcanic Parent Material</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kenya's highland agricultural counties — Kiambu, Murang'a, Nyeri, Meru, Kirinyaga, Embu, and the Aberdare footzones — sit on volcanic rocks from Mount Kenya and the Aberdare Range. These volcanic deposits weather over thousands of years to produce kandic clay minerals rich in iron and aluminium oxides. These minerals are inherently acidic — they create a naturally low pH baseline that predates any farming activity.</p>
              <p className="text-soil-600 leading-relaxed mb-4">The practical implication: even virgin forest soils in these counties typically have pH 5.0 to 5.5. The moment farming begins and the other two acidification processes start, pH drops below the 5.5 threshold where aluminium toxicity begins damaging crop roots. Counties like Kakamega, Bungoma, and Kisii in Western Kenya have similar geology from different volcanic periods with the same acidifying result.</p>
            </section>

            <section>
              <h2 id="cause-2-leaching" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cause 2: Rainfall Leaching of Alkaline Cations</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kenya's highland and western counties receive 900 to 1,800 mm of annual rainfall. This water percolates through the soil profile, dissolving and carrying calcium (Ca2+), magnesium (Mg2+), and potassium (K+) — the alkaline cations that buffer soil against acidity — downward into the subsoil and groundwater. The longer a soil has been under high rainfall without replacement of these cations, the more acidic it becomes.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Annual rainfall and soil pH relationship across Kenyan counties</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["County", "Annual Rainfall (mm)", "Typical pH Range", "Leaching Severity"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Kakamega", "1,500–1,900", "4.8–5.5", "Severe"], ["Kiambu", "900–1,200", "5.2–6.0", "Moderate–High"], ["Meru (upper)", "1,200–1,600", "4.5–5.5", "Severe"], ["Nyeri", "800–1,400", "4.8–5.8", "High"], ["Nakuru", "800–1,000", "5.8–6.8", "Low–Moderate"], ["Kajiado", "400–700", "7.5–8.5", "None — alkaline"]].map(([county, rain, ph, sev], i) => (
                      <tr key={county as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800"><Link href={`/soil/${(county as string).toLowerCase()}`} className="hover:text-gold-600">{county}</Link></td>
                        <td className="px-4 py-3 text-soil-600">{rain}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{ph}</td>
                        <td className="px-4 py-3 text-sm">{sev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="cause-3-fertilizer" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cause 3: Nitrogen Fertilizer Acidification</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Every kilogram of ammonium-based nitrogen fertilizer — CAN, urea, ammonium sulfate, DAP — adds to soil acidity through the nitrification process. Soil bacteria convert ammonium (NH4+) to nitrate (NO3−), releasing two hydrogen ions per molecule. At 50 kg of CAN per acre per season, soil pH drops by 0.1 to 0.2 units per season.</p>
              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-800 mb-2">The cumulative effect most farmers miss</p>
                <p className="text-sm text-red-700 leading-relaxed">A farmer applying CAN at 50 kg per acre for 10 seasons without any lime application has lowered soil pH by 1.0 to 2.0 units. A farm that started at pH 6.0 in 2010 may now be at pH 4.5 to 5.0 — deep in the aluminium toxicity zone. The farmer sees declining yields year after year, applies more fertilizer in response, and accelerates the acidification that is causing the decline. Without pH measurement, this spiral is invisible.</p>
              </div>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Acidifying effect of common Kenyan fertilizers</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Fertilizer", "N Content", "Acidification Rate", "pH Drop per 10 Seasons", "Alternative"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Urea", "46% N", "High", "1.5–2.5 units", "CAN (less acidifying per unit N)"], ["CAN", "26% N", "Moderate", "1.0–2.0 units", "Lime maintenance offsets"], ["Ammonium sulfate", "21% N", "Very High", "2.0–3.0 units", "Use only on alkaline soils"], ["DAP", "18% N, 46% P", "Moderate", "0.8–1.5 units", "Lime 3 weeks before DAP"]].map(([fert, n, rate, drop, alt], i) => (
                      <tr key={fert as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800">{fert}</td>
                        <td className="px-4 py-3 text-soil-600">{n}</td>
                        <td className="px-4 py-3">{rate}</td>
                        <td className="px-4 py-3 font-bold text-red-700">{drop}</td>
                        <td className="px-4 py-3 text-xs text-soil-400">{alt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="county-ph-map" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Soil pH Across Kenya's Agricultural Counties</h2>
              <p className="text-soil-600 leading-relaxed mb-5">ShambaIQ's precision soil mapping reveals that Kenya's soil acidity follows a clear geographic pattern driven by the three causes above: high-rainfall volcanic counties are most acidic, low-rainfall rift valley counties are neutral to alkaline, and semi-arid counties are alkaline.</p>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                  { zone: "Strongly Acidic (pH < 5.5)", color: "bg-red-50 border-red-200", counties: "Kakamega, Bungoma, Vihiga, Meru upper, Nyeri upper, Kisii, Nyamira, Embu, Tharaka Nithi", action: "Lime required — 1 to 2.5 t/acre" },
                  { zone: "Moderately Acidic (pH 5.5–6.0)", color: "bg-amber-50 border-amber-200", counties: "Kiambu, Murang'a, Kirinyaga, Nandi, Bomet, Kericho, Trans Nzoia", action: "Maintenance lime — 0.5 to 1 t/acre" },
                  { zone: "Neutral to Alkaline (pH > 6.0)", color: "bg-green-50 border-green-200", counties: "Nakuru, Uasin Gishu, Laikipia, Kajiado, Narok, Baringo, Machakos", action: "No lime needed — some require acidifying inputs" },
                ].map((item) => (
                  <div key={item.zone} className={`${item.color} border rounded-xl p-4`}>
                    <h3 className="font-semibold text-forest-800 text-sm mb-2">{item.zone}</h3>
                    <p className="text-xs text-soil-500 mb-2">{item.counties}</p>
                    <p className="text-xs font-medium text-forest-700">{item.action}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="symptoms" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Recognising Acidity in the Field — Without a Soil Test</h2>
              <div className="space-y-3 mb-6">
                {[
                  { symptom: "Maize stunted and pale despite CAN application", explanation: "The classic aluminium toxicity presentation. Roots are damaged before they can absorb the nitrogen you just applied. CAN goes into the soil and volatilises without uptake. More CAN does not help — only liming reverses this." },
                  { symptom: "Short, stubby root systems with brown tips", explanation: "Pull a stunted maize plant. If the roots are short, thickened, and have dark brown tips rather than white growing tips, aluminium is binding to the root meristem and blocking cell division. This is the definitive field diagnosis of aluminium toxicity." },
                  { symptom: "Beans fail to nodulate — no pink bumps on roots", explanation: "Rhizobium bacteria are sensitive to pH below 5.5. If you inoculated bean seed with Rhizobium and see no root nodules at 6 weeks, soil pH is likely too low for the bacteria to survive. Lime is the precondition — inoculant only works above pH 5.5." },
                  { symptom: "Successive seasons of declining yields on the same field", explanation: "Progressive yield decline despite consistent fertilizer application is the signature of cumulative acidification from nitrogen fertilizers without lime maintenance. Each season the pH drops slightly further, each season the fertilizer works slightly less, each season the farmer blames the seed or the rain." },
                ].map((item) => (
                  <div key={item.symptom} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 text-sm mb-1">{item.symptom}</h3>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="lime-programme" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">The Lime Treatment Programme</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Lime application rates by starting soil pH for Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Starting pH", "Lime Rate (t/acre)", "Cost at KES 700/bag", "Apply Before Planting", "Target pH"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Below 4.5", "2.5 tonnes (50 bags)", "KES 35,000", "6+ weeks", "5.8–6.2"], ["4.5–5.0", "2.0 tonnes (40 bags)", "KES 28,000", "6 weeks", "6.0–6.2"], ["5.0–5.5", "1.5 tonnes (30 bags)", "KES 21,000", "4 weeks", "6.0–6.5"], ["5.5–6.0", "0.75 tonnes (15 bags)", "KES 10,500", "3 weeks", "6.2–6.5"], ["Annual maintenance", "0.3–0.5 tonnes", "KES 4,200–7,000", "After harvest", "Maintain > 6.0"]].map(([ph, rate, cost, timing, target], i) => (
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
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-Step: Testing and Correcting Acidic Soil</h2>
              <ol className="space-y-4">
                {howToSchema.step.map((step: { name: string; text: string }, i: number) => (
                  <li key={i} className="flex gap-4 bg-white border border-cream-300 rounded-xl p-5" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                    <div className="w-9 h-9 rounded-full bg-forest-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <div><h3 className="font-semibold text-forest-800 mb-1" itemProp="name">{step.name}</h3><p className="text-sm text-soil-500 leading-relaxed" itemProp="text">{step.text}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ tells you your exact soil pH and calculates your lime requirement before you spend anything. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Check My Soil pH</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[{ href: "/blog/acidic-soil-treatment-meru-nyeri", label: "Acidic Soil Treatment — Meru & Nyeri" }, { href: "/blog/cheapest-way-fix-acidic-soil-kenya", label: "Cheapest Way to Fix Acidic Soil" }, { href: "/blog/dap-vs-can-vs-npk-fertilizer-guide-kenya", label: "DAP vs CAN vs NPK Guide" }, { href: "/blog/kenya-county-soil-rankings-2026", label: "Kenya County Soil Rankings 2026" }, { href: "/zones/central-highlands", label: "Central Highlands Zone" }, { href: "/app", label: "Check Your Farm's pH Now" }].map(({ href, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 text-soil-500 hover:text-forest-700 transition-colors py-1"><span className="text-gold-500 flex-shrink-0">→</span>{label}</Link>
                ))}
              </div>
            </aside>

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }, i: number) => (
                  <details key={i} className="group bg-white border border-cream-300 rounded-xl" itemScope itemType="https://schema.org/Question">
                    <summary className="flex justify-between items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-forest-800 hover:text-forest-600" itemProp="name">{item.name}<span className="text-gold-500 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span></summary>
                    <div className="px-5 pb-4 text-sm text-soil-600 leading-relaxed border-t border-cream-200" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer"><div itemProp="text">{item.acceptedAnswer.text}</div></div>
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Acidity Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[["Affected area", "> 60% highland Kenya"], ["Critical pH", "Below 5.5"], ["Target pH", "6.0–6.5"], ["Main treatment", "Dolomitic lime"], ["Cost per acre", "KES 10,500–35,000"], ["Payback", "3–8x in first season"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2"><span className="text-soil-400">{k}</span><span className="font-medium text-forest-700 text-right text-xs">{v}</span></div>
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
