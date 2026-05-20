import Link from "next/link";
import { Metadata } from "next";
import { getCrops } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Crop Farming Guides — 25 Crops, Soil Requirements, Fertilizer",
  description:
    "Complete farming guides for 25 Kenyan crops. Soil pH requirements, nitrogen needs, best counties, seed varieties, and fertilizer recommendations.",
};

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  Cereals:               { emoji: "🌾", color: "#d4a020" },
  Legumes:               { emoji: "🫘", color: "#16a34a" },
  "Root & Tuber Crops":  { emoji: "🥔", color: "#a86e08" },
  Vegetables:            { emoji: "🥬", color: "#15803d" },
  "Cash Crops":          { emoji: "☕", color: "#7c3aed" },
  "Fruits & Trees":      { emoji: "🥭", color: "#dc2626" },
};

function categorize(crop: string): string {
  if (["Maize", "Wheat", "Sorghum", "Finger Millet", "Rice (Upland)"].includes(crop)) return "Cereals";
  if (["Beans", "Cowpeas", "Groundnuts", "Pigeon Peas"].includes(crop)) return "Legumes";
  if (["Potatoes", "Cassava", "Sweet Potato", "Onions"].includes(crop)) return "Root & Tuber Crops";
  if (["Tomatoes", "Kale (Sukuma)", "Cabbage"].includes(crop)) return "Vegetables";
  if (["Tea", "Coffee (Arabica)", "Cotton", "Pyrethrum", "Sisal", "Sunflower"].includes(crop)) return "Cash Crops";
  return "Fruits & Trees";
}

export default function CropsDirectoryPage() {
  const crops = getCrops();

  const groups: Record<string, typeof crops> = {};
  crops.forEach((c) => {
    const cat = categorize(c.crop);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  });

  // Ensure consistent order
  const categoryOrder = ["Cereals", "Legumes", "Root & Tuber Crops", "Vegetables", "Cash Crops", "Fruits & Trees"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Crop Guides" }]} />

      <div className="mb-10 md:mb-14">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-forest-700 mb-3 leading-tight">
          Crop Farming Guides
        </h1>
        <p className="text-soil-400 max-w-2xl text-lg leading-relaxed">
          Detailed guides for 25 crops grown in Kenya. Each guide includes soil
          requirements, best counties, seed varieties, fertilizer plans, and
          expected economics.
        </p>
      </div>

      {categoryOrder.filter((cat) => groups[cat]?.length).map((cat) => {
        const meta = CATEGORY_META[cat] || { emoji: "🌱", color: "#16a34a" };
        const catCrops = groups[cat];
        return (
          <section key={cat} className="mb-12">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-cream-300">
              <span className="text-2xl">{meta.emoji}</span>
              <h2 className="font-display text-xl font-bold text-forest-600">
                {cat}
              </h2>
              <span className="text-sm text-soil-400 ml-1">
                {catCrops.length} crops
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catCrops.map((c) => (
                <Link
                  key={c.slug}
                  href={`/crops/${c.slug}`}
                  className="bg-white rounded-2xl p-5 border border-cream-300 hover:border-gold-400 card-hover group"
                >
                  <h3 className="font-display text-lg font-bold text-forest-700 group-hover:text-gold-600 transition-colors mb-3 leading-tight">
                    {c.crop}
                  </h3>

                  <div className="space-y-2 text-xs text-soil-400">
                    {/* pH bar */}
                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span>pH range</span>
                        <span className="font-semibold text-forest-700">{c.ph_min}–{c.ph_max}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-cream-300 relative overflow-hidden">
                        <div
                          className="absolute h-full rounded-full bg-forest-400"
                          style={{
                            left: `${((c.ph_min - 3) / 8) * 100}%`,
                            width: `${((c.ph_max - c.ph_min) / 8) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* NPK needs */}
                    <div className="flex justify-between">
                      <span>N / P / K need</span>
                      <div className="flex gap-1.5">
                        {[c.n_need, c.p_need, c.k_need].map((need, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                            style={{
                              backgroundColor:
                                need === "high" ? "#dc262615" : need === "medium" ? "#f59e0b15" : "#16a34a15",
                              color:
                                need === "high" ? "#dc2626" : need === "medium" ? "#f59e0b" : "#16a34a",
                            }}
                          >
                            {need === "high" ? "H" : need === "medium" ? "M" : "L"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Yield + Price */}
                    <div className="flex justify-between">
                      <span>Yield</span>
                      <span className="font-semibold text-forest-700">
                        {c.yield_per_acre.toLocaleString()} kg/acre
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market price</span>
                      <span className="font-semibold text-green-600">
                        KES {c.price_per_kg}/kg
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gold-600 group-hover:text-gold-500 transition-colors">
                    Full guide <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
