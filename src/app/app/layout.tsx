import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { absolute: "Get Soil & Fertilizer Advice — ShambaIQ" },
  description: "Free precision fertilizer and soil advice for Kenyan farmers. Powered by iSDAsoil satellite data.",
  robots: { index: false, follow: true },
};
export default function L({ children }: { children: React.ReactNode }) { return <>{children}</>; }
