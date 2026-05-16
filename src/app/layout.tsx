import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shambaiq.com"),
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
  alternates: {
    languages: {
      "en": "https://www.shambaiq.com",
      "sw": "https://www.shambaiq.com/sw",
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
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
