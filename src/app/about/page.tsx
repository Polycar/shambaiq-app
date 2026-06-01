import { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AUTHOR_PERSON, ORGANIZATION, BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Polycarp Andabwa — Agricultural Environmental Engineer & Founder | ShambaIQ",
  description:
    "Polycarp Andabwa holds an MSc in Agricultural Environmental Engineering (University of Debrecen), BBA, Coursera SEO certification, and an EASA Drone Pilot licence. Founder of ShambaIQ.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    type: "profile",
    url: `${BASE_URL}/about`,
    title: "About Polycarp Andabwa — Founder, ShambaIQ",
    description:
      "Agricultural Environmental Engineer, GIS & Remote Sensing specialist, EASA Licensed Drone Pilot, and founder of ShambaIQ — Kenya's precision soil intelligence platform.",
    images: [
      {
        url: `${BASE_URL}/images/polycarp-andabwa-shambaiq.jpg`,
        width: 800,
        height: 800,
        alt: "Polycarp Andabwa, founder of ShambaIQ",
      },
    ],
    siteName: "ShambaIQ",
  },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  ...AUTHOR_PERSON,
  description:
    "Agricultural Environmental Engineer and founder of ShambaIQ — Kenya's precision soil intelligence platform. MSc from the University of Debrecen, Hungary. Specialises in geospatial soil analysis, GIS and remote sensing, environmental impact assessment, precision agriculture, and drone surveying. EASA Licensed Drone Pilot. Coursera SEO Expert Certified.",
  image: `${BASE_URL}/images/polycarp-andabwa-shambaiq.jpg`,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "About", item: `${BASE_URL}/about` },
  ],
};

const CREDENTIALS = [
  {
    label: "MSc Agricultural Environmental Engineering",
    org: "University of Debrecen, Hungary",
    year: "2026",
    type: "degree",
  },
  {
    label: "Bachelor of Business Administration",
    org: "Accounting · Finance · HR Management · Marketing",
    year: "—",
    type: "degree",
  },
  {
    label: "SEO Expert Certification",
    org: "Coursera",
    year: "2025–26",
    type: "certificate",
  },
  {
    label: "EASA Licensed Drone Pilot",
    org: "European Union Aviation Safety Agency",
    year: "Active",
    type: "license",
  },
];

const SKILLS = [
  {
    area: "Soil Science",
    detail:
      "MSc thesis on spatial distribution of soil contamination across 493 samples, seven parameters, using IDW, Kriging, and Sequential Gaussian Simulation. Deep understanding of soil chemistry, nutrient cycling, and agronomic interpretation.",
  },
  {
    area: "GIS and Remote Sensing",
    detail:
      "Geospatial analysis of soil and environmental data at county and farm scale. Proficient in spatial interpolation, raster analysis, and satellite-derived land use interpretation across Kenyan agroecological zones.",
  },
  {
    area: "Environmental Impact Assessment",
    detail:
      "Trained in EIA frameworks, baseline data collection, stakeholder engagement, and mitigation planning. Familiar with Kenya NEMA regulatory standards and EU environmental assessment directives.",
  },
  {
    area: "Environmental Monitoring",
    detail:
      "Field and laboratory monitoring of soil, water, and atmospheric parameters. Experience with heavy metal analysis, soil nutrient profiling, and environmental quality reporting.",
  },
  {
    area: "Precision Agriculture",
    detail:
      "Built ShambaIQ — a precision soil intelligence platform providing science-based soil quality scores and crop-specific fertilizer recommendations for all 47 Kenyan counties using high-resolution satellite soil data.",
  },
  {
    area: "Hydrology",
    detail:
      "Understanding of watershed dynamics, soil water retention, and drainage design relevant to dryland and irrigated farming systems across Kenya's diverse agroecological zones.",
  },
  {
    area: "EASA Licensed Drone Pilot",
    detail:
      "Licenced to operate UAVs for aerial surveying, crop scouting, and environmental monitoring under EASA regulations. Enables field-level data collection beyond what satellite resolution provides.",
  },
  {
    area: "Search Engine Optimisation",
    detail:
      "Coursera SEO Expert Certified. Designed the full ShambaIQ SEO architecture: 1,380+ auto-generated pages, complete structured data stack (BreadcrumbList, Article, FAQPage, HowTo, HowTo, Person, Organization), Kiswahili content strategy, and a zero-budget backlink outreach plan.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd schemas={[personSchema, ORGANIZATION, breadcrumbSchema]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", url: BASE_URL },
            { name: "About", url: `${BASE_URL}/about` },
          ]}
        />

        <div className="mt-8">
          {/* ── Hero ── */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-forest-700 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              PA
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-forest-900 mb-1">
                Polycarp Andabwa
              </h1>
              <p className="text-gold-700 font-semibold mb-3">
                Agricultural Environmental Engineer · EASA Drone Pilot · Founder, ShambaIQ
              </p>
              <p className="text-soil-600 leading-relaxed max-w-2xl">
                I built ShambaIQ because precision soil data existed at farm-level resolution
                across all of Kenya — but no tool made it usable for a farmer on a basic
                smartphone or an extension officer in the field without a lab. ShambaIQ closes
                that gap: science-based soil scores, crop-specific fertilizer plans, and
                agronomic advice grounded in real spatial data for all 47 counties.
              </p>
            </div>
          </div>

          {/* ── Credentials ── */}
          <section className="mb-10">
            <h2 className="text-xl font-display font-bold text-forest-800 mb-5">
              Credentials & Qualifications
            </h2>
            <div className="space-y-3">
              {CREDENTIALS.map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-4 bg-cream-50 border border-cream-300 rounded-xl p-4"
                >
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5 ${
                      c.type === "degree"
                        ? "bg-forest-100 text-forest-700"
                        : c.type === "license"
                        ? "bg-gold-100 text-gold-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {c.type === "degree"
                      ? "Degree"
                      : c.type === "license"
                      ? "Licence"
                      : "Certificate"}
                  </span>
                  <div>
                    <p className="font-semibold text-forest-800 text-sm">{c.label}</p>
                    <p className="text-xs text-soil-500 mt-0.5">
                      {c.org} · {c.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Skills ── */}
          <section className="mb-10">
            <h2 className="text-xl font-display font-bold text-forest-800 mb-5">
              Areas of Expertise
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {SKILLS.map((s) => (
                <div
                  key={s.area}
                  className="bg-white border border-cream-300 rounded-xl p-5"
                >
                  <h3 className="font-semibold text-forest-700 mb-2 text-sm">{s.area}</h3>
                  <p className="text-xs text-soil-500 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── About ShambaIQ ── */}
          <section className="mb-10">
            <h2 className="text-xl font-display font-bold text-forest-800 mb-4">
              About ShambaIQ
            </h2>
            <p className="text-soil-600 leading-relaxed mb-4">
              ShambaIQ is a precision soil intelligence platform covering all 47 Kenyan counties.
              It provides science-based Soil Quality Index scores, crop-specific fertilizer
              recommendations with bag-per-acre budgets, and agronomic guidance in both English
              and Kiswahili — built on high-resolution satellite soil prediction models and
              validated against field data.
            </p>
            <p className="text-soil-600 leading-relaxed mb-5">
              The blog applies the same rigour to content: every article is grounded in real
              soil nutrient values for the county being discussed, certified variety data, and
              agronomic advice specific to Kenyan farming systems — not generic content recycled
              across African markets.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/app"
                className="bg-forest-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors"
              >
                Try ShambaIQ Tool
              </Link>
              <Link
                href="/blog"
                className="border border-forest-300 text-forest-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-50 transition-colors"
              >
                Read the Blog
              </Link>
              <Link
                href="https://github.com/Polycat"
                className="border border-cream-300 text-soil-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-cream-50 transition-colors"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
