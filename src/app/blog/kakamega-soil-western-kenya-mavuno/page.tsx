import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("kakamega-soil-western-kenya-mavuno")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Kakamega Soil Mavuno Guide", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What is Mavuno fertilizer?", answer: "Mavuno is a range of compound fertilizers by MEA Fertilizers for Kenya. Mavuno Planting (26:10:10:4S) provides NPK plus sulfur. Mavuno Top Dress (30:0:10:5S) provides N and K for top-dressing. Unlike DAP (18:46:0) which provides very high phosphorus, Mavuno's balanced formulations suit situations where moderate P plus K and S are all needed." },
  { question: "Is Mavuno better than DAP for maize in Kakamega?", answer: "On most Kakamega farms where phosphorus is below 10 mg/kg, DAP provides more P per shilling — 4.6 times more phosphorus per bag. DAP wins when P is the primary limiting nutrient. Mavuno wins only when K is also deficient (below 80 mg/kg) and P is moderate (above 12 mg/kg). ShambaIQ identifies which nutrients are limiting on your specific farm." },
  { question: "How much Mavuno per acre for maize?", answer: "If using Mavuno Planting as the basal: 50 kg (1 bag) in the planting furrow. Top-dress with Mavuno Top Dress 50 kg or CAN 50 kg at knee height. Choose Mavuno Top Dress over CAN if potassium is deficient." },
  { question: "Is Mavuno good for beans in Kakamega?", answer: "No. Mavuno Planting's 26% nitrogen suppresses Rhizobium nodule formation. Beans fix their own nitrogen and do not benefit from N fertilizer. The correct basal for Kakamega beans is rock phosphate at 50 kg or low-rate DAP at 25 kg — phosphorus only." },
  { question: "What does Mavuno fertilizer contain?", answer: "Mavuno Planting: 26% N, 10% P2O5, 10% K2O, 4% S. Mavuno Top Dress: 30% N, 0% P, 10% K2O, 5% S. The sulfur content is significant for Kakamega's leached soils where sulfur deficiency mimics nitrogen deficiency symptoms." },
]);
const TOC_ITEMS: TOCItem[] = [
  { id: "kakamega-soil", label: "Kakamega Soil Profile", level: 2 },
  { id: "mavuno-vs-dap", label: "Mavuno vs DAP Head-to-Head", level: 2 },
  { id: "programme", label: "Complete Fertilizer Programme", level: 2 },
  { id: "beans-warning", label: "Why Mavuno Is Wrong for Beans", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

export default function Page() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Kakamega Soil Mavuno Guide", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County Farming Guides</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">Kakamega Soil Guide: <span className="text-gold-600">Mavuno Fertilizer vs DAP — Which Wins on Western Kenya Soils?</span></h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">Mavuno is Kenya's most popular compound fertilizer brand — formulations developed specifically for East African soils. In Kakamega County's phosphorus-deficient, slightly acidic soils, the question of Mavuno vs DAP is one of the most common decisions smallholder farmers face. The answer depends on your specific soil nutrient profile. This guide uses ShambaIQ's precision data for Kakamega to show exactly when each product wins.</p>
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
              <h2 id="kakamega-soil" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Kakamega Soil Profile — What the Data Shows</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Kakamega County soil nutrient profile from ShambaIQ precision mapping</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Parameter", "Kakamega Average", "Crop Optimum", "Implication for Fertilizer Choice"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Soil pH", "4.8–5.5", "6.0–6.5", "Lime before any fertilizer on soils below 5.5"], ["Phosphorus (mg/kg)", "6–14", "> 15 mg/kg", "P-deficient — DAP's high P content is the advantage"], ["Potassium (mg/kg)", "80–180", "> 80 mg/kg", "Low-to-adequate — Mavuno's K content matters here"], ["Nitrogen (g/kg)", "1.2–2.0", "> 1.2 g/kg", "Adequate — CAN top-dress sufficient"], ["Organic Carbon (%)", "1.5–2.5", "> 2.0%", "Moderate — maintain with crop residues"], ["Sulfur", "Often deficient", "Adequate", "Mavuno's 4% S is an advantage on S-deficient farms"]].map(([p, avg, opt, imp], i) => (
                      <tr key={p as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{p}</td>
                        <td className="px-4 py-3 text-soil-600">{avg}</td>
                        <td className="px-4 py-3 text-soil-500">{opt}</td>
                        <td className="px-4 py-3 text-xs text-forest-700">{imp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">Source: ShambaIQ precision mapping, Kakamega County. <Link href="/app?county=kakamega" className="text-gold-600 hover:underline">Get your farm-specific values.</Link></p>
            </section>

            <section>
              <h2 id="mavuno-vs-dap" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Mavuno Planting vs DAP — Head-to-Head on Kakamega Soils</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Factor", "DAP (18:46:0)", "Mavuno Planting (26:10:10:4S)", "Winner for Kakamega"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["P per 50 kg bag", "23 kg", "5 kg", "DAP — 4.6x more P"], ["N per 50 kg bag", "9 kg", "13 kg", "Mavuno — but N comes from CAN anyway"], ["K per 50 kg bag", "0 kg", "5 kg", "Mavuno — matters if K < 80 mg/kg"], ["Sulfur", "None", "2 kg", "Mavuno — if S-deficient"], ["Cost per bag", "KES 4,200", "KES 4,500", "DAP — more P per shilling"], ["Best scenario", "P below 10 mg/kg, K adequate", "P moderate, K deficient, S deficient", "Depends on your soil"]].map(([f, dap, mav, win], i) => (
                      <tr key={f as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{f}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{dap}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{mav}</td>
                        <td className="px-4 py-3 font-semibold text-gold-700 text-xs">{win}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-forest-50 border-l-4 border-forest-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-forest-800 mb-2">The ShambaIQ verdict for most Kakamega farms</p>
                <p className="text-sm text-forest-700 leading-relaxed">On the majority of Kakamega farms where phosphorus is the primary limiting nutrient (below 10 mg/kg), DAP provides more phosphorus per shilling and should remain the default basal fertilizer. Switch to Mavuno Planting only if ShambaIQ confirms your farm has both potassium deficiency (below 80 mg/kg) AND moderate phosphorus (above 12 mg/kg). The data decides — not the brand name.</p>
              </div>
            </section>

            <section>
              <h2 id="programme" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Complete Fertilizer Programme for Kakamega Maize</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Stage", "If P < 10 mg/kg (use DAP)", "If P > 12 & K < 80 (use Mavuno)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Pre-plant (if pH < 5.5)", "Lime 1–1.5 t/acre, 3 weeks before", "Same"], ["At planting", "DAP 50 kg in furrow", "Mavuno Planting 50 kg in furrow"], ["Top-dress (knee height)", "CAN 50 kg/acre", "Mavuno Top Dress 50 kg or CAN 50 kg"], ["Total N applied", "22 kg/acre", "26–43 kg/acre"], ["Total P applied", "23 kg/acre", "5 kg/acre"], ["Total K applied", "0 kg/acre", "5–10 kg/acre"]].map(([stage, dap, mav], i) => (
                      <tr key={stage as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{stage}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{dap}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{mav}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="beans-warning" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Mavuno Is Wrong for Kakamega Beans</h2>
              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-red-800 mb-2">Mavuno Planting contains 26% nitrogen — beans do not need it</p>
                <p className="text-sm text-red-700 leading-relaxed">Mavuno Planting's high nitrogen content (26%) actively suppresses Rhizobium nodule formation in beans. Beans fix 40 to 80 kg of atmospheric nitrogen per acre per season at zero cost through Rhizobium bacteria in root nodules. Applying Mavuno to beans costs more than DAP, provides less phosphorus, and reduces the free nitrogen fixation that makes beans valuable in a rotation system. For Kakamega beans, the correct basal is rock phosphate at 50 kg or DAP at 25 kg — phosphorus only, no nitrogen.</p>
              </div>
            </section>
            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">Get your farm-specific soil data and recommendations. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open ShambaIQ</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/kakamega", label: "Kakamega County Soil Report" },
                  { href: "/blog/dap-vs-can-vs-npk-fertilizer-guide-kenya", label: "DAP vs CAN vs NPK Guide" },
                  { href: "/blog/bean-farming-kakamega-double-harvest", label: "Bean Farming in Kakamega" },
                  { href: "/crops/maize", label: "Maize Crop Guide" },
                  { href: "/dealers/kakamega", label: "Agrovets in Kakamega" },
                  { href: "/app?county=kakamega", label: "Check Your Kakamega Farm" },
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Avg pH", "4.8–5.5"],
                    ["Avg P", "6–14 mg/kg"],
                    ["Avg K", "80–180 mg/kg"],
                    ["Default basal", "DAP for most farms"],
                    ["Switch to Mavuno", "Only if K < 80"],
                    ["Never for beans", "Use rock phosphate"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2"><span className="text-soil-400 text-xs">{k}</span><span className="font-medium text-forest-700 text-right text-xs">{v}</span></div>
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
