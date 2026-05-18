import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Plant Doctor — AI Pest & Disease Diagnosis",
  description: "Upload a photo of a sick crop leaf for instant AI-powered diagnosis. Pest identification and treatment advice for Kenyan farms.",
  robots: { index: false, follow: true },
};
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
