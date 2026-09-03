"use client";

// Reklamları buradan düzenleyebilirsiniz
const REKLAMLAR = [
  {
    id: 1,
    logo: "🏪",
    firma: "ÖRNEK MARKET",
    slogan: "Her gün taze ürünler",
    renk: "#ceaa52",
  },
  {
    id: 2,
    logo: "⚽",
    firma: "SPOR DÜNYASI",
    slogan: "Forma & Ayakkabı %30 indirim",
    renk: "#f59e0b",
  },
  {
    id: 3,
    logo: "🍕",
    firma: "LEZZET PIZZA",
    slogan: "Maç gecesi özel menü",
    renk: "#10b981",
  },
  {
    id: 4,
    logo: "🚗",
    firma: "OTOPARK A.Ş.",
    slogan: "Saha yanı güvenli park",
    renk: "#3b82f6",
  },
  {
    id: 5,
    logo: "💊",
    firma: "BURSA ECZANE",
    slogan: "Sağlıklı sporcular için",
    renk: "#8b5cf6",
  },
  {
    id: 6,
    logo: "📞",
    firma: "REKLAM: 0501 012 0016",
    slogan: "Buraya reklam vermek için arayın!",
    renk: "#ceaa52",
  },
];

export default function ReklamBandi() {
  // Reklamları 3 kez tekrar et - sonsuz döngü hissi için
  const tekrarli = [...REKLAMLAR, ...REKLAMLAR, ...REKLAMLAR];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998, // Navbar'ın altında ama içeriğin üstünde
        background: "rgba(7,7,7,0.97)",
        borderTop: "1px solid rgba(212,175,55,0.25)",
        overflow: "hidden",
        height: 44,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Kayan Bant */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          animation: "kayBant 40s linear infinite",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {tekrarli.map((r, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0 28px",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Yanıp sönen nokta */}
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: r.renk,
                boxShadow: `0 0 6px ${r.renk}`,
                animation: "yanipSon 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 18 }}>{r.logo}</span>
            <span
              style={{
                color: r.renk,
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {r.firma}
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              —
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {r.slogan}
            </span>
          </div>
        ))}
      </div>

      {/* Sol ve sağ soluk geçişi */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(to right, rgba(7,7,7,1), transparent)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(to left, rgba(7,7,7,1), transparent)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <style>{`
        @keyframes kayBant {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes yanipSon {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
