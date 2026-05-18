import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "shambaiq-backend-production.up.railway.app" }],
  },
  async redirects() {
    return [
      { source: "/sw/udongo/:county", destination: "/soil/:county", permanent: true },
      { source: "/sw/mazao/:crop", destination: "/crops/:crop", permanent: true },
    ];
  },
};
export default nextConfig;
