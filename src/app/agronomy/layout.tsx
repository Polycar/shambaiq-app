import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shamba Mshauri — AI Agronomist Chat | ShambaIQ",
  description:
    "Ask Kenya's AI agronomist anything — crop diseases, fertilizer advice, soil problems, pest control. Free precision advice for all 47 counties in English and Kiswahili.",
  robots: { index: true, follow: true },
};

export default function AgronomyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
