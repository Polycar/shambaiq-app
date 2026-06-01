import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("long-rains-2026-what-to-plant-kenya")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Seasonal Guides", url: `${BASE_URL}/blog?category=seasonal-guides` }, { name: "Long Rains 2026 Planting Guide", url: `${BASE_URL}/blog/${POST.slug}` }]);

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
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Seasonal Guides", url: `${BASE_URL}/blog?category=seasonal-guides` }, { name: "Long Rains 2026 Planting Guide", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=seasonal-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Seasonal Guides</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">Long Rains 2026 Kenya: <span className="text-gold-700">What to Plant by County and Agroecological Zone</span></h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">Kenya's long rains (March–June 2026) are the primary planting window for over 70 percent of smallholder farmers. The decisions made in the first two weeks of March determine household food security and farm income for the next six months. This guide provides ShambaIQ's county-specific recommendations calibrated against soil data and historical rainfall patterns.</p>
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
              <p className="text-soil-600 leading-relaxed mb-4">Kenya's long rains (March–June 2026) are the primary planting window for over 70 percent of smallholder farmers. The decisions made in the first two weeks of March determine household food security and farm income for the next six months. This guide provides ShambaIQ's county-specific recommendations calibrated against soil data and historical rainfall patterns.</p>
            </section>

            <section>
              <h2 id="by-zone" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">What to Plant by Agroecological Zone \u2014 Long Rains 2026</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Long rains 2026 planting recommendations by zone Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Zone", "Counties", "Onset Window", "Primary Crops", "Intercrop Option"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Highland (> 1,800m)", "Nyandarua, Nyeri upper, Meru upper", "Late March\u2013April", "Potato, Wheat, Maize (H614D)", "Beans after potato"], ["Upper Midland", "Nakuru, U. Gishu, Trans Nzoia", "Late March\u2013Early April", "Maize (DK8031), Wheat", "Maize + beans intercrop"], ["Midland (1,200\u20131,500m)", "Kakamega, Nandi, Kisii, Embu", "Early\u2013Mid April", "Maize (DK777), Beans, Tea", "Maize + beans intercrop"], ["Lower Midland", "Machakos, Makueni highland", "Mid March\u2013April", "Maize (DUMA 43), Sorghum", "Maize + cowpea"], ["Semi-Arid", "Kitui, Kajiado, Baringo lower", "When rains arrive", "Sorghum, Cowpeas, Green grams", "Sorghum + pigeon peas"], ["Coastal", "Kilifi, Kwale, Mombasa", "March 15\u201320", "Cassava, Cowpeas, Coconut", "Cassava + cowpea"]].map(([zone, counties, onset, crops, inter], i) => (
                      <tr key={zone as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-semibold text-forest-800 text-xs">{zone}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{counties}</td>
                        <td className="px-3 py-3 text-xs text-soil-600">{onset}</td>
                        <td className="px-3 py-3 text-xs text-forest-700 font-medium">{crops}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{inter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="prep-checklist" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Pre-Season Preparation Checklist</h2>
              <div className="space-y-3 mb-6">
                {[{task: "Check soil pH with ShambaIQ \u2014 4 weeks before planting", why: "If liming is needed, it must be done 3\u20134 weeks before planting. Checking pH on planting day means it is too late for the current season."}, {task: "Buy certified seed from KEPHIS-registered agrovets", why: "Counterfeit seed is rampant before planting season. Buy from known dealers, check packaging hologram, and verify lot numbers against KEPHIS database."}, {task: "Apply lime if pH below 5.8 for maize or 5.5 for beans", why: "Lime incorporated 3\u20134 weeks before planting ensures pH correction has begun before seed goes in. Late lime application produces no benefit in the current season."}, {task: "Prepare zai pits or tied ridges in ASAL zones", why: "Water harvesting structures must be ready before rains arrive. Building them during the rains wastes the first critical rainfall events \u2014 often the most reliable of the season."}, {task: "Order Rhizobium inoculant if planting beans", why: "Inoculant has a limited shelf life and is often out of stock at peak planting time. Order in advance and store in a cool, dark place."}].map((item) => (
                  <div key={item.task} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 text-sm mb-1">{item.task}</h3>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.why}</p>
                  </div>
                ))}
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Onset (Coast)", "March 15–20"],
                    ["Onset (Central)", "March 25–April 5"],
                    ["Onset (Western)", "April 1–10"],
                    ["Top highland crop", "Maize + beans intercrop"],
                    ["Top ASAL crop", "Sorghum + cowpeas"],
                    ["Key tool", "ShambaIQ soil check"],
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
