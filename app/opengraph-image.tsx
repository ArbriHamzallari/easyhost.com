import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EasyHost: Turn minibar snacks into passive income";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FF5A1F 0%, #E54A12 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            🏠
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            EasyHost
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.05",
            letterSpacing: "-0.02em",
            maxWidth: "900px",
          }}
        >
          Turn minibar snacks into passive income.
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.8)",
            marginTop: "24px",
            maxWidth: "700px",
            lineHeight: "1.4",
          }}
        >
          Beautiful in-room menus for Airbnb hosts and boutique hotels.
        </div>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {["7-day free trial", "No credit card", "Zero transaction fees"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "999px",
                  padding: "10px 24px",
                  fontSize: "18px",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
