import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "40px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Medical cross */}
        <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Horizontal bar */}
          <div style={{ position: "absolute", width: 100, height: 32, background: "white", borderRadius: 8 }} />
          {/* Vertical bar */}
          <div style={{ position: "absolute", width: 32, height: 100, background: "white", borderRadius: 8 }} />
        </div>
        {/* Hospital name text */}
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: 700,
            marginTop: 8,
            letterSpacing: "-0.5px",
            fontFamily: "sans-serif",
          }}
        >
          Medicare
        </div>
      </div>
    ),
    { ...size }
  );
}
