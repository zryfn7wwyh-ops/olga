import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default function BlogOpengraphImage() {
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
            fontSize: 64,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Статьи и юридические разъяснения
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
          <div>Семейное право</div>
          <div>·</div>
          <div>Наследственные споры</div>
          <div>·</div>
          <div>Защита бизнеса</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
