import { ImageResponse } from "next/og";
import { getCountyBySlug, computeSoilHealthScore, getNutrientStatus } from "@/lib/data";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ county: string }> }
) {
  const { county: slug } = await params;
  const county = getCountyBySlug(slug);

  if (!county) {
    return new Response("County not found", { status: 404 });
  }

  const score = computeSoilHealthScore(county);
  const scoreColor = score >= 70 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626";
  const phStatus = getNutrientStatus(county.pH, "ph");
  const nStatus = getNutrientStatus(county.nitrogen, "nitrogen");
  const pStatus = getNutrientStatus(county.phosphorus, "phosphorus");

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
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "24px", color: "#C8860A", fontWeight: 700, letterSpacing: "0.05em" }}>
              ShambaIQ
            </div>
            <div style={{ fontSize: "14px", color: "#d4c9a8", marginTop: "4px" }}>
              Precision Agriculture for Kenya
            </div>
          </div>
          {/* Score ring */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "60px",
              border: `6px solid ${scoreColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "48px", fontWeight: 800, color: scoreColor }}>{score}</div>
            <div style={{ fontSize: "12px", color: "#d4c9a8", marginTop: "-4px" }}>SOIL HEALTH</div>
          </div>
        </div>

        {/* County name */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "56px", fontWeight: 800, lineHeight: 1.1 }}>
            {county.county} County
          </div>
          <div style={{ fontSize: "22px", color: "#C8860A", marginTop: "12px", fontWeight: 500 }}>
            {county.zone} — Soil Health Report 2026
          </div>
        </div>

        {/* Nutrient row */}
        <div style={{ display: "flex", gap: "40px" }}>
          {[
            { label: "pH", value: county.pH.toString(), status: phStatus.label },
            { label: "Nitrogen", value: `${county.nitrogen} g/kg`, status: nStatus.label },
            { label: "Phosphorus", value: `${county.phosphorus} mg/kg`, status: pStatus.label },
            { label: "Potassium", value: `${county.potassium} mg/kg`, status: "—" },
          ].map((n) => (
            <div key={n.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "14px", color: "#8a9a7a" }}>{n.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>{n.value}</div>
              <div style={{ fontSize: "13px", color: "#C8860A" }}>{n.status}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "24px", fontSize: "14px", color: "#5a6a5a" }}>
          shambaiq.com/soil/{slug} · 30m precision satellite data
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
