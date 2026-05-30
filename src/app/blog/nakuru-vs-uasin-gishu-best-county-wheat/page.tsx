import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("nakuru-vs-uasin-gishu-best-county-wheat")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Comparisons", url: `${BASE_URL}/blog?category=comparisons` }, { name: "Nakuru vs Uasin Gishu Wheat", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "Coming soon", answer: "This section is being updated with detailed FAQ content." },
]);
const TOC_ITEMS: TOCItem[] = [
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

export default function Page() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Comparisons", url: `${BASE_URL}/blog?category=comparisons` }, { name: "Nakuru vs Uasin Gishu Wheat", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=comparisons" className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Comparisons</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">Nakuru vs Uasin Gishu: <span className="text-gold-600">Which Is Kenya's Best Wheat County?</span></h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">Nakuru and Uasin Gishu produce over 70 percent of Kenya's wheat. Both offer excellent highland conditions but differ in altitude distribution, disease pressure, and market infrastructure. ShambaIQ's precision soil mapping reveals where each county has the advantage.</p>
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
              <p className="text-soil-600 leading-relaxed mb-4">Nakuru and Uasin Gishu produce over 70 percent of Kenya's wheat. Both offer excellent highland conditions but differ in altitude distribution, disease pressure, and market infrastructure. ShambaIQ's precision soil mapping reveals where each county has the advantage.</p>
            </section>

            <section>
              <h2 id="soil-comparison" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Soil Data: Nakuru vs Uasin Gishu</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Soil comparison Nakuru versus Uasin Gishu for wheat production Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Parameter", "Nakuru", "Uasin Gishu", "Wheat Optimum"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Altitude range", "1,800\u20132,200 m", "1,800\u20132,400 m", "> 1,800 m"], ["Soil pH", "5.8\u20136.8", "5.5\u20136.5", "6.0\u20137.0"], ["Phosphorus (mg/kg)", "10\u201320", "8\u201318", "> 15"], ["Nitrogen (g/kg)", "1.4\u20132.2", "1.5\u20132.4", "> 1.5"], ["Organic Carbon (%)", "1.8\u20132.8", "2.0\u20133.2", "> 2.0"], ["Annual Rainfall", "800\u20131,000 mm", "900\u20131,200 mm", "700\u20131,000 mm"], ["Humidity", "Moderate\u2013High", "Moderate", "Low preferred"], ["Stem rust risk", "Moderate\u2013High", "Moderate", "Variety dependent"]].map(([p, nak, ug, opt], i) => (
                      <tr key={p as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{p}</td>
                        <td className="px-4 py-3 text-soil-600">{nak}</td>
                        <td className="px-4 py-3 text-soil-600">{ug}</td>
                        <td className="px-4 py-3 text-forest-700 font-medium text-xs">{opt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="varieties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Best Wheat Varieties by County</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[{county: "Nakuru", top: "Eagle 10", alt: "Kenya Fahari, Kenya Shindo", note: "Eagle 10 leads for Ug99 stem rust resistance. Kenya Fahari yields higher in favourable seasons but more susceptible to yellow stripe rust in Nakuru's cooler, wetter Rift Valley floor conditions."}, {county: "Uasin Gishu", top: "Kenya Fahari", alt: "Eagle 10, NGANO 1", note: "Eldoret Basin's lower humidity reduces foliar disease pressure in most seasons, making Kenya Fahari's yield advantage consistently realisable. NGANO 1 shows strong Ug99 resistance and competitive yield."}].map((c) => (
                  <div key={c.county} className="bg-white border border-cream-300 rounded-xl p-5">
                    <h3 className="font-bold text-forest-800 mb-1">{c.county} County</h3>
                    <p className="text-xs text-gold-700 font-semibold mb-1">Top: {c.top}</p>
                    <p className="text-xs text-soil-500 mb-2">Also: {c.alt}</p>
                    <p className="text-xs text-soil-400 leading-relaxed border-t border-cream-200 pt-2">{c.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Wheat Enterprise Budget Per Acre \u2014 2026</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Cost (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Certified seed (50 kg)", "5,000"], ["DAP (1.5 bags)", "6,300"], ["CAN (1 bag)", "3,500"], ["Propiconazole fungicide", "2,200"], ["Herbicide (2,4-D)", "1,200"], ["Land preparation", "4,000"], ["Harvest (combine hire)", "3,500"]].map(([item, cost], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 text-forest-800">{item}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{cost}</td>
                      </tr>
                    ))}
                    <tr className="bg-forest-700 text-white"><td className="px-4 py-3 font-bold">Total Cost</td><td className="px-4 py-3 font-bold">KES 25,700</td></tr>
                    <tr className="bg-gold-50"><td className="px-4 py-3 font-bold text-gold-800">Revenue (18 bags \u00d7 KES 4,500)</td><td className="px-4 py-3 font-bold text-gold-800">KES 81,000</td></tr>
                    <tr className="bg-green-50"><td className="px-4 py-3 font-bold text-green-800">Net Margin</td><td className="px-4 py-3 font-bold text-green-800">KES 55,300</td></tr>
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
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/app", label: "Check Your Farm Soil" },
                  { href: "/blog", label: "All Blog Posts" },
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
                    ["Nakuru wheat %", "25–30% of national"],
                    ["UG wheat %", "40–45% of national"],
                    ["Top variety", "Eagle 10 (rust resistant)"],
                    ["Yield target", "18–22 bags/acre"],
                    ["Key disease", "Ug99 stem rust"],
                    ["NCPB price", "KES 4,500/bag"],
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
