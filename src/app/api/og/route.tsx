import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
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
          padding: "80px",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "28px", color: "#C8860A", fontWeight: 700, marginBottom: "20px" }}>
          ShambaIQ
        </div>
        <div style={{ fontSize: "56px", fontWeight: 800, lineHeight: 1.2, marginBottom: "16px" }}>
          Know your soil.
        </div>
        <div style={{ fontSize: "56px", fontWeight: 800, lineHeight: 1.2, color: "#C8860A", marginBottom: "30px" }}>
          Grow with precision.
        </div>
        <div style={{ fontSize: "22px", color: "#d4c9a8", maxWidth: "700px", lineHeight: 1.5 }}>
          Free soil analysis, fertilizer plans, and crop recommendations for all 47 Kenyan counties.
        </div>

        <div style={{ display: "flex", gap: "60px", marginTop: "50px" }}>
          {[
            { n: "47", l: "Counties" },
            { n: "25", l: "Crops" },
            { n: "1,450+", l: "Wards" },
            { n: "Free", l: "Forever" },
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "40px", fontWeight: 800, color: "#C8860A" }}>{s.n}</div>
              <div style={{ fontSize: "14px", color: "#8a9a7a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", fontSize: "14px", color: "#5a6a5a" }}>
          shambaiq.com · 30m precision satellite data
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
