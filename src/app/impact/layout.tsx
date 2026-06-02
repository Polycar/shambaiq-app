import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Our Impact — Sustainable Development Goals | ShambaIQ",
  description:
    "ShambaIQ contributes to 5 UN SDGs: No Poverty, Zero Hunger, Gender Equality, Climate Action, and Life on Land. Free precision agriculture for all 47 Kenyan counties.",
  alternates: { canonical: `${BASE_URL}/impact` },
  openGraph: {
    title: "ShambaIQ Impact — Sustainable Development Goals",
    description: "How free precision soil intelligence contributes to 5 UN SDGs across Kenya's 47 counties.",
    url: `${BASE_URL}/impact`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "ShambaIQ SDG Impact" }],
  },
  twitter: { card: "summary_large_image", title: "ShambaIQ Impact — SDGs", description: "Free precision agriculture contributing to Zero Hunger, No Poverty, Climate Action and 2 more UN SDGs in Kenya.", images: [`${BASE_URL}/api/og`] },
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
