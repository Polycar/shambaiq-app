import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("organic-soil-restoration-machakos")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Organic soil restoration Machakos", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What is the best cover crop for Machakos dryland soils?", answer: "Pigeon peas are the single best cover crop for Machakos dryland conditions. They are drought-tolerant to 600 mm annual rainfall, fix 40 to 80 kg of atmospheric nitrogen per acre per season, produce deep tap roots that break compacted alfisol hardpan, add significant organic matter through leaf litter, and produce an edible grain that provides income. Cowpeas are the second-best choice — faster-growing than pigeon peas and better suited to the shortest planting windows during unreliable short rains. Get a Machakos-specific rotation plan at shambaiq.com/app?county=machakos." },
  { question: "How much compost does Machakos soil need per acre?", answer: "Machakos alfisol soils with organic carbon below 1.2 percent benefit significantly from 2 to 5 tonnes of compost per acre per season. At 2 tonnes per acre, organic carbon increases by approximately 0.1 to 0.2 percent per season. Reaching the target of 2 percent organic carbon from a starting point of 0.8 percent requires consistent application over 3 to 5 seasons. Compost made from crop residues, animal manure, and green biomass on-farm is the most cost-effective source — purchasing compost at Machakos market prices makes the economics difficult." },
  { question: "How do I retain moisture in Machakos semi-arid soils?", answer: "Four moisture conservation techniques work together on Machakos alfisol soils. Zai pits — small planting basins 20 to 30 cm diameter, 15 cm deep, spaced 60 to 80 cm apart — concentrate water and organic matter at the root zone during rainfall and reduce runoff by 40 to 60 percent. Tied ridges across the slope contour intercept runoff before it leaves the field. Mulching with crop residues reduces surface evaporation by 30 to 50 percent. Cover cropping with pigeon peas or cowpeas between maize rows maintains soil cover that dramatically reduces evaporation during dry spells." },
  { question: "Why is Machakos soil poor despite historical farming?", answer: "Machakos has been farmed intensively for over a century. The original terracing systems built by the Akamba people maintained soil organic matter and prevented erosion through careful land management. Progressive land subdivision over generations has reduced farm sizes below the threshold where traditional fallow rotations are practical. Continuous cropping without organic matter replacement progressively depletes organic carbon, weakens soil structure, and reduces water-holding capacity. The degradation is not permanent — organic matter can be rebuilt — but it requires deliberate management rather than the input-only approach that has dominated extension advice for the past three decades." },
  { question: "What drought-tolerant crops should I grow in Machakos?", answer: "For Machakos' 500 to 800 mm annual rainfall with high variability, the most reliable crops ranked by drought tolerance are: sorghum (most tolerant — produces some yield even at 400 mm), cowpeas, pigeon peas, cassava, green grams, and millet. Maize is feasible but requires drought-tolerant varieties (DUMA 43, H614D) and moisture conservation practices. Beans perform adequately in years with above-average rainfall but fail in dry years. Avoid irrigated vegetables unless you have a reliable water source — the investment in water infrastructure is difficult to recover from a single failed season." },
]);

const howToSchema = makeHowToSchema({
  name: "How to build soil organic matter in Machakos dryland farms",
  description: "A step-by-step guide to restoring organic carbon, improving moisture retention, and rebuilding soil health on Machakos alfisol soils using cover crops, compost, and conservation farming techniques.",
  totalTime: "P365D",
  estimatedCost: { currency: "KES", value: "5000–15000 per acre per season" },
  supply: ["Pigeon pea or cowpea seed for cover cropping", "Compost or farmyard manure", "Maize stover and crop residues for mulch"],
  tool: ["Hand hoe for zai pits", "Ox plough for tied ridges", "ShambaIQ precision tool"],
  steps: [
    { name: "Baseline your soil organic carbon with ShambaIQ", text: "Use ShambaIQ at shambaiq.com/app?county=machakos to get your farm's current organic carbon reading. Machakos soils commonly show 0.6 to 1.2 percent organic carbon — below the 2 percent minimum for good soil structure and water retention. Knowing your starting point lets you track improvement season by season." },
    { name: "Dig zai pits for water harvesting before the rains", text: "Dig zai pits (small planting basins 20 cm diameter, 15 cm deep) during the dry season before rain arrives. Space at 60 cm within rows and 80 cm between rows. Fill each pit with a double handful of compost or aged manure. When rain comes, water concentrates in the pits rather than running off — extending effective moisture availability by 2 to 3 weeks beyond normal rainfall." },
    { name: "Plant drought-tolerant crops with pigeon pea interrows", text: "Plant maize or sorghum in the zai pits at the first reliable rainfall. Between every two maize rows, plant a row of pigeon peas as an intercrop. Pigeon peas do not compete significantly with maize during the first 6 weeks while maize is establishing, then continue growing after maize harvest to fix nitrogen and add leaf litter organic matter through the dry season." },
    { name: "Never burn crop residues — mulch instead", text: "After maize harvest, cut stalks at ground level and lay them flat between the crop rows as mulch. A 5 to 8 cm layer of maize stover mulch reduces soil surface evaporation by 30 to 50 percent, moderates soil temperature by 3 to 5 degrees Celsius, and decomposes over 6 to 12 months to add organic matter. Burning destroys months of organic matter accumulation and releases carbon that took the entire season to fix." },
    { name: "Build a compost system using on-farm materials", text: "Establish a simple compost heap using crop residues, animal manure, kitchen waste, and green biomass from pigeon pea prunings. Layer 30 cm of dry material with 10 cm of green material and a thin layer of soil. Water to maintain moisture. Compost is ready in 2 to 3 months. Apply at 2 to 3 tonnes per acre per season — the equivalent of 40 to 60 wheelbarrow loads for a one-acre plot." },
    { name: "Build tied ridges for season-long moisture conservation", text: "At the start of each season, form ridges across the slope contour using a jembe or ox plough. Every 3 to 4 metres along the ridge, leave a small cross-ridge (tie) that creates a series of connected water storage basins. Tied ridges reduce runoff by 40 to 70 percent on Machakos' gently sloping alfisol soils — capturing rainfall that would otherwise leave the field and be unavailable to crops." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "machakos-soil-crisis", label: "Machakos soil degradation — understanding the problem", level: 2 },
  { id: "soil-data", label: "Machakos soil organic carbon data", level: 2 },
  { id: "cover-crops", label: "Cover crops — pigeon peas and cowpeas", level: 2 },
  { id: "water-harvesting", label: "Water harvesting — zai pits and tied ridges", level: 2 },
  { id: "composting", label: "On-farm composting strategy", level: 2 },
  { id: "drought-crops", label: "Drought-tolerant crop selection", level: 2 },
  { id: "howto", label: "Step-by-step restoration guide", level: 2 },
  { id: "faq", label: "Frequently asked questions", level: 2 },
];

export default function OrganicSoilMachakosPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "Soil health", url: `${BASE_URL}/blog?category=soil-health` }, { name: "Organic soil restoration Machakos", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=soil-health" className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">Soil health</Link>
                <Link href="/soil/machakos" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Machakos County</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Building soil organic matter in Machakos:
                <span className="text-gold-700">A dryland restoration guide</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Machakos County's alfisol soils were once highly productive under the traditional land management systems that built the famous Machakos terraces. Decades of continuous cropping, land fragmentation, and removal of organic matter have reduced soil organic carbon to below 1 percent across large areas — well below the 2 percent minimum needed for adequate water retention and nutrient cycling. The good news is that organic matter can be rebuilt, and in Machakos the tools — pigeon peas, zai pits, tied ridges, and on-farm composting — are inexpensive and proven.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-500 pb-6 border-b border-cream-300">
                <AuthorCard compact />
                <span className="text-soil-300 hidden sm:block">·</span>
                <time dateTime={POST.datePublished}>{new Date(POST.datePublished).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span className="text-soil-300">·</span>
                <span>{POST.readingTimeMin} min read</span>
              </div>
            </header>

            <figure className="mb-8 rounded-2xl overflow-hidden bg-cream-200">
              <img src={POST.image} alt={POST.imageAlt} width={1200} height={630} className="w-full h-72 object-cover" itemProp="image" loading="eager" />
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Pigeon pea cover crop growing in degraded dryland soil in Machakos County. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="machakos-soil-crisis" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Machakos soil degradation — understanding the problem</h2>
              <p className="text-soil-600 leading-relaxed mb-4">ShambaIQ's precision soil mapping of Machakos County reveals that organic carbon across much of the county averages 0.6 to 1.2 percent — well below the 2 percent threshold that soil scientists use as the minimum for a functionally productive agricultural soil. At these levels the consequences are compounding and interconnected.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { problem: "Low water-holding capacity", detail: "Organic matter acts like a sponge — each 1 percent increase in organic carbon increases the soil's water-holding capacity by approximately 20 litres per square metre. At 0.8 percent organic carbon, Machakos soils hold roughly 40 percent less water per rainfall event than they would at 2 percent. In a county where annual rainfall averages 500 to 700 mm, losing 40 percent of each rainfall event to runoff and rapid drainage is the difference between a viable crop and crop failure." },
                  { problem: "Structural collapse and crusting", detail: "Organic matter binds soil particles into stable aggregates. Below 1 percent, Machakos alfisol soils lose aggregation and the surface seals under rainfall impact, forming a crust that reduces infiltration by 60 to 80 percent. Water runs off rather than entering the soil. The crust also physically restricts seedling emergence, particularly for small-seeded crops like sorghum and green grams." },
                  { problem: "Reduced nitrogen cycling", detail: "Soil microbes that mineralise nitrogen from organic matter need organic carbon as their energy source. At 0.8 percent organic carbon, microbial biomass is low and nitrogen cycling is slow — meaning applied fertilizer must compensate for the natural nitrogen supply that a healthy soil would provide. This creates a dependency on purchased inputs that breaks down in drought years when farmers cannot afford fertilizer." },
                  { problem: "Hardpan development", detail: "Machakos alfisol soils develop a cemented hardpan layer at 20 to 35 cm depth when continuously tilled at the same depth under low organic matter conditions. This hardpan blocks root penetration, restricts water drainage into deeper soil layers, and forces crops into a very shallow root zone that exhausts available moisture within days of the last rainfall. Breaking hardpan requires deep subsoiling or persistent deep-rooted cover crops like pigeon peas." },
                ].map((item) => (
                  <div key={item.problem} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-2 text-sm">{item.problem}</h3>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Machakos soil organic carbon data</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Machakos County soil organic carbon and nutrient data from precision soil mapping</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Parameter", "Machakos average", "Target for good farming", "Gap", "Primary fix"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Organic Carbon (%)", "0.6 – 1.2%", "> 2.0%", "Critical", "Cover crops + compost"],
                      ["Soil pH", "5.8 – 6.8", "6.0 – 7.0", "Adequate", "Monitor — lime if below 5.8"],
                      ["Total Nitrogen (g/kg)", "0.6 – 1.0", "> 1.2 g/kg", "Low", "Legume rotation + compost"],
                      ["Phosphorus (mg/kg)", "6 – 16", "> 15 mg/kg", "Deficient", "DAP at planting"],
                      ["Potassium (mg/kg)", "120 – 250", "> 100 mg/kg", "Adequate", "No K supplement needed"],
                      ["Water retention (mm/100mm soil)", "8 – 12 mm", "> 18 mm", "Low", "Organic matter restoration"],
                    ].map(([param, avg, target, gap, fix], i) => (
                      <tr key={param as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800 text-xs">{param}</td>
                        <td className="px-4 py-3 text-soil-600">{avg}</td>
                        <td className="px-4 py-3 text-soil-500">{target}</td>
                        <td className="px-4 py-3 font-medium">{gap}</td>
                        <td className="px-4 py-3 text-xs text-soil-500">{fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-500 mb-4">Source: ShambaIQ precision soil mapping, Machakos County average. <Link href="/app?county=machakos" className="text-gold-700 hover:underline">Get your farm-specific organic carbon reading here.</Link></p>
            </section>

            <section>
              <h2 id="cover-crops" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cover crops — why pigeon peas are Machakos's best tool</h2>
              <p className="text-soil-600 leading-relaxed mb-5">A single cover crop species does more for Machakos soil health than any combination of purchased inputs. Pigeon peas fix nitrogen, break hardpan, add organic matter, provide grain income, and tolerate the exact rainfall conditions that Machakos experiences.</p>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Cover crop comparison for Machakos dryland conditions</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Cover crop", "Drought tolerance", "N fixation (kg/acre)", "Hardpan breaking", "Income potential", "Best use"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Pigeon pea", "High (> 500 mm)", "40 – 80 kg", "Excellent (deep taproot)", "High — grain market", "Primary cover crop — interrow between maize"],
                      ["Cowpea", "High (> 400 mm)", "30 – 60 kg", "Moderate", "Good — grain and leaf vegetable", "Short rains when season too short for pigeon pea"],
                      ["Green gram", "Moderate (> 500 mm)", "20 – 40 kg", "Low", "High per kg — niche market", "Sole crop in reliable rainfall years"],
                      ["Mucuna (velvet bean)", "Moderate", "80 – 120 kg", "Good", "Low — not edible", "Fallow improvement only — not for intercropping"],
                    ].map(([crop, drought, n, hardpan, income, use], i) => (
                      <tr key={crop as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800">{crop}</td>
                        <td className="px-4 py-3 text-soil-600 text-xs">{drought}</td>
                        <td className="px-4 py-3 text-soil-500">{n}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{hardpan}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{income}</td>
                        <td className="px-4 py-3 text-xs text-forest-700">{use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="water-harvesting" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Water harvesting — zai pits and tied ridges</h2>
              <p className="text-soil-600 leading-relaxed mb-5">In semi-arid Machakos, the primary limiting factor is not total rainfall but rainfall capture. Two low-cost technologies capture 40 to 70 percent more of each rainfall event for crop use.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { technique: "Zai pits", cost: "Labour only — KES 2,000–4,000/acre", howto: "Dig planting basins 20–30 cm diameter, 15 cm deep, spaced 60 cm within rows and 80 cm between rows. Fill each pit with a double handful of compost before planting. When rain falls, water concentrates in pits rather than running off. Organic matter in the pit feeds soil microbes that dramatically improve local soil structure within 2 to 3 seasons.", benefit: "40–60% runoff reduction. 2–3 week moisture extension after rainfall. Progressive soil improvement at the root zone." },
                  { technique: "Tied ridges", cost: "Ox plough time — KES 1,500–2,500/acre", howto: "Plough ridges across the slope contour. Every 3 to 4 metres along the ridge, leave a small cross-tie that creates a connected series of water storage basins across the entire field. Water is intercepted before it can flow downhill and held in the field for gradual infiltration.", benefit: "40–70% runoff reduction. Effective across all Machakos slope gradients below 15 percent. Combines well with mulching for maximum retention." },
                ].map((item) => (
                  <div key={item.technique} className="bg-forest-50 border border-forest-200 rounded-xl p-5">
                    <h3 className="font-semibold text-forest-800 mb-1">{item.technique}</h3>
                    <p className="text-xs text-gold-700 font-medium mb-3">{item.cost}</p>
                    <p className="text-xs text-forest-700 leading-relaxed mb-3">{item.howto}</p>
                    <div className="bg-white rounded-lg p-2 text-xs text-forest-600 font-medium">{item.benefit}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="drought-crops" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Drought-tolerant crop selection for Machakos</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Drought-tolerant crop rankings for Machakos County Kenya</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Crop", "Min rainfall (mm)", "Season length", "Market", "Reliability"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Sorghum", "400", "90 – 120 days", "NCPB + local brewers", "Very high"],
                      ["Cowpeas", "400", "60 – 75 days", "Local + Nairobi", "High"],
                      ["Pigeon peas", "500", "150 – 200 days", "Local + export", "High"],
                      ["Cassava", "450", "9 – 18 months", "Local", "Very high"],
                      ["Green grams", "500", "60 – 70 days", "Premium local", "Moderate"],
                      ["Maize (DUMA 43)", "600", "90 – 100 days", "NCPB + local", "Moderate"],
                    ].map(([crop, rain, season, market, rel], i) => (
                      <tr key={crop as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-semibold text-forest-800">{crop}</td>
                        <td className="px-4 py-3 text-soil-600">{rain}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{season}</td>
                        <td className="px-4 py-3 text-soil-500 text-xs">{market}</td>
                        <td className="px-4 py-3 font-medium">{rel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-step: building soil organic matter in Machakos</h2>
              <ol className="space-y-4">
                {howToSchema.step.map((step: { name: string; text: string }, i: number) => (
                  <li key={i} className="flex gap-4 bg-white border border-cream-300 rounded-xl p-5" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                    <div className="w-9 h-9 rounded-full bg-forest-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <div>
                      <h3 className="font-semibold text-forest-800 mb-1" itemProp="name">{step.name}</h3>
                      <p className="text-sm text-soil-500 leading-relaxed" itemProp="text">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ shows your Machakos farm's current organic carbon level and gives you a season-by-season restoration plan using cover crops and composting. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Machakos Arid Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/machakos", label: "Machakos county soil report" },
                  { href: "/crops/pigeon-peas", label: "Pigeon peas crop guide" },
                  { href: "/blog/farming-semi-arid-kenya-machakos-makueni-kitui", label: "Semi-arid Kenya farming guide" },
                  { href: "/soil/makueni", label: "Makueni county — compare" },
                  { href: "/dealers/machakos", label: "Agrovets in Machakos county" },
                  { href: "/zones/semi-arid", label: "Semi-arid zone guide" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 text-soil-500 hover:text-forest-700 transition-colors py-1">
                    <span className="text-gold-500 flex-shrink-0">→</span>{label}
                  </Link>
                ))}
              </div>
            </aside>

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Frequently asked questions</h2>
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
            <div className="sticky top-6 space-y-6">
              <TableOfContents items={TOC_ITEMS} />
              <div className="bg-cream-100 border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-700 mb-3">Machakos quick facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Semi-Arid"], ["Altitude", "1,000 – 1,800 m"], ["Avg Rainfall", "500 – 800 mm/yr"], ["Soil Type", "Alfisol"], ["Avg OC", "0.6 – 1.2%"], ["Hardpan", "Common at 20–35 cm"], ["Priority", "Organic matter first"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-500">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/machakos" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:text-gold-700 transition-colors">Full Machakos Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-500 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "makueni", name: "Makueni" }, { slug: "kitui", name: "Kitui" }, { slug: "kajiado", name: "Kajiado" }, { slug: "nairobi", name: "Nairobi" }].map(({ slug, name }) => (
                    <Link key={slug} href={`/soil/${slug}`} className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>{name} County</span><span className="text-gold-500 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More soil health guides" />
      </div>
    </>
  );
}
