import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION, makeFAQSchema, makeHowToSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "GPS farm mapping — soil analysis for your exact plot in Kenya",
  description:
    "Use your phone's GPS to get satellite soil data and a fertilizer plan for your exact farm plot — not just county averages. Works in all 47 Kenyan counties, free.",
  alternates: { canonical: `${BASE_URL}/map` },
  openGraph: {
    title: "GPS farm mapping — soil analysis for your exact plot in Kenya",
    description:
      "Drop a GPS pin on your exact farm plot. ShambaIQ reads 30m satellite soil data and generates a fertilizer plan specific to your shamba.",
    url: `${BASE_URL}/map`,
  },
};

const howToSchema = makeHowToSchema({
  name: "How to get a soil analysis for your exact farm plot using GPS",
  description:
    "ShambaIQ's GPS farm mapping feature reads 30m satellite soil data for your precise location and generates a fertilizer plan tailored to your specific plot.",
  totalTime: "PT2M",
  estimatedCost: { currency: "KES", value: "0" },
  tool: ["Smartphone with GPS", "Internet connection"],
  steps: [
    {
      name: "Open ShambaIQ and tap 'Check my farm'",
      text:
        "Go to shambaiq.com/app on your phone. You will see two options at the top: 'Select region' and 'Check my farm'. Tap 'Check my farm' to switch to GPS mode.",
    },
    {
      name: "Allow location access",
      text:
        "Your browser will ask permission to access your GPS. Tap Allow. ShambaIQ instantly reads your exact coordinates and pulls 30-metre satellite soil data for that specific point — not county averages.",
    },
    {
      name: "Pick your crop and get your fertilizer plan",
      text:
        "Select the crop you want to grow. ShambaIQ compares your plot's soil pH, nitrogen, phosphorus, and potassium against your crop's requirements and generates a fertilizer plan with bag-per-acre quantities and an estimated cost.",
    },
  ],
});

const faqSchema = makeFAQSchema([
  {
    question: "How accurate is GPS soil mapping on ShambaIQ?",
    answer:
      "ShambaIQ uses iSDA satellite soil data at 30-metre resolution. Your GPS pin is matched to the nearest 30m pixel, giving you soil pH, nitrogen, phosphorus, and potassium measurements that are far more precise than county or ward averages. For most farms this is accurate enough to determine the correct fertilizer type and quantity.",
  },
  {
    question: "Do I need to download an app to use GPS farm mapping?",
    answer:
      "No app download is needed. ShambaIQ works entirely in your phone's browser. Visit shambaiq.com/app, tap 'Check my farm', and allow location access. The GPS reading and soil analysis happen instantly in the browser.",
  },
  {
    question: "Is GPS farm mapping free?",
    answer:
      "Yes, GPS farm mapping on ShambaIQ is completely free. There are no subscriptions, no hidden charges, and no limit on how many times you can check your farm.",
  },
  {
    question: "Which counties does GPS farm mapping cover?",
    answer:
      "GPS farm mapping works in all 47 counties of Kenya. The underlying satellite soil dataset (iSDA Africa) covers the entire country at 30m resolution, so your exact plot can be analysed whether you are in Trans-Nzoia, Meru, Kakamega, Kajiado, or any other county.",
  },
  {
    question: "What is the difference between 'Select region' and 'Check my farm'?",
    answer:
      "'Select region' lets you choose your county and ward manually — useful if you want to compare soil across different areas. 'Check my farm' uses your phone's GPS to read data for your exact plot. GPS mode is more precise and is recommended for generating a fertilizer plan for a specific shamba.",
  },
  {
    question: "Can I use GPS soil mapping if I am not on my farm right now?",
    answer:
      "GPS mapping reads your current location. If you are not on the farm at the moment, use the 'Select region' tab instead — choose your county and ward to get soil data and a fertilizer plan for that area.",
  },
]);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "GPS farm mapping", item: `${BASE_URL}/map` },
  ],
};

const steps = [
  {
    n: "1",
    title: "Open ShambaIQ and tap 'Check my farm'",
    body: "Visit shambaiq.com/app on your phone. At the top of the tool you will see two tabs: 'Select region' and 'Check my farm'. Tap 'Check my farm' to switch into GPS mode.",
  },
  {
    n: "2",
    title: "Allow location access",
    body: "Your browser will ask permission to read your GPS. Tap Allow. ShambaIQ instantly reads your coordinates and pulls 30-metre satellite soil data for that exact point — pH, nitrogen, phosphorus, and potassium measured under your specific plot.",
  },
  {
    n: "3",
    title: "Pick your crop and get your plan",
    body: "Select the crop you plan to grow. ShambaIQ scores your soil against that crop's requirements, then generates a fertilizer plan: which product to use, how many bags per acre, when to apply, and an estimated cost in Kenyan shillings.",
  },
];

const faqs = [
  {
    q: "How accurate is the soil data?",
    a: "ShambaIQ uses iSDA Africa satellite data at 30-metre resolution. Your GPS pin is matched to the nearest 30m measurement — far more precise than county averages, and precise enough to determine correct fertilizer type and quantity for your shamba.",
  },
  {
    q: "Do I need to download an app?",
    a: "No download needed. The GPS feature works entirely in your phone's browser. Visit shambaiq.com/app and tap 'Check my farm' — that's it.",
  },
  {
    q: "Is GPS farm mapping free?",
    a: "Yes, completely free. No subscription, no credit card, no usage limit.",
  },
  {
    q: "Which counties are covered?",
    a: "All 47 counties of Kenya. The satellite dataset covers the entire country, so whether your farm is in Trans-Nzoia, Meru, Kakamega, Kajiado, or anywhere else, your exact plot can be analysed.",
  },
  {
    q: "What if I am not on my farm right now?",
    a: "GPS mode reads your current location. If you are not on the farm, use the 'Select region' tab instead — choose your county and ward to get soil data and a plan for that area.",
  },
];

export default function MapPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[howToSchema, faqSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "GPS farm mapping" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4">
        GPS farm mapping — soil data for your exact plot
      </h1>

      <p className="text-lg text-soil-500 max-w-2xl mb-8 leading-relaxed">
        ShambaIQ's "Check my farm" feature uses your phone's GPS to read 30-metre satellite soil
        data for your specific plot — not just your county or ward average. Open the tool, allow
        location, pick your crop, and get a fertilizer plan in under two minutes. Free, no app
        required.
      </p>

      {/* CTA */}
      <Link
        href="/app"
        className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-colors mb-12 shadow-lg shadow-gold-500/25"
      >
        Check my farm now — it's free →
      </Link>

      {/* How it works */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">
          How GPS farm mapping works — 3 steps
        </h2>
        <div className="flex flex-col gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative bg-white rounded-2xl p-7 border border-cream-300 hover:border-gold-400 transition-colors"
            >
              <span className="absolute -top-4 -left-1 font-display text-6xl font-extrabold text-cream-300/60 leading-none select-none">
                {s.n}
              </span>
              <div className="relative pt-2">
                <h3 className="font-display text-lg font-bold text-forest-700 mb-2">{s.title}</h3>
                <p className="text-soil-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why GPS vs county average */}
      <section className="mb-14 bg-forest-700 text-cream-100 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold mb-4">
          Why GPS precision matters for fertilizer plans
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-gold-300 mb-2">County or ward average</h3>
            <ul className="space-y-2 text-cream-300">
              <li>Based on 1,000s of km² of mixed soils</li>
              <li>pH may vary by ±1.5 across a single ward</li>
              <li>Fertilizer plan could be under- or over-specified</li>
              <li>No account for your plot's specific history</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gold-300 mb-2">GPS plot reading (30m satellite)</h3>
            <ul className="space-y-2 text-cream-300">
              <li>Reads the 30m pixel under your actual farm</li>
              <li>pH, N, P, K values matched to your coordinates</li>
              <li>Fertilizer plan specific to your soil chemistry</li>
              <li>More accurate bag-per-acre and cost estimate</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-5">
          What the GPS soil analysis tells you
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Soil pH", desc: "Whether your plot is acidic, neutral, or alkaline — and whether you need lime before planting." },
            { label: "Nitrogen (N)", desc: "How much nitrogen is available in your soil and which nitrogen fertilizer will close the gap." },
            { label: "Phosphorus (P)", desc: "Phosphorus deficiency is Kenya's most common yield limiter. GPS mapping shows exactly how short your plot is." },
            { label: "Potassium (K)", desc: "Potassium for strong stems, drought tolerance, and disease resistance — measured at your coordinates." },
            { label: "Fertilizer plan", desc: "Product name, application rate in bags per acre, timing, and estimated cost in KES." },
            { label: "Crop suitability score", desc: "Your soil is scored 0–100 against your chosen crop's ideal growing conditions." },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-cream-300">
              <h3 className="font-semibold text-forest-700 mb-1">{item.label}</h3>
              <p className="text-sm text-soil-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section className="mb-14 bg-cream-100 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-3">
          Coverage: all 47 Kenyan counties
        </h2>
        <p className="text-soil-500 leading-relaxed max-w-2xl">
          GPS farm mapping uses the iSDA Africa satellite soil dataset, which covers Kenya at 30-metre
          resolution. Wherever your farm is — Trans-Nzoia, Meru, Kakamega, Machakos, Nakuru, Kisii,
          Siaya, Garissa, or any of the other 47 counties — your GPS coordinates will return accurate
          soil readings. The dataset is updated periodically as new satellite passes are processed.
        </p>
      </section>

      {/* FAQs */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-cream-200 border border-cream-200 rounded-2xl overflow-hidden bg-white">
          {faqs.map((faq) => (
            <div key={faq.q} className="px-6 py-5">
              <h3 className="font-semibold text-forest-700 mb-2">{faq.q}</h3>
              <p className="text-sm text-soil-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lab override cross-link */}
      <div className="mb-8 bg-cream-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-forest-700 mb-1">Have a physical soil test report?</p>
          <p className="text-sm text-soil-500">
            Enter your lab values (pH, N, P, K) directly into ShambaIQ for an even more precise fertilizer plan.
          </p>
        </div>
        <Link
          href="/soil-test"
          className="shrink-0 px-5 py-2.5 bg-white border border-cream-300 hover:border-gold-400 text-forest-700 font-semibold rounded-xl transition-colors text-sm"
        >
          Use lab results →
        </Link>
      </div>

      {/* Final CTA */}
      <div className="bg-forest-700 rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-cream-100 mb-3">
          Ready to check your farm?
        </h2>
        <p className="text-cream-300 mb-6 max-w-md mx-auto">
          Open ShambaIQ on your phone, tap 'Check my farm', and allow GPS. Your soil analysis and
          fertilizer plan are ready in under two minutes — free.
        </p>
        <Link
          href="/app"
          className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold rounded-xl text-lg transition-colors"
        >
          Check my farm →
        </Link>
      </div>
    </div>
  );
}
