import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shambaiq.com"),
  title: {
    default: "ShambaIQ — Precision Agriculture for Every Kenyan Farmer",
    template: "%s | ShambaIQ",
  },
  description:
    "Free soil analysis and fertilizer recommendations for all 47 Kenyan counties, 25 crops. Powered by iSDAsoil satellite data.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "ShambaIQ",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_CODE",
  },
  alternates: {
    languages: {
      "en": "https://shambaiq.com",
      "sw": "https://shambaiq.com/sw",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
