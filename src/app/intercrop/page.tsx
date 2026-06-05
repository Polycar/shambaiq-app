import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION, makeFAQSchema, makeHowToSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Intercropping guide for Kenya — companion crop planting with nitrogen savings",
  description:
    "ShambaIQ analyses companion crop compatibility for Kenyan farms — shows nitrogen fixation savings, fertilizer cost reduction, planting layout, and income comparison vs monocrop. Free for all 47 counties.",
  alternates: { canonical: `${BASE_URL}/intercrop` },
  openGraph: {
    title: "Intercropping guide Kenya — companion crop planting & fertilizer savings",
    description:
      "Add a companion crop in ShambaIQ and get a full intercrop audit: compatibility, nitrogen fixation (kg/ha saved), reduced CAN bags, planting arrangement, timing, and income vs monocrop.",
    url: `${BASE_URL}/intercrop`,
  },
};

const howToSchema = makeHowToSchema({
  name: "How to get an intercrop plan for your farm in Kenya",
  description:
    "ShambaIQ's companion crop feature analyses intercrop compatibility, calculates nitrogen fixation savings, and gives you a planting layout with timing and spacing — alongside the fertilizer plan for both crops.",
  totalTime: "PT3M",
  estimatedCost: { currency: "KES", value: "0" },
  tool: ["Smartphone or computer", "Internet connection"],
  steps: [
    {
      name: "Open ShambaIQ and select your location",
      text: "Go to shambaiq.com/app. Choose your county and ward, or use GPS to pin your exact plot.",
    },
    {
      name: "Select your primary crop",
      text: "Pick the main crop you plan to grow — maize, beans, potato, tomato, or any of the 40+ supported crops.",
    },
    {
      name: "Add a companion crop",
      text: "Expand the 'Add companion crop' section and select your second crop from the list. ShambaIQ checks compatibility against your primary crop automatically.",
    },
    {
      name: "Get the intercrop audit and fertilizer plan",
      text: "Your results include: compatibility status, any conflict warnings, nitrogen fixation savings (kg/ha and KES saved on CAN bags), planting arrangement (alternating rows or strip intercrop), spacing, timing, income comparison vs monocrop, and certified seed varieties for both crops.",
    },
  ],
});

const faqSchema = makeFAQSchema([
  {
    question: "Which companion crop combinations work well in Kenya?",
    answer:
      "Common high-performing intercrop pairs in Kenya include: maize + beans (beans fix 40–80 kg N/ha, reducing CAN use), maize + cowpeas (excellent dryland option), maize + green grams (fast-maturing, minimal competition), sorghum + cowpeas, and tomato + basil. ShambaIQ checks your specific soil and climate before recommending the combination.",
  },
  {
    question: "How much nitrogen do beans fix when intercropped with maize?",
    answer:
      "Common beans fix 40–80 kg of nitrogen per hectare (16–32 kg/acre) when well-nodulated. ShambaIQ calculates the exact CAN bags saved based on your farm size and converts the saving into Kenyan shillings — for a 1-acre maize-bean intercrop this typically saves KES 1,200–3,500 on top-dressing.",
  },
  {
    question: "Does intercropping reduce my total fertilizer cost?",
    answer:
      "Yes, in most legume-cereal combinations. Legumes (beans, cowpeas, green grams) fix atmospheric nitrogen and leave residual nitrogen in the soil, reducing the CAN or Urea needed for the cereal. ShambaIQ shows the exact saving in bags per acre and the KES value based on current fertilizer prices.",
  },
  {
    question: "What does the intercrop audit show?",
    answer:
      "The intercrop audit shows: (1) compatibility status — whether the two crops work well together in your soil and climate; (2) any warnings, such as competing root depths or pest sharing; (3) nitrogen fixation data (if a legume is involved); (4) planting layout — row arrangement, spacing between crops, planting timing offset; and (5) income comparison showing projected gross income from the intercrop vs growing the primary crop alone.",
  },
  {
    question: "Can I intercrop with any of the 40 crops?",
    answer:
      "ShambaIQ supports companion crop analysis for most of the 40+ crops in its database. Some combinations will return a compatibility warning (e.g. two heavy nitrogen feeders competing for the same nutrients). The system always flags incompatible pairs rather than silently returning a plan.",
  },
  {
    question: "Does the fertilizer plan cover both crops in the intercrop?",
    answer:
      "Yes. When you add a companion crop, ShambaIQ generates a fertilizer plan that accounts for both crops' nutrient needs together, plus shows certified seed varieties for both the primary and companion crop separately.",
  },
]);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Intercropping guide", item: `${BASE_URL}/intercrop` },
  ],
};

const COMMON_PAIRS = [
  { primary: "Maize", companion: "Beans", benefit: "Beans fix 40–80 kg N/ha — reduces CAN top-dressing cost. Widely practised across all Kenyan highland zones." },
  { primary: "Maize", companion: "Cowpeas", benefit: "Excellent dryland intercrop. Cowpeas tolerate heat and drought, fixing nitrogen while covering soil and reducing erosion." },
  { primary: "Maize", companion: "Green Grams", benefit: "Fast-maturing green grams are harvested before maize canopy closes, giving two income streams with minimal competition." },
  { primary: "Sorghum", companion: "Cowpeas", benefit: "Core intercrop system in ASAL counties (Kitui, Makueni, Kajiado). Both crops survive on less than 500mm annual rainfall." },
  { primary: "Maize", companion: "Pigeon Peas", benefit: "Long-duration pigeon peas fix nitrogen throughout the season and sell at premium prices in Nairobi markets." },
  { primary: "Tomato", companion: "Basil", benefit: "Basil repels aphids and whiteflies that attack tomatoes, reducing pesticide spend. Popular in horticultural zones." },
];

const steps = [
  { n: "1", title: "Select your location", body: "Choose county and ward (or use GPS). ShambaIQ loads the satellite soil data for your exact area." },
  { n: "2", title: "Pick your primary crop", body: "Select the main crop you plan to grow — maize, beans, potato, tomato, or any of the 40+ supported crops." },
  { n: "3", title: "Add a companion crop", body: "Expand 'Add companion crop' and choose your second crop. Compatibility is checked automatically against soil, climate, and growth stage." },
  { n: "4", title: "Get the full intercrop plan", body: "Results include the fertilizer plan for both crops, nitrogen savings in kg/ha and KES, planting layout (arrangement, spacing, timing), and income vs monocrop." },
];

export default function IntercropPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[howToSchema, faqSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Intercropping guide" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4">
        Intercropping in Kenya — companion crops, nitrogen savings, and income comparison
      </h1>

      <p className="text-lg text-soil-500 max-w-2xl mb-3 leading-relaxed">
        ShambaIQ analyses companion crop combinations for your exact soil and location — compatibility,
        nitrogen fixation savings, reduced fertilizer cost, planting layout, and projected income
        vs monocrop. Free for all 47 counties.
      </p>
      <p className="text-sm text-soil-400 mb-8">
        Use the <strong className="text-forest-700">Add companion crop</strong> option in the ShambaIQ tool
        to get your intercrop plan alongside the fertilizer recommendation.
      </p>

      <Link
        href="/app"
        className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-colors mb-12 shadow-lg shadow-gold-500/25"
      >
        Get my intercrop plan →
      </Link>

      {/* How it works */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">
          How to get an intercrop plan — 4 steps
        </h2>
        <div className="flex flex-col gap-5">
          {steps.map((s) => (
            <div key={s.n} className="relative bg-white rounded-2xl p-7 border border-cream-300 hover:border-gold-400 transition-colors">
              <span className="absolute -top-4 -left-1 font-display text-6xl font-extrabold text-cream-300/60 leading-none select-none">{s.n}</span>
              <div className="relative pt-2">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-2">{s.title}</h3>
                <p className="text-soil-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What the intercrop audit shows */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-5">
          What the intercrop audit tells you
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Compatibility status", desc: "Green (compatible), Amber (warning — proceed with care), or Red (conflict). Includes the specific reason." },
            { label: "Nitrogen fixation savings", desc: "For legume companions: exact kg of nitrogen fixed per hectare and per acre, bags of CAN saved, and the KES saving at current fertilizer prices." },
            { label: "Planting layout", desc: "Row arrangement (alternating rows, strip intercrop), spacing between crop rows, and whether to plant simultaneously or stagger planting dates." },
            { label: "Income comparison", desc: "Projected gross income from the intercrop vs growing the primary crop alone — as a percentage advantage and absolute KES difference per acre." },
            { label: "Fertilizer plan for both crops", desc: "Combined nutrient recommendation accounting for both crops' needs, with bag quantities and timing." },
            { label: "Certified seeds for both crops", desc: "Verified seed varieties for the primary and companion crop, with maturity days, yield, altitude zone, and breeder." },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-cream-300">
              <h3 className="font-semibold text-forest-700 mb-1">{item.label}</h3>
              <p className="text-sm text-soil-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common pairs */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-5">
          Common intercrop combinations in Kenya
        </h2>
        <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden">
          <div className="divide-y divide-cream-100">
            {COMMON_PAIRS.map((pair) => (
              <div key={pair.primary + pair.companion} className="px-6 py-4 grid sm:grid-cols-4 gap-2">
                <div className="sm:col-span-1">
                  <span className="font-semibold text-forest-700">{pair.primary}</span>
                  <span className="text-soil-400 mx-1">+</span>
                  <span className="font-semibold text-gold-700">{pair.companion}</span>
                </div>
                <p className="sm:col-span-3 text-sm text-soil-500 leading-relaxed">{pair.benefit}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-soil-400 mt-3">
          ShambaIQ checks compatibility for your specific county soil and season — results vary by location.
        </p>
      </section>

      {/* Why intercrop */}
      <section className="mb-14 bg-forest-700 text-cream-100 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold mb-4">
          Why intercrop? The economics for Kenyan smallholders
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-sm leading-relaxed text-cream-300">
          <div>
            <h3 className="font-semibold text-gold-300 mb-2">Lower fertilizer cost</h3>
            <p>Legumes fix atmospheric nitrogen, reducing or eliminating CAN top-dressing for the cereal row. Saves KES 1,200–3,500 per acre depending on farm size.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gold-300 mb-2">Two income streams</h3>
            <p>Two harvests from the same piece of land. In maize-bean intercrop, the bean harvest typically covers all input costs before the maize even matures.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gold-300 mb-2">Risk reduction</h3>
            <p>If one crop fails due to drought, pest, or price collapse, the companion crop provides a fallback income. Intercropping is the original Kenyan smallholder insurance strategy.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-cream-200 border border-cream-200 rounded-2xl overflow-hidden bg-white">
          {[
            { q: "Which companion crop combinations work well in Kenya?", a: "Common high-performing pairs: maize + beans (nitrogen fixation, lower CAN cost), maize + cowpeas (dryland), maize + green grams (fast second harvest), sorghum + cowpeas (ASAL counties), and tomato + basil (pest control). ShambaIQ checks your soil before recommending." },
            { q: "How much nitrogen do beans fix when intercropped with maize?", a: "Common beans fix 40–80 kg of nitrogen per hectare. ShambaIQ calculates the exact CAN bags saved for your farm size and converts it to KES at current fertilizer prices." },
            { q: "Does intercropping reduce fertilizer cost?", a: "Yes, for legume-cereal combinations. The legume's nitrogen fixation reduces CAN or Urea needed for the cereal. ShambaIQ shows the exact saving in bags and KES." },
            { q: "Can I intercrop with any of the 40+ crops?", a: "Most combinations are supported. Incompatible pairs are flagged rather than silently returning a plan — you will see a compatibility warning with the reason." },
          ].map((faq) => (
            <div key={faq.q} className="px-6 py-5">
              <h3 className="font-semibold text-forest-700 mb-2">{faq.q}</h3>
              <p className="text-sm text-soil-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/crops" className="block text-center px-6 py-3 bg-white border border-cream-300 hover:border-gold-400 text-forest-700 font-semibold rounded-xl transition-colors">
          Browse crop guides →
        </Link>
        <Link href="/app" className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">
          Get free intercrop plan →
        </Link>
      </div>
    </div>
  );
}
