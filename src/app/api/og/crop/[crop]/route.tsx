import { ImageResponse } from "next/og";
import { getCropBySlug } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ crop: string }> }
) {
  const { crop: slug } = await params;
  const cropData = getCropBySlug(slug);

  if (!cropData) {
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
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" }}>
            <span style={{ fontSize: 40, color: "#d97706", fontWeight: "bold", padding: "10px 30px", backgroundColor: "#fef3c7", borderRadius: "100px" }}>
              Farming Guide
            </span>
          </div>
          <h1 style={{ fontSize: 100, color: "#11472a", fontWeight: "bold", margin: "20px 0 0 0" }}>
            {cropData.crop}
          </h1>
          <p style={{ fontSize: 40, color: "#928574", marginTop: "20px", maxWidth: "800px" }}>
            Soil requirements, best counties, seeds, and fertilizer plan
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, color: "#928574" }}>Expected Yield</span>
            <span style={{ fontSize: 50, color: "#11472a", fontWeight: "bold" }}>{cropData.yield_per_acre} kg/acre</span>
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ fontSize: 30, color: "#d97706", fontWeight: "bold" }}>🌱 ShambaIQ</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
