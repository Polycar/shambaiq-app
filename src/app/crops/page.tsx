import Link from "next/link";
import { Metadata } from "next";
import { getCrops } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Crop Farming Guides — 25 Crops, Soil Requirements, Fertilizer",
  description:
    "Complete farming guides for 25 Kenyan crops. Soil pH requirements, nitrogen needs, best counties, seed varieties, and fertilizer recommendations.",
};

export default function CropsDirectoryPage() {
  const crops = getCrops();

  const groups: Record<string, typeof crops> = {};
  crops.forEach((c) => {
    const cat =
      ["Maize", "Wheat", "Sorghum", "Finger Millet", "Rice (Upland)"].includes(c.crop)
        ? "Cereals"
        : ["Beans", "Cowpeas", "Groundnuts", "Pigeon Peas"].includes(c.crop)
        ? "Legumes"
        : ["Potatoes", "Cassava", "Sweet Potato", "Onions"].includes(c.crop)
        ? "Root & Tuber Crops"
        : ["Tomatoes", "Kale (Sukuma)", "Cabbage"].includes(c.crop)
        ? "Vegetables"
        : ["Tea", "Coffee (Arabica)", "Cotton", "Pyrethrum", "Sisal", "Sunflower"].includes(c.crop)
        ? "Cash Crops"
        : "Fruits & Trees";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Crop Guides" }]} />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        Crop Farming Guides
      </h1>
      <p className="text-soil-400 mb-10 max-w-2xl">
        Detailed guides for 25 crops grown in Kenya. Each guide includes soil
        requirements, best counties, seed varieties, fertilizer plans, and
        expected economics.
      </p>

      {Object.entries(groups).map(([cat, catCrops]) => (
        <section key={cat} className="mb-10">
          <h2 className="font-display text-xl font-bold text-forest-600 mb-4 pb-2 border-b border-cream-300">
            {cat}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catCrops.map((c) => (
              <Link
                key={c.slug}
                href={`/crops/${c.slug}`}
                className="bg-white rounded-xl p-5 border border-cream-300 hover:border-gold-400 hover:shadow-md transition-all group"
              >
                <h3 className="font-display font-bold text-forest-700 group-hover:text-gold-600 transition-colors mb-2">
                  {c.crop}
                </h3>
                <div className="text-xs text-soil-400 space-y-1">
                  <div className="flex justify-between">
                    <span>pH range</span>
                    <span className="font-semibold text-forest-700">
                      {c.ph_min}–{c.ph_max}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>N / P / K need</span>
                    <span className="font-semibold text-forest-700 capitalize">
                      {c.n_need} / {c.p_need} / {c.k_need}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yield</span>
                    <span className="font-semibold text-forest-700">
                      {c.yield_per_acre.toLocaleString()} kg/acre
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="font-semibold text-green-600">
                      KES {c.price_per_kg}/kg
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
