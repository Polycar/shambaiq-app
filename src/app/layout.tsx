import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import PWAInstaller from "@/components/PWAInstaller";
import Script from "next/script";
import { cookies } from "next/headers";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shambaiq.com"),
  title: { default: "ShambaIQ — Precision Agriculture for Every Kenyan Farmer", template: "%s | ShambaIQ" },
  description: "Satellite-powered soil intelligence for Kenya's smallholder farmers. Science-based fertilizer plans, soil health scores, and crop recommendations for all 47 counties.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    apple: "/icon-192.png"
  },
  manifest: "/manifest.json",
  openGraph: { type: "website", locale: "en_KE", siteName: "ShambaIQ", images: ["/api/og"] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: { google: "hDkSRs8CVliEOaxCe1Odg6JKByTt7natiI-1DM4GHWo" },
  alternates: { canonical: "https://www.shambaiq.com" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("shambaiq_session");
  let isLoggedIn = false;
  let userName = "";

  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie.value));
      isLoggedIn = true;
      userName = session.name || "Farmer";
    } catch {
      // Ignored
    }
  }

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <meta name="theme-color" content="#15803d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ShambaIQ" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Preconnect to origins needed early so the browser opens sockets in parallel */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://api.shambaiq.com" />
        <link rel="dns-prefetch" href="https://api.shambaiq.com" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header isLoggedIn={isLoggedIn} userName={userName} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <WhatsAppWidget />
        <PWAInstaller />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7X2WCN7KJ7" strategy="lazyOnload" />
        <Script id="ga-init" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-7X2WCN7KJ7');`}</Script>
      </body>
    </html>
  );
}
