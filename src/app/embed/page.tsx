import { Metadata } from "next";
import { getCountySoils } from "@/lib/data";
import EmbedBuilderClient from "./EmbedBuilderClient";

export const metadata: Metadata = {
  title: "Free Soil Health Embeddable Widget — ShambaIQ for Media & Web",
  description:
    "Embed real-time, precision 30m soil health data cards on your website, agriculture blog, or county portal. Simple copy-paste iframe code for all 47 counties.",
  keywords: [
    "soil health widget",
    "agriculture blog embed",
    "kenya farming badge",
    "soil data iframe",
    "shambaiq widget builder",
  ].join(", "),
  alternates: { canonical: "https://shambaiq.com/embed" },
  openGraph: {
    title: "Free Soil Health Widget Builder — ShambaIQ",
    description: "Embed precision soil health data for all 47 Kenyan counties on your website. Copy-paste iframe code generator.",
    url: "https://shambaiq.com/embed",
    images: [{ url: "https://shambaiq.com/api/og", width: 1200, height: 630, alt: "ShambaIQ Embeddable Soil Widget" }],
  },
  twitter: { card: "summary_large_image", title: "Free Soil Data Widget Builder", description: "Embed county soil health data on any website — simple iframe for all 47 Kenyan counties.", images: ["https://shambaiq.com/api/og"] },
};

export default function EmbedWidgetBuilderPage() {
  const counties = getCountySoils().sort((a, b) => a.county.localeCompare(b.county));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Dynamic interactive part using Client Component */}
      <EmbedBuilderClient counties={counties.map((c) => ({ county: c.county, slug: c.slug }))} />
    </div>
  );
}
