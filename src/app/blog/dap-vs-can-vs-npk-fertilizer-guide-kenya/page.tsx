import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("dap-vs-can-vs-npk-fertilizer-guide-kenya")!;

export const metadata: Metadata = {
  title: POST.metaTitle, description: POST.metaDescription,
  alternates: { canonical: `${BASE_URL}/blog/${POST.slug}` },
  openGraph: { type: "article", url: `${BASE_URL}/blog/${POST.slug}`, title: POST.metaTitle, description: POST.metaDescription, images: [{ url: `${BASE_URL}/api/og?type=blog&slug=${POST.slug}`, width: 1200, height: 630, alt: POST.imageAlt }], publishedTime: POST.datePublished, modifiedTime: POST.dateModified, authors: [`${BASE_URL}/about`], section: POST.section, tags: POST.secondaryKeywords, siteName: "ShambaIQ", locale: "en_KE" },
  twitter: { card: "summary_large_image", site: "@shambaiq_ke", creator: "@polycarp_agri", title: POST.metaTitle, description: POST.metaDescription, images: [`${BASE_URL}/api/og?type=blog&slug=${POST.slug}`] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  keywords: [POST.focusKeyword, ...POST.secondaryKeywords, ...(POST.kiswahiliKeywords ?? [])],
  authors: [{ name: "Polycarp Andabwa", url: `${BASE_URL}/about` }],
};

const articleSchema = makeArticleSchema({ headline: POST.title, description: POST.metaDescription, slug: POST.slug, datePublished: POST.datePublished, dateModified: POST.dateModified, image: `/api/og?type=blog&slug=${POST.slug}`, keywords: [POST.focusKeyword, ...POST.secondaryKeywords], wordCount: POST.wordCount, section: POST.section });
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Fertilizer Guides", url: `${BASE_URL}/blog?category=fertilizer-guides` }, { name: "DAP vs CAN vs NPK", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What is DAP fertilizer used for in Kenya?", answer: "DAP (18:46:0) is a basal fertilizer applied at planting to supply phosphorus for root development. Appropriate for most highland crops on acidic to neutral soils at 50 kg per acre. Not appropriate on alkaline soils above pH 7.5 where it raises pH further." },
  { question: "What is the difference between CAN and urea?", answer: "Both supply nitrogen but CAN (26% N) contains immediately available nitrate plus slow-release ammonium and 8% calcium. Urea (46% N) is cheaper per unit N but loses 20-30% to volatilisation on surface application. CAN is more reliable for smallholder use in Kenya's variable conditions." },
  { question: "When should I use NPK 17:17:17?", answer: "Use NPK 17:17:17 when a crop requires nitrogen, phosphorus, and potassium simultaneously at equivalent rates: vegetable crops in early growth, alkaline soils where DAP is problematic, and situations requiring all three macronutrients in a single application." },
  { question: "Can I mix DAP and CAN?", answer: "Do not mix DAP and CAN in the same application. Ammonium from DAP reacts with calcium in CAN to form insoluble calcium phosphate, reducing phosphorus availability. Apply DAP at planting and CAN separately at knee height — the timing separation ensures maximum efficiency." },
  { question: "How much fertilizer per acre of maize in Kenya?", answer: "Standard programme: 50 kg DAP (1 bag) at planting + 50 kg CAN (1 bag) at knee height. On soils below pH 5.5, add lime at least 3 weeks before planting. Total cost: approximately KES 7,700 per acre for basic DAP + CAN." },
]);
const TOC_ITEMS: TOCItem[] = [
  { id: "comparison", label: "Side-by-Side Comparison", level: 2 },
  { id: "dap-detail", label: "DAP — When to Use and Avoid", level: 2 },
  { id: "can-detail", label: "CAN — The Top-Dress Standard", level: 2 },
  { id: "npk-detail", label: "NPK 17:17:17 — The Balanced Option", level: 2 },
  { id: "by-crop", label: "Which Fertilizer for Which Crop", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

export default function Page() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Fertilizer Guides", url: `${BASE_URL}/blog?category=fertilizer-guides` }, { name: "DAP vs CAN vs NPK", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=fertilizer-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Fertilizer Guides</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">DAP vs CAN vs NPK Fertilizer: <span className="text-gold-700">Which Should You Use in Kenya?</span></h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">Walk into any Kenyan agrovet and you face the same three products: DAP, CAN, and NPK 17:17:17. Most farmers buy what their neighbour uses without understanding what each product actually does in their specific soil. The wrong choice wastes money — applying DAP to alkaline Kajiado soil raises pH further and damages onion roots; applying CAN to beans suppresses nitrogen fixation that would have supplied nitrogen for free. This guide explains what each product does and when to use which.</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-500 pb-6 border-b border-cream-300">
                <AuthorCard compact /><span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span className="text-soil-300">·</span><span>{POST.readingTimeMin} min read</span>
              </div>
            </header>
            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img src={POST.image} alt={POST.imageAlt} width={1200} height={630} className="w-full h-72 object-cover" itemProp="image" loading="eager" />
            </figure>

            <section>
              <h2 id="comparison" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Side-by-Side Comparison: DAP vs CAN vs NPK 17:17:17</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">DAP CAN NPK fertilizer comparison Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Property", "DAP (18:46:0)", "CAN (26:0:0)", "NPK (17:17:17)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Nitrogen (%)", "18%", "26%", "17%"], ["Phosphorus (%)", "46%", "0%", "17%"], ["Potassium (%)", "0%", "0%", "17%"], ["Calcium", "None", "8% Ca", "None"], ["Price per 50 kg bag (KES)", "4,000–4,500", "3,200–3,800", "4,200–4,800"], ["Application timing", "At planting (basal)", "Top-dress at knee height", "At planting (basal)"], ["Best for", "Maize, wheat, potato at planting", "All crops needing N top-dress", "Vegetables, alkaline soils, balanced needs"], ["NOT suitable for", "Alkaline soils (pH > 7.5)", "Beans (suppresses N-fixation)", "High-P needs (use DAP instead)"], ["Acidifying effect", "Moderate", "Moderate", "Low"]].map(([prop, dap, can, npk], i) => (
                      <tr key={prop as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{prop}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{dap}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{can}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{npk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="dap-detail" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">DAP — When to Use and When to Avoid</h2>
              <p className="text-soil-600 leading-relaxed mb-4">DAP (Di-Ammonium Phosphate, 18:46:0) is Kenya's most widely used basal fertilizer. Its high phosphorus content (46%) makes it the most cost-effective source of phosphorus for root development at planting. Apply in the furrow 5 cm below and 5 cm beside the seed — never in direct contact.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 text-sm mb-2">Use DAP when:</h3>
                  <div className="space-y-1 text-xs text-green-700">
                    {["Soil pH is 5.5 to 7.0 (acidic to neutral)", "Soil phosphorus is below 15 mg/kg", "Planting maize, wheat, potato, or vegetables", "You need the most P per shilling spent"].map((t) => <p key={t} className="flex gap-2"><span>✓</span>{t}</p>)}
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="font-semibold text-red-800 text-sm mb-2">Avoid DAP when:</h3>
                  <div className="space-y-1 text-xs text-red-700">
                    {["Soil pH is above 7.5 (Kajiado, Narok, Baringo)", "Growing beans or other legumes", "Soil phosphorus is already above 20 mg/kg", "You need potassium — DAP has zero K"].map((t) => <p key={t} className="flex gap-2"><span>✗</span>{t}</p>)}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 id="can-detail" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">CAN — The Top-Dress Nitrogen Source</h2>
              <p className="text-soil-600 leading-relaxed mb-4">CAN (Calcium Ammonium Nitrate, 26% N) contains both ammonium and nitrate nitrogen. Nitrate is immediately plant-available while ammonium is absorbed more slowly — providing both immediate and sustained nitrogen supply. The 8% calcium content makes CAN the correct top-dress choice on calcium-deficient soils.</p>
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">CAN vs Urea: Why CAN is more reliable for smallholders</p>
                <p className="text-sm text-amber-700 leading-relaxed">Urea (46% N) is cheaper per unit of nitrogen but loses 20 to 30 percent to volatilisation when applied to the soil surface in hot conditions — common in most Kenyan farming zones. CAN volatilises less because its nitrate component does not need soil conversion before uptake. For smallholders who cannot incorporate fertilizer after application, CAN delivers more usable nitrogen per shilling despite higher bag price.</p>
              </div>
            </section>

            <section>
              <h2 id="npk-detail" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">NPK 17:17:17 — The Balanced Option</h2>
              <p className="text-soil-600 leading-relaxed mb-4">NPK 17:17:17 supplies nitrogen, phosphorus, and potassium in equal proportions. It is the correct choice when all three macronutrients are needed simultaneously — common for vegetables in early growth and on alkaline soils where DAP is inappropriate.</p>
              <p className="text-soil-600 leading-relaxed mb-4">The cost trade-off: NPK 17:17:17 at 50 kg per acre provides only 8.5 kg of phosphorus per acre — less than half of DAP's 23 kg. For crops with high phosphorus demand on phosphorus-deficient soils, DAP is more cost-effective. For crops needing balanced nutrition (onions, cabbages, tomatoes in establishment), NPK 17:17:17 eliminates the need for separate potassium application.</p>
            </section>

            <section>
              <h2 id="by-crop" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Which Fertilizer for Which Crop</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Fertilizer recommendation by crop type in Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Crop", "At Planting", "Top-Dress", "Do NOT Use", "Why"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Maize", "DAP 50 kg/acre", "CAN 50 kg/acre at knee height", "NPK (wasteful K)", "Maize needs high P at planting, high N at V6-V8"], ["Wheat", "DAP 75 kg/acre", "CAN 50 kg/acre at tillering", "Urea (volatilises)", "Wheat needs more P than maize for root mass"], ["Beans", "Rock phosphate 50 kg or DAP 25 kg", "NONE", "CAN, Urea, NPK", "Beans fix own N — external N suppresses nodules"], ["Onion (Kajiado)", "NPK 17:17:17 50 kg", "Ammonium sulfate 50 kg", "DAP (raises alkaline pH)", "Alkaline soils need acidifying N source"], ["Cabbage", "DAP 50 kg + NPK 25 kg", "CAN 50 kg at 3 and 6 weeks", "Urea alone (Ca deficiency)", "Heavy feeder needing balanced NPK + Ca from CAN"], ["Tomato", "DAP 50 kg", "CAN 50 kg at 2, 5, 8 weeks", "Excess N at fruiting", "Late N delays ripening and reduces shelf life"]].map(([crop, plant, top, dont, why], i) => (
                      <tr key={crop as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-semibold text-forest-800">{crop}</td>
                        <td className="px-3 py-3 text-xs text-soil-600">{plant}</td>
                        <td className="px-3 py-3 text-xs text-soil-600">{top}</td>
                        <td className="px-3 py-3 text-xs text-red-600 font-medium">{dont}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">Get your farm-specific soil data and recommendations. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open ShambaIQ</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/blog/complete-maize-farming-guide-kenya", label: "Complete Maize Guide" },
                  { href: "/blog/how-much-fertilizer-per-acre-kenya-calculator", label: "Fertilizer Calculator by Crop" },
                  { href: "/blog/why-your-soil-is-acidic-kenya", label: "Why Your Soil Is Acidic" },
                  { href: "/blog/kenya-county-soil-rankings-2026", label: "County Soil Rankings 2026" },
                  { href: "/crops/maize", label: "Maize Crop Guide" },
                  { href: "/app", label: "Get Farm-Specific Recommendation" },
                ].map(({ href, label }) => (
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Best basal", "DAP for most crops"],
                    ["Best top-dress", "CAN at knee height"],
                    ["For alkaline soil", "NPK 17:17:17"],
                    ["For beans", "Rock phosphate only"],
                    ["DAP price", "KES 4,000-4,500/bag"],
                    ["CAN price", "KES 3,200-3,800/bag"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2"><span className="text-soil-500 text-xs">{k}</span><span className="font-medium text-forest-700 text-right text-xs">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="Related Guides" />
      </div>
    </>
  );
}
