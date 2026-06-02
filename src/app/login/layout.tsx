import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Log In to ShambaIQ — Free Soil & Farming Advice",
  description: "Log in to access your soil reports, yield history, and personalized fertilizer recommendations for your Kenyan farm.",
  alternates: { canonical: `${BASE_URL}/login` },
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
