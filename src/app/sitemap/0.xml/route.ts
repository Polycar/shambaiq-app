import { ALL_POSTS } from "@/lib/blog-data";
import { ALL_COUNTIES, ALL_CROPS, ALL_ZONES } from "@/lib/site-data";

export const revalidate = 86400; // ISR: re-generate every 24 hours

const BASE = "https://shambaiq.com";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

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
  const now = new Date().toISOString();
  const dataUpdated = "2026-06-01T00:00:00.000Z";

  // Pages that genuinely change on every deploy (live data, blog, dealer stock)
  const livePages: SitemapEntry[] = [
    { url: BASE,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/app`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/dealers`,     lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/yields`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  // Pages whose content is driven by static datasets — stable until data changes
  const stablePages: SitemapEntry[] = [
    { url: `${BASE}/soil`,         lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/crops`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/zones`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/map`,          lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/soil-test`,    lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/intercrop`,    lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/crop-finder`,  lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/seeds`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/features`,     lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/api`,          lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/embed`,        lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/doctor`,       lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/agronomy`,     lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/soil/compare`, lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/impact`,       lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/partners`,     lastModified: dataUpdated, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Truly static pages — bump the date manually when the copy changes
  const staticCopyPages: SitemapEntry[] = [
    { url: `${BASE}/about`,          lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/contact`,        lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.6 },
    { url: `${BASE}/dealers/apply`,  lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/dealers/status`, lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/login`,          lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/privacy`,        lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,          lastModified: "2026-05-01T00:00:00.000Z", changeFrequency: "yearly",  priority: 0.3 },
  ];

  const safeDate = (dateStr: string | null | undefined, fallback: string): string => {
    if (!dateStr) return fallback;
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? fallback : d.toISOString();
    } catch {
      return fallback;
    }
  };

  let dynamicPosts: any[] = [];
  try {
    const res = await fetch(`${API}/api/v1/blog`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      dynamicPosts = data.posts || [];
    }
  } catch {
    // omit dynamic posts if API is unreachable
  }

  const blogPages: SitemapEntry[] = [
    ...ALL_POSTS.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: safeDate(post.dateModified, now),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...dynamicPosts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: safeDate(post.published_at, now),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];

  const zonePages: SitemapEntry[] = ALL_ZONES.map((zone) => ({
    url: `${BASE}/zones/${zone.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const countyPages: SitemapEntry[] = ALL_COUNTIES.map((c) => ({
    url: `${BASE}/soil/${c.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const dealerPages: SitemapEntry[] = ALL_COUNTIES.map((c) => ({
    url: `${BASE}/dealers/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const cropPages: SitemapEntry[] = ALL_CROPS.map((c) => ({
    url: `${BASE}/crops/${c.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Per-crop county comparison pages
  const comparePages: SitemapEntry[] = ALL_CROPS.map((c) => ({
    url: `${BASE}/soil/compare/${c.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const allEntries = [
    ...livePages,
    ...stablePages,
    ...staticCopyPages,
    ...blogPages,
    ...zonePages,
    ...countyPages,
    ...cropPages,
    ...dealerPages,
    ...comparePages,
  ];

  const xml = toXML(allEntries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
