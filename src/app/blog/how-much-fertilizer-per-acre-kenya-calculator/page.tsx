import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("how-much-fertilizer-per-acre-kenya-calculator")!;

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

const articleSchema = makeArticleSchema({ headline: POST.title, description: POST.metaDescription, slug: POST.slug, datePublished: POST.datePublished, dateModified: POST.dateModified, image: `/api/og?type=blog&slug=${POST.slug}`, keywords: [POST.focusKeyword, ...POST.secondaryKeywords], wordCount: POST.wordCount, section: POST.section });
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: POST.title, url: `${BASE_URL}/blog/${POST.slug}` }]);
const faqSchema = makeFAQSchema([
  { question: "How many bags of DAP per acre for maize in Kenya?", answer: "The standard recommendation for Kenyan highland maize is 1 bag (50 kg) of DAP per acre at planting, applied in the planting furrow. This provides 9 kg of nitrogen and 23 kg of phosphorus per acre. On strongly acidic soils below pH 5.5, DAP efficiency is reduced by 40 to 60 percent through phosphorus fixation — lime before applying DAP on these soils. On soils with confirmed adequate phosphorus above 20 mg/kg, reduce DAP to 25 kg per acre and redirect the saving to CAN top-dressing." },
  { question: "How many bags of CAN per acre for maize in Kenya?", answer: "1 bag (50 kg) of CAN per acre as a top-dress at knee height is the standard recommendation for Kenyan highland maize. This provides 13 kg of nitrogen per acre — sufficient for yields of 20 to 28 bags per acre at standard plant populations. For higher yield targets of 30 bags and above on fertile limed soils, a second CAN application of 25 kg per acre at tasselling is used by commercial farmers." },
  { question: "How much fertilizer per acre for cabbage in Kenya?", answer: "Cabbage in highland counties like Kiambu requires 3 applications: DAP at 50 kg per acre at transplanting, CAN at 50 kg per acre at 3 weeks, and CAN at 50 kg per acre at 6 weeks. Total: 1.5 bags DAP plus 2 bags CAN per acre. Foliar micronutrients — boron at week 4, calcium at weeks 3 and 6 — are essential for Kiambu's acidic soils." },
  { question: "How much fertilizer per acre for tomatoes in Kenya?", answer: "Tomatoes require the most intensive programme of Kenya's common vegetables. Basal: DAP at 50 kg per acre at transplanting. Top-dress schedule: CAN at 50 kg per acre at weeks 2, 5, and 8. Potassium sulfate at 25 kg per acre at first fruit set (week 8 to 10) improves fruit size and shelf life. Calcium nitrate foliar at weeks 3, 6, and 9 prevents blossom end rot." },
  { question: "Do I need fertilizer for beans in Kenya?", answer: "Beans need phosphorus at planting but do not benefit from nitrogen fertilizer — they fix their own nitrogen through Rhizobium bacteria. The correct programme: rock phosphate at 50 kg per acre or DAP at 25 to 30 kg per acre at planting, Rhizobium inoculant on the seed, and lime if pH is below 5.5. No CAN, no urea, no top-dressing. Applying nitrogen to beans suppresses Rhizobium nodulation and reduces the nitrogen fixation that would benefit the following maize crop." },]);

export default function Page() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: POST.title, url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                How Much Fertilizer Per Acre in Kenya: <span className="text-gold-600">Rates by Crop, County, and Soil Type</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">{POST.metaDescription}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-400 pb-6 border-b border-cream-300">
                <AuthorCard compact />
                <span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span className="text-soil-300">·</span>
                <span>{POST.readingTimeMin} min read</span>
              </div>
            </header>

            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img src={POST.image} alt={POST.imageAlt} width={1200} height={630} className="w-full h-72 object-cover" itemProp="image" loading="eager" />
            </figure>

            <div className="prose prose-lg max-w-none text-soil-600 mb-8">
              <p>The most common fertilizer question from Kenyan smallholder farmers is also the most variable: how much do I use? The answer depends on your soil's existing nutrient levels, the crop you are growing, your county's agroecological zone, and the specific product you are using. A blanket answer of '1 bag of DAP and 1 bag of CAN' is accurate for highland maize but wrong for beans, wrong for onions in Kajiado, and wrong for any crop on unlimed acidic soils where fertilizer efficiency collapses. This guide provides correct rates for Kenya's 10 most common crop-county combinations.</p>
            </div>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-8 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">Get county-specific soil data and agronomic recommendations for your farm. Free, no sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open ShambaIQ</Link>
            </div>

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }, i: number) => (
                  <details key={i} className="group bg-white border border-cream-300 rounded-xl" itemScope itemType="https://schema.org/Question">
                    <summary className="flex justify-between items-center gap-3 px-5 py-4 cursor-pointer list-none font-semibold text-forest-800 hover:text-forest-600" itemProp="name">
                      {item.name}<span className="text-gold-500 flex-shrink-0 text-lg group-open:rotate-45 transition-transform">+</span>
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
            <div className="sticky top-6 bg-cream-100 border border-cream-300 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Quick Links</p>
              <nav className="space-y-1">
                <Link href="#faq" className="block text-sm text-soil-500 hover:text-forest-700 transition-colors py-1">FAQ</Link>
                <Link href={POST.ctaLink} className="block text-sm text-gold-600 hover:text-gold-700 font-semibold py-1">Open ShambaIQ Tool →</Link>
              </nav>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="Related Guides" />
      </div>
    </>
  );
}
