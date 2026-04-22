import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Horizontal bar of cross */}
        <div
          style={{
            position: "absolute",
            width: 18,
            height: 6,
            background: "white",
            borderRadius: 2,
          }}
        />
        {/* Vertical bar of cross */}
        <div
          style={{
            position: "absolute",
            width: 6,
            height: 18,
            background: "white",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
