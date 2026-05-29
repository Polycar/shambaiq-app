import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("dap-vs-can-vs-npk-fertilizer-guide-kenya")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: POST.category, url: `${BASE_URL}/blog?category=${POST.category}` }, { name: POST.title, url: `${BASE_URL}/blog/${POST.slug}` }]);
const faqSchema = makeFAQSchema([
  { question: "What is DAP fertilizer used for in Kenya?", answer: "DAP (Di-Ammonium Phosphate, 18:46:0) is used as a basal fertilizer applied at planting to supply phosphorus for root development and early plant establishment. It is appropriate for most Kenyan highland crops on acidic to neutral soils — maize, wheat, potato, vegetables, and beans — applied in the planting furrow at 50 kg per acre. It is NOT appropriate on alkaline soils above pH 7.5 (Kajiado, Narok, parts of Baringo) where the diammonium component raises pH further and damages roots. On these soils substitute NPK 17:17:17 or rock phosphate." },
  { question: "What is the difference between CAN and urea in Kenya?", answer: "Both CAN and urea supply nitrogen for top-dressing, but they differ in form and behaviour. CAN (Calcium Ammonium Nitrate, 26% N) contains both ammonium and nitrate nitrogen — nitrate is immediately plant-available while ammonium is taken up more slowly. CAN also contains 8 percent calcium, making it the correct top-dress choice on calcium-deficient soils. Urea (46% N) contains only amide nitrogen that must first convert to ammonium and then nitrate in the soil — a process that takes 5 to 10 days and loses 20 to 30 percent to volatilisation if applied to the soil surface in hot conditions. CAN is generally more reliable for smallholder use in Kenya's variable conditions. Urea is cheaper per unit of nitrogen and appropriate where application can be incorporated or timed before rain." },
  { question: "When should I use NPK 17:17:17 in Kenya?", answer: "NPK 17:17:17 is a balanced compound fertilizer appropriate when a crop requires nitrogen, phosphorus, and potassium simultaneously at equivalent rates. It is the correct choice for: vegetable crops in early growth (cabbages, tomatoes, onions) where balanced nutrition supports rapid establishment; alkaline soils where DAP's ammonium content is problematic; situations where a single application must supply all three macronutrients. It is NOT efficient for maize at planting where phosphorus is the primary need — DAP at 50 kg per acre is more economical than NPK 17:17:17 at 50 kg per acre for the same phosphorus dose." },
  { question: "Can I mix DAP and CAN fertilizers in Kenya?", answer: "Do not mix DAP and CAN in the same application. The ammonium from DAP reacts with the calcium in CAN to form calcium phosphate complexes that reduce phosphorus availability. Apply DAP at planting and CAN separately at knee height — this is the standard Kenyan maize fertilizer programme and the timing separation ensures maximum efficiency from both products. You can store them in the same shed but should not combine them in the spreader or by hand." },
  { question: "How much fertilizer per acre of maize in Kenya?", answer: "The standard KEPHIS-recommended programme for Kenya highland maize is: 50 kg DAP (1 bag) at planting in the furrow + 50 kg CAN (1 bag) at knee height as a top-dress. On soils below pH 5.5, add 1 to 2 tonnes of dolomitic lime at least 3 weeks before planting. On soils with confirmed potassium deficiency (below 80 mg/kg), add 25 kg muriate of potash at planting alongside DAP. Total cost at current prices: approximately KES 7,700 per acre for the basic DAP + CAN programme." },
]);

const TOC_ITEMS: TOCItem[] = [
  { id: "what-is-dap", label: "DAP — What It Is and When to Use It", level: 2 },
  { id: "what-is-can", label: "CAN — The Top-Dress Nitrogen Source", level: 2 },
  { id: "what-is-npk", label: "NPK 17:17:17 — The Balanced Option", level: 2 },
  { id: "comparison-table", label: "Side-by-Side Comparison", level: 2 },
  { id: "by-crop", label: "Which Fertilizer for Which Crop", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

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
                DAP vs CAN vs NPK Fertilizer: <span className="text-gold-600">The Definitive Comparison</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Walk into any Kenyan agrovet and you face the same three products on the shelf: DAP, CAN, and NPK 17:17:17. Most farmers buy what their neighbour uses or what the agrovet recommends without understanding what each product actually does in their specific soil. The wrong choice wastes money — applying DAP to alkaline Kajiado soil raises pH further and damages onion roots; applying CAN to beans suppresses nitrogen fixation that would have supplied nitrogen for free; applying NPK 17:17:17 to phosphorus-saturated highland soil provides phosphorus that does nothing while charging premium price for it. This guide explains what each product does and when to use which.
              </p>
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

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">Get your county-specific soil data and fertilizer recommendations instantly. Free, no sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open ShambaIQ Tool</Link>
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
            <div className="sticky top-6">
              <TableOfContents items={TOC_ITEMS} />
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="Related Guides" />
      </div>
    </>
  );
}
