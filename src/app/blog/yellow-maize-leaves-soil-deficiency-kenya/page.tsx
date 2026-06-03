import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("yellow-maize-leaves-soil-deficiency-kenya")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Diagnostic guides", url: `${BASE_URL}/blog?category=diagnostic-guides` }, { name: "Yellow maize leaves diagnosis", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "Coming soon", answer: "This section is being updated with detailed FAQ content." },
]);
const TOC_ITEMS: TOCItem[] = [
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function Page() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Diagnostic guides", url: `${BASE_URL}/blog?category=diagnostic-guides` }, { name: "Yellow maize leaves diagnosis", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=diagnostic-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Diagnostic guides</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Yellow maize leaves in Kenya:
                <span className="text-gold-700">Diagnosing soil deficiency vs disease</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">Yellow maize leaves are the most common distress signal from Kenyan farms, with at least eight distinct causes requiring completely different treatments. Applying CAN to yellow maize caused by aluminium toxicity wastes money. Applying lime to nitrogen deficiency misses the problem. This guide provides the precise diagnostic criteria for each cause.</p>
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
              <p className="text-soil-600 leading-relaxed mb-4">Yellow maize leaves are the most common distress signal from Kenyan farms, with at least eight distinct causes requiring completely different treatments. Applying CAN to yellow maize caused by aluminium toxicity wastes money. Applying lime to nitrogen deficiency misses the problem. This guide provides the precise diagnostic criteria for each cause.</p>
            </section>

            <section>
              <h2 id="diagnosis-table" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Visual diagnosis guide: 8 causes of yellow maize leaves</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Yellow maize leaf diagnosis guide Kenya soil deficiency vs disease</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Cause", "Pattern", "Leaves affected", "Other signs", "Fix", "Response time"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Nitrogen deficiency", "V-shaped from tip to midrib", "Lower/older first", "Pale green overall", "CAN 50 kg/acre", "5\u20137 days"], ["Aluminium toxicity", "Uniform pale wash", "All leaves", "Stubby brown roots", "Lime \u2014 next season", "Next season"], ["Phosphorus deficiency", "Purple-red tint", "Lower leaves", "Cold soil, slow growth", "DAP at planting", "2\u20133 weeks"], ["Zinc deficiency", "Interveinal stripes", "Young/upper leaves", "Common pH > 7.5", "ZnSO4 foliar 2g/L", "7\u201310 days"], ["Sulfur deficiency", "Uniform pale yellow", "Youngest leaves", "No response to CAN", "AmSulfate foliar", "7\u201310 days"], ["Grey leaf spot", "Rectangular grey lesions", "Lower first", "Lesions between veins", "Propiconazole spray", "Stops spread"], ["Corn leaf blight", "Cigar-shaped tan lesions", "Upper canopy", "Cool humid conditions", "Mancozeb spray", "Stops spread"], ["Maize streak virus", "Bright yellow streaks", "All leaves", "Parallel to veins", "Remove plants \u2014 no cure", "N/A"]].map(([cause, pattern, leaves, signs, fix, time], i) => (
                      <tr key={cause as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-semibold text-forest-800 text-xs">{cause}</td>
                        <td className="px-3 py-3 text-xs text-soil-600">{pattern}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{leaves}</td>
                        <td className="px-3 py-3 text-xs text-soil-500">{signs}</td>
                        <td className="px-3 py-3 text-xs text-forest-700 font-medium">{fix}</td>
                        <td className="px-3 py-3 text-xs text-gold-700">{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="n-vs-al" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Nitrogen deficiency vs aluminium toxicity \u2014 the critical distinction</h2>
              <p className="text-soil-600 leading-relaxed mb-4">These two causes look similar from a distance but require opposite treatments. Getting the diagnosis wrong costs an entire season.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[{type: "Nitrogen deficiency", pattern: "V-shaped yellowing starting from leaf tips on LOWER leaves, spreading upward. Midrib stays slightly greener. Plant responds visibly to CAN within 5\u20137 days.", rootTest: "Roots are normal \u2014 white tips, branching pattern intact.", action: "Apply CAN 50 kg/acre immediately. Response is fast.", color: "bg-amber-50 border-amber-200"}, {type: "Aluminium toxicity (low pH)", pattern: "Uniform pale, washed-out yellowing across ALL leaves. Plants are stunted overall \u2014 shorter than normal with fewer leaves. Does NOT respond to CAN application.", rootTest: "Pull the plant \u2014 roots are short, stubby, thickened, with BROWN tips. This is the definitive diagnostic sign.", action: "Lime required. CAN will not help. Benefit comes next season after pH correction.", color: "bg-red-50 border-red-200"}].map((item) => (
                  <div key={item.type} className={`${item.color} border rounded-xl p-5`}>
                    <h3 className="font-bold text-forest-800 mb-2">{item.type}</h3>
                    <div className="space-y-2 text-xs text-soil-600">
                      <div><span className="font-semibold text-forest-700">Pattern: </span>{item.pattern}</div>
                      <div><span className="font-semibold text-forest-700">Root test: </span>{item.rootTest}</div>
                      <div className="bg-white rounded-lg p-2 font-medium text-forest-700">{item.action}</div>
                    </div>
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
                  { href: "/app", label: "Check your farm soil" },
                  { href: "/blog", label: "All blog posts" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 text-soil-500 hover:text-forest-700 transition-colors py-1"><span className="text-gold-500 flex-shrink-0">→</span>{label}</Link>
                ))}
              </div>
            </aside>

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Frequently asked questions</h2>
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Quick facts</p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Most common cause", "N deficiency"],
                    ["Most missed cause", "Al toxicity (low pH)"],
                    ["Quick test", "Pull roots — brown tips = Al"],
                    ["N fix", "CAN 50 kg immediately"],
                    ["Al fix", "Lime — next season"],
                    ["Zinc fix", "Foliar ZnSO4 2g/L"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2"><span className="text-soil-500 text-xs">{k}</span><span className="font-medium text-forest-700 text-right text-xs">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="Related guides" />
      </div>
    </>
  );
}
