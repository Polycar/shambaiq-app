import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("cheapest-way-fix-acidic-soil-kenya")!;

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
  { question: "Is wood ash a good substitute for lime in Kenya?", answer: "Wood ash partially substitutes for lime on soils at pH 5.5 to 6.0, providing meaningful correction at low or zero cost for farmers who generate it on-farm. Wood ash has a neutralising value of approximately 30 to 50 percent of agricultural lime. Apply at 1 to 2 tonnes per acre to raise pH by 0.2 to 0.5 units. It also supplies potassium and calcium. On strongly acidic soils below pH 5.0, wood ash alone cannot achieve adequate correction — agricultural lime is necessary." },
  { question: "Does compost reduce soil acidity in Kenya?", answer: "Compost raises soil pH slightly through two mechanisms: decomposing organic matter consumes hydrogen ions, and organic acids form stable complexes with aluminium, reducing its toxicity even at unchanged pH. At 3 to 5 tonnes per acre per season, compost typically raises pH by 0.1 to 0.3 units — a meaningful but partial correction. Compost and lime work better together than either alone — the combination is the most effective and cost-efficient approach for building soil health in acidic Kenyan highland soils." },
  { question: "How much does it cost to lime 1 acre in Kenya?", answer: "Liming cost depends on starting pH. At pH 5.0 to 5.5 requiring 1.5 tonnes per acre: 30 bags at KES 700 = KES 21,000. At pH 4.5 to 5.0 requiring 2 tonnes: 40 bags = KES 28,000. Lime amortises over 3 to 4 seasons — annual cost per acre is KES 5,000 to 9,000. County governments subsidise lime in some years through NCPB and agricultural offices — check with your ward agricultural officer before purchasing at full retail price." },
  { question: "What is the cheapest way to fix acidic soil without buying lime?", answer: "For farmers who cannot afford agricultural lime immediately, four low-cost or zero-cost approaches provide partial correction: wood ash at 1 to 2 tonnes per acre (zero cost if generated on-farm), termite hill soil which is naturally alkaline at 2 to 3 tonnes per acre, bone meal at 100 to 200 kg per acre on mildly acidic soils, and compost at 3 to 5 tonnes per acre which improves pH buffering. None of these fully substitute for lime on strongly acidic soils below pH 5.0." },
  { question: "Which lime is cheapest in Kenya — agricultural lime, dolomite, or calcite?", answer: "Agricultural lime price varies significantly by region. In the Rift Valley near Eldoret and Nakuru (close to limestone deposits), prices range from KES 600 to 750 per 50 kg bag. In Western Kenya, transport costs push prices to KES 700 to 900 per bag. In Meru and Nyeri, prices reach KES 800 to 1,000 per bag. Dolomitic lime is 10 to 15 percent more expensive than calcitic but provides magnesium that Meru and Nyeri's leached soils need — making it better value for these counties. Bulk purchase through cooperatives typically reduces price by 15 to 25 percent." },]);

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
                Cheapest Way to Fix Acidic Soil in Kenya: <span className="text-gold-600">Lime vs Wood Ash vs Compost — Cost-Benefit Comparison</span>
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
              <p>Agricultural lime is the correct treatment for acidic soil in Kenya — but at KES 700 to 900 per 50 kg bag and 20 to 50 bags per acre required, the upfront cost is a real barrier for smallholder farmers. Wood ash, compost, and other organic amendments offer partial correction at lower cost or zero cost for farmers who generate these materials on-farm. This guide compares the cost-effectiveness of each approach for different starting pH levels and farm sizes, with realistic assessments of what each amendment can and cannot achieve.</p>
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
