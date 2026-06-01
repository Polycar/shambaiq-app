import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCountySoils,
  getCountyBySlug,
  computeSoilHealthScore,
  getNutrientStatus,
} from "@/lib/data";
import ScoreRing from "@/components/ScoreRing";
import Logo from "@/components/Logo";

interface PageProps {
  params: Promise<{ county: string }>;
}

export async function generateStaticParams() {
  return getCountySoils().map((c) => ({ county: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { county: slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) return {};
  return {
    title: `${county.county} Soil Health Status Widget`,
    description: `Embeddable live soil health metrics for ${county.county} County.`,
    alternates: { canonical: `https://shambaiq.com/soil/${slug}` },
  };
}

export default async function CountyEmbedPage({ params }: PageProps) {
  const { county: slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const score = computeSoilHealthScore(county);

  const nutrients = [
    { label: "pH (Soil Acidity)", val: county.pH, type: "ph" as const },
    { label: "Total Nitrogen", val: `${county.nitrogen} g/kg`, type: "nitrogen" as const },
    { label: "Extractable Phosphorus", val: `${county.phosphorus} mg/kg`, type: "phosphorus" as const },
    { label: "Extractable Potassium", val: `${county.potassium} mg/kg`, type: "potassium" as const },
  ];

  return (
    <div className="bg-cream-50/50 p-4 min-h-screen flex flex-col justify-between border border-cream-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cream-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Logo size={20} showText={false} />
          <span className="font-display font-bold text-forest-700 text-sm">
            Shamba<span className="text-gold-500">IQ</span> Soil Report
          </span>
        </div>
        <span className="text-xs bg-forest-700/5 text-forest-700 font-semibold px-2 py-0.5 rounded-full">
          30m precision
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-5 gap-4 items-center mb-4">
        {/* Radial ring score - 2 cols */}
        <div className="col-span-2 flex justify-center py-1">
          <ScoreRing score={score} size={110} label="Soil Score" />
        </div>

        {/* Core metrics list - 3 cols */}
        <div className="col-span-3 space-y-2">
          <div className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-1">
            {county.county} County Soil
          </div>
          {nutrients.map((n) => {
            const rawVal = typeof n.val === "string" ? parseFloat(n.val) : n.val;
            const status = getNutrientStatus(rawVal, n.type);
            return (
              <div key={n.type} className="flex justify-between items-center bg-white rounded-lg p-2 border border-cream-100 shadow-sm">
                <div>
                  <div className="text-[10px] text-soil-500 font-medium leading-none">{n.label}</div>
                  <div className="text-xs font-bold text-forest-700 mt-0.5">{n.val}</div>
                </div>
                <span
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white leading-none uppercase shrink-0"
                  style={{ backgroundColor: status.color }}
                >
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Dofollow Backlink Link juice */}
      <div className="border-t border-cream-200 pt-3 flex items-center justify-between text-[11px]">
        <Link
          href={`https://www.shambaiq.com/soil/${slug}`}
          target="_blank"
          rel="noopener"
          className="text-gold-700 hover:text-gold-500 font-bold flex items-center gap-0.5 transition-colors"
        >
          View Full Report →
        </Link>
        <span className="text-soil-500">
          Powered by{" "}
          <Link
            href={`https://www.shambaiq.com/soil/${slug}`}
            target="_blank"
            rel="noopener"
            className="text-forest-700 hover:underline font-bold"
          >
            ShambaIQ {county.county} Soil Data
          </Link>
        </span>
      </div>
    </div>
  );
}
