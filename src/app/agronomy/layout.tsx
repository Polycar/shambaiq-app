import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Shamba Mshauri — AI Agronomist Chat | ShambaIQ",
  description: "Ask Kenya's AI agronomist about crop diseases, fertilizer doses, soil problems, and pest control. Free bilingual advice for all 47 counties.",
  alternates: { canonical: `${BASE_URL}/agronomy` },
  openGraph: {
    title: "Shamba Mshauri — Kenya's AI Agronomist",
    description: "Ask any farming question in English or Swahili. Get instant expert advice on soil health, fertilizer, pests, and crop management.",
    url: `${BASE_URL}/agronomy`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "Shamba Mshauri AI Agronomist" }],
  },
  twitter: { card: "summary_large_image", title: "Shamba Mshauri — Kenya's AI Agronomist", description: "Ask any farming question in English or Swahili. Instant expert advice for Kenyan smallholder farmers.", images: [`${BASE_URL}/api/og`] },
  robots: { index: false, follow: true },
};

export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }

