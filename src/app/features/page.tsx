import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION } from "@/lib/schema";

export const metadata: Metadata = {
  title: "ShambaIQ features — free precision farming tools for Kenyan farmers",
  description:
    "Every feature in ShambaIQ: soil analysis, fertilizer plans, GPS mapping, 7-day weather, certified seeds, intercropping, plant disease diagnosis, PDF reports, WhatsApp sharing, Swahili support, and more. All free.",
  alternates: { canonical: `${BASE_URL}/features` },
  openGraph: {
    title: "ShambaIQ features — complete precision farming toolkit for Kenya",
    description:
      "Full feature list: GPS farm mapping, lab soil override, AI crop matching, intercrop analysis, weather forecasts, certified seeds, PDF reports, plant disease diagnosis, Swahili support, and offline PWA.",
    url: `${BASE_URL}/features`,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Features", item: `${BASE_URL}/features` },
  ],
};

const FEATURE_GROUPS = [
  {
    title: "Soil analysis & fertilizer planning",
    features: [
      {
        name: "Precision fertilizer plan",
        desc: "Select county, ward, or GPS location + crop + farm size. Get fertilizer product, bags per acre, timing, and total cost in KES. Accounts for current soil pH, nitrogen, phosphorus, and potassium from 30m satellite data.",
        href: "/app",
      },
      {
        name: "GPS farm mapping",
        desc: "Tap 'Check my farm' and allow location access. ShambaIQ reads satellite soil data for your exact GPS coordinates — not just your county or ward average.",
        href: "/map",
      },
      {
        name: "Lab soil override",
        desc: "Have a lab test report? Enter your actual pH, nitrogen (g/kg), phosphorus (mg/kg), and potassium (mg/kg) values. ShambaIQ uses your measured data instead of the satellite estimate.",
        href: "/soil-test",
      },
      {
        name: "Soil health score",
        desc: "Every analysis returns a 0–100 soil health score (colour-coded green/amber/red) with a plain-language explanation of what it means for your chosen crop.",
        href: "/app",
      },
      {
        name: "Nutrient sufficiency bars",
        desc: "Visual comparison of your soil's current N, P, and K levels against the crop's optimal requirements — shown as percentage bars in the results.",
        href: "/app",
      },
      {
        name: "Subsidised vs commercial price toggle",
        desc: "Switch between government-subsidised fertilizer pricing (KES 2,500/bag) and open-market commercial rates with a single click. See exactly how much you save under the subsidy programme.",
        href: "/app",
      },
    ],
  },
  {
    title: "Crop planning",
    features: [
      {
        name: "AI crop finder",
        desc: "Not sure what to plant? Choose 'I don't know yet' instead of a crop. ShambaIQ scores all 40+ crops against your soil chemistry, current season, and weather, then ranks them by suitability and income per acre.",
        href: "/crop-finder",
      },
      {
        name: "Intercropping & companion crops",
        desc: "Add a second crop to any plan. Get a full intercrop audit: compatibility status, nitrogen fixation savings (kg/ha and KES saved on CAN bags), planting layout with row arrangement and spacing, and income comparison vs monocrop.",
        href: "/intercrop",
      },
      {
        name: "Certified seed varieties",
        desc: "After every fertilizer plan, ShambaIQ shows KALRO and Kenya Seed Company certified varieties for your crop — filtered to your altitude zone with maturity days, yield/acre, breeder, and disease resistance.",
        href: "/seeds",
      },
      {
        name: "Planting timeline",
        desc: "Three-month planting calendar specific to your location and crop. Shows what to do in each phase: land preparation, planting, first top-dressing, second top-dressing, and harvest window.",
        href: "/app",
      },
    ],
  },
  {
    title: "Weather & risk",
    features: [
      {
        name: "7-day weather forecast",
        desc: "Location-specific 7-day forecast in the results: daily temperature highs and lows, rainfall, and a planting-window indicator. Collapsible section in the fertilizer plan output.",
        href: "/app",
      },
      {
        name: "Weather-based pest & disease alerts",
        desc: "Real-time risk alerts generated from the forecast. When conditions favour specific pests or diseases (e.g. fall armyworm at high temperature, blight at high humidity), ShambaIQ shows the risk, symptoms, and preventive actions.",
        href: "/app",
      },
    ],
  },
  {
    title: "Diagnosis & advice",
    features: [
      {
        name: "Plant doctor — leaf scan diagnosis",
        desc: "Upload or camera-capture a photo of a sick leaf. AI diagnoses the disease or pest with confidence score, severity, treatment steps, product recommendations, and prevention advice.",
        href: "/doctor",
      },
      {
        name: "Ask AI agronomist",
        desc: "Multi-turn chat with an AI agronomist. English and Swahili supported. Starter prompts available. Conversation history saved for logged-in users.",
        href: "/agronomy",
      },
    ],
  },
  {
    title: "Results & sharing",
    features: [
      {
        name: "PDF report download",
        desc: "Generate a professional printable PDF from your results — includes soil profile, fertilizer plan, planting timeline, weather forecast, pest alerts, certified seeds, agrovet list, and full budget breakdown. Useful for taking to a bank, co-op, or input dealer.",
        href: "/app",
      },
      {
        name: "WhatsApp sharing",
        desc: "One tap exports a formatted WhatsApp message with your crop, soil score, fertilizer budget, timeline, and nearest agrovet. Share with farmer groups, extension officers, or family members.",
        href: "/app",
      },
      {
        name: "Fertilizer comparison ('The Switch')",
        desc: "Side-by-side comparison of your current practice vs the ShambaIQ recommendation — shows the difference in strategy, expected outcome, and yield impact.",
        href: "/app",
      },
    ],
  },
  {
    title: "Finding inputs",
    features: [
      {
        name: "Agrovet locator",
        desc: "Verified agrovets within 50km of your farm shown after every plan — name, town, phone, distance, and ShambaIQ verification badge.",
        href: "/dealers",
      },
      {
        name: "Live dealer inventory",
        desc: "Tap 'See what's in stock' on any agrovet card to check real-time inventory: product name, price, and stock status (In stock / Low / Out of stock).",
        href: "/dealers",
      },
      {
        name: "Yield tracker",
        desc: "Log your harvest by season and crop. Track bags per acre over time and see how precision farming improves your yield year on year.",
        href: "/yields",
      },
    ],
  },
  {
    title: "Accessibility & language",
    features: [
      {
        name: "English and Swahili",
        desc: "The entire ShambaIQ tool — all form labels, results text, AI recommendations, and error messages — is available in both English and Swahili. Toggle in the top-right corner of the tool.",
        href: "/app",
      },
      {
        name: "Install as mobile app (PWA)",
        desc: "Install ShambaIQ directly to your phone's home screen from the browser — no App Store or Play Store download required. Cached soil data works offline after first load.",
        href: "/app",
      },
      {
        name: "Embeddable soil widget",
        desc: "County soil data cards can be embedded on any external website, blog, or county portal using a copy-paste iframe. Useful for county government websites, NGOs, and extension officer portals.",
        href: "/embed",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Features" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4">
        Everything ShambaIQ does — full feature list
      </h1>

      <p className="text-lg text-soil-500 max-w-2xl mb-8 leading-relaxed">
        ShambaIQ is a free precision farming platform for Kenyan smallholders and commercial farmers.
        All features below are free — no subscription, no app download, no registration required
        for most tools.
      </p>

      <Link
        href="/app"
        className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-colors mb-12 shadow-lg shadow-gold-500/25"
      >
        Try the free tool →
      </Link>

      {FEATURE_GROUPS.map((group) => (
        <section key={group.title} className="mb-12">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-5 pb-2 border-b border-cream-300">
            {group.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {group.features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="block bg-white rounded-xl p-5 border border-cream-200 hover:border-gold-400 transition-colors group"
              >
                <h3 className="font-semibold text-forest-700 mb-2 group-hover:text-gold-700 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-sm text-soil-500 leading-relaxed">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Stats */}
      <section className="bg-forest-700 text-cream-100 rounded-2xl p-8 mb-12">
        <h2 className="font-display text-2xl font-bold mb-6">By the numbers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { n: "47", label: "Counties covered" },
            { n: "40+", label: "Crops supported" },
            { n: "1,880+", label: "County × crop plans" },
            { n: "0", label: "Cost to farmers" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl font-extrabold text-gold-400 mb-1">{s.n}</div>
              <div className="text-xs text-cream-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/map" className="block text-center px-5 py-3 bg-white border border-cream-300 hover:border-gold-400 text-forest-700 font-semibold rounded-xl transition-colors text-sm">
          GPS farm mapping →
        </Link>
        <Link href="/intercrop" className="block text-center px-5 py-3 bg-white border border-cream-300 hover:border-gold-400 text-forest-700 font-semibold rounded-xl transition-colors text-sm">
          Intercropping guide →
        </Link>
        <Link href="/app" className="block text-center px-5 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors text-sm">
          Get started free →
        </Link>
      </div>
    </div>
  );
}
