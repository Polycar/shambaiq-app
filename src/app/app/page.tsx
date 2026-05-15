import { getCountySoils, getWards, getCrops, slugify } from "@/lib/data";
import RecommendTool from "./RecommendTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Advice — ShambaIQ",
  description:
    "Free precision fertilizer and soil advice for Kenyan farmers. Select your county, crop, and get actionable recommendations powered by iSDAsoil satellite data.",
};

export default function AppPage() {
  const counties = getCountySoils().map((c) => ({
    county: c.county,
    slug: c.slug,
    zone: c.zone,
    pH: c.pH,
    nitrogen: c.nitrogen,
    phosphorus: c.phosphorus,
    potassium: c.potassium,
    organic_carbon: c.organicCarbon,
  }));

  const wards = getWards().map((w) => ({
    county: w.county,
    subcounty: w.subcounty,
    ward: w.ward,
    latitude: w.latitude,
    longitude: w.longitude,
  }));

  const crops = getCrops().map((c) => ({
    crop: c.crop,
    slug: slugify(c.crop),
  }));

  return <RecommendTool counties={counties} wards={wards} crops={crops} />;
}
