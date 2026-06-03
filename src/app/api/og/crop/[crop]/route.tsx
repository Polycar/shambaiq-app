import { ImageResponse } from "next/og";
import { getCropBySlug, getTopCountiesForCrop } from "@/lib/data";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ crop: string }> }
) {
  const { crop: slug } = await params;
  const crop = getCropBySlug(slug);

  if (!crop) {
    return new Response("Crop not found", { status: 404 });
  }

  const topCounties = getTopCountiesForCrop(crop, 5);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, sans-serif",
          background: "linear-gradient(135deg, #1a3a1a 0%, #1e4620 50%, #1a3a1a 100%)",
          color: "white",
          padding: "60px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "24px", color: "#C8860A", fontWeight: 700 }}>ShambaIQ</div>
            <div style={{ fontSize: "14px", color: "#d4c9a8", marginTop: "4px" }}>Crop Farming Guide</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: "18px", color: "#16a34a", fontWeight: 600 }}>
              KES {crop.price_per_kg}/kg
            </div>
            <div style={{ fontSize: "14px", color: "#d4c9a8" }}>Market price</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "60px", fontWeight: 800, lineHeight: 1.1 }}>{crop.crop}</div>
          <div style={{ fontSize: "22px", color: "#C8860A", marginTop: "12px" }}>
            Farming Guide — Kenya
          </div>
        </div>

        <div style={{ display: "flex", gap: "40px", marginBottom: "16px" }}>
          {[
            { label: "pH Range", value: `${crop.ph_min}–${crop.ph_max}` },
            { label: "Yield", value: `${crop.yield_per_acre.toLocaleString()} kg/acre` },
            { label: "Nitrogen need", value: crop.n_need },
            { label: "Soil", value: crop.pref_texture },
          ].map((n) => (
            <div key={n.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "14px", color: "#8a9a7a" }}>{n.label}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, textTransform: "capitalize" }}>{n.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ fontSize: "14px", color: "#8a9a7a" }}>Best counties:</div>
          {topCounties.slice(0, 5).map((tc) => (
            <div
              key={tc.county.slug}
              style={{
                fontSize: "13px",
                padding: "4px 12px",
                borderRadius: "20px",
                backgroundColor: "rgba(200,134,10,0.2)",
                color: "#C8860A",
                fontWeight: 600,
              }}
            >
              {tc.county.county}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px", fontSize: "14px", color: "#5a6a5a" }}>
          shambaiq.com/crops/{slug} · 30m precision satellite data
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
