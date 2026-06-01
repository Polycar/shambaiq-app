import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Your Agrovet",
  description: "List your agricultural input shop on ShambaIQ. Connect with farmers in your area. Free listing, reviewed within 1-3 business days.",
  alternates: { canonical: "https://shambaiq.com/dealers/apply" },
};

export default function DealerApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
