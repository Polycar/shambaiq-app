import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Shamba Mshauri — Free AI Agronomist for Kenyan Farmers",
  description: "Ask Kenya's AI agronomist about crop diseases, fertilizer doses, soil problems, and pest control — free, in English or Kiswahili, for all 47 counties.",
  alternates: { canonical: `${BASE_URL}/agronomy` },
  openGraph: {
    title: "Shamba Mshauri — Free AI Agronomist for Kenyan Farmers",
    description: "Ask any farming question in English or Kiswahili. Instant expert advice on soil health, fertilizer, pests, and crop management for all 47 counties.",
    url: `${BASE_URL}/agronomy`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "Shamba Mshauri AI Agronomist" }],
  },
  twitter: { card: "summary_large_image", title: "Shamba Mshauri — Free AI Agronomist for Kenyan Farmers", description: "Ask any farming question in English or Kiswahili. Free expert advice for Kenyan smallholder farmers.", images: [`${BASE_URL}/api/og`] },
  robots: { index: true, follow: true },
};

export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }

