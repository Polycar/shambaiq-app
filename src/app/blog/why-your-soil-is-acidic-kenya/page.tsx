import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("why-your-soil-is-acidic-kenya")!;

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
  { question: "What causes soil acidity in Kenya?", answer: "Three mechanisms cause soil acidity in Kenya. First, geological origin: Kenya's highland counties were formed from volcanic rocks that weather to inherently acidic clay minerals. Second, rainfall leaching: Kenya's humid highland zones receive 900 to 1,800 mm of annual rainfall that progressively carries calcium, magnesium, and potassium out of the topsoil, leaving hydrogen and aluminium ions dominant. Third, nitrogen fertilizer acidification: every kilogram of urea or CAN applied acidifies the soil slightly through the nitrification process. Farmers who have applied high nitrogen inputs for 10 to 15 seasons without liming have progressively acidified their soils. Most Kenyan soils experience all three causes simultaneously." },
  { question: "How do I know if my soil is acidic?", answer: "The most reliable way is a soil pH test — either through ShambaIQ's precision mapping at shambaiq.com or a physical soil test kit available from county agriculture offices and some agrovets. Without a test, these field indicators suggest acidity below pH 5.5: stunted, yellowing maize despite fertilizer application; pale green rather than deep green leaf colour; plants that respond poorly to CAN top-dressing; frequent crop failures in specific low-lying or high-altitude sections of a farm; and visible aluminium toxicity symptoms including short, stubby root systems when you pull plants." },
  { question: "How do I fix acidic soil in Kenya?", answer: "Agricultural lime is the primary treatment. Apply dolomitic lime (calcium magnesium carbonate) at 1 to 2.5 tonnes per acre depending on starting pH — get your exact rate from ShambaIQ at shambaiq.com. Incorporate lime to 15 cm depth at least 4 weeks before planting. For maintenance, apply 300 to 500 kg per acre annually after harvest to offset ongoing acidification from nitrogen fertilizers and rainfall. Wood ash at 1 to 2 tonnes per acre provides a supplementary correction on moderately acidic soils pH 5.5 to 6.0. Compost and organic matter also raise pH slightly while building soil structure." },
  { question: "Does CAN make soil more acidic?", answer: "Yes — CAN (Calcium Ammonium Nitrate) acidifies soil slightly with each application. The ammonium component nitrifies in the soil, releasing two hydrogen ions per nitrogen molecule in the process. At the standard application rate of 50 kg per acre per season, CAN lowers soil pH by approximately 0.1 to 0.2 units per season. Over 10 seasons of continuous application without liming, this cumulative acidification equals 1 to 2 pH units — a shift from pH 6.5 to 4.5 to 5.5 is entirely explainable by CAN use without lime maintenance. Urea acidifies even more strongly than CAN per unit of nitrogen applied." },
  { question: "What pH should Kenya farm soil be?", answer: "For most Kenya food crops, the target pH range is 6.0 to 6.5. At this range: aluminium is insoluble and non-toxic, phosphorus availability is maximised, nitrogen cycling by soil microbes is optimal, calcium and magnesium are available in adequate quantities, and most micronutrients are accessible. Tea performs best at pH 4.5 to 5.5 and should not be limed. Onions on alkaline Kajiado soils perform well at pH 6.5 to 7.5 and should not be over-corrected. For everything else — maize, beans, vegetables, coffee, potato — targeting pH 6.0 to 6.5 is the universal starting point." },
]);

const TOC_ITEMS: TOCItem[] = [
  { id: "cause-1-geology", label: "Cause 1: Volcanic Parent Material", level: 2 },
  { id: "cause-2-leaching", label: "Cause 2: Rainfall Leaching", level: 2 },
  { id: "cause-3-fertilizer", label: "Cause 3: Nitrogen Fertilizer Acidification", level: 2 },
  { id: "symptoms", label: "Recognising Acidity — Field Symptoms", level: 2 },
  { id: "lime-treatment", label: "The Lime Treatment Programme", level: 2 },
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
                Why Your Soil Is Acidic in Kenya — 3 Causes and How to Fix Them: <span className="text-gold-600">The Causes and Cures</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Soil acidity is Kenya's most widespread and most under-diagnosed crop yield problem. Across the Central Highlands, Western Kenya, and the Mount Kenya counties, more than 60 percent of agricultural land has soil pH below 5.5 — a threshold where aluminium becomes toxic, phosphorus locks out, and nitrogen fertilizer efficiency drops by 30 to 50 percent. Most farmers know their soil is 'bad' but not why, or what specifically to do about it. This guide explains the three causes of soil acidity in Kenya's specific context and the three tools that reverse it.
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
