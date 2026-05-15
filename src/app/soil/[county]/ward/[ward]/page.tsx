import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCountySoils,
  getCountyBySlug,
  getWards,
  getWardsByCounty,
  getWardBySlug,
  slugify,
  getCrops,
  scoreCropForCounty,
  API_BASE,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ county: string; ward: string }>;
}

// Build top wards at build time, rest on-demand
export async function generateStaticParams() {
  const counties = getCountySoils().slice(0, 3);
  return counties.flatMap((c) => {
    const wards = getWardsByCounty(c.county).slice(0, 2);
    return wards.map((w) => ({ county: c.slug, ward: slugify(w.ward) }));
  });
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: countySlug, ward: wardSlug } = await params;
  const county = getCountyBySlug(countySlug);
  const ward = getWardBySlug(countySlug, wardSlug);
  if (!county || !ward) return { title: "Ward Not Found" };

  return {
    title: `${ward.ward} Ward Soil Report — ${county.county} County`,
    description: `Precision soil analysis for ${ward.ward} ward in ${ward.subcounty} sub-county, ${county.county}. GPS coordinates: ${ward.latitude.toFixed(4)}, ${ward.longitude.toFixed(4)}. iSDAsoil 30m satellite data.`,
  };
}

export default async function WardPage({ params }: PageProps) {
  const { county: countySlug, ward: wardSlug } = await params;
  const county = getCountyBySlug(countySlug);
  const ward = getWardBySlug(countySlug, wardSlug);
  if (!county || !ward) notFound();

  const allWards = getWardsByCounty(county.county);
  const subcountyWards = allWards.filter((w) => w.subcounty === ward.subcounty);
  const crops = getCrops();
  const topCrops = crops
    .map((c) => ({ crop: c, score: scoreCropForCounty(county, c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Attempt to fetch precision soil data from backend
  let precisionData: Record<string, number> | null = null;
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/soil/precision/${ward.latitude}/${ward.longitude}`,
      { next: { revalidate: 86400 } }
    );
    if (res.ok) {
      precisionData = await res.json();
    }
  } catch {
    // Use county-level fallback
  }

  const soilPh = precisionData?.pH ?? county.pH;
  const soilN = precisionData?.["Total Nitrogen (g/kg)"] ?? county.nitrogen;
  const soilP = precisionData?.["Extractable Phosphorus (mg/kg)"] ?? county.phosphorus;
  const soilK = precisionData?.["Extractable Potassium (mg/kg)"] ?? county.potassium;

  return (
    <div className="bg-cream-100 min-h-screen">
      <Breadcrumbs
        items={[
          { label: "Soil Reports", href: "/soil" },
          { label: county.county, href: `/soil/${county.slug}` },
          { label: `${ward.ward} Ward` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700">
                {ward.ward} Ward
              </h1>
              <p className="text-soil-400 mt-1">
                {ward.subcounty} Sub-County · {county.county} County
              </p>
              <p className="text-xs text-soil-400 mt-1 font-mono">
                📍 {ward.latitude.toFixed(4)}°, {ward.longitude.toFixed(4)}°
                {ward.population > 0 && ` · Pop: ${ward.population.toLocaleString()}`}
              </p>
            </div>
            <Link
              href={`/app?county=${encodeURIComponent(county.county)}`}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Get Advice →
            </Link>
          </div>

          {precisionData ? (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              🎯 Ward-Level Precision Data (iSDA 30m)
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
              📊 County-Level Averages (precision data loading)
            </div>
          )}
        </div>

        {/* Soil data grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "pH", value: soilPh.toFixed(1), status: soilPh >= 5.5 && soilPh <= 7.0 ? "good" : "warn" },
            { label: "Nitrogen", value: `${soilN.toFixed(2)} g/kg`, status: soilN >= 1.2 ? "good" : soilN >= 0.8 ? "warn" : "low" },
            { label: "Phosphorus", value: `${soilP.toFixed(1)} mg/kg`, status: soilP >= 20 ? "good" : soilP >= 12 ? "warn" : "low" },
            { label: "Potassium", value: `${soilK.toFixed(1)} mg/kg`, status: soilK >= 200 ? "good" : soilK >= 150 ? "warn" : "low" },
          ].map((n) => (
            <div key={n.label} className="bg-white rounded-xl p-4 border border-cream-300 shadow-sm">
              <span className="text-xs text-soil-400 font-medium">{n.label}</span>
              <div className="font-display text-xl font-bold text-forest-700 mt-1">{n.value}</div>
              <div
                className={`mt-1 text-xs font-semibold ${
                  n.status === "good" ? "text-green-600" : n.status === "warn" ? "text-amber-600" : "text-red-600"
                }`}
              >
                {n.status === "good" ? "✓ Adequate" : n.status === "warn" ? "⚠ Moderate" : "✕ Low"}
              </div>
            </div>
          ))}
        </div>

        {/* Top crops for this ward */}
        <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm mb-8">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-4">
            Best Crops for {ward.ward}
          </h2>
          <div className="space-y-3">
            {topCrops.map(({ crop, score }, i) => (
              <Link
                key={crop.slug}
                href={`/soil/${county.slug}/${crop.slug}`}
                className="flex items-center gap-4 py-2 border-b border-cream-200 last:border-0 hover:bg-cream-50 -mx-2 px-2 rounded transition-colors"
              >
                <span className="text-lg font-bold text-soil-400 w-6">{i + 1}</span>
                <span className="flex-1 font-semibold text-forest-700">{crop.crop}</span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{
                    backgroundColor: score >= 70 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626",
                  }}
                >
                  {score}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Other wards in this sub-county */}
        <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm">
          <h2 className="font-display text-lg font-bold text-forest-700 mb-4">
            Other Wards in {ward.subcounty}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {subcountyWards
              .filter((w) => w.ward !== ward.ward)
              .map((w) => (
                <Link
                  key={w.slug}
                  href={`/soil/${county.slug}/ward/${slugify(w.ward)}`}
                  className="text-sm text-forest-600 hover:text-gold-600 py-1 transition-colors"
                >
                  {w.ward}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
