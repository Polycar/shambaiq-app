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
    ];
  },
};
export default nextConfig;
