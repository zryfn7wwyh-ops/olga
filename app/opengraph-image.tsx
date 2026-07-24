import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#17191d",
          color: "#faf9f6",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#c2a67d",
          }}
        >
          <div style={{ width: 48, height: 1, background: "#c2a67d" }} />
          Адвокат Аксёнова Анита Георгиевна
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 58,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Адвокатская защита в сложных гражданских, уголовных делах и бизнес-спорах
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 40,
            fontSize: 24,
            color: "#faf9f6cc",
          }}
        >
          <div>Стаж с 2000 года</div>
          <div>·</div>
          <div>Краснодар</div>
          <div>·</div>
          <div>+7 (989) 230-10-00</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
