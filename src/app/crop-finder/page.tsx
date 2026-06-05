import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION, makeFAQSchema, makeHowToSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "What crop should I plant in Kenya? AI crop finder for your soil",
  description:
    "Not sure what to grow? ShambaIQ's AI crop finder scores all 40+ crops against your farm's soil chemistry, current season, and weather forecast — then ranks them by suitability and income potential. Free for all 47 counties.",
  alternates: { canonical: `${BASE_URL}/crop-finder` },
  openGraph: {
    title: "What crop should I plant? AI crop finder for Kenyan farmers",
    description:
      "Select your county, skip the crop picker, and let ShambaIQ's AI rank all 40+ crops by soil suitability, season, weather, and income potential for your specific farm.",
    url: `${BASE_URL}/crop-finder`,
  },
};

const howToSchema = makeHowToSchema({
  name: "How to find the best crop to plant for your farm in Kenya",
  description:
    "ShambaIQ's AI crop finder scores all 40+ crops against your location's soil pH, nitrogen, phosphorus, potassium, current season, and 7-day weather forecast, then ranks them by suitability and projected income.",
  totalTime: "PT2M",
  estimatedCost: { currency: "KES", value: "0" },
  tool: ["Smartphone or computer", "Internet connection"],
  steps: [
    {
      name: "Open ShambaIQ and select your location",
      text:
        "Go to shambaiq.com/app. Choose your county and ward, or tap 'Check my farm' to use GPS and pin your exact plot.",
    },
    {
      name: "Choose 'I don't know yet' instead of a crop",
      text:
        "In the crop selector, instead of picking a specific crop, select 'I don't know yet — show me what fits my soil'. This switches the tool into crop-finder mode.",
    },
    {
      name: "Tap Get plan and see your ranked crop list",
      text:
        "ShambaIQ scores all 40+ crops against your soil chemistry (pH, N, P, K), current planting season, and the 7-day weather forecast. Results are sorted by match score. Each crop card shows the suitability percentage, estimated yield, and gross income per acre.",
    },
    {
      name: "Pick a crop and get your fertilizer plan",
      text:
        "Tap any crop in the ranked list to pre-fill the crop selector and immediately run the full fertilizer analysis for that crop on your land.",
    },
  ],
});

const faqSchema = makeFAQSchema([
  {
    question: "How does ShambaIQ decide which crop is best for my soil?",
    answer:
      "ShambaIQ compares your soil's measured pH, total nitrogen (g/kg), extractable phosphorus (mg/kg), and extractable potassium (mg/kg) against each crop's known optimal growing range. Crops whose soil requirements closely match your soil conditions receive higher scores. The current planting season and 7-day weather forecast are also factored in — a crop that needs dry conditions scores lower if rain is forecast.",
  },
  {
    question: "How many crops are compared?",
    answer:
      "ShambaIQ's database includes over 40 crops grown commercially in Kenya: cereals (maize, wheat, sorghum, finger millet, rice), legumes (beans, cowpeas, green grams, soybeans, pigeon peas), vegetables (tomato, kale, cabbage, onion, carrot, capsicum, spinach), root crops (potato, cassava, sweet potato, arrow root), fruits (avocado, banana, mango, passion fruit, watermelon), fodder crops, and cash crops (coffee, tea, sugarcane, sunflower, macadamia).",
  },
  {
    question: "Can I use the crop finder if I am not on my farm?",
    answer:
      "Yes. Use the 'Select region' tab, choose your county and ward, then select 'I don't know yet'. The crop finder runs on satellite soil data for your ward — you don't need to be physically present.",
  },
  {
    question: "Is the crop ranking different for each county?",
    answer:
      "Yes, significantly. Narok and Nakuru soils (slightly acidic, medium-high nitrogen) rank wheat and potato very highly. Machakos and Kitui soils (low pH, low phosphorus) rank sorghum, cowpeas, and green grams higher. Kisii soils (very acidic, high rainfall) rank tea and avocado highly but may flag maize as needing lime first.",
  },
  {
    question: "Does the crop finder show income estimates?",
    answer:
      "Yes. Each crop in the ranked list shows an estimated gross income per acre, calculated from the crop's average yield for your soil conditions multiplied by the current local market price. This helps you compare not just agronomic suitability but also economic return.",
  },
  {
    question: "What if I want to try a crop that scored low?",
    answer:
      "You can still get a fertilizer plan for any crop regardless of its suitability score. A low score tells you the soil needs amendment — the plan will tell you exactly what to add (lime, DAP, phosphorus) to bring conditions closer to optimal before planting.",
  },
]);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Crop finder", item: `${BASE_URL}/crop-finder` },
  ],
};

const FACTORS = [
  { label: "Soil pH", desc: "Each crop has an optimal pH range. Maize prefers 5.5–7.0; potato 4.8–5.5; wheat 6.0–7.0. Your soil's measured pH is scored against each crop's range." },
  { label: "Nitrogen (N)", desc: "Heavy feeders like maize and wheat score lower if soil nitrogen is insufficient. Legumes score higher because they fix their own nitrogen." },
  { label: "Phosphorus (P)", desc: "Root development and grain fill depend on phosphorus. Crops with high P needs (potato, tomato) score lower on P-deficient soils." },
  { label: "Potassium (K)", desc: "Potassium affects disease resistance and stem strength. Crops like banana and potato need high K; cereals need moderate levels." },
  { label: "Planting season", desc: "Crops are matched to the current calendar season. A crop not suited to the current long or short rains window receives a season penalty." },
  { label: "7-day weather forecast", desc: "Current rainfall and temperature forecast adjusts scores. A dry week ahead boosts drought-tolerant crop scores; heavy rain boosts water-loving crops." },
];

const EXAMPLES = [
  { county: "Trans-Nzoia", top: ["Maize", "Wheat", "Potato"], soil: "pH 5.8–6.2, high nitrogen, medium phosphorus" },
  { county: "Machakos", top: ["Sorghum", "Cowpeas", "Green Grams"], soil: "pH 5.2–5.8, low nitrogen, low phosphorus, annual rainfall 600mm" },
  { county: "Kisii", top: ["Maize", "Avocado", "Tea"], soil: "pH 4.8–5.5, very acidic — lime recommended for cereals" },
  { county: "Laikipia", top: ["Wheat", "Sunflower", "Maize"], soil: "pH 6.0–6.8, medium nitrogen, low rainfall — drought-tolerant varieties ranked highest" },
];

export default function CropFinderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[howToSchema, faqSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Crop finder" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4">
        Not sure what to plant? ShambaIQ ranks all 40+ crops for your soil
      </h1>

      <p className="text-lg text-soil-500 max-w-2xl mb-3 leading-relaxed">
        Select your county — or drop a GPS pin on your exact farm — and ShambaIQ's AI scores every
        crop in its database against your soil chemistry, current season, and 7-day weather forecast.
        Results are ranked by suitability and income potential.
      </p>
      <p className="text-sm text-soil-400 mb-8">
        In the tool, choose <strong className="text-forest-700">"I don't know yet — show me what fits my soil"</strong> instead
        of picking a specific crop. Works in all 47 counties, free.
      </p>

      <Link
        href="/app"
        className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-colors mb-12 shadow-lg shadow-gold-500/25"
      >
        Find the best crop for my farm →
      </Link>

      {/* Steps */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">
          How the crop finder works — 4 steps
        </h2>
        <div className="flex flex-col gap-5">
          {[
            { n: "1", title: "Select your location", body: "County and ward, or GPS pin. ShambaIQ loads 30m satellite soil data for your exact area." },
            { n: "2", title: "Choose 'I don't know yet'", body: "In the crop selector, pick the last option: 'I don't know yet — show me what fits my soil'. This activates crop-finder mode." },
            { n: "3", title: "See your ranked crop list", body: "All 40+ crops are scored and sorted by suitability. Each card shows the match score, estimated yield, and gross income per acre at current prices." },
            { n: "4", title: "Pick a crop and get your plan", body: "Tap any crop to instantly load the full fertilizer recommendation for that crop on your land — no need to start over." },
          ].map((s) => (
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

      {/* Factors */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-5">
          What factors go into the crop score?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FACTORS.map((f) => (
            <div key={f.label} className="bg-white rounded-xl p-5 border border-cream-300">
              <h3 className="font-semibold text-forest-700 mb-1">{f.label}</h3>
              <p className="text-sm text-soil-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* County examples */}
      <section className="mb-14 bg-cream-100 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-5">
          Top-ranked crops by county — examples
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {EXAMPLES.map((ex) => (
            <div key={ex.county} className="bg-white rounded-xl p-5 border border-cream-300">
              <h3 className="font-semibold text-forest-700 mb-1">{ex.county} County</h3>
              <p className="text-xs text-soil-400 mb-3">{ex.soil}</p>
              <div className="flex gap-2 flex-wrap">
                {ex.top.map((crop, i) => (
                  <span key={crop} className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? "#16a34a" : i === 1 ? "#f59e0b" : "#6b7280" }}>
                    #{i + 1} {crop}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-soil-400 mt-4">Rankings vary by season and weather. Run the crop finder for your exact location to get current results.</p>
      </section>

      {/* FAQs */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">Frequently asked questions</h2>
        <div className="divide-y divide-cream-200 border border-cream-200 rounded-2xl overflow-hidden bg-white">
          {[
            { q: "How does ShambaIQ decide which crop is best?", a: "It compares your soil's pH, nitrogen, phosphorus, and potassium against each crop's optimal growing range, then adjusts for planting season and current weather. Crops are ranked by how closely conditions match." },
            { q: "How many crops are compared?", a: "Over 40 crops: cereals, legumes, vegetables, root crops, fruits, fodder, and cash crops. Every crop in the database is scored — not just a pre-selected shortlist." },
            { q: "Does the ranking change by season?", a: "Yes. Crops unsuited to the current long or short rains season receive a penalty. Run the tool at the start of each season to get the most relevant rankings." },
            { q: "What if I want to grow a crop that scored low?", a: "You can still get a fertilizer plan for it. The plan will show what soil amendment (lime, DAP, extra phosphorus) is needed to bring your soil into the crop's optimal range." },
          ].map((faq) => (
            <div key={faq.q} className="px-6 py-5">
              <h3 className="font-semibold text-forest-700 mb-2">{faq.q}</h3>
              <p className="text-sm text-soil-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/soil/compare" className="block text-center px-6 py-3 bg-white border border-cream-300 hover:border-gold-400 text-forest-700 font-semibold rounded-xl transition-colors">
          Best county for each crop →
        </Link>
        <Link href="/app" className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">
          Find crops for my soil →
        </Link>
      </div>
    </div>
  );
}
