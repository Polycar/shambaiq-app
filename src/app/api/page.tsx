import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { BASE_URL, ORGANIZATION } from "@/lib/schema";
import { ArrowRight, Code, Cpu, Database, Globe, Key, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Soil & Crop API for Kenya — ShambaIQ Developer Portal",
  description:
    "Integrate hyper-local soil health mapping (pH, N, P, K) and crop suitability models into your agricultural apps, SMS services, or research. Free API access.",
  keywords: [
    "soil api",
    "kenya agricultural api",
    "soil data api",
    "crop suitability api",
    "shambaiq developer",
    "farming data endpoint",
  ].join(", "),
  alternates: { canonical: `${BASE_URL}/api` },
  openGraph: {
    title: "ShambaIQ Open Soil & Crop API — Free for Developers",
    description: "Free REST API for Kenya soil health data. pH, N, P, K, and crop suitability for all 47 counties. No authentication required.",
    url: `${BASE_URL}/api`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "ShambaIQ Developer API Documentation" }],
  },
  twitter: { card: "summary_large_image", title: "ShambaIQ Free Soil & Crop API", description: "Free REST API for Kenya soil data and crop suitability. No auth, no rate limits. Build for smallholder farmers.", images: [`${BASE_URL}/api/og`] },
  robots: { index: true, follow: true },
};

export default function ApiDocsPage() {
  const apiSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "ShambaIQ Open Soil & Crop API Documentation",
    description: "Free REST API for hyper-local Kenya soil health data (pH, N, P, K) and crop suitability scoring across all 47 counties.",
    url: `${BASE_URL}/api`,
    inLanguage: "en-KE",
    about: { "@type": "Thing", name: "Agricultural Data API", description: "REST API for Kenya soil and crop data" },
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is the ShambaIQ API free to use?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. The ShambaIQ API is completely free with no API key required. There are no rate limits for public use, allowing you to start building immediately." },
      },
      {
        "@type": "Question",
        name: "What data does the ShambaIQ soil API return?",
        acceptedAnswer: { "@type": "Answer", text: "The /county/{county_slug}/soil endpoint returns pH, Total Nitrogen (g/kg), Extractable Phosphorus (mg/kg), Extractable Potassium (mg/kg), and Organic Carbon (g/kg) for any of Kenya's 47 counties, derived from 30m-resolution satellite data." },
      },
      {
        "@type": "Question",
        name: "How do I get fertilizer recommendations from the API?",
        acceptedAnswer: { "@type": "Answer", text: "POST to /recommend with a JSON body containing county, crop, current_fertilizer, farm_size_acres, lang, and price_mode. The API returns tailored basal and top-dressing bag quantities, a budget breakdown, and a soil health score." },
      },
      {
        "@type": "Question",
        name: "Which crops does the ShambaIQ crop suitability API support?",
        acceptedAnswer: { "@type": "Answer", text: "The API calculates suitability indices for over 25 major Kenyan crops including Maize, Beans, Tea, Coffee, Wheat, Potatoes, Sugarcane, Sorghum, and more, based on regional soil chemistry models." },
      },
    ],
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Developer API", item: `${BASE_URL}/api` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <JsonLd schemas={[apiSchema, faqSchema, breadcrumbSchema, ORGANIZATION]} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Developer API" },
        ]}
      />

      {/* Hero Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 font-semibold text-xs uppercase tracking-wider mb-4">
          <Cpu size={12} />
          Open agricultural data
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-forest-700 mb-4 leading-tight">
          ShambaIQ Open Soil & Crop API
        </h1>
        <p className="text-soil-500 max-w-3xl text-lg leading-relaxed">
          Unlock 30m precision satellite-derived soil data and dynamic fertilizer recommendations.
          We provide a public, free REST API for developers, researchers, and agronomists to build
          sustainable tech solutions for Kenyan farmers.
        </p>
      </div>

      {/* Grid of Key Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-700/5 flex items-center justify-center mb-4">
            <Globe className="text-forest-600" size={20} />
          </div>
          <h2 className="font-display text-lg font-bold text-forest-700 mb-2">Hyper-local soil metrics</h2>
          <p className="text-sm text-soil-500 leading-relaxed">
            Get instant pH, Total Nitrogen, Extractable Phosphorus, Potassium, and Organic Carbon values for all 47 counties.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-700/5 flex items-center justify-center mb-4">
            <Terminal className="text-forest-600" size={20} />
          </div>
          <h2 className="font-display text-lg font-bold text-forest-700 mb-2">Crop suitability scoring</h2>
          <p className="text-sm text-soil-500 leading-relaxed">
            Calculate suitability indices for 25 major crops based on regional soil chemistry models and pH tolerances.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-forest-700/5 flex items-center justify-center mb-4">
            <Key className="text-forest-600" size={20} />
          </div>
          <h2 className="font-display text-lg font-bold text-forest-700 mb-2">No API key required</h2>
          <p className="text-sm text-soil-500 leading-relaxed">
            Free tier requires no complex onboarding. Start building immediately with zero rate-limit friction for public use.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Endpoint Documentation */}
        <div className="lg:col-span-2 space-y-12">
          {/* Base URL */}
          <section className="bg-forest-900 text-cream-100 rounded-2xl p-6 border border-forest-800">
            <h2 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Database size={18} className="text-gold-400" />
              API base endpoint URL
            </h2>
            <code className="block bg-forest-950 px-4 py-2.5 rounded-lg text-gold-300 font-mono text-sm break-all">
              https://api.shambaiq.com/api/v1
            </code>
            <p className="text-xs text-cream-400 mt-2">
              All requests must use HTTPS and return standard JSON payloads.
            </p>
          </section>

          {/* Endpoint 1 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-700 text-xs font-extrabold px-2.5 py-1 rounded">GET</span>
              <h3 className="font-mono text-base font-bold text-forest-700 break-all">/county/{"{county_slug}"}/soil</h3>
            </div>
            <h2 className="font-display text-xl font-bold text-forest-700 mb-3">Retrieve county soil profile</h2>
            <p className="text-soil-500 text-sm mb-6 leading-relaxed">
              Returns the aggregated 30m resolution satellite soil metrics for a given county. Replace{" "}
              <code className="bg-cream-100 text-forest-700 px-1 py-0.5 rounded font-mono text-xs">{"{county_slug}"}</code>{" "}
              with the lowercase county slug (e.g. <code className="bg-cream-100 text-forest-700 px-1 py-0.5 rounded font-mono text-xs">kakamega</code>).
            </p>

            <h3 className="text-xs uppercase tracking-wider text-soil-500 font-semibold mb-2">Request headers</h3>
            <pre className="bg-cream-50 border border-cream-200 rounded-lg p-3 text-xs font-mono text-forest-700 mb-6">
              {"Content-Type: application/json"}
            </pre>

            <h3 className="text-xs uppercase tracking-wider text-soil-500 font-semibold mb-2">JSON response body</h3>
            <pre className="bg-forest-950 text-gold-300 rounded-lg p-4 font-mono text-xs overflow-x-auto leading-relaxed">
{`{
  "status": "success",
  "county": "Kakamega",
  "soil_metrics": {
    "pH": 5.63,
    "nitrogen_g_kg": 1.01,
    "phosphorus_mg_kg": 14.0,
    "potassium_mg_kg": 147.0,
    "organic_carbon_g_kg": 21.5
  },
  "agroecological_zone": "Western"
}`}
            </pre>
          </section>

          {/* Endpoint 2 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-cream-300 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-2.5 py-1 rounded">POST</span>
              <h3 className="font-mono text-base font-bold text-forest-700 break-all">/recommend</h3>
            </div>
            <h2 className="font-display text-xl font-bold text-forest-700 mb-3">Generate fertilizer recommendation</h2>
            <p className="text-soil-500 text-sm mb-6 leading-relaxed">
              Provides precision fertilizer requirements (basal, top-dressing bag quantities) and soil health assessments tailored dynamically to the crop and soil parameters.
            </p>

            <h3 className="text-xs uppercase tracking-wider text-soil-500 font-semibold mb-2">JSON request body</h3>
            <pre className="bg-forest-950 text-gold-300 rounded-lg p-4 font-mono text-xs overflow-x-auto leading-relaxed mb-6">
{`{
  "county": "Kakamega",
  "crop": "Maize",
  "current_fertilizer": "DAP",
  "farm_size_acres": 1.0,
  "lang": "English",
  "price_mode": "Subsidized"
}`}
            </pre>

            <h3 className="text-xs uppercase tracking-wider text-soil-500 font-semibold mb-2">JSON response body</h3>
            <pre className="bg-forest-950 text-gold-300 rounded-lg p-4 font-mono text-xs overflow-x-auto leading-relaxed">
{`{
  "county_data": {
    "County": "Kakamega",
    "pH": 5.63,
    "Total Nitrogen (g/kg)": 1.01,
    "Extractable Phosphorus (mg/kg)": 14.0,
    "Extractable Potassium (mg/kg)": 147.0
  },
  "crop": "Maize",
  "advice": [
    "pH is Healthy (5.6).",
    "Recommended: 0.5 to 0.9 bags of NPK 17:17:17.",
    "Top-dress: Urea at Week 4-6."
  ],
  "budget": {
    "breakdown": [
      "Stage 1 (Basal): 0.71 x bags NPK 17:17:17",
      "Stage 2 (Top Dress): 1.00 x bags Urea"
    ],
    "total_budget": 4264
  },
  "health_score": 79
}`}
            </pre>
          </section>
        </div>

        {/* Right Column - Code Snippets Selector */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-sm sticky top-24">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4 flex items-center gap-2">
              <Code size={18} className="text-gold-500" />
              Quick integration code
            </h2>

            <div className="space-y-6">
              {/* cURL */}
              <div>
                <span className="text-xs font-bold text-forest-600 block mb-1">cURL / Shell</span>
                <pre className="bg-forest-950 text-gold-300 rounded-lg p-3 font-mono text-xs overflow-x-auto leading-relaxed">
{`curl -X GET \\
  https://api.shambaiq.com/api/v1/county/kakamega/soil \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>

              {/* JS Fetch */}
              <div>
                <span className="text-xs font-bold text-forest-600 block mb-1">JavaScript / Fetch</span>
                <pre className="bg-forest-950 text-gold-300 rounded-lg p-3 font-mono text-xs overflow-x-auto leading-relaxed">
{`fetch('https://api.shambaiq.com/api/v1/county/kakamega/soil')
  .then(res => res.json())
  .then(data => console.log(data));`}
                </pre>
              </div>

              {/* Python requests */}
              <div>
                <span className="text-xs font-bold text-forest-600 block mb-1">Python / Requests</span>
                <pre className="bg-forest-950 text-gold-300 rounded-lg p-3 font-mono text-xs overflow-x-auto leading-relaxed">
{`import requests

url = "https://api.shambaiq.com/api/v1/county/kakamega/soil"
response = requests.get(url)
print(response.json())`}
                </pre>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-cream-200">
              <h3 className="font-display font-bold text-forest-700 text-sm mb-2">Want to browse reports manually?</h3>
              <p className="text-xs text-soil-500 mb-4">
                Explore individual county pages to see aggregated details compiled on top of our dataset.
              </p>
              <Link
                href="/soil"
                className="inline-flex items-center gap-1 text-sm font-bold text-gold-700 hover:text-gold-500 transition-colors"
              >
                Browse soil reports <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
