import { Suspense } from "react";
import { getCountySoils, getWards, getCrops, getCountyCoords, slugify, getDealers } from "@/lib/data";
import RecommendTool from "./RecommendTool";


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

  const countyCoords = getCountyCoords().map((c) => ({
    county: c.county,
    latitude: c.latitude,
    longitude: c.longitude,
  }));

  const dealers = getDealers();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="skeleton w-64 h-8" /></div>}>
      <RecommendTool counties={counties} wards={wards} crops={crops} countyCoords={countyCoords} dealers={dealers} />
    </Suspense>
  );
}
