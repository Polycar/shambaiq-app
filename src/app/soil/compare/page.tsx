import { Metadata } from "next";
import Link from "next/link";
import { getCrops } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Best counties for every crop in Kenya — soil suitability comparison",
  description:
    "Which Kenyan county is best for maize, beans, potato, tomato, avocado, or any of 40 crops? Ranked by soil pH, nutrients, rainfall, and altitude from satellite and climate data.",
  alternates: { canonical: `${BASE_URL}/soil/compare` },
  openGraph: {
    title: "Best counties for every crop in Kenya — suitability rankings",
    description:
      "Compare all 47 Kenyan counties for any crop. Rankings combine satellite soil data (pH, nitrogen, phosphorus, potassium) with county rainfall and altitude suitability.",
    url: `${BASE_URL}/soil/compare`,
  },
};

const CATEGORY_ORDER = [
  "Cereals",
  "Legumes",
  "Root & Tuber Crops",
  "Vegetables",
  "Fruits",
  "Cash Crops",
  "Fodder",
];

function categorize(crop: string): string {
  if (["Maize", "Wheat", "Sorghum", "Finger Millet", "Millet", "Rice (Upland)", "Rice (Lowland/Paddy)"].includes(crop)) return "Cereals";
  if (["Beans", "Cowpeas", "Groundnuts", "Pigeon Peas", "Green Grams", "Soybeans"].includes(crop)) return "Legumes";
  if (["Potato", "Cassava", "Sweet Potato", "Arrow Root"].includes(crop)) return "Root & Tuber Crops";
  if (["Tomato", "Kale (Sukuma Wiki)", "Cabbage", "Onion", "Spinach", "Carrot", "Capsicum", "Chilies", "Dhania", "Garlic", "Snow Peas"].includes(crop)) return "Vegetables";
  if (["Avocado", "Mango", "Banana", "Watermelon", "Passion Fruit", "Pixie Oranges", "Pawpaw", "Wambugu Apples"].includes(crop)) return "Fruits";
  if (["Tea", "Coffee (Arabica)", "Coffee (Robusta)", "Cotton", "Pyrethrum", "Sisal", "Sunflower", "Sugarcane", "Macadamia", "Cashew Nuts", "Coconuts"].includes(crop)) return "Cash Crops";
  if (["Napier Grass", "Lucerne"].includes(crop)) return "Fodder";
  return "Cash Crops";
}

export default function ComparePage() {
  const crops = getCrops();

  const byCategory: Record<string, typeof crops> = {};
  for (const crop of crops) {
    const cat = categorize(crop.crop);
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(crop);
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Crop suitability comparison by county — Kenya",
    description:
      "County-level suitability rankings for 40 crops grown in Kenya, combining satellite soil pH, nitrogen, phosphorus, and potassium with county rainfall and altitude data.",
    numberOfItems: crops.length,
    url: `${BASE_URL}/soil/compare`,
    itemListElement: crops.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.crop,
      url: `${BASE_URL}/soil/compare/${c.slug}`,
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Soil reports", item: `${BASE_URL}/soil` },
      { "@type": "ListItem", position: 3, name: "County comparison", item: `${BASE_URL}/soil/compare` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd schemas={[itemListSchema, breadcrumbSchema, { "@context": "https://schema.org", ...ORGANIZATION }]} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Soil reports", href: "/soil" },
          { label: "County comparison" },
        ]}
      />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-3">
        Best counties for every crop in Kenya
      </h1>
      <p className="text-soil-500 max-w-2xl mb-10">
        Select any crop to see all 47 counties ranked by soil and climate suitability — scored
        against satellite-measured pH, nitrogen, phosphorus, potassium, plus county rainfall and altitude.
      </p>

      {CATEGORY_ORDER.filter((cat) => byCategory[cat]?.length).map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="font-display text-lg font-bold text-forest-700 mb-4 border-b border-cream-300 pb-2">
            {cat}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {byCategory[cat].map((crop) => (
              <Link
                key={crop.slug}
                href={`/soil/compare/${crop.slug}`}
                className="flex items-center justify-between gap-3 p-4 bg-white rounded-xl border border-cream-300 hover:border-gold-400 transition-all group"
              >
                <div>
                  <span className="font-semibold text-forest-700 group-hover:text-gold-700 transition-colors block">
                    {crop.crop}
                  </span>
                  <span className="text-xs text-soil-400">
                    Best county for {crop.crop.toLowerCase()}
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-soil-400 group-hover:text-gold-500 shrink-0 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
