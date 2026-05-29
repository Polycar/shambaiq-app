import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("kakamega-soil-western-kenya-mavuno")!;

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
  { question: "What is Mavuno fertilizer?", answer: "Mavuno is a range of compound fertilizers manufactured by MEA Fertilizers for Kenya's market, formulated with NPK ratios calibrated for East African soils. Mavuno Planting (26:10:10) provides nitrogen, phosphorus, and potassium simultaneously. Mavuno Top Dress (30:0:10) provides nitrogen and potassium for top-dressing. Unlike DAP (18:46:0) which provides only nitrogen and very high phosphorus, Mavuno's balanced formulations are appropriate when phosphorus needs are moderate but potassium deficiency is also present." },
  { question: "Is Mavuno better than DAP for maize in Kakamega?", answer: "On Kakamega's leached soils where phosphorus is deficient (below 10 mg/kg), DAP provides more phosphorus per kilogram and per shilling than Mavuno Planting. DAP at 18:46:0 delivers 46 percent phosphorus — more than four times Mavuno Planting's 10 percent. If phosphorus is the primary limiting nutrient, DAP is more cost-effective. However, on Kakamega farms where potassium is also deficient (below 80 mg/kg), Mavuno Planting supplies potassium while DAP does not. ShambaIQ identifies which nutrients are limiting on your specific farm." },
  { question: "How much Mavuno fertilizer per acre for maize in Kakamega?", answer: "For Kakamega maize using Mavuno Planting as the basal fertilizer: apply 50 kg (1 bag) in the planting furrow at the same rate as DAP. Follow with Mavuno Top Dress at 50 kg per acre or CAN at 50 kg per acre at knee height. The choice between Mavuno Top Dress and CAN depends on whether your soil shows potassium deficiency — if K is below 80 mg/kg, Mavuno Top Dress provides both N and K simultaneously." },
  { question: "What does Mavuno fertilizer contain?", answer: "Mavuno Planting (26:10:10:4S) contains 26% nitrogen, 10% phosphorus, 10% potassium, and 4% sulfur. Mavuno Top Dress (30:0:10:5S) contains 30% nitrogen, 0% phosphorus, 10% potassium, and 5% sulfur. The sulfur content is agronomically significant for Kakamega's leached soils where sulfur deficiency occurs — deficiency symptoms mimic nitrogen deficiency but do not respond to nitrogen application." },
  { question: "Is Mavuno fertilizer good for beans in Kakamega?", answer: "For beans in Kakamega, Mavuno Planting is not recommended because its high nitrogen (26%) suppresses Rhizobium nodule formation. Beans fix their own nitrogen and do not benefit from nitrogen fertilizer. The correct basal for beans is rock phosphate or low-rate DAP at 25 kg per acre, providing phosphorus for root development without nitrogen that disrupts biological fixation." },]);

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
                Kakamega Soil Guide: <span className="text-gold-600">Mavuno Fertilizer vs DAP on Western Kenya Soils</span>
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
              <p>Mavuno is Kenya's most popular compound fertilizer brand — a range of formulations developed specifically for Kenya's diverse soil types. In Kakamega County's phosphorus-deficient, slightly acidic soils, the question of whether to use Mavuno or DAP is one of the most common fertilizer decisions smallholder farmers face. The answer depends on your specific soil nutrient profile and the crop you are growing. This guide uses ShambaIQ's precision soil data for Kakamega to show exactly when Mavuno outperforms DAP and when DAP remains the better choice.</p>
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
