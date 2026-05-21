import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Organic Soil Enrichment & Soil Carbon Guide — Kenya",
  description:
    "Restore soil health naturally using organic soil carbon conservation. Learn cover cropping, composting, and nitrogen-fixing legumes for Kenyan shambas.",
  openGraph: { title: "Organic Soil Enrichment & Soil Carbon Guide — Kenya", images: ["/api/og"] },
};

export default function OrganicSoilGuide() {
  const counties = getCountySoils();

  // Find some counties representing diverse organic carbon/health profiles
  const nairobi = counties.find((c) => c.county.toLowerCase() === "nairobi");
  const kiambu = counties.find((c) => c.county.toLowerCase() === "kiambu");
  const machakos = counties.find((c) => c.county.toLowerCase() === "machakos");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Organic Soil Enrichment & Soil Carbon Guide — Kenya",
    author: { "@type": "Organization", name: "ShambaIQ" },
    datePublished: "2026-05-21",
    dateModified: "2026-05-21",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Soil Organic Carbon (SOC) and why does it matter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Soil Organic Carbon is the carbon component of organic matter (decomposed plant and animal materials). It is the foundation of soil health, determining water retention, soil structure, and microbial activity. Higher carbon levels directly correlate with crop yield resilience.",
        },
      },
      {
        "@type": "Question",
        name: "How can I increase the soil organic matter on my Kenyan farm?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can increase organic matter by applying high-quality compost, planting nitrogen-fixing cover crops (like desmodium or mucuna), practicing zero-tillage to prevent carbon oxidation, and returning crop residues (maize stalks) directly to the soil rather than burning them.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Organic Soil Guide" }]} />

        <header className="mb-10">
          <span className="px-3 py-1 bg-forest-700/10 text-forest-700 text-xs font-semibold rounded-full">Soil Science</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mt-4 mb-3">Organic Soil Enrichment & Soil Carbon Guide — Kenya</h1>
          <p className="text-soil-400 leading-relaxed max-w-2xl">
            Chemical fertilizers work best in carbon-rich soil. We explore how to restore your shamba's natural fertility using organic soil carbon conservation.
          </p>
          <div className="text-xs text-soil-300 mt-4">Updated May 2026 · 7 min read</div>
        </header>

        <div className="prose prose-forest max-w-none">
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">The Carbon Crisis in Kenyan Soils</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              When farmers notice their yields dropping, their immediate instinct is often to buy more chemical fertilizers. However, if your soil has depleted organic carbon, chemical inputs are largely wasted. Without **Soil Organic Matter (SOM)**, fertilizers simply leach away into local waterways or lock up in the soil, unavailable to plant roots.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Decades of intense tillage, over-reliance on chemical inputs, and burning crop residues have left many Kenyan shambas depleted of carbon. Healthy agricultural soil should ideally have a soil organic carbon content of **above 2.0%**. Today, many intensive cropping areas in Central and Rift Valley Kenya have dropped below **1.2%**, severely limiting crop health and water retention.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Understanding the Soil Organic Carbon Loop</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Soil organic carbon behaves like a giant sponge. Each 1% increase in soil organic carbon allows the soil to hold an estimated **20,000 gallons of water per acre**. This makes carbon building the absolute single most important defense against drought and changing seasonal weather.
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              Furthermore, organic carbon provides the biological food for beneficial soil microbes. These microbes secrete organic acids that naturally unlock phosphorus bonded to iron and aluminum—a common problem discussed in our <Link href="/blog/why-soil-is-acidic-kenya" className="text-gold-600 hover:underline font-semibold">soil acidity guide</Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Three Practices to Restore Soil Carbon</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Rebuilding your soil's carbon profile is a multi-season investment that pays compound dividends in reduced fertilizer bills and higher yields:
            </p>

            <h3 className="font-display text-xl font-bold text-forest-700 mt-6 mb-2">1. Stop Burning Crop Residues</h3>
            <p className="text-soil-500 leading-relaxed mb-4">
              After harvesting maize or wheat, many farmers burn the stalks to clear the land quickly. This is a massive waste of carbon. Instead, chop the residues and leave them as a protective mulch, or incorporate them into the soil. As they decay, they transform into stable soil carbon and feed beneficial earthworms. 
            </p>
            <p className="text-soil-500 leading-relaxed mb-4">
              For example, implementing residue retention in heavy maize zones greatly accelerates soil recovery. You can read more about crop rotations and residues in our <Link href="/blog/complete-maize-farming-guide-kenya" className="text-gold-600 hover:underline font-semibold">maize farming guide</Link>.
            </p>

            <h3 className="font-display text-xl font-bold text-forest-700 mt-6 mb-2">2. Plant Nitrogen-Fixing Cover Crops</h3>
            <p className="text-soil-500 leading-relaxed mb-4">
              Leaving the soil bare between seasons allows hot tropical sun to oxidize and burn away organic carbon. Always plant a cover crop like **Desmodium, Mucuna, or Lablab**. These legumes absorb nitrogen from the air and pump carbon sugars directly through their roots into the soil biology, enriching the shamba naturally.
            </p>

            <h3 className="font-display text-xl font-bold text-forest-700 mt-6 mb-2">3. Thermal Composting over Raw Manure</h3>
            <p className="text-soil-500 leading-relaxed mb-4">
              Adding raw animal manure directly to fields is common, but much of its nitrogen evaporates as ammonia gas and weed seeds are spread. **Composting manure** together with dry carbon materials (straw, dry grass) and green materials (weeds, leaves) creating a dark, crumbly compost locks in the nutrients and populates the shamba with millions of beneficial fungi.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">Soil Carbon Profiles Across Regions</h2>
            <p className="text-soil-500 leading-relaxed mb-4">
              Let's look at typical soil organic carbon levels under different farming models in Kenya:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Region / Farm Type</th>
                    <th className="text-left py-2 font-semibold">Typical Organic Carbon %</th>
                    <th className="text-left py-2 font-semibold">Water Retention Capacity</th>
                    <th className="text-left py-2 font-semibold text-forest-700">Fertilizer Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Degraded Continuous Tillage (e.g. Parts of Machakos)</td>
                    <td className="py-2.5">0.8% – 1.2% (Very Low)</td>
                    <td className="py-2.5">Poor (Heavy runoff/erosion)</td>
                    <td className="py-2.5">Low (Heavy leaching)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-medium">Standard Smallholder Shamba (e.g. Parts of Kiambu)</td>
                    <td className="py-2.5">1.5% – 1.8% (Moderate)</td>
                    <td className="py-2.5">Medium (Dries out within 10 days)</td>
                    <td className="py-2.5">Moderate (Standard responses)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2.5 font-bold text-green-700">Conservation Agriculture / Composted Shamba</td>
                    <td className="py-2.5 font-bold text-green-700">2.2% – 3.5% (High)</td>
                    <td className="py-2.5 font-bold">Excellent (High moisture cushion)</td>
                    <td className="py-2.5 font-bold">High (Microbial activation)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-soil-500 leading-relaxed">
              Farms practicing zero-tillage and high composting save up to 30% in chemical fertilizer costs because their rich soil microbiology is highly efficient at processing and storing soil nutrients.
            </p>
          </section>
        </div>

        <div className="mt-10 bg-forest-700 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">Rebuild your shamba's soil biology</h2>
          <p className="text-cream-400 mb-6">Analyze your county's baseline soil organic carbon maps and receive dynamic cover-cropping advice.</p>
          <Link href="/app" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">Analyze Soil Biology →</Link>
        </div>
      </article>
    </>
  );
}
