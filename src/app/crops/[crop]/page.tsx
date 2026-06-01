import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCrops,
  getCropBySlug,
  getTopCountiesForCrop,
  getSeedsByCrop,
  getCropCalendars,
  getTopDressing,
  getPrices,
  slugify,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 0;

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

interface PageProps {
  params: Promise<{ crop: string }>;
}

export async function generateStaticParams() {
  return getCrops().map((c) => ({ crop: c.slug }));
}

async function fetchLivePrice(cropName: string): Promise<number | null> {
  try {
    const res = await fetch(`${API}/api/v1/crops/prices`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.prices?.[cropName] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { crop: slug } = await params;
  const crop = getCropBySlug(slug);
  if (!crop) return {};
  return {
    title: `${crop.crop} Farming in Kenya — Soil Requirements, Best Counties, Fertilizer Guide`,
    description: `Complete ${crop.crop} farming guide: optimal soil pH ${crop.ph_min}–${crop.ph_max}, nitrogen needs, best counties ranked by soil suitability. Certified seed varieties and fertilizer budget.`,
    openGraph: {
      title: `${crop.crop} Farming Guide — Kenya`,
      images: [`/api/og/crop/${slug}`],
    },
    alternates: { canonical: `https://shambaiq.com/crops/${slug}` },
  };
}

export default async function CropPage({ params }: PageProps) {
  const { crop: slug } = await params;
  const crop = getCropBySlug(slug);
  if (!crop) notFound();

  const topCounties = getTopCountiesForCrop(crop, 10);
  const worstCounties = getTopCountiesForCrop(crop, 47).slice(-5).reverse();
  const seeds = getSeedsByCrop(crop.crop);
  const calendars = getCropCalendars().filter(
    (c) => c.crop.toLowerCase() === crop.crop.toLowerCase()
  );
  const topDress = getTopDressing().find(
    (t) => t.crop.toLowerCase() === crop.crop.toLowerCase()
  );
  const prices = getPrices();

  const livePrice = await fetchLivePrice(crop.crop);
  const displayPrice = livePrice ?? crop.price_per_kg;
  const revenue = displayPrice * crop.yield_per_acre;

  // Item 14: Previous/Next crop navigation
  const allCrops = getCrops();
  const currentIdx = allCrops.findIndex((c) => c.slug === slug);
  const prevCrop = currentIdx > 0 ? allCrops[currentIdx - 1] : null;
  const nextCrop = currentIdx < allCrops.length - 1 ? allCrops[currentIdx + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Crop Guides", href: "/crops" },
          { label: crop.crop },
        ]}
      />

      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        {crop.crop} Farming Guide — Kenya
      </h1>
      <p className="text-soil-500 mb-10">
        Soil requirements, top counties, seed varieties, fertilizer plan &amp;
        economics
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Requirements */}
          <section className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Soil Requirements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "pH Range", val: `${crop.ph_min}–${crop.ph_max}` },
                { label: "Nitrogen", val: crop.n_need },
                { label: "Phosphorus", val: crop.p_need },
                { label: "Potassium", val: crop.k_need },
              ].map((r) => (
                <div
                  key={r.label}
                  className="bg-cream-50 rounded-lg p-4 border border-cream-200 text-center"
                >
                  <div className="text-xs text-soil-500 mb-1">{r.label}</div>
                  <div className="font-bold text-forest-700 capitalize">
                    {r.val}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-soil-500">
              Preferred texture:{" "}
              <span className="font-semibold text-forest-700">
                {crop.pref_texture}
              </span>
            </div>
          </section>

          {/* Top counties */}
          <section className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Best Counties for {crop.crop}
            </h2>
            <div className="space-y-2">
              {topCounties.map(({ county, score }, i) => (
                <Link
                  key={county.slug}
                  href={`/soil/${county.slug}/${slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream-100 transition-colors group"
                >
                  <span className="w-6 text-sm font-bold text-soil-500">
                    #{i + 1}
                  </span>
                  <span className="flex-1 font-medium text-forest-700 group-hover:text-gold-700 transition-colors">
                    {county.county}
                  </span>
                  <span className="text-xs text-soil-500">{county.zone}</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor:
                        score >= 70
                          ? "#16a34a"
                          : score >= 50
                          ? "#f59e0b"
                          : "#dc2626",
                    }}
                  >
                    {score}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Challenging counties */}
          <section className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Challenging Counties for {crop.crop}
            </h2>
            <p className="text-sm text-soil-500 mb-4">
              These counties may need soil amendments for {crop.crop}
            </p>
            <div className="space-y-2">
              {worstCounties.map(({ county, score }) => (
                <Link
                  key={county.slug}
                  href={`/soil/${county.slug}/${slug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-cream-100 transition-colors"
                >
                  <span className="font-medium text-forest-700">
                    {county.county}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    {score}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Seeds */}
          {seeds.length > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-cream-300">
              <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
                Certified Seed Varieties
              </h2>
              <div className="space-y-3">
                {seeds.map((s, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-cream-50 border border-cream-200"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-forest-700">
                        {s.variety}
                      </span>
                      <span className="text-xs bg-forest-100 text-forest-600 px-2 py-0.5 rounded-full">
                        {s.altitude_zone}
                      </span>
                    </div>
                    <div className="text-xs text-soil-500">
                      {s.breeder} · {s.maturity_days} days ·{" "}
                      {s.yield_bags} bags/acre
                    </div>
                    {s.special && (
                      <div className="text-xs text-soil-500 italic mt-1">
                        {s.special}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Calendar */}
          {calendars.length > 0 && (
            <section className="bg-white rounded-2xl p-6 border border-cream-300">
              <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
                Planting Calendar
              </h2>
              {calendars.map((cal) => (
                <div key={cal.season} className="mb-4 last:mb-0">
                  <h3 className="text-sm font-bold text-gold-700 mb-2">
                    {cal.season}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Month 1", val: cal.month1 },
                      { label: "Month 2", val: cal.month2 },
                      { label: "Month 3", val: cal.month3 },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="bg-cream-50 rounded-lg p-3 border border-cream-200"
                      >
                        <div className="text-xs text-soil-500 mb-1">
                          {m.label}
                        </div>
                        <div className="text-sm text-forest-700 font-medium">
                          {m.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Economics
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-soil-500">Market price</span>
                <span className="font-bold text-forest-700">
                  KES {displayPrice}/kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-soil-500">Expected yield</span>
                <span className="font-bold text-forest-700">
                  {crop.yield_per_acre.toLocaleString()} kg/acre
                </span>
              </div>
              <hr className="border-cream-200" />
              <div className="flex justify-between">
                <span className="text-soil-500">Est. revenue</span>
                <span className="font-bold text-green-600">
                  KES {revenue.toLocaleString()}/acre
                </span>
              </div>
            </div>
          </div>

          {topDress && (
            <div className="bg-white rounded-2xl p-6 border border-cream-300">
              <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
                Top Dressing
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-soil-500">Product:</span>{" "}
                  <span className="font-semibold text-forest-700">
                    {topDress.product}
                  </span>
                </div>
                <div>
                  <span className="text-soil-500">Timing:</span>{" "}
                  <span className="font-semibold text-forest-700">
                    {topDress.timing}
                  </span>
                </div>
                <div>
                  <span className="text-soil-500">Bags/acre:</span>{" "}
                  <span className="font-semibold text-forest-700">
                    {topDress.bags_per_acre}
                  </span>
                </div>
                <p className="text-xs text-soil-500 italic mt-2">
                  {topDress.instruction}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-cream-300">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
              Fertilizer Prices
            </h2>
            <div className="space-y-2 text-sm">
              {prices.slice(0, 5).map((p) => (
                <div key={p.fertilizer} className="flex justify-between">
                  <span className="text-soil-500">{p.fertilizer}</span>
                  <span className="font-semibold text-forest-700">
                    KES {p.subsidized.toLocaleString()}
                  </span>
                </div>
              ))}
              <p className="text-xs text-soil-300">Subsidized price / 50kg bag</p>
            </div>
          </div>

          <Link
            href={`/app?crop=${encodeURIComponent(crop.crop)}`}
            className="block text-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors"
          >
            Check Your County for {crop.crop} →
          </Link>
        </div>
      </div>

      {/* Item 14: Previous/Next crop navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-cream-300">
        {prevCrop ? (
          <Link
            href={`/crops/${prevCrop.slug}`}
            className="flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-gold-700 transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
            {prevCrop.crop}
          </Link>
        ) : <span />}
        <Link href="/crops" className="text-xs text-soil-500 hover:text-gold-700 transition-colors">
          All crops
        </Link>
        {nextCrop ? (
          <Link
            href={`/crops/${nextCrop.slug}`}
            className="flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-gold-700 transition-colors group"
          >
            {nextCrop.crop}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m0 0l-7-7m7 7l-7 7"/></svg>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
