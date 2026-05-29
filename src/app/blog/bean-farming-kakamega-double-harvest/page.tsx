import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorCard from "@/components/AuthorCard";
import RelatedPosts from "@/components/RelatedPosts";
import TableOfContents, { TOCItem } from "@/components/TableOfContents";
import { makeArticleSchema, makeBreadcrumbSchema, makeFAQSchema, makeHowToSchema, BASE_URL, WEBSITE_SCHEMA, ORGANIZATION } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const POST = getPostBySlug("bean-farming-kakamega-double-harvest")!;

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
const breadcrumbSchema = makeBreadcrumbSchema([{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Bean Farming in Kakamega", url: `${BASE_URL}/blog/${POST.slug}` }]);

const faqSchema = makeFAQSchema([
  { question: "What fertilizer should I use for beans in Kakamega?", answer: "Beans in Kakamega's leached acidic soils need phosphorus at planting but should not receive nitrogen fertilizer. Apply rock phosphate or DAP at 25 to 30 kg per acre directly into the planting furrow. Do not add CAN, urea, or any nitrogen — beans fix their own nitrogen through Rhizobium bacteria in root nodules. Adding nitrogen fertilizer suppresses nodule formation and wastes money while reducing the natural N-fixation that makes beans so valuable in a rotation. With Rhizobium inoculant and rock phosphate, Kakamega bean farmers can produce 8 to 12 bags per acre with virtually zero nitrogen cost. Get a farm-specific plan at shambaiq.com/app?county=kakamega&crop=beans." },
  { question: "What is Rhizobium inoculant and how do I use it for beans in Kakamega?", answer: "Rhizobium is a soil bacterium that forms symbiotic nodules on bean roots, converting atmospheric nitrogen into plant-available form. Commercial inoculant is a peat or liquid formulation containing high concentrations of the correct Rhizobium strain for beans (Rhizobium leguminosarum bv. phaseoli). To use: mix bean seed with inoculant paste (follow package directions, typically 5 to 10 g per kg of seed) immediately before planting. Keep inoculated seed out of direct sunlight. Plant the same day as inoculation. Inoculant costs approximately KES 200 to 400 per acre and replaces nitrogen inputs worth KES 1,500 to 2,500 per acre." },
  { question: "What bean varieties are best for Kakamega County?", answer: "For Kakamega's humid Western Kenya conditions, certified varieties with angular leaf spot and bean common mosaic virus tolerance perform best. Kenya Mavuno and Jesca are the two KEPHIS-certified varieties most widely grown by Kakamega commercial bean farmers. Wairimu DM1 is preferred for the Nairobi dry bean market. Rose Coco varieties (Mwitemania, Lyamungu) suit the fresh pod market. Avoid recycled seed from previous seasons — bean seed degrades rapidly with viruses that reduce yield by 30 to 50 percent over two to three generations." },
  { question: "How do I manage bean common mosaic virus in Kakamega?", answer: "Bean Common Mosaic Virus (BCMV) is the most prevalent yield-limiting disease in Kakamega bean production. Symptoms include mosaic leaf patterns, leaf curling, and pod distortion. It is seed-borne and aphid-transmitted. Prevention requires three simultaneous actions: plant certified virus-indexed seed only, control aphid populations with imidacloprid seed treatment or early foliar sprays when aphid colonies appear, and remove and destroy infected plants immediately before they serve as a virus reservoir for healthy plants. Curative treatments do not exist — prevention is the only effective strategy." },
  { question: "How many bags of beans per acre can I expect in Kakamega?", answer: "With Rhizobium inoculant, rock phosphate or low-rate DAP, certified virus-free seed, and correct liming of acidic soils, Kakamega bean farmers achieve 8 to 14 bags of 90 kg per acre under normal rainfall. Without Rhizobium inoculant but with adequate phosphorus, yields drop to 5 to 8 bags. With neither inoculant nor phosphorus on leached Kakamega soils, yields of 3 to 5 bags are typical — the current average for most smallholders." },
  { question: "Can I intercrop beans with maize in Kakamega?", answer: "Yes — maize and beans intercropping is one of the most productive combinations for Kakamega's Western Kenya conditions. Plant one row of beans between every two rows of maize. The bean fixes nitrogen that benefits the subsequent maize crop, and the maize canopy provides partial shade that reduces bean moisture stress during dry spells. This combination produces 70 to 85 percent of sole-crop maize yield plus 60 to 70 percent of sole-crop bean yield on the same land area — a total land equivalent ratio of 1.3 to 1.5, meaning the intercrop is 30 to 50 percent more productive per acre than growing either crop alone." },
]);

const howToSchema = makeHowToSchema({
  name: "How to Grow Beans in Kakamega County — Rhizobium and Precision Phosphorus Guide",
  description: "A step-by-step guide to growing high-yield beans on Kakamega's leached acidic soils using Rhizobium inoculant, rock phosphate, and certified virus-free seed.",
  totalTime: "P75D",
  estimatedCost: { currency: "KES", value: "8000–14000 per acre" },
  supply: ["KEPHIS-certified bean seed (Kenya Mavuno, Jesca, or Rose Coco)", "Rhizobium inoculant for beans (Bradyrhizobium/Rhizobium leguminosarum)", "Rock phosphate or DAP (25–30 kg per acre)", "Agricultural lime (if pH below 5.5)"],
  tool: ["Planting stick or jab planter", "Knapsack sprayer", "Soil pH meter", "ShambaIQ precision tool"],
  steps: [
    { name: "Check soil pH — beans fail below pH 5.5", text: "Use ShambaIQ at shambaiq.com/app?county=kakamega&crop=beans to confirm your soil pH. Kakamega's leached acidic soils commonly show pH 4.8 to 5.5. Below pH 5.5, aluminium toxicity damages root nodules before Rhizobium bacteria can establish — the nitrogen fixation system fails entirely. If your pH is below 5.5, apply 500 kg to 1 tonne of agricultural lime per acre at least 3 weeks before planting. Do not skip liming on strongly acidic Kakamega soils and expect Rhizobium to work — it will not." },
    { name: "Apply Rhizobium inoculant to seed on planting day", text: "Mix certified bean seed with Rhizobium inoculant paste immediately before planting, following package directions (typically 5 to 10 g per kg of seed). The inoculant must coat the seed surface uniformly. Keep inoculated seed in shade and plant within 4 hours — ultraviolet light kills the bacteria rapidly. Do not mix inoculant with any fungicide seed treatments — fungicides kill Rhizobium. If you use fungicide seed dressing, apply it the previous day and allow to dry, then apply Rhizobium inoculant fresh on planting morning." },
    { name: "Apply rock phosphate or low-rate DAP in the furrow", text: "Apply rock phosphate at 50 kg per acre or DAP at 25 to 30 kg per acre in the planting furrow, covered with 2 cm of soil before placing the seed. Rock phosphate releases phosphorus slowly over the season and is less expensive per unit phosphorus than DAP on acidic soils where it solubilises effectively. DAP at low rate provides faster-available phosphorus for early root development. Do not increase DAP beyond 30 kg per acre — excess phosphorus at planting does not improve yield and wastes money." },
    { name: "Plant certified seed at correct spacing and depth", text: "Plant certified bean seed at 40 cm between rows and 10 to 15 cm within rows, 3 to 5 cm deep, two seeds per hole. This gives approximately 50,000 to 65,000 plants per acre — the density required for full yield potential. Plant at the onset of rains when soil moisture is adequate at 5 cm depth. Beans planted into dry soil or immediately after heavy rain that compacts the surface have poor emergence." },
    { name: "Weed thoroughly at 2 and 4 weeks — no weed competition", text: "Hand weed at 2 and 4 weeks after planting before canopy closure. Bean plants are particularly sensitive to early weed competition — yield losses of 30 to 50 percent occur when weeds are not controlled in the first 4 weeks. After canopy closure at 5 to 6 weeks, beans shade the soil and weed competition becomes minimal. Pre-emergence herbicide (Dual Gold) at planting reduces the weeding burden on farms with persistent weed pressure." },
    { name: "Monitor for bean stem maggot and act within 48 hours", text: "Scout for bean stem maggot (Ophiomyia spp.) from week 2 — look for yellowing and wilting of young plants. Pull affected plants and check for white maggots tunnelling in the stem at soil level. At 10 percent plant infestation, apply dimethoate or chlorpyrifos drench at the stem base. Seed treatment with imidacloprid at planting is the most effective preventive measure on farms with a history of bean stem maggot. Early intervention within 48 hours of visible wilting prevents total plant loss." },
    { name: "Harvest at correct moisture to avoid aflatoxin", text: "Harvest when 80 percent of pods have turned yellow-brown and seeds rattle in dry pods, typically 70 to 75 days after planting for bush varieties. Harvest in the morning when dew has dried but before afternoon humidity rises. Thresh immediately and dry to below 13 percent moisture before storage. Beans stored above 13 percent moisture in Kakamega's humid conditions develop Aspergillus mold and aflatoxin within days — rendering the entire harvest unmarketable." },
  ],
});

const TOC_ITEMS: TOCItem[] = [
  { id: "kakamega-bean-potential", label: "Why Kakamega Beans Are an Underperforming Asset", level: 2 },
  { id: "soil-data", label: "Kakamega Soil Data for Beans", level: 2 },
  { id: "rhizobium", label: "Rhizobium Inoculant — Free Nitrogen from the Air", level: 2 },
  { id: "varieties", label: "Certified Bean Varieties for Western Kenya", level: 2 },
  { id: "fertilizer", label: "Phosphorus-Only Fertilizer Programme", level: 2 },
  { id: "disease", label: "Bean Common Mosaic Virus Management", level: 2 },
  { id: "howto", label: "Step-by-Step Growing Guide", level: 2 },
  { id: "budget", label: "Cost and Revenue Budget Per Acre", level: 2 },
  { id: "faq", label: "Frequently Asked Questions", level: 2 },
];

export default function BeanKakamegaPage() {
  const relatedPosts = getRelatedPosts(POST, 3);
  return (
    <>
      <JsonLd schemas={[WEBSITE_SCHEMA, ORGANIZATION, articleSchema, breadcrumbSchema, faqSchema, howToSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: "County Farming Guides", url: `${BASE_URL}/blog?category=county-farming-guides` }, { name: "Bean Farming in Kakamega", url: `${BASE_URL}/blog/${POST.slug}` }]} />
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          <article itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={POST.datePublished} />
            <meta itemProp="dateModified" content={POST.dateModified} />
            <meta itemProp="author" content="Polycarp Andabwa" />
            <meta itemProp="publisher" content="ShambaIQ" />
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/blog?category=county-farming-guides" className="text-xs font-semibold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full hover:bg-gold-100 transition-colors">County Farming Guides</Link>
                <Link href="/soil/kakamega" className="text-xs font-semibold uppercase tracking-widest text-forest-600 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full hover:bg-forest-100 transition-colors">Kakamega County</Link>
                <Link href="/crops/beans" className="text-xs font-semibold uppercase tracking-widest text-soil-500 bg-cream-200 border border-cream-300 px-3 py-1 rounded-full hover:bg-cream-300 transition-colors">Beans</Link>
              </div>
              <h1 itemProp="headline" className="text-3xl sm:text-4xl font-display font-bold text-forest-900 leading-tight mb-4">
                Precision Bean Cultivation in Kakamega: <span className="text-gold-600">Double Your Harvests</span>
              </h1>
              <p className="text-lg text-soil-500 leading-relaxed mb-5" itemProp="description">
                Beans are Kenya's second-most-important food crop and a critical protein source for Western Kenya households. In Kakamega County, they are also one of the most systematically under-managed crops — most farmers harvest 3 to 5 bags per acre when the same farm under precision management is capable of 10 to 14 bags. The gap is not irrigation, not rainfall, not seed price. It is three decisions made at planting: inoculating seed with Rhizobium, applying phosphorus at the correct low rate, and planting certified virus-free seed. Get all three right and Kakamega's leached acidic soils become highly productive bean land at minimal input cost.
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
              <figcaption className="text-xs text-soil-300 px-4 py-2 text-center">Bean crop growing on leached acidic soil in Kakamega County, Western Kenya. Source: ShambaIQ field data.</figcaption>
            </figure>

            <section>
              <h2 id="kakamega-bean-potential" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Why Kakamega Beans Are an Underperforming Asset</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Kakamega's 1,500 to 1,900 mm annual rainfall, fertile appearance of its red soils, and two reliable growing seasons create conditions that should produce consistently high bean yields. The gap between potential and actual production has three causes that are entirely within farmer control.</p>
              <div className="space-y-3 mb-6">
                {[
                  { title: "Leached acidic soils suppress Rhizobium activity", detail: "Kakamega's high rainfall progressively leaches calcium and raises soil aluminium concentration. The result — soil pH of 4.8 to 5.5 across most of the county — directly damages the root nodules where Rhizobium fixes nitrogen. Farmers who do not lime before planting beans are planting into conditions where the nitrogen fixation system that makes beans so valuable cannot function. Most of the fertilizer applied to compensate is also poorly available at low pH." },
                  { title: "Uncertified recycled seed carries multiple viruses", detail: "Bean Common Mosaic Virus (BCMV) and Bean Common Mosaic Necrotic Virus (BCMNV) are seed-borne — once introduced to a seed stock they persist in every subsequent generation saved from that harvest. Most Kakamega farmers recycle seed for 3 to 5 seasons before replacing it. By season 3, virus incidence in recycled seed lots reaches 40 to 60 percent, causing the mosaic, curling, and pod distortion that farmers accept as normal variation. A single generation of certified virus-indexed seed resets the entire disease burden." },
                  { title: "Nitrogen fertilizer applied to a nitrogen-fixing crop", detail: "A well-nodulated bean plant fixes 40 to 80 kg of atmospheric nitrogen per acre per season at zero input cost. When nitrogen fertilizer is applied, the plant downregulates nodule formation — it detects that nitrogen is available and reduces its investment in the nodule system. The result is that farmers who apply CAN to beans pay for nitrogen they do not need while suppressing the free nitrogen fixation that would have occurred without any input at all." },
                ].map((item) => (
                  <div key={item.title} className="bg-cream-50 border border-cream-300 rounded-xl p-4">
                    <strong className="text-forest-700 font-semibold block mb-1">{item.title}</strong>
                    <p className="text-sm text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="soil-data" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Kakamega Soil Data for Beans</h2>
              <div className="overflow-x-auto mb-6 rounded-xl border border-cream-300">
                <table className="w-full text-sm">
                  <caption className="sr-only">Kakamega County soil nutrient values versus bean requirements</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Nutrient", "Kakamega Average", "Bean Optimum", "Status", "Action"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Soil pH", "4.8 – 5.5", "5.5 – 7.0", "Acidic — Critical", "Lime to 5.8+ before planting"],
                      ["Total Nitrogen (g/kg)", "1.2 – 2.0", "Supplied by Rhizobium", "Irrelevant", "Do NOT apply nitrogen fertilizer"],
                      ["Phosphorus (mg/kg)", "6 – 14", "> 12 mg/kg", "Deficient", "Rock phosphate or low DAP at planting"],
                      ["Potassium (mg/kg)", "80 – 180", "> 80 mg/kg", "Low – Adequate", "Returned by crop residue incorporation"],
                      ["Organic Carbon (g/kg)", "15 – 25", "> 12 g/kg", "Adequate", "Maintain — beans add organic matter"],
                    ].map(([n, v, o, s, a], i) => (
                      <tr key={n as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 font-medium text-forest-800">{n}</td>
                        <td className="px-4 py-3 text-soil-600">{v}</td>
                        <td className="px-4 py-3 text-soil-500">{o}</td>
                        <td className="px-4 py-3 font-medium text-sm">{s}</td>
                        <td className="px-4 py-3 text-xs text-soil-400">{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">Source: ShambaIQ precision soil mapping, Kakamega County average. <Link href="/app?county=kakamega&crop=beans" className="text-gold-600 hover:underline">Get your farm-specific bean suitability score here.</Link></p>
            </section>

            <section>
              <h2 id="rhizobium" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Rhizobium Inoculant — Free Nitrogen from the Air</h2>
              <p className="text-soil-600 leading-relaxed mb-4">Nitrogen fixation by Rhizobium is one of the most economically significant biological processes in smallholder farming. A single application of Rhizobium inoculant costing KES 200 to 400 per acre delivers nitrogen fixation equivalent to KES 1,500 to 2,500 per acre of CAN fertilizer — and does so continuously throughout the season as the plant grows.</p>
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-5 mb-6">
                <p className="text-sm font-bold text-forest-800 mb-3">How Rhizobium Inoculation Works in Practice</p>
                <div className="space-y-2">
                  {[
                    { step: "1", text: "Rhizobium bacteria in the inoculant colonise bean roots within 7 to 14 days of planting" },
                    { step: "2", text: "The plant forms root nodules — small pink or red bumps visible when you gently pull a root" },
                    { step: "3", text: "Inside each nodule, Rhizobium converts atmospheric nitrogen (N2) to ammonium (NH4+) that the plant can use" },
                    { step: "4", text: "A well-nodulated bean plant produces 40 to 80 kg of plant-available nitrogen per acre at zero additional cost" },
                    { step: "5", text: "After harvest, nodule decomposition releases residual nitrogen into the soil — benefiting the following maize crop" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-forest-700 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</div>
                      <p className="text-forest-700">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6">
                <p className="text-sm font-bold text-amber-800 mb-2">Why inoculant fails on unlimed Kakamega soils</p>
                <p className="text-sm text-amber-700 leading-relaxed">Rhizobium bacteria are sensitive to soil acidity. At pH below 5.5, aluminium toxicity damages root tips before Rhizobium can colonise them, and the low pH environment inhibits bacterial survival in the soil. Farmers who apply inoculant to unlimed Kakamega soils at pH 4.8 wonder why they see no pink nodules at 6 weeks. The lime investment is the precondition — inoculant only works reliably at pH 5.5 and above.</p>
              </div>
            </section>

            <section>
              <h2 id="varieties" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Certified Bean Varieties for Western Kenya</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  { variety: "Kenya Mavuno", type: "Climbing bush", maturity: "70 – 80 days", yield: "10 – 14 bags/acre", notes: "KEPHIS-certified. Excellent angular leaf spot resistance — the primary foliar disease in Kakamega's humid conditions. High protein content preferred by Nairobi dry bean processors." },
                  { variety: "Jesca", type: "Bush", maturity: "65 – 75 days", yield: "9 – 13 bags/acre", notes: "Shorter season than Mavuno — useful for double-cropping in both long and short rains. Good BCMV tolerance. Favoured by Kakamega commercial growers targeting the Busia and Kisumu fresh markets." },
                  { variety: "Wairimu DM1", type: "Bush", maturity: "70 – 80 days", yield: "8 – 12 bags/acre", notes: "Preferred for the Nairobi dry bean wholesale market due to consistent cream colour and uniform seed size. Moderate angular leaf spot resistance — spray preventively in Kakamega's humid conditions." },
                  { variety: "Rose Coco (Mwitemania)", type: "Bush", maturity: "65 – 75 days", yield: "7 – 10 bags/acre", notes: "Premium price at fresh pod stage — sold green to Nairobi supermarkets and urban markets. Requires harvesting at 55 to 60 days for the fresh market. Lower dry grain yield than other varieties." },
                ].map((v) => (
                  <div key={v.variety} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 mb-1">{v.variety}</h3>
                    <p className="text-xs text-gold-600 font-medium mb-3">{v.type}</p>
                    <div className="space-y-1.5 text-sm mb-3">
                      {[["Maturity", v.maturity], ["Expected yield", v.yield]].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between gap-2">
                          <span className="text-soil-400">{label}</span>
                          <span className="font-medium text-forest-700 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-soil-400 border-t border-cream-200 pt-2">{v.notes}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="disease" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Bean Common Mosaic Virus — Managing Kakamega's Primary Disease</h2>
              <p className="text-soil-600 leading-relaxed mb-4">BCMV is seed-borne and aphid-transmitted. Once present in a field, it cannot be cured. The entire management strategy is prevention through three simultaneous interventions.</p>
              <div className="space-y-3 mb-6">
                {[
                  { action: "Plant certified virus-indexed seed", detail: "The most impactful single intervention. Certified seed lots are tested for BCMV at less than 0.1 percent incidence. Buying certified seed every 2 to 3 seasons resets the virus burden regardless of farm history. Cost: approximately KES 1,200 to 1,800 per acre for certified seed versus KES 400 to 600 for recycled seed — a KES 800 to 1,200 difference that is recovered many times over in yield improvement." },
                  { action: "Treat seed with imidacloprid to control aphid vectors", detail: "Aphids colonise bean plants from seedling emergence and transmit BCMV during feeding. Imidacloprid seed treatment at 2 g per kg of seed provides systemic aphid protection for 3 to 4 weeks — covering the most vulnerable early growth stage. Cost: approximately KES 200 per acre. Apply imidacloprid the day before planting, allow to dry, then apply Rhizobium inoculant fresh on planting morning." },
                  { action: "Remove infected plants immediately", detail: "At the first sign of mosaic symptoms — mottled light and dark green leaf patterns, leaf puckering, or pod distortion — remove the entire plant including roots and destroy it away from the field. Infected plants serve as a virus reservoir for aphids feeding on them and moving to healthy plants. Leaving even a few infected plants doubles the spread rate within the crop." },
                ].map((item) => (
                  <div key={item.action} className="bg-white border border-cream-300 rounded-xl p-4">
                    <h3 className="font-semibold text-forest-800 text-sm mb-2">{item.action}</h3>
                    <p className="text-xs text-soil-500 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 id="howto" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-6">Step-by-Step: Growing Beans in Kakamega County</h2>
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

            <section>
              <h2 id="budget" className="text-2xl font-display font-bold text-forest-800 mt-10 mb-4">Cost and Revenue Budget Per Acre — Kakamega Beans 2026</h2>
              <div className="overflow-x-auto rounded-xl border border-cream-300 mb-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Bean production cost and revenue per acre Kakamega County Kenya 2026</caption>
                  <thead className="bg-forest-700 text-white">
                    <tr>{["Item", "Qty", "Unit Cost (KES)", "Total (KES)"].map((h) => <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {[
                      ["Certified bean seed (Kenya Mavuno)", "20 kg", "120", "2,400"],
                      ["Agricultural lime (if pH below 5.5)", "500 kg", "700", "3,500"],
                      ["Rock phosphate or DAP (25 kg)", "25 kg", "80", "2,000"],
                      ["Rhizobium inoculant", "1 pack (20 g)", "300", "300"],
                      ["Imidacloprid seed treatment", "10 g", "200", "200"],
                      ["Fungicide (angular leaf spot)", "2 applications", "900", "1,800"],
                      ["Labour — planting and fertilizing", "3 days", "500", "1,500"],
                      ["Labour — weeding (x2)", "4 days", "500", "2,000"],
                      ["Labour — harvest and threshing", "3 days", "500", "1,500"],
                    ].map(([item, qty, unit, total], i) => (
                      <tr key={item as string} className={i % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                        <td className="px-4 py-3 text-forest-800">{item}</td>
                        <td className="px-4 py-3 text-soil-500">{qty}</td>
                        <td className="px-4 py-3 text-soil-500">{unit}</td>
                        <td className="px-4 py-3 font-semibold text-forest-700">{total}</td>
                      </tr>
                    ))}
                    <tr className="bg-forest-700 text-white">
                      <td colSpan={3} className="px-4 py-3 font-bold">TOTAL INPUT COST</td>
                      <td className="px-4 py-3 font-bold">KES 15,200</td>
                    </tr>
                    <tr className="bg-gold-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-gold-800">Expected Revenue (11 bags x KES 8,500 per 90 kg bag)</td>
                      <td className="px-4 py-3 font-bold text-gold-800">KES 93,500</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td colSpan={3} className="px-4 py-3 font-bold text-green-800">Net Margin</td>
                      <td className="px-4 py-3 font-bold text-green-800">KES 78,300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-soil-400 mb-4">Lime cost only applies to soils below pH 5.5 and amortises over 3 to 4 seasons. Find <Link href="/dealers/kakamega" className="text-gold-600 hover:underline">Kakamega agrovets stocking Rhizobium inoculant here.</Link></p>
            </section>

            <div className="bg-forest-700 text-white rounded-2xl p-8 mt-12 mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-forest-300 mb-2">Free Precision Tool</p>
              <h3 className="text-xl font-display font-bold mb-3">{POST.ctaText}</h3>
              <p className="text-forest-200 text-sm mb-5">ShambaIQ checks your Kakamega farm's soil pH and phosphorus status and builds your complete bean fertilizer programme — telling you exactly how much lime and phosphorus to apply, and confirming whether your soil is ready for Rhizobium to work. Free. No sign-up required.</p>
              <Link href={POST.ctaLink} className="inline-block bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold px-7 py-3 rounded-xl transition-colors">Open Kakamega Bean Advisor</Link>
            </div>

            <aside className="bg-cream-100 border border-cream-300 rounded-xl p-5 mb-8" aria-label="Related county and crop pages">
              <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Also on ShambaIQ</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { href: "/soil/kakamega", label: "Kakamega County Soil Report" },
                  { href: "/crops/beans", label: "Beans Crop Guide — All Counties" },
                  { href: "/blog/kakamega-soil-western-kenya-mavuno", label: "Kakamega Soil — Mavuno vs DAP" },
                  { href: "/soil/kakamega/maize", label: "Maize in Kakamega — Rotation Crop" },
                  { href: "/dealers/kakamega", label: "Agrovets in Kakamega County" },
                  { href: "/zones/western-highlands", label: "Western Highlands Zone" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 text-soil-500 hover:text-forest-700 transition-colors py-1">
                    <span className="text-gold-500 flex-shrink-0">→</span>{label}
                  </Link>
                ))}
              </div>
            </aside>

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
            <div className="sticky top-6 space-y-6">
              <TableOfContents items={TOC_ITEMS} />
              <div className="bg-cream-100 border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-3">Kakamega Quick Facts</p>
                <div className="space-y-2 text-sm">
                  {[["Zone", "Western Highlands"], ["Altitude", "1,400 – 1,900 m"], ["Avg Rainfall", "1,500 – 1,900 mm/yr"], ["Dominant Soil", "Leached ferralitic"], ["Avg Soil pH", "4.8 – 5.5"], ["N Fixation", "Yes — with Rhizobium"], ["P Status", "Deficient"]].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between gap-2">
                      <span className="text-soil-400">{k}</span>
                      <span className="font-medium text-forest-700 text-right text-xs">{v}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soil/kakamega" className="mt-4 block text-center text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors">Full Kakamega Soil Report →</Link>
              </div>
              <div className="bg-white border border-cream-300 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-3">Neighbouring Counties</p>
                <div className="space-y-1.5">
                  {[{ slug: "bungoma", name: "Bungoma" }, { slug: "vihiga", name: "Vihiga" }, { slug: "nandi", name: "Nandi" }, { slug: "siaya", name: "Siaya" }].map(({ slug, name }) => (
                    <Link key={slug} href={`/soil/${slug}`} className="flex justify-between items-center text-sm text-soil-500 hover:text-forest-700 transition-colors py-0.5">
                      <span>{name} County</span><span className="text-gold-500 text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
        <RelatedPosts posts={relatedPosts} heading="More County Farming Guides" />
      </div>
    </>
  );
}
