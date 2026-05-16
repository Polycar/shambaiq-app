import { ImageResponse } from "next/og";
import { getCountyBySlug } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ county: string }> }
) {
  const { county: slug } = await params;
  const countyData = getCountyBySlug(slug);

  if (!countyData) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: 80, color: "#11472a", fontWeight: "bold", margin: 0 }}>
            {countyData.county} County
          </h1>
        </div>
        
        <p style={{ fontSize: 40, color: "#928574", marginBottom: "60px" }}>
          {countyData.zone} Agroecological Zone
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#fef3c7", padding: "40px", borderRadius: "20px", width: "30%" }}>
            <span style={{ fontSize: 30, color: "#928574" }}>pH Level</span>
            <span style={{ fontSize: 60, color: "#11472a", fontWeight: "bold" }}>{countyData.pH}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#fef3c7", padding: "40px", borderRadius: "20px", width: "30%" }}>
            <span style={{ fontSize: 30, color: "#928574" }}>Nitrogen</span>
            <span style={{ fontSize: 60, color: "#11472a", fontWeight: "bold" }}>{countyData.nitrogen} <span style={{ fontSize: 30 }}>g/kg</span></span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#fef3c7", padding: "40px", borderRadius: "20px", width: "30%" }}>
            <span style={{ fontSize: 30, color: "#928574" }}>Phosphorus</span>
            <span style={{ fontSize: 60, color: "#11472a", fontWeight: "bold" }}>{countyData.phosphorus} <span style={{ fontSize: 30 }}>mg/kg</span></span>
          </div>
        </div>

        <div style={{ display: "flex", position: "absolute", bottom: "40px", right: "80px" }}>
          <span style={{ fontSize: 30, color: "#d97706", fontWeight: "bold" }}>🌱 ShambaIQ</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
