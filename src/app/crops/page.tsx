import Link from "next/link";
import { Metadata } from "next";
import { getCrops } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowRight } from "lucide-react";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Crop Farming Guides — 40+ Crops, Soil Requirements, Fertilizer",
  description:
    "Complete farming guides for over 40 Kenyan crops. Soil pH requirements, nitrogen needs, best counties, seed varieties, and fertilizer recommendations.",
  alternates: { canonical: "https://shambaiq.com/crops" },
  openGraph: {
    title: "Crop Farming Guides — 40+ Kenyan Crops",
    description: "Soil pH, nitrogen needs, best counties, certified seed varieties, and fertilizer budgets for over 40 Kenyan crops.",
    url: "https://shambaiq.com/crops",
    images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: "Kenya Crop Farming Guides" }],
  },
  twitter: { card: "summary_large_image", title: "Crop Farming Guides — 40+ Kenyan Crops", description: "Soil requirements, best counties, and fertilizer budgets for over 40 crops in Kenya.", images: ["https://shambaiq.com/api/og"] },
};

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

interface LiveCrop {
  id: number;
  slug: string;
  name: string;
  category: string;
  ph_min: number;
  ph_max: number;
  price_per_kg: number | null;
  yield_per_acre: number | null;
  n_need: string;
  p_need: string;
  k_need: string;
  pref_texture: string | null;
}

async function fetchLiveCrops(): Promise<LiveCrop[]> {
  try {
    const res = await fetch(`${API}/api/v1/crops/economics`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.crops || [];
  } catch {
    return [];
  }
}

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  Cereals:               { emoji: "🌾", color: "#d4a020" },
  Legumes:               { emoji: "🫘", color: "#16a34a" },
  "Root & Tuber Crops":  { emoji: "🥔", color: "#a86e08" },
  Vegetables:            { emoji: "🥬", color: "#15803d" },
  "Cash Crops":          { emoji: "☕", color: "#7c3aed" },
  "Fruits & Trees":      { emoji: "🥭", color: "#dc2626" },
  Other:                 { emoji: "🌱", color: "#16a34a" },
};

function categorize(crop: string): string {
  if (["Maize", "Wheat", "Sorghum", "Finger Millet", "Rice (Upland)"].includes(crop)) return "Cereals";
  if (["Beans", "Cowpeas", "Groundnuts", "Pigeon Peas"].includes(crop)) return "Legumes";
  if (["Potato", "Cassava", "Sweet Potato", "Onion", "Arrow Root"].includes(crop)) return "Root & Tuber Crops";
  if (["Tomato", "Kale (Sukuma Wiki)", "Cabbage", "Spinach", "Carrot", "Capsicum", "Chilies", "Dhania", "Garlic", "Snow Peas"].includes(crop)) return "Vegetables";
  if (["Tea", "Coffee (Arabica)", "Cotton", "Pyrethrum", "Sisal", "Sunflower"].includes(crop)) return "Cash Crops";
  return "Fruits & Trees";
}

export default async function CropsDirectoryPage() {
  const staticCrops = getCrops();
  const liveCrops = await fetchLiveCrops();

  // Build a lookup from live API data by slug/name for O(1) access
  const liveBySlug = new Map(liveCrops.map(c => [c.slug, c]));
  const liveByName = new Map(liveCrops.map(c => [c.name, c]));

  // Merge: start from static crops (for page routing compatibility), overlay live data
  const merged = staticCrops.map(sc => {
    const live = liveBySlug.get(sc.slug) ?? liveByName.get(sc.crop);
    return {
      crop: sc.crop,
      slug: sc.slug,
      category: live?.category ?? categorize(sc.crop),
      ph_min: live?.ph_min ?? sc.ph_min,
      ph_max: live?.ph_max ?? sc.ph_max,
      price_per_kg: live?.price_per_kg ?? sc.price_per_kg,
      yield_per_acre: live?.yield_per_acre ?? sc.yield_per_acre,
    };
  });

  // Also add any new crops added via admin that aren't in static data
  liveCrops.forEach(lc => {
    if (!liveBySlug.has(lc.slug) || !staticCrops.find(sc => sc.slug === lc.slug)) {
      if (!merged.find(m => m.slug === lc.slug)) {
        merged.push({
          crop: lc.name, slug: lc.slug, category: lc.category,
          ph_min: lc.ph_min, ph_max: lc.ph_max,
          price_per_kg: lc.price_per_kg ?? 0,
          yield_per_acre: lc.yield_per_acre ?? 0,
        });
      }
    }
  });

  const groups: Record<string, typeof merged> = {};
  merged.forEach((c) => {
    const cat = c.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  });

  const categoryOrder = ["Cereals", "Legumes", "Root & Tuber Crops", "Vegetables", "Cash Crops", "Fruits & Trees", "Other"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Crop Guides" }]} />

      <div className="mb-10 md:mb-14">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-forest-700 mb-3 leading-tight">
          Crop Farming Guides
        </h1>
        <p className="text-soil-500 max-w-2xl text-lg leading-relaxed">
          Detailed guides for {merged.length} crops grown in Kenya. Each guide includes soil
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
              <h2 className="font-display text-xl font-bold text-forest-600">{cat}</h2>
              <span className="text-sm text-soil-500 ml-1">{catCrops.length} crops</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catCrops.map((c) => (
                <Link
                  key={c.slug}
                  href={`/crops/${c.slug}`}
                  className="bg-white rounded-2xl p-5 border border-cream-300 hover:border-gold-400 card-hover group"
                >
                  <h3 className="font-display text-lg font-bold text-forest-700 group-hover:text-gold-700 transition-colors mb-3 leading-tight">
                    {c.crop}
                  </h3>
                  <div className="space-y-2 text-xs text-soil-500">
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
                    <div className="flex justify-between">
                      <span>Yield</span>
                      <span className="font-semibold text-forest-700">
                        {c.yield_per_acre ? c.yield_per_acre.toLocaleString() + " kg/acre" : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market price</span>
                      <span className="font-semibold text-green-600">
                        {c.price_per_kg ? `KES ${c.price_per_kg}/kg` : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gold-700 group-hover:text-gold-500 transition-colors">
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
