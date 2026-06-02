import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Plant Doctor — AI Crop Disease & Pest Diagnosis",
  description: "Upload a photo of a sick crop leaf for instant AI-powered diagnosis. Pest identification, disease treatment steps, and product recommendations for Kenyan farms.",
  alternates: { canonical: `${BASE_URL}/doctor` },
  openGraph: {
    title: "Plant Doctor — AI Crop Disease Diagnosis",
    description: "Snap a photo of a sick leaf. Get instant AI diagnosis with treatment steps and product recommendations tailored for Kenya.",
    url: `${BASE_URL}/doctor`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "ShambaIQ Plant Doctor AI Diagnosis" }],
  },
  twitter: { card: "summary_large_image", title: "Plant Doctor — ShambaIQ", description: "AI-powered crop disease and pest diagnosis. Photo upload, instant diagnosis, treatment advice.", images: [`${BASE_URL}/api/og`] },
  robots: { index: false, follow: true },
};
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
