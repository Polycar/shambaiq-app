import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("how-much-fertilizer-per-acre-kenya-calculator")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Fertilizer Guides", url: `${BASE_URL}/blog?category=fertilizer-guides` }, { name: "Fertilizer Calculator Kenya", url: `${BASE_URL}/blog/${POST.slug}` }]);

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
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Fertilizer Guides", url: `${BASE_URL}/blog?category=fertilizer-guides` }, { name: "Fertilizer Calculator Kenya", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=fertilizer-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Fertilizer Guides</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">How Much Fertilizer Per Acre in Kenya: <span className="text-gold-700">Rates by Crop, County, and Soil Type</span></h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">The most common fertilizer question is also the most variable: how much do I use? A blanket answer of 1 bag DAP and 1 bag CAN is correct for highland maize but wrong for beans, wrong for onions in Kajiado, and wrong for any crop on unlimed acidic soils. This guide provides correct rates for Kenya's 10 most common crop-county combinations.</p>
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
              <p className="text-soil-600 leading-relaxed mb-4">The most common fertilizer question is also the most variable: how much do I use? A blanket answer of 1 bag DAP and 1 bag CAN is correct for highland maize but wrong for beans, wrong for onions in Kajiado, and wrong for any crop on unlimed acidic soils. This guide provides correct rates for Kenya's 10 most common crop-county combinations.</p>
            </section>

            <section>
              <h2 id="rates-table" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Fertilizer Rates for Kenya's 10 Most Common Crops</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Fertilizer application rates by crop in Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Crop", "At Planting", "Top-Dress", "Lime Needed?", "Total Cost/Acre"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Maize", "DAP 50 kg", "CAN 50 kg (knee height)", "If pH < 5.8", "KES 7,700"], ["Wheat", "DAP 75 kg", "CAN 50 kg (tillering)", "If pH < 6.0", "KES 9,800"], ["Beans", "DAP 25 kg + Rhizobium", "NONE", "If pH < 5.5", "KES 3,500"], ["Cabbage", "DAP 50 kg", "CAN 50 kg \u00d7 2 (wk 3 + 6)", "If pH < 5.5", "KES 11,700"], ["Tomato", "DAP 50 kg", "CAN 50 kg \u00d7 3 (wk 2, 5, 8)", "If pH < 5.5", "KES 14,700"], ["Onion (Kajiado)", "NPK 17:17:17 50 kg", "AmSulfate 50 kg \u00d7 2", "No \u2014 alkaline", "KES 10,400"], ["Potato", "DAP 50 kg + MOP 25 kg", "CAN 50 kg (earthing up)", "If pH < 5.5", "KES 10,200"], ["Sweet potato", "DAP 25 kg", "Mavuno 25 kg (wk 4)", "If pH < 5.5", "KES 5,600"], ["Sorghum", "DAP 25 kg", "CAN 25 kg (if rain good)", "Rarely needed", "KES 4,200"], ["Napier grass", "DAP 50 kg (establish)", "CAN 50 kg per cut (4-6/yr)", "If pH < 5.5", "KES 16,000+/yr"]].map(([crop, plant, top, lime, cost], i) => (
                      <tr key={crop as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-semibold text-forest-800">{crop}</td>
                        <td className="px-3 py-3 text-xs text-soil-600">{plant}</td>
                        <td className="px-3 py-3 text-xs text-soil-600">{top}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{lime}</td>
                        <td className="px-3 py-3 font-semibold text-gold-700 text-xs">{cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Costs exclude lime. Lime adds KES 10,500\u201335,000/acre depending on starting pH but amortises over 3\u20134 seasons. <Link href="/app" className="text-gold-700 hover:underline">Get your exact fertilizer rate here.</Link></p>
            </section>

            <section>
              <h2 id="mistakes" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Three Expensive Fertilizer Mistakes</h2>
              <div className="space-y-3 mb-6">
                {[{title: "Applying CAN at planting instead of knee height", cost: "15\u201330% nitrogen wasted", fix: "CAN volatilises from the surface before roots can absorb it. Wait until knee height when the established root system actively absorbs nitrogen during rapid growth."}, {title: "Applying nitrogen fertilizer to beans", cost: "KES 3,500 wasted + reduced yield", fix: "Beans fix their own nitrogen through Rhizobium. External N suppresses nodule formation. Apply phosphorus only."}, {title: "Applying DAP to alkaline Kajiado soils", cost: "pH rises further, zinc locks out", fix: "DAP's diammonium component releases hydroxide ions. Use NPK 17:17:17 and ammonium sulfate instead."}].map((item) => (
                  <div key={item.title} className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="font-semibold text-red-800 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-red-600 font-medium mb-2">Cost: {item.cost}</p>
                    <p className="text-xs text-soil-500">{item.fix}</p>
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
                    ["Maize basal", "DAP 50 kg/acre"],
                    ["Maize top-dress", "CAN 50 kg/acre"],
                    ["Beans basal", "DAP 25 kg ONLY"],
                    ["Beans top-dress", "NONE"],
                    ["Onion (alkaline)", "NPK 17:17:17"],
                    ["Cabbage total", "3 applications"],
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
