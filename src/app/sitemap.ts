import type { MetadataRoute } from "next";
import { ALL_POSTS } from "@/lib/blog-data";
import { ALL_COUNTIES, ALL_CROPS, ALL_ZONES } from "@/lib/site-data";
import { getWards, slugify } from "@/lib/data";

const BASE = "https://shambaiq.com";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

// ── Two sitemap shards ──────────────────────────────────────────────────────
// 0 → static pages, blog, zones, counties, crops, dealers, compare
// 1 → all ward-level pages (~1 450 URLs)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }];
}

export default async function sitemap(
  props: { id: Promise<string> }
): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;

  if (String(id) === "1") {
    return buildWardSitemap();
  }
  return buildMainSitemap();
}

// ── Shard 0: main pages ─────────────────────────────────────────────────────

async function buildMainSitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const dataUpdated = "2026-06-01T00:00:00.000Z";
  const staticCopyDate = "2026-05-01T00:00:00.000Z";

  // Pages that genuinely change on every deploy (live data, blog, dealer stock)
  const livePages: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/app`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/dealers`,     lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/yields`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  // Pages whose content is driven by static datasets
  const stablePages: MetadataRoute.Sitemap = [
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
  const staticCopyPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/about`,          lastModified: staticCopyDate, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/contact`,        lastModified: staticCopyDate, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${BASE}/dealers/apply`,  lastModified: staticCopyDate, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/dealers/status`, lastModified: staticCopyDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/login`,          lastModified: staticCopyDate, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/privacy`,        lastModified: staticCopyDate, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,          lastModified: staticCopyDate, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ── Blog posts (static + dynamic from API) ──
  const safeDate = (dateStr: string | null | undefined, fallback: string): string => {
    if (!dateStr) return fallback;
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? fallback : d.toISOString();
    } catch {
      return fallback;
    }
  };

  let dynamicPosts: { slug: string; published_at?: string }[] = [];
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

  const blogPages: MetadataRoute.Sitemap = [
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

  // ── Data-driven pages ──
  const zonePages: MetadataRoute.Sitemap = ALL_ZONES.map((zone) => ({
    url: `${BASE}/zones/${zone.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const countyPages: MetadataRoute.Sitemap = ALL_COUNTIES.map((c) => ({
    url: `${BASE}/soil/${c.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const dealerPages: MetadataRoute.Sitemap = ALL_COUNTIES.map((c) => ({
    url: `${BASE}/dealers/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const cropPages: MetadataRoute.Sitemap = ALL_CROPS.map((c) => ({
    url: `${BASE}/crops/${c.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const comparePages: MetadataRoute.Sitemap = ALL_CROPS.map((c) => ({
    url: `${BASE}/soil/compare/${c.slug}`,
    lastModified: dataUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
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
}

// ── Shard 1: ward pages ─────────────────────────────────────────────────────

function buildWardSitemap(): MetadataRoute.Sitemap {
  const dataUpdated = "2026-06-01T00:00:00.000Z";
  const wards = getWards();

  return wards.map((w) => {
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
}
