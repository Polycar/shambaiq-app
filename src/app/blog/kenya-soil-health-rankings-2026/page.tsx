import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, computeSoilHealthScore } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "2026 Kenya Soil Health Report: All 47 Counties Ranked",
  description:
    "Complete soil health rankings for every Kenyan county. pH, nitrogen, phosphorus, and potassium data from iSDAsoil satellite mapping. Find where Kenya's healthiest farmland is.",
  openGraph: {
    title: "2026 Kenya Soil Health Report: All 47 Counties Ranked",
    images: ["/api/og"],
  },
};

export default function KenyaSoilRankings() {
  const counties = getCountySoils()
    .map((c) => ({ ...c, score: computeSoilHealthScore(c) }))
    .sort((a, b) => b.score - a.score);

  const top10 = counties.slice(0, 10);
  const bottom10 = counties.slice(-10).reverse();
  const acidic = counties.filter((c) => c.pH < 5.5).sort((a, b) => a.pH - b.pH);
  const alkaline = counties.filter((c) => c.pH > 7.5).sort((a, b) => b.pH - a.pH);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "2026 Kenya Soil Health Report: All 47 Counties Ranked",
    author: { "@type": "Organization", name: "ShambaIQ" },
    publisher: { "@type": "Organization", name: "ShambaIQ", url: "https://shambaiq.com" },
    datePublished: "2026-05-01",
    dateModified: "2026-05-16",
    description: "Complete soil health rankings for every Kenyan county based on iSDAsoil satellite data.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which Kenyan county has the healthiest soil?",
        acceptedAnswer: { "@type": "Answer", text: `Based on iSDAsoil 2026 data, ${top10[0]?.county} County has the highest soil health score of ${top10[0]?.score}/100, with optimal pH, nitrogen, and phosphorus levels for most crops.` },
      },
      {
        "@type": "Question",
        name: "Which Kenyan counties have acidic soil?",
        acceptedAnswer: { "@type": "Answer", text: `${acidic.length} counties have acidic soil (pH below 5.5), including ${acidic.slice(0, 5).map(c => c.county).join(", ")}. These counties benefit most from lime application before planting.` },
      },
      {
        "@type": "Question",
        name: "Where does ShambaIQ soil data come from?",
        acceptedAnswer: { "@type": "Answer", text: "ShambaIQ uses iSDAsoil satellite data, which provides soil chemistry predictions at 30-metre resolution across all of Africa. The data is produced using machine learning models trained on thousands of soil samples." },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "2026 Soil Rankings" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Data Report</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">
            2026 Kenya Soil Health Report: All 47 Counties Ranked
          </h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            We analyzed iSDAsoil satellite data for every county in Kenya, scoring soil health based on pH, nitrogen, phosphorus, potassium, and organic carbon. Here are the results.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 8 min read · Data source: iSDAsoil 30m satellite mapping</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">How We Scored Soil Health</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Each county receives a Soil Quality Index (SQI) score from 0 to 100 based on five parameters: pH, total nitrogen, extractable phosphorus, extractable potassium, and organic carbon. The scoring uses a sigmoid-weighted model where pH carries 40% of the weight (because it controls nutrient availability) and each nutrient carries 15%. A score above 80 means the soil can support most crops with minimal amendments. Below 50, significant intervention is needed.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Top 10 Healthiest Counties</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Kenya&apos;s healthiest soils are concentrated in the <Link href="/zones/rift-valley" className="text-gold-600 hover:underline font-medium">Rift Valley</Link> and parts of <Link href="/zones/western" className="text-gold-600 hover:underline font-medium">Western Kenya</Link>. These counties have near-optimal pH, strong nitrogen levels, and adequate phosphorus for most crops.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {top10.map((c, i) => (
                <Link key={c.slug} href={`/soil/${c.slug}`} className="flex items-center gap-3 p-3 rounded-xl border border-cream-300 hover:border-gold-400 transition-colors">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: c.score >= 70 ? "#16a34a" : "#f59e0b" }}>{i + 1}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-forest-700">{c.county}</span>
                    <span className="text-xs text-soil-400 ml-2">{c.zone}</span>
                  </div>
                  <span className="font-bold text-forest-700">{c.score}</span>
                </Link>
              ))}
            </div>
            <p className="text-soil-500 leading-relaxed">
              <Link href={`/soil/${top10[0]?.slug}`} className="text-gold-600 hover:underline font-medium">{top10[0]?.county}</Link> leads the rankings thanks to its balanced pH of {top10[0]?.pH} and high nitrogen content of {top10[0]?.nitrogen} g/kg. The entire Rift Valley zone benefits from volcanic soils deposited over millennia, creating naturally fertile conditions that most other regions cannot match without significant fertilizer investment.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Most Challenging Counties</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              The bottom of the rankings is dominated by <Link href="/zones/arid-north" className="text-gold-600 hover:underline font-medium">Arid North</Link> and <Link href="/zones/arid-north-east" className="text-gold-600 hover:underline font-medium">Arid North-East</Link> counties. These face a double challenge: highly alkaline pH (above 7.5) that locks phosphorus and micronutrients, combined with low organic carbon from minimal vegetation cover.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {bottom10.map((c, i) => (
                <Link key={c.slug} href={`/soil/${c.slug}`} className="flex items-center gap-3 p-3 rounded-xl border border-cream-300 hover:border-gold-400 transition-colors">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-red-500">{47 - i}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-forest-700">{c.county}</span>
                    <span className="text-xs text-soil-400 ml-2">pH {c.pH}</span>
                  </div>
                  <span className="font-bold text-red-600">{c.score}</span>
                </Link>
              ))}
            </div>
            <p className="text-soil-500 leading-relaxed">
              However, low scores do not mean farming is impossible. <Link href={`/soil/${bottom10[0]?.slug}`} className="text-gold-600 hover:underline font-medium">{bottom10[0]?.county}</Link> has high potassium ({bottom10[0]?.potassium} mg/kg) and phosphorus ({bottom10[0]?.phosphorus} mg/kg) — the challenge is pH management and water availability, not nutrient poverty. Crops like <Link href="/crops/sorghum" className="text-gold-600 hover:underline font-medium">sorghum</Link> and <Link href="/crops/cowpeas" className="text-gold-600 hover:underline font-medium">cowpeas</Link> tolerate these conditions well.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Acidity Problem: {acidic.length} Counties Below pH 5.5</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Acidic soil (pH below 5.5) affects {acidic.length} counties, primarily in the <Link href="/zones/central-highlands" className="text-gold-600 hover:underline font-medium">Central Highlands</Link>, <Link href="/zones/lake-victoria-basin" className="text-gold-600 hover:underline font-medium">Lake Victoria Basin</Link>, and <Link href="/zones/mt-kenya" className="text-gold-600 hover:underline font-medium">Mt. Kenya</Link> zones. Acidity locks phosphorus in the soil, making it unavailable to plants even when present. This is why high-rainfall areas often have paradoxically poor crop yields — the nutrients are there but chemically trapped.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              The most acidic counties are {acidic.slice(0, 5).map((c, i) => (
                <span key={c.slug}>{i > 0 && (i === acidic.slice(0, 5).length - 1 ? ", and " : ", ")}<Link href={`/soil/${c.slug}`} className="text-gold-600 hover:underline font-medium">{c.county} (pH {c.pH})</Link></span>
              ))}. For a detailed guide on fixing acidic soil, read our article on <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-medium">why Kenyan soil is acidic and how to fix it</Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">What This Means for Farmers</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Knowing your county&apos;s baseline soil chemistry is the starting point — not the destination. These scores represent county averages from satellite data. Your specific shamba may differ significantly, especially if you&apos;ve been applying amendments or if your plot sits on a different geological formation than the county average.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              For precision advice matched to your exact location and crop, use ShambaIQ&apos;s <Link href="/app" className="text-gold-600 hover:underline font-medium">recommendation tool</Link>. It combines the satellite data shown here with crop-specific thresholds, local fertilizer prices, and seasonal timing to produce a complete planting plan with budget.
            </p>
            <p className="text-soil-500 leading-relaxed">
              Understanding which fertilizer matches your soil condition is equally important. Our guide on <Link href="/blog/dap-vs-can-vs-npk-fertilizer-guide" className="text-gold-600 hover:underline font-medium">DAP vs CAN vs NPK</Link> explains when to use each type based on your specific nutrient deficiencies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Methodology</h2>
            <p className="text-soil-500 leading-relaxed">
              All data comes from the iSDAsoil (2021) dataset, which uses machine learning models trained on over 100,000 soil samples to predict soil properties at 30-metre resolution across Africa. County averages are computed using zonal statistics over official county boundaries. The Soil Quality Index uses a sigmoid-weighted scoring model with pH (40% weight), nitrogen (15%), phosphorus (15%), potassium (15%), and organic carbon (15%). Full methodology is documented in ShambaIQ&apos;s open-source codebase.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Check your county&apos;s soil</h2>
          <p className="text-cream-400 mb-6">Get a personalized fertilizer plan for your exact location and crop.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">
            Get Free Advice →
          </Link>
        </div>
      </article>
    </>
  );
}
