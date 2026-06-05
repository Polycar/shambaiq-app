import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION, makeFAQSchema, makeHowToSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Use your soil test results to get a fertilizer plan — Kenya",
  description:
    "Have a soil test report from a lab? Enter your pH, nitrogen, phosphorus, and potassium values into ShambaIQ and get a precise fertilizer plan for any crop. Free, works for all 47 Kenyan counties.",
  alternates: { canonical: `${BASE_URL}/soil-test` },
  openGraph: {
    title: "Use your lab soil test results for a fertilizer plan — ShambaIQ",
    description:
      "Enter your actual lab soil test values (pH, N, P, K) into ShambaIQ and get a crop-specific fertilizer plan based on your real soil data, not satellite estimates.",
    url: `${BASE_URL}/soil-test`,
  },
};

const howToSchema = makeHowToSchema({
  name: "How to get a fertilizer plan from your soil test results in Kenya",
  description:
    "ShambaIQ's lab soil override lets you enter your own soil test results (pH, nitrogen, phosphorus, potassium) and instantly generates a crop-specific fertilizer plan based on your verified data.",
  totalTime: "PT3M",
  estimatedCost: { currency: "KES", value: "0" },
  tool: ["Soil test report", "Smartphone or computer", "Internet connection"],
  steps: [
    {
      name: "Open ShambaIQ and select your location and crop",
      text:
        "Go to shambaiq.com/app. Select your county, or use GPS to pin your plot. Then pick the crop you want to grow.",
    },
    {
      name: "Open Advanced Settings and enable Lab Soil Override",
      text:
        "Scroll to the Advanced Settings section and expand it. You will see 'Advanced: Lab Soil Override'. Tick the checkbox labelled 'I have lab results' to switch from satellite data to your own values.",
    },
    {
      name: "Enter your soil test values",
      text:
        "Type in the four values from your soil test report: pH (dimensionless), Nitrogen in g/kg, Phosphorus in mg/kg, and Potassium in mg/kg. ShambaIQ immediately replaces the satellite estimate with your actual soil data.",
    },
    {
      name: "Get your personalised fertilizer plan",
      text:
        "Tap 'Get plan'. ShambaIQ compares your actual soil values against your crop's requirements and generates a fertilizer recommendation — product, application rate in bags per acre, timing, and estimated cost in KES.",
    },
  ],
});

const faqSchema = makeFAQSchema([
  {
    question: "What soil test values does ShambaIQ accept?",
    answer:
      "ShambaIQ accepts four measurements from your soil test report: pH (no units), Total Nitrogen in g/kg, Extractable Phosphorus in mg/kg (Olsen or Mehlich-3 methods), and Extractable Potassium in mg/kg. These are the standard values reported by most Kenyan soil labs including KEPHIS and university labs.",
  },
  {
    question: "Where can I get a soil test done in Kenya?",
    answer:
      "Soil testing in Kenya is available at KEPHIS (Kenya Plant Health Inspectorate Service), the University of Nairobi Soil Science Department, Egerton University, JKUAT, and various private labs. County governments in Trans-Nzoia, Uasin Gishu, Nakuru, and others also run subsidised soil testing programmes through their agriculture departments. Costs typically range from KES 1,000 to KES 3,500 per sample.",
  },
  {
    question: "Why use lab results instead of satellite data?",
    answer:
      "Satellite soil data is excellent for general guidance across a county or ward. Lab results from a physical soil sample taken on your specific plot are more accurate for that exact piece of land — particularly on farms that have received heavy fertilizer applications or amendments over many years, which can shift pH and nutrient levels away from the regional average.",
  },
  {
    question: "Can I enter results in different units?",
    answer:
      "ShambaIQ uses the most common Kenyan lab reporting units: g/kg for nitrogen and mg/kg for phosphorus and potassium. If your report shows nitrogen as a percentage (%), multiply by 10 to convert to g/kg. If phosphorus or potassium is shown in cmol/kg (sometimes called meq/100g), check with your lab for the mg/kg equivalent.",
  },
  {
    question: "Does lab mode work with GPS or region selection?",
    answer:
      "Yes. Lab mode works alongside both location methods. You can select your county and ward (region mode) or use GPS to pin your exact plot, and then enable lab override. The location is still used to look up your nearest agrovets and local price data — only the soil nutrient values are replaced by your lab results.",
  },
  {
    question: "Is this feature free?",
    answer:
      "Yes. Lab soil override is completely free with no account required. Open shambaiq.com/app, select a location and crop, expand Advanced Settings, tick 'I have lab results', and enter your values.",
  },
]);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Use soil test results", item: `${BASE_URL}/soil-test` },
  ],
};

const steps = [
  {
    n: "1",
    title: "Open ShambaIQ and choose your location and crop",
    body: "Go to shambaiq.com/app. Select your county and ward (or tap 'Check my farm' to use GPS). Then choose the crop you want to grow.",
  },
  {
    n: "2",
    title: "Expand Advanced Settings and enable lab override",
    body: "Scroll to Advanced Settings and open it. You will see 'Advanced: Lab Soil Override'. Tick the checkbox labelled 'I have lab results'. The four soil input fields will appear.",
  },
  {
    n: "3",
    title: "Type in your soil test values",
    body: "Enter the four numbers from your report: pH, Nitrogen (g/kg), Phosphorus (mg/kg), and Potassium (mg/kg). ShambaIQ replaces the satellite estimate with your actual measured values.",
  },
  {
    n: "4",
    title: "Get your fertilizer plan",
    body: "Tap 'Get plan'. You receive a fertilizer recommendation built on your real soil chemistry: which product, how many bags per acre, when to apply, and the estimated cost in KES.",
  },
];

const faqs = [
  {
    q: "What four values do I need from my soil test report?",
    a: "pH (no units), Total Nitrogen in g/kg, Extractable Phosphorus in mg/kg, and Extractable Potassium in mg/kg. These are the standard values on reports from KEPHIS, university labs, and most private Kenyan soil labs.",
  },
  {
    q: "Where can I get a soil test done in Kenya?",
    a: "KEPHIS is the main government option. University of Nairobi, Egerton University, and JKUAT also run soil labs. Several counties (Trans-Nzoia, Uasin Gishu, Nakuru) offer subsidised testing through their agriculture departments. Costs range from KES 1,000 to KES 3,500 per sample.",
  },
  {
    q: "Why are lab results better than satellite data?",
    a: "Satellite data gives accurate averages across a county or ward, but your specific plot may differ — especially if it has received heavy fertilizer applications or amendments over the years. Lab results from a physical sample taken on your farm are the most accurate data you can use.",
  },
  {
    q: "My report shows nitrogen as a percentage. What do I enter?",
    a: "Multiply the percentage by 10 to get g/kg. For example, 0.15% nitrogen = 1.5 g/kg.",
  },
  {
    q: "Does entering lab values affect the location or agrovet data?",
    a: "No. Your location (county/ward or GPS) is still used to find nearby agrovets and local fertilizer prices. Only the soil nutrient values change — everything else stays the same.",
  },
];

export default function SoilTestPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[howToSchema, faqSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Use soil test results" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4">
        Get a fertilizer plan from your own soil test results
      </h1>

      <p className="text-lg text-soil-500 max-w-2xl mb-3 leading-relaxed">
        If you have a soil test report from a lab, you can enter your actual pH, nitrogen,
        phosphorus, and potassium values into ShambaIQ and get a fertilizer plan based on your
        real soil chemistry — not satellite estimates.
      </p>
      <p className="text-sm text-soil-400 mb-8">
        The feature is called <strong className="text-forest-700">Lab Soil Override</strong> and
        it's under Advanced Settings in the free ShambaIQ tool.
      </p>

      {/* CTA */}
      <Link
        href="/app"
        className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-colors mb-12 shadow-lg shadow-gold-500/25"
      >
        Enter my soil test results →
      </Link>

      {/* How it works */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">
          How to use your soil test results — 4 steps
        </h2>
        <div className="flex flex-col gap-5">
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

      {/* Comparison */}
      <section className="mb-14 bg-forest-700 text-cream-100 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold mb-4">
          Satellite data vs your lab results
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-gold-300 mb-2">Satellite soil data (default)</h3>
            <ul className="space-y-2 text-cream-300">
              <li>30m resolution — precise for regional planning</li>
              <li>Reflects natural soil without amendment history</li>
              <li>No soil sampling required — instant</li>
              <li>Best for first-time and general use</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gold-300 mb-2">Your lab results (override)</h3>
            <ul className="space-y-2 text-cream-300">
              <li>Measured on a physical sample from your plot</li>
              <li>Reflects years of fertilizer and lime applications</li>
              <li>Most accurate if you have a recent lab report</li>
              <li>Recommended for serious commercial farms</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What values */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-5">
          What values does ShambaIQ accept?
        </h2>
        <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden">
          <div className="divide-y divide-cream-100">
            {[
              { param: "pH", unit: "dimensionless (e.g. 5.8, 6.2)", notes: "No conversion needed. Enter the number directly from your report." },
              { param: "Nitrogen (N)", unit: "g/kg", notes: "If your report shows %, multiply by 10. Example: 0.15% → enter 1.5" },
              { param: "Phosphorus (P)", unit: "mg/kg", notes: "Olsen or Mehlich-3 method. Most Kenyan labs use Olsen for P." },
              { param: "Potassium (K)", unit: "mg/kg", notes: "If shown as cmol/kg, ask your lab for the mg/kg equivalent." },
            ].map((row) => (
              <div key={row.param} className="px-6 py-4 grid sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="font-semibold text-forest-700">{row.param}</div>
                <div className="text-sm text-soil-500 font-mono">{row.unit}</div>
                <div className="text-sm text-soil-400">{row.notes}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to get a soil test */}
      <section className="mb-14 bg-cream-100 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-4">
          Where to get a soil test in Kenya
        </h2>
        <p className="text-soil-500 leading-relaxed mb-5 max-w-2xl">
          A proper lab test costs between KES 1,000 and KES 3,500 per sample and takes 3–10 working
          days. Collect soil from several spots across your farm (zigzag pattern, 0–20 cm depth),
          mix together, and send a combined 500 g sample.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "KEPHIS — Kenya Plant Health Inspectorate Service", detail: "Government lab. Offices in Nairobi and regional centres. Most affordable option." },
            { name: "University of Nairobi — Soil Science Lab", detail: "Faculty of Agriculture. Accepts external samples. Results include recommended amendments." },
            { name: "Egerton University Soil Lab", detail: "Located in Njoro, Nakuru County. Widely used by Rift Valley farmers." },
            { name: "County Agriculture Departments", detail: "Trans-Nzoia, Uasin Gishu, Nakuru, and Meru counties run subsidised soil testing. Visit your nearest Sub-County Agriculture Office." },
          ].map((lab) => (
            <div key={lab.name} className="bg-white rounded-xl p-5 border border-cream-300">
              <h3 className="font-semibold text-forest-700 mb-1 text-sm">{lab.name}</h3>
              <p className="text-xs text-soil-500 leading-relaxed">{lab.detail}</p>
            </div>
          ))}
        </div>
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

      {/* Related */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/map"
          className="block text-center px-6 py-3 bg-white border border-cream-300 hover:border-gold-400 text-forest-700 font-semibold rounded-xl transition-colors"
        >
          GPS farm mapping →
        </Link>
        <Link
          href="/app"
          className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
        >
          Get free fertilizer plan →
        </Link>
      </div>
    </div>
  );
}
