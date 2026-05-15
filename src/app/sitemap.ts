import { MetadataRoute } from "next";
import { getCountySoils, getCrops, getZones, getWards, slugify } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shambaiq.com";
  const counties = getCountySoils();
  const crops = getCrops();
  const zones = getZones();
  const wards = getWards();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/soil`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/crops`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/zones`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/dealers`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/yields`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/doctor`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const countyPages: MetadataRoute.Sitemap = counties.map((c) => ({
    url: `${base}/soil/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const cropPages: MetadataRoute.Sitemap = crops.map((c) => ({
    url: `${base}/crops/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const zonePages: MetadataRoute.Sitemap = zones.map((z) => ({
    url: `${base}/zones/${slugify(z)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const dealerPages: MetadataRoute.Sitemap = counties.map((c) => ({
    url: `${base}/dealers/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // County × Crop combos
  const combos: MetadataRoute.Sitemap = counties.flatMap((c) =>
    crops.map((cr) => ({
      url: `${base}/soil/${c.slug}/${cr.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  // Ward pages
  const wardPages: MetadataRoute.Sitemap = wards.map((w) => {
    const countySlug = slugify(counties.find(
      (c) => c.county.toLowerCase() === w.county.toLowerCase()
    )?.county || w.county);
    return {
      url: `${base}/soil/${countySlug}/ward/${slugify(w.ward)}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    };
  });

  return [
    ...staticPages,
    ...countyPages,
    ...cropPages,
    ...zonePages,
    ...dealerPages,
    ...combos,
    ...wardPages,
  ];
}
