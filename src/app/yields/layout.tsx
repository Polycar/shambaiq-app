import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Yield Tracker — Log & Track Your Harvest Season by Season",
  description: "Track your farm harvest season by season. Log yields for over 40 crops and watch how precision farming improves your output over time.",
  alternates: { canonical: `${BASE_URL}/yields` },
  openGraph: {
    title: "Yield Tracker — Season-by-Season Harvest Logging",
    description: "Log crop yields by season and county. See how data-driven fertilizer plans improve your farm's output over time.",
    url: `${BASE_URL}/yields`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "ShambaIQ Yield Tracker" }],
  },
  twitter: { card: "summary_large_image", title: "Yield Tracker — ShambaIQ", description: "Log and track harvest yields season by season for over 40 crops.", images: [`${BASE_URL}/api/og`] },
  robots: { index: false, follow: true },
};
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
