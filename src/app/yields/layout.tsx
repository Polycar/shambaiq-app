import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Yield Tracker — Log & Track Your Harvest",
  description: "Track your farm harvest season by season. Log yields for 25 crops and see how precision farming improves your output.",
  robots: { index: false, follow: true },
};
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
