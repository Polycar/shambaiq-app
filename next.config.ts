import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.shambaiq.com" }],
  },
  async redirects() {
    return [
      { source: "/sw/udongo/:county", destination: "/soil/:county", permanent: true },
      { source: "/sw/mazao/:crop", destination: "/crops/:crop", permanent: true },
      {
        source: "/blog/how-to-improve-maize-yield-in-kenya-through-soil-testing",
        destination: "/blog/complete-maize-farming-guide-kenya",
        permanent: true,
      },
      // ── Duplicate slug redirects (cleaned 2026-05-30) ─────────────────
      { source: "/blog/bean-farming-kakamega", destination: "/blog/bean-farming-kakamega-double-harvest", permanent: true },
      { source: "/blog/cabbage-farming-kiambu", destination: "/blog/cabbage-farming-kiambu-highland-soils", permanent: true },
      { source: "/blog/dairy-farming-nandi", destination: "/blog/dairy-fodder-farming-nandi-county", permanent: true },
      { source: "/blog/dap-vs-can-vs-npk-fertilizer-guide", destination: "/blog/dap-vs-can-vs-npk-fertilizer-guide-kenya", permanent: true },
      { source: "/blog/how-much-fertilizer-per-acre-calculator", destination: "/blog/how-much-fertilizer-per-acre-kenya-calculator", permanent: true },
      { source: "/blog/kakamega-soil-mavuno-not-dap", destination: "/blog/kakamega-soil-western-kenya-mavuno", permanent: true },
      { source: "/blog/kenya-soil-health-rankings-2026", destination: "/blog/kenya-county-soil-rankings-2026", permanent: true },
      { source: "/blog/meru-nyeri-potato-farming-guide", destination: "/blog/acidic-soil-treatment-meru-nyeri", permanent: true },
      { source: "/blog/onion-farming-kajiado", destination: "/blog/onion-farming-kajiado-dryland-guide", permanent: true },
      { source: "/blog/organic-soil-enrichment-kenya-soil-carbon", destination: "/blog/organic-soil-restoration-machakos", permanent: true },
      { source: "/blog/tomato-farming-guide-kiambu-kirinyaga", destination: "/blog/tomato-farming-kirinyaga-mwea-soils", permanent: true },
      { source: "/blog/why-soil-is-acidic-kenya", destination: "/blog/why-your-soil-is-acidic-kenya", permanent: true },
      { source: "/blog/sweet-potato-farming-homa-bay-guide", destination: "/blog/sweet-potato-farming-homa-bay", permanent: true },
    ];
  },
};
export default nextConfig;
