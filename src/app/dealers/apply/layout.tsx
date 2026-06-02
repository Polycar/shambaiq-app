import type { Metadata } from "next";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Register Your Agrovet — Get Listed on ShambaIQ",
  description: "List your agricultural input shop on ShambaIQ for free. Connect with farmers searching for fertilizer, seeds, and pesticides in your county.",
  alternates: { canonical: `${BASE_URL}/dealers/apply` },
  openGraph: {
    title: "Register Your Agrovet on ShambaIQ — Free Listing",
    description: "Free agrovet listing across all 47 Kenyan counties. Connect with data-driven farmers searching for fertilizer, seeds, and crop protection products.",
    url: `${BASE_URL}/dealers/apply`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "Register Your Agrovet on ShambaIQ" }],
  },
  twitter: { card: "summary_large_image", title: "Register Your Agrovet — ShambaIQ", description: "Free agrovet listing. Connect with farmers in your county searching for farm inputs.", images: [`${BASE_URL}/api/og`] },
};

export default function DealerApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
