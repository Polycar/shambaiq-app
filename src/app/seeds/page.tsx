import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION, makeFAQSchema } from "@/lib/schema";
import { getSeeds } from "@/lib/data";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Certified seed varieties for Kenya — maize, beans, potato, tomato & more",
  description:
    "KALRO and Kenya Seed Company certified seed varieties for 30+ crops. ShambaIQ shows the right variety for your altitude zone, soil, and season — with maturity days, yield per acre, breeder, and disease resistance.",
  alternates: { canonical: `${BASE_URL}/seeds` },
  openGraph: {
    title: "Certified seed varieties Kenya — ranked by altitude, yield & disease resistance",
    description:
      "Find KEPHIS-certified seed varieties for maize, beans, potato, tomato, wheat, avocado, and 30+ crops. Filtered by altitude zone and matched to your farm's soil after the fertilizer plan.",
    url: `${BASE_URL}/seeds`,
  },
};

const faqSchema = makeFAQSchema([
  {
    question: "How does ShambaIQ show certified seed varieties?",
    answer:
      "After generating a fertilizer plan, ShambaIQ automatically shows certified seed varieties for your crop, filtered by your altitude zone (highland, medium altitude, dryland). Each variety card shows the breeder (KALRO, Kenya Seed Company, Simlaw Seeds, Royal Seeds), maturity days, expected yield in bags per acre, altitude zone, and any special attributes (drought tolerance, disease resistance, export suitability).",
  },
  {
    question: "Are the seed varieties listed KEPHIS certified?",
    answer:
      "Yes. All varieties in ShambaIQ's seed database are officially certified by KEPHIS (Kenya Plant Health Inspectorate Service) or approved by KALRO (Kenya Agricultural and Livestock Research Organisation). Only commercially released varieties with documented performance data are included.",
  },
  {
    question: "Which altitude zone do I need?",
    answer:
      "Kenya's seed varieties are typically categorised into three altitude zones: Highland (above 1,800m — Nakuru, Nyeri, Nyandarua, Elgeyo Marakwet), Medium Altitude (900–1,800m — most of Central, Western, and parts of Rift Valley), and Dryland (below 900m, less than 700mm annual rainfall — Machakos, Kitui, Kajiado, Baringo). ShambaIQ automatically uses the altitude zone for your selected county.",
  },
  {
    question: "What is the difference between hybrid and open-pollinated varieties?",
    answer:
      "Hybrid varieties (e.g. H614, H6218 for maize) are bred by crossing two parent lines — they produce higher yields but seeds cannot be saved for replanting. Open-pollinated varieties (e.g. Katumani Composite B, Money Maker tomato) can have seeds saved and replanted. Hybrids generally yield 20–40% more but cost more per bag. ShambaIQ lists both types and notes which applies.",
  },
  {
    question: "Where can I buy certified seeds in Kenya?",
    answer:
      "After the fertilizer plan, ShambaIQ shows verified agrovets within 50km of your farm. These are the best places to buy certified seeds. You can also buy directly from Kenya Seed Company branches, KALRO field stations, and certified agrodealers registered with KEPHIS.",
  },
]);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Certified seeds", item: `${BASE_URL}/seeds` },
  ],
};

const CROP_ORDER = ["Maize", "Beans", "Potato", "Wheat", "Tomato", "Kale (Sukuma Wiki)", "Sorghum", "Avocado"];

const ZONE_COLOR: Record<string, string> = {
  Highland: "#16a34a",
  "Medium/Highland": "#16a34a",
  "Medium Altitude": "#f59e0b",
  "Medium": "#f59e0b",
  "Dryland": "#dc2626",
  "Dryland/Medium": "#dc2626",
  "Highland Tea Zone": "#7c3aed",
};

function zoneColor(zone: string): string {
  for (const [k, v] of Object.entries(ZONE_COLOR)) {
    if (zone.includes(k)) return v;
  }
  return "#6b7280";
}

export default function SeedsPage() {
  const allSeeds = getSeeds();
  const featured = CROP_ORDER.map((cropName) => ({
    crop: cropName,
    varieties: allSeeds.filter((s) => s.crop === cropName),
  })).filter((g) => g.varieties.length > 0);

  const otherCrops = [...new Set(allSeeds.map((s) => s.crop))].filter(
    (c) => !CROP_ORDER.includes(c)
  ).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[faqSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Certified seeds" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4">
        Certified seed varieties for Kenya — matched to your altitude zone and soil
      </h1>

      <p className="text-lg text-soil-500 max-w-2xl mb-3 leading-relaxed">
        ShambaIQ shows KEPHIS-certified and KALRO-approved seed varieties after every fertilizer plan
        — filtered to varieties that suit your altitude zone, soil conditions, and target market.
        Below are the varieties in the database for the most common crops.
      </p>
      <p className="text-sm text-soil-400 mb-8">
        For a personalised variety recommendation filtered to your exact county and farm, run the
        free ShambaIQ tool and check the seeds section in your results.
      </p>

      <Link
        href="/app"
        className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl text-lg transition-colors mb-12 shadow-lg shadow-gold-500/25"
      >
        Get seed recommendations for my farm →
      </Link>

      {/* Zone legend */}
      <div className="flex flex-wrap gap-3 mb-10 text-xs font-semibold">
        {[
          { label: "Highland (>1,800m)", color: "#16a34a" },
          { label: "Medium Altitude (900–1,800m)", color: "#f59e0b" },
          { label: "Dryland (<900m)", color: "#dc2626" },
        ].map((z) => (
          <span key={z.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-cream-300">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
            {z.label}
          </span>
        ))}
      </div>

      {/* Featured crops */}
      {featured.map(({ crop, varieties }) => (
        <section key={crop} className="mb-12">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-4 flex items-center gap-3">
            {crop} certified seed varieties
            <span className="text-sm font-normal text-soil-400">{varieties.length} varieties</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {varieties.map((v) => (
              <div key={v.variety} className="bg-white rounded-xl p-5 border border-cream-200 hover:border-gold-400 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-forest-700 leading-tight">{v.variety}</h3>
                  <span
                    className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: zoneColor(v.altitude_zone) }}
                  >
                    {v.altitude_zone.split("/")[0]}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-soil-500">
                  <p><span className="font-medium text-soil-700">Breeder:</span> {v.breeder}</p>
                  <p><span className="font-medium text-soil-700">Maturity:</span> {v.maturity_days} days</p>
                  <p><span className="font-medium text-soil-700">Yield:</span> {v.yield_bags} bags/acre</p>
                  {v.special && <p className="text-soil-400 italic mt-2">{v.special}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Other crops */}
      <section className="mb-14 bg-cream-100 rounded-2xl p-8">
        <h2 className="font-display text-xl font-bold text-forest-700 mb-4">
          More crops with seed variety data
        </h2>
        <p className="text-soil-500 text-sm mb-5">
          ShambaIQ also shows certified varieties for these crops after your fertilizer plan:
        </p>
        <div className="flex flex-wrap gap-2">
          {otherCrops.map((crop) => (
            <Link
              key={crop}
              href={`/app?crop=${encodeURIComponent(crop)}`}
              className="px-4 py-2 bg-white rounded-lg border border-cream-300 hover:border-gold-400 text-sm text-forest-700 font-medium transition-colors"
            >
              {crop}
            </Link>
          ))}
        </div>
      </section>

      {/* How seeds are shown */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-5">
          How ShambaIQ matches seed varieties to your farm
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Altitude zone", desc: "ShambaIQ uses your county's elevation profile to filter varieties — highland varieties on lowland farms produce poor yields and vice versa." },
            { label: "Breeder", desc: "All varieties are from KALRO, Kenya Seed Company, Simlaw Seeds, Royal Seeds, or other KEPHIS-approved breeders. No unverified varieties are listed." },
            { label: "Maturity days", desc: "Matched to the typical growing season length for your location. Short-rains farmers in drier zones see faster-maturing varieties ranked higher." },
            { label: "Special attributes", desc: "Drought tolerance, disease resistance (e.g. late blight in potato, common mosaic virus in beans), export suitability (e.g. Hass avocado), or premium market attributes are flagged per variety." },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-5 border border-cream-300">
              <h3 className="font-semibold text-forest-700 mb-1">{item.label}</h3>
              <p className="text-sm text-soil-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">Frequently asked questions</h2>
        <div className="divide-y divide-cream-200 border border-cream-200 rounded-2xl overflow-hidden bg-white">
          {[
            { q: "Are these varieties KEPHIS certified?", a: "Yes. All varieties in the database are officially certified by KEPHIS or approved by KALRO. Only commercially released varieties with documented performance data are included." },
            { q: "What altitude zone do I need?", a: "Highland (above 1,800m) — Nakuru, Nyeri, Nyandarua. Medium altitude (900–1,800m) — most of Central, Western, Rift Valley. Dryland (below 900m, under 700mm rain) — Machakos, Kitui, Kajiado. ShambaIQ auto-detects your zone from your county." },
            { q: "Can I buy these seeds from agrovets?", a: "Yes. After your fertilizer plan, ShambaIQ shows verified agrovets within 50km of your farm. You can also buy from Kenya Seed Company branches and KALRO field stations directly." },
            { q: "What is the difference between hybrid and open-pollinated?", a: "Hybrids (e.g. H614, H6218) yield 20–40% more but seeds cannot be saved for replanting. Open-pollinated varieties (e.g. Katumani Composite B) can be saved. Both types are listed." },
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
          Crop farming guides →
        </Link>
        <Link href="/app" className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">
          Get seed varieties for my farm →
        </Link>
      </div>
    </div>
  );
}
