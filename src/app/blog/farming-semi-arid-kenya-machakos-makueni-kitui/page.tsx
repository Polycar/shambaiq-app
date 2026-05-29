import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("farming-semi-arid-kenya-machakos-makueni-kitui")!;

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
  { question: "What crops grow well in Machakos, Makueni, and Kitui?", answer: "The most reliable crops ranked by drought tolerance: sorghum (produces at 400mm), cowpeas, pigeon peas, green grams, cassava, millet, and sweet potatoes. Maize is feasible with drought-tolerant varieties (DUMA 43) and conservation farming but fails in drought years. Onions under drip irrigation produce exceptional returns due to dry conditions that favour bulb curing. Commercial farmers with borehole access grow tomatoes and watermelons for Nairobi markets year-round." },
  { question: "How much rainfall is needed for farming in Machakos?", answer: "Machakos County averages 700 to 900 mm of annual rainfall in two unreliable seasons — long rains (March to May) and short rains (October to December). The lower zones at 900 to 1,100m experience high inter-annual variability — a bad year can bring 400 mm, a good year over 900 mm. Water harvesting through zai pits, tied ridges, and farm ponds is not optional — it is the technology that converts unreliable rainfall into reliable crop production." },
  { question: "What fertilizer should I use in Machakos County?", answer: "Machakos alfisol soils are phosphorus-deficient (6 to 16 mg/kg) and low in organic carbon (0.6 to 1.2%). For maize and sorghum, apply DAP at 25 to 50 kg per acre at planting. Reduce CAN top-dressing in drought years — nitrogen applied to moisture-stressed crops volatilises without uptake. Compost at 2 to 3 tonnes per acre per season is the highest-return single investment because it simultaneously improves water retention, phosphorus availability, and nitrogen cycling." },
  { question: "Is drip irrigation viable for small farms in Kitui?", answer: "Drip irrigation is viable for Kitui smallholders at 0.1 to 0.5 acres using gravity-fed systems from elevated tanks or simple solar-pumped systems from shallow wells. At 0.25 acres of drip-irrigated tomatoes or onions, revenue of KES 60,000 to 150,000 per season is achievable against investment of KES 20,000 to 40,000 for basic drip infrastructure. The payback period is one to two seasons." },
  { question: "How do farmers in Makueni County manage drought?", answer: "Experienced Makueni farmers manage drought through five integrated strategies: crop diversification across drought-tolerance levels so at least one crop succeeds in any rainfall year; staggered planting dates to spread risk; water harvesting infrastructure that maximises every millimetre of rainfall; on-farm food reserves from drought-tolerant crops; and income diversification through livestock and off-farm employment." },]);

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
                Farming in Semi-Arid Kenya: <span className="text-gold-600">Precision Strategies for Machakos, Makueni, and Kitui</span>
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
              <p>Machakos, Makueni, and Kitui counties cover Kenya's largest contiguous dryland farming zone — over 36,000 square kilometres of alfisol soils receiving 400 to 800 mm of erratic annual rainfall. Conventional extension advice fails in these counties because it was developed for highland conditions and assumes rainfall regularity that does not exist here. Precision farming in semi-arid Kenya starts from a different premise: work with the rainfall that arrives rather than managing for the rainfall you hope for.</p>
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
