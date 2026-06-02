import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Partner with ShambaIQ — API, White-Label & Agrovet Placements",
  description:
    "Integrate Kenya's soil intelligence into your platform. API access, white-label solutions, and agrovet dealer placements for agribusiness and NGO partners.",
  alternates: { canonical: `${BASE_URL}/partners` },
  openGraph: {
    title: "Partner with ShambaIQ — B2B Agricultural Intelligence",
    description: "API access, white-label soil data, and agrovet placement opportunities with Kenya's precision soil intelligence platform.",
    url: `${BASE_URL}/partners`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "Partner with ShambaIQ" }],
  },
  twitter: { card: "summary_large_image", title: "Partner with ShambaIQ", description: "API, white-label, and agrovet placements for agribusiness partners across Kenya.", images: [`${BASE_URL}/api/og`] },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
