import Link from "next/link";
import { Metadata } from "next";
import { getCountySoils, getDealersByCounty } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Agrovet Directory — Find Farm Input Dealers in Kenya",
  description:
    "Find verified agrovet dealers in all 47 Kenyan counties. Search for fertilizer, seeds, and pesticide suppliers near you.",
  alternates: { canonical: "https://shambaiq.com/dealers" },
};

export default function DealersPage() {
  const counties = getCountySoils();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Agrovet Directory" }]} />
      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
        Agrovet Directory
      </h1>
      <p className="text-soil-400 mb-10 max-w-2xl">
        Find verified farm input dealers — fertilizer, seeds, and pesticides —
        across all 47 Kenyan counties.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {counties
          .sort((a, b) => a.county.localeCompare(b.county))
          .map((c) => {
            const dealers = getDealersByCounty(c.county);
            return (
              <Link
                key={c.slug}
                href={`/dealers/${c.slug}`}
                className="bg-white rounded-xl p-5 border border-cream-300 hover:border-gold-400 hover:shadow-md transition-all group"
              >
                <h3 className="font-display font-bold text-forest-700 group-hover:text-gold-600 transition-colors">
                  {c.county}
                </h3>
                <p className="text-sm text-soil-400 mt-1">
                  {dealers.length > 0
                    ? `${dealers.length} dealer${dealers.length > 1 ? "s" : ""} listed`
                    : "No dealers yet"}
                </p>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
