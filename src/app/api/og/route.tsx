import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#11472a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ fontSize: 100, color: "#d97706", fontWeight: "bold", marginRight: "20px" }}>🌱</span>
          <h1 style={{ fontSize: 100, color: "#fff", fontWeight: "bold", margin: 0 }}>
            ShambaIQ
          </h1>
        </div>
        <p style={{ fontSize: 40, color: "#fef3c7", textAlign: "center", maxWidth: "800px" }}>
          Precision agriculture for every Kenyan farmer. 47 counties, 25 crops, satellite soil data.
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
