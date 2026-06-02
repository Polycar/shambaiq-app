import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountySoils, getCountyBySlug, getDealersByCounty } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL } from "@/lib/schema";

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
  const dealers = getDealersByCounty(county.county);
  return {
    title: `Agrovets in ${county.county} County — ${dealers.length} Farm Input Dealers`,
    description: `Find ${dealers.length} verified agrovet dealers in ${county.county} County. Fertilizer, seeds, and pesticide suppliers with stock lists and contact info.`,
    alternates: { canonical: `https://shambaiq.com/dealers/${slug}` },
    openGraph: {
      title: `${dealers.length} Agrovets in ${county.county} County`,
      description: `Verified fertilizer, seed, and pesticide dealers in ${county.county} County, Kenya.`,
      url: `https://shambaiq.com/dealers/${slug}`,
      images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: `Agrovet dealers in ${county.county} Kenya` }],
    },
    twitter: { card: "summary_large_image", title: `Agrovets in ${county.county} County`, description: `Find ${dealers.length} verified farm input dealers in ${county.county} County.`, images: ["https://shambaiq.com/api/og"] },
  };
}

export default async function DealerCountyPage({ params }: PageProps) {
  const { county: slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const dealers = getDealersByCounty(county.county);

  const dealerGraph = dealers.length > 0 ? {
    "@context": "https://schema.org",
    "@graph": dealers.map((d) => ({
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/dealers/${slug}#${d.name.replace(/\s+/g, "-").toLowerCase()}`,
      name: d.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: d.town,
        addressRegion: county.county,
        addressCountry: "KE",
      },
      areaServed: { "@type": "AdministrativeArea", name: `${county.county} County, Kenya` },
      ...(d.lat && d.lon
        ? { geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lon } }
        : {}),
      ...(d.phone ? { telephone: d.phone } : {}),
      ...(d.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: d.rating, bestRating: 5, worstRating: 1 } } : {}),
    })),
  } : null;

  return (
    <>
      {dealerGraph && <JsonLd schemas={[dealerGraph]} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Dealers", href: "/dealers" },
            { label: county.county },
          ]}
        />

        <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-2">
          Agrovets in {county.county} County
        </h1>
        <p className="text-soil-500 mb-10">
          {dealers.length} farm input dealer{dealers.length !== 1 ? "s" : ""} found
        </p>

        {dealers.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {dealers.map((d, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-cream-300 flex flex-col justify-between hover:shadow-md hover:border-gold-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="font-display font-bold text-forest-700 text-lg leading-snug">
                      {d.name}
                    </h2>
                    {d.rating && (
                      <span className="flex items-center gap-1 bg-gold-50 text-gold-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gold-200 shrink-0">
                        ⭐ {d.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-soil-500 mb-4">{d.town}</p>
                </div>
                {d.phone && (
                  <p className="text-sm text-forest-600 mb-2">
                    📞{" "}
                    <a href={`tel:${d.phone}`} className="hover:text-gold-700">
                      {d.phone}
                    </a>
                  </p>
                )}
                {d.stocks && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {d.stocks.split(",").map((s) => (
                      <span
                        key={s.trim()}
                        className="text-xs bg-cream-200 text-soil-500 px-2 py-0.5 rounded-full"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 border border-cream-300 text-center">
            <p className="text-soil-500 mb-4">
              No dealers listed in {county.county} yet.
            </p>
            <p className="text-sm text-soil-300">
              Are you an agrovet in {county.county}?{" "}
              <span className="text-gold-700 font-medium">Apply to be listed</span> on
              ShambaIQ.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href={`/soil/${county.slug}`}
            className="text-gold-700 hover:text-gold-700 font-medium text-sm"
          >
            ← View {county.county} soil report
          </Link>
        </div>
      </div>
    </>
  );
}
