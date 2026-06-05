import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { absolute: "Get Soil & Fertilizer Advice — ShambaIQ" },
  description: "Free precision fertilizer and soil advice for Kenyan farmers. Powered by 30m satellite soil data.",
  robots: { index: false, follow: true },
};
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
