import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("yellow-maize-leaves-soil-deficiency-kenya")!;

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
  { question: "Why are my maize leaves turning yellow in Kenya?", answer: "Yellow maize leaves in Kenya have eight possible causes: nitrogen deficiency (most common — yellowing from leaf tip moving upward on older lower leaves), aluminium toxicity from low soil pH (pale overall yellowing with stunted plants that do not respond to fertilizer), phosphorus deficiency in cold soils (purple-red tinting with slow growth), zinc deficiency on alkaline soils (interveinal striping on young leaves), sulphur deficiency (yellowing of youngest leaves), grey leaf spot fungal disease (rectangular tan-grey lesions between veins), northern corn leaf blight (long cigar-shaped tan lesions), and maize streak virus (bright yellow streaks along leaf veins)." },
  { question: "How do I fix yellow maize leaves in Kenya?", answer: "The fix depends entirely on the cause. Nitrogen deficiency: apply CAN at 50 kg per acre immediately. Aluminium toxicity from low pH: lime and wait — CAN will not help. Zinc deficiency: spray zinc sulfate at 2g per litre. Sulphur deficiency: spray ammonium sulfate foliar. Grey leaf spot: spray propiconazole or mancozeb. Maize streak virus: remove infected plants — no cure exists." },
  { question: "What does nitrogen deficiency look like in maize?", answer: "Nitrogen deficiency in maize produces a characteristic V-shaped yellowing starting from the leaf tip and progressing back along the midrib. Yellowing begins on lower, older leaves first and moves up the plant as deficiency progresses. The plant looks pale green to yellow overall in severe cases. Unlike most deficiency symptoms, nitrogen deficiency responds visibly within 5 to 7 days of CAN top-dress application on soils above pH 5.5." },
  { question: "What does aluminium toxicity look like in maize in Kenya?", answer: "Aluminium toxicity on acidic soils produces a pale, washed-out yellowing across all leaves rather than the tip-to-base pattern of nitrogen deficiency. Plants are uniformly stunted with fewer leaves. Root systems are shallow and stubby with dark brown root tips. The critical diagnostic sign is that these plants do not respond to nitrogen or phosphorus fertilizer — only liming above pH 5.5 reverses the symptoms." },
  { question: "Can yellow maize leaves recover after treatment?", answer: "Yellow leaves that have already turned yellow do not return to green after treatment — the chlorophyll damage is permanent in those specific leaves. However, new leaves emerging after correct treatment grow green and normal, and yield potential recovers. Nitrogen-deficient maize that receives CAN at early yellowing (V4 to V6 stage) typically recovers to 85 to 95 percent of potential. Aluminium-toxic maize on unlimed soils cannot fully recover within the same season." },]);

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
                Yellow Maize Leaves in Kenya: <span className="text-gold-600">Diagnosing Soil Deficiency vs Disease</span>
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
              <p>Yellow maize leaves are the most common crop distress signal reported by Kenyan smallholder farmers, and they have at least eight distinct causes — each requiring a completely different treatment. Applying CAN to yellow maize caused by aluminium toxicity wastes money and does nothing. Applying lime to yellow maize caused by nitrogen deficiency misses the actual problem. A correct visual diagnosis takes less than 5 minutes in the field and immediately narrows the cause to one or two options. This guide provides the precise diagnostic criteria for each cause of yellow maize leaves in Kenya's farming conditions.</p>
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
