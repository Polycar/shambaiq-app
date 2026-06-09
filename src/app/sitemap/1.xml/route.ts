import { ALL_COUNTIES } from "@/lib/site-data";
import { getWards, slugify } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 86400; // Cache for 24 hours

const BASE = "https://shambaiq.com";

interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

function toXML(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ""}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ""}
    ${entry.priority !== undefined ? `<priority>${entry.priority.toFixed(2)}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET() {
  const dataUpdated = "2026-06-01T00:00:00.000Z";
  const wards = getWards();

  const entries: SitemapEntry[] = wards.map((w) => {
    const county = ALL_COUNTIES.find(
      (c) => c.name.toLowerCase() === w.county.toLowerCase()
    );
    const countySlug = county ? county.slug : slugify(w.county);
    return {
      url: `${BASE}/soil/${countySlug}/ward/${w.slug}`,
      lastModified: dataUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
  });

  const xml = toXML(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
