// ─────────────────────────────────────────────────────────────────────────────
// ShambaIQ Schema Library — Every JSON-LD type across the site
// Google spec: https://developers.google.com/search/docs/appearance/structured-data
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_URL = "https://shambaiq.com";

// ── Core Reusable Entities ────────────────────────────────────────────────────

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "ShambaIQ",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/shambaiq-logo.png`,
    width: 512,
    height: 512,
  },
  sameAs: ["https://github.com/Polycar", "https://twitter.com/shambaiq_ke"],
  description:
    "Kenya's precision soil intelligence platform. Satellite-powered soil scores and agronomic recommendations for all 47 counties.",
};

export const AUTHOR_PERSON = {
  "@type": "Person",
  "@id": `${BASE_URL}/about#author`,
  name: "Polycarp Andabwa",
  url: `${BASE_URL}/about`,
  jobTitle: "Agricultural Environmental Engineer & Founder, ShambaIQ",
  worksFor: { "@id": `${BASE_URL}/#organization` },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of Debrecen",
      url: "https://www.unideb.hu",
      department: "Faculty of Agricultural and Food Sciences and Environmental Management",
    },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "MSc Agricultural Environmental Engineering",
      credentialCategory: "degree",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: "University of Debrecen, Hungary",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Bachelor of Business Administration",
      credentialCategory: "degree",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "SEO Expert Certification",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Coursera" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "EASA Licensed Drone Pilot",
      credentialCategory: "license",
      recognizedBy: {
        "@type": "Organization",
        name: "European Union Aviation Safety Agency (EASA)",
      },
    },
  ],
  knowsAbout: [
    "Soil Science",
    "GIS and Remote Sensing",
    "Geospatial Analysis",
    "Environmental Impact Assessment",
    "Environmental Monitoring",
    "Precision Agriculture",
    "Hydrology",
    "Drone Surveying",
    "Kenyan Farming Systems",
    "Agricultural Engineering",
    "Search Engine Optimisation",
  ],
  sameAs: [
    "https://github.com/Polycar",
    "https://www.linkedin.com/in/polycarp-a-a7174916b/",
  ],
};

export const WEBSITE_SCHEMA = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "ShambaIQ",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "en-KE",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/soil/{county}` },
    "query-input": "required name=county",
  },
};

// ── Breadcrumbs ───────────────────────────────────────────────────────────────

export interface BreadcrumbItem { name: string; url: string }

export function makeBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── Article / BlogPosting ─────────────────────────────────────────────────────

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  image: string;
  keywords: string[];
  wordCount?: number;
  section?: string;
}

export function makeArticleSchema(p: ArticleSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${p.slug}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${p.slug}` },
    headline: p.headline,
    description: p.description,
    image: {
      "@type": "ImageObject",
      url: p.image.startsWith("http") ? p.image : `${BASE_URL}${p.image}`,
      width: 1200,
      height: 630,
    },
    datePublished: p.datePublished,
    dateModified: p.dateModified,
    author: AUTHOR_PERSON,
    publisher: ORGANIZATION,
    inLanguage: "en-KE",
    keywords: p.keywords.join(", "),
    ...(p.wordCount && { wordCount: p.wordCount }),
    ...(p.section && { articleSection: p.section }),
    isPartOf: {
      "@type": "Blog",
      "@id": `${BASE_URL}/blog#blog`,
      name: "ShambaIQ Farming Blog",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
  };
}

// ── FAQPage ───────────────────────────────────────────────────────────────────

export interface FAQItem { question: string; answer: string }

export function makeFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// ── HowTo ─────────────────────────────────────────────────────────────────────

export interface HowToStep { name: string; text: string; image?: string }

export interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: { currency: string; value: string };
  supply?: string[];
  tool?: string[];
  steps: HowToStep[];
}

export function makeHowToSchema(p: HowToSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: p.name,
    description: p.description,
    ...(p.totalTime && { totalTime: p.totalTime }),
    ...(p.estimatedCost && {
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: p.estimatedCost.currency,
        value: p.estimatedCost.value,
      },
    }),
    ...(p.supply && { supply: p.supply.map((s) => ({ "@type": "HowToSupply", name: s })) }),
    ...(p.tool && { tool: p.tool.map((t) => ({ "@type": "HowToTool", name: t })) }),
    step: p.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image && { image: { "@type": "ImageObject", url: `${BASE_URL}${s.image}` } }),
    })),
  };
}

// ── LocalBusiness (Dealer pages) ──────────────────────────────────────────────

export function makeDealerSchema(name: string, town: string, county: string, phone?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/dealers/${county.toLowerCase().replace(/ /g, "-")}#${name.replace(/\s+/g, "-").toLowerCase()}`,
    name,
    ...(phone && { telephone: phone }),
    address: {
      "@type": "PostalAddress",
      addressLocality: town,
      addressRegion: county,
      addressCountry: "KE",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${county} County, Kenya`,
    },
  };
}

// ── County FAQs (auto-generated from soil data) ───────────────────────────────

export interface CountyFAQProps {
  county: string; pH: number; nitrogen: number;
  phosphorus: number; potassium: number; zone: string;
}

export function makeCountyFAQSchema({ county, pH, nitrogen, phosphorus, zone }: CountyFAQProps) {
  const phClass =
    pH < 5.5 ? "strongly acidic" : pH < 6.5 ? "moderately acidic to neutral" : "neutral to alkaline";
  return makeFAQSchema([
    {
      question: `What is the soil pH in ${county} County?`,
      answer: `${county} County has an average soil pH of ${pH} (${phClass}). ${
        pH < 5.5
          ? "Lime application is strongly recommended before planting most crops to unlock phosphorus availability."
          : "Most crops perform well at this pH without lime treatment."
      }`,
    },
    {
      question: `What crops grow best in ${county} County?`,
      answer: `Based on precision soil mapping data, ${county} soils have nitrogen at ${nitrogen} g/kg and phosphorus at ${phosphorus} mg/kg. Get a full ranked crop suitability list for your specific farm at shambaiq.com/app.`,
    },
    {
      question: `What fertilizer should I use in ${county}?`,
      answer: `Fertilizer choice depends on your target crop and exact soil conditions. Farms in the ${zone} zone typically benefit from DAP or NPK compound at planting, followed by CAN top-dressing. Get a precise budget and bag-per-acre plan at shambaiq.com/app.`,
    },
  ]);
}
