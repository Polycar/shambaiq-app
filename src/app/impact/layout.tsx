import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Our Impact — Sustainable Development Goals",
  description:
    "ShambaIQ contributes to 5 UN Sustainable Development Goals: No Poverty, Zero Hunger, Gender Equality, Climate Action, and Life on Land. Free precision agriculture for 47 Kenyan counties.",
  alternates: { canonical: `${BASE_URL}/impact` },
  openGraph: {
    title: "ShambaIQ Impact — Sustainable Development Goals",
    images: ["/api/og"],
  },
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
