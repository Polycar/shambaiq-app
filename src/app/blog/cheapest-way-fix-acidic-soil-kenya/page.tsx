import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("cheapest-way-fix-acidic-soil-kenya")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil Health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Cheapest Way Fix Acidic Soil", url: `${BASE_URL}/blog/${POST.slug}` }]);

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
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil Health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Cheapest Way Fix Acidic Soil", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} /><meta itemProp="dateModified" content={POST.dateModified} /><meta itemProp="author" content="Polycarp Andabwa" /><meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=soil-health" className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Soil Health</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">Cheapest Way to Fix Acidic Soil in Kenya: <span className="text-gold-600">Lime vs Wood Ash vs Compost — Cost-Benefit Comparison</span></h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">Agricultural lime is the correct treatment for acidic soil — but at KES 700 to 900 per 50 kg bag and 20 to 50 bags per acre required, the upfront cost is a real barrier. Wood ash, compost, and organic amendments offer partial correction at lower or zero cost. This guide compares the cost-effectiveness of each approach with realistic assessments of what each can and cannot achieve.</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-400 pb-6 border-b border-cream-300">
                <AuthorCard compact /><span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span className="text-soil-300">·</span><span>{POST.readingTimeMin} min read</span>
              </div>
            </header>
            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img src={POST.image} alt={POST.imageAlt} width={1200} height={630} className="w-full h-72 object-cover" itemProp="image" loading="eager" />
            </figure>

            <section>
              <p className="text-soil-600 leading-relaxed mb-4">Agricultural lime is the correct treatment for acidic soil — but at KES 700 to 900 per 50 kg bag and 20 to 50 bags per acre required, the upfront cost is a real barrier. Wood ash, compost, and organic amendments offer partial correction at lower or zero cost. This guide compares the cost-effectiveness of each approach with realistic assessments of what each can and cannot achieve.</p>
            </section>

            <section>
              <h2 id="comparison" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost-Effectiveness Comparison: Lime vs Wood Ash vs Compost</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Soil acidity correction methods cost comparison Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Amendment", "Cost/Acre", "pH Lift", "Speed", "Extra Benefits", "Limitation"].map((h) => <th key={h} className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[["Agricultural lime (dolomitic)", "KES 10,500\u201335,000", "+1.0\u20132.5 units", "3\u20136 months", "Supplies Ca + Mg", "High upfront cost"], ["Wood ash", "Free\u2013KES 3,000", "+0.2\u20130.5 units", "1\u20133 months", "Supplies K + Ca", "Weak on pH < 5.0"], ["Compost (3\u20135 t/acre)", "KES 3,000\u20138,000", "+0.1\u20130.3 units", "2\u20134 seasons", "Water retention, N cycling", "Cannot replace lime alone"], ["Termite hill soil", "Labour only", "+0.2\u20130.4 units", "1\u20132 months", "Locally available", "Variable quality"], ["Bone meal", "KES 2,000\u20134,000", "+0.1\u20130.2 units", "2\u20134 months", "Supplies P + Ca", "Expensive per pH unit"], ["Lime + compost (recommended)", "KES 13,000\u201340,000", "+1.5\u20133.0 units", "1\u20132 seasons", "Best of both", "Highest initial investment"]].map(([method, cost, lift, speed, extra, limit], i) => (
                      <tr key={method as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-3 py-3 font-semibold text-forest-800 text-xs">{method}</td>
                        <td className="px-3 py-3 text-soil-600 text-xs">{cost}</td>
                        <td className="px-3 py-3 font-bold text-green-700 text-xs">{lift}</td>
                        <td className="px-3 py-3 text-soil-500 text-xs">{speed}</td>
                        <td className="px-3 py-3 text-xs text-forest-700">{extra}</td>
                        <td className="px-3 py-3 text-xs text-red-600">{limit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="budget-scenarios" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Three Budget Scenarios for Fixing Acidic Soil</h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[{budget: "Zero budget", cost: "KES 0\u20132,000", method: "Wood ash (1\u20132 t/acre from cooking fires) + crop residue incorporation + legume cover crop rotation. Expected pH lift: 0.3\u20130.5 units over 2\u20133 seasons. Suitable for farms at pH 5.5\u20136.0 where mild correction is sufficient.", works: "Moderate acidity only"}, {budget: "Low budget", cost: "KES 5,000\u201312,000", method: "Half-rate lime (500 kg\u20131 tonne/acre) + wood ash + compost. Expected pH lift: 0.8\u20131.5 units over 1\u20132 seasons. Most cost-effective for farms at pH 5.0\u20135.5. Prioritise the most acidic fields first and expand liming over 2\u20133 seasons.", works: "Most smallholders"}, {budget: "Full correction", cost: "KES 15,000\u201340,000", method: "Full lime rate (1.5\u20132.5 t/acre) + compost (3 t/acre). Expected pH lift: 1.5\u20132.5 units in 1 season. The most cost-effective long-term because full correction maximises fertilizer efficiency from season one. Annual maintenance lime of 300\u2013500 kg/acre sustains the correction.", works: "Best ROI long-term"}].map((s) => (
                  <div key={s.budget} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <h3 className="font-bold text-forest-800 mb-1">{s.budget}</h3>
                    <p className="text-xs text-gold-700 font-semibold mb-2">{s.cost}/acre</p>
                    <p className="text-xs text-soil-500 leading-relaxed mb-2">{s.method}</p>
                    <div className="bg-white rounded-lg p-2 text-xs text-forest-700 font-medium">{s.works}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="subsidy" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Government Lime Subsidies \u2014 Where to Check</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Several Kenya county governments have implemented lime subsidy programmes through NCPB and county agricultural offices. Availability varies by year and county budget allocation. Before purchasing lime at full retail price, check with your ward agricultural officer for current subsidy availability. Counties that have offered lime subsidies in recent years include Uasin Gishu, Kakamega, Nyeri, and Meru \u2014 though availability is not guaranteed each year.</p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">Get your farm-specific soil data and recommendations. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open ShambaIQ</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
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
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[
                    ["Lime cost/acre", "KES 10,500–35,000"],
                    ["Wood ash cost", "Free if on-farm"],
                    ["Compost pH lift", "+0.1–0.3 units"],
                    ["Lime pH lift", "+1.0–2.5 units"],
                    ["Best combo", "Lime + compost"],
                    ["Subsidy", "Check county gov"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2"><span className="text-soil-400 text-xs">{k}</span><span className="font-medium text-forest-700 text-right text-xs">{v}</span></div>
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
