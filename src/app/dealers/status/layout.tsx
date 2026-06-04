import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check application status",
  description: "Check the status of your agrovet listing application on ShambaIQ.",
  robots: { index: false, follow: false },
};

export default function DealerStatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
