"use client";

import Image from "next/image";
import Countdown from "./Countdown";
import Link from "next/link";
export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url('/images/stadium.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "130px 20px 40px",
      }}
    >
      {/* KARARTMA */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,.92))",
        }}
      />

      {/* İÇERİK */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 430,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >

        <Image
          src="/logo.png"
          alt="KLAS LİG"
          width={160}
          height={160}
          priority
        />

        <h1
          style={{
            color: "#fff",
            fontSize: 46,
            fontWeight: 900,
            lineHeight: 1.05,
            marginTop: 10,
            textShadow: "0 0 20px rgba(255,0,0,.45)",
          }}
        >
          KLAS LİG
          <br />
          BURSA
        </h1>

        <div
          style={{
            marginTop: 12,
            color: "#ff3131",
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: 3,
          }}
        >
          3. SEZON
        </div>
                 <div
  style={{
    width: "100%",
    marginTop: 35,
  }}
>
  <Countdown />
</div>

       <Link
  href="/oyuncu-basvurusu"
  style={{
    width: "100%",
    maxWidth: 320,
    textDecoration: "none",
    marginTop: 28,
  }}
>
  <button
    style={{
      width: "100%",
      height: 56,
      border: "none",
      borderRadius: 999,
      background: "#ff3131",
      color: "#fff",
      fontSize: 18,
      fontWeight: 800,
      cursor: "pointer",
      boxShadow: "0 0 25px rgba(255,49,49,.45)",
    }}
  >
    👤 OYUNCU BAŞVURUSU
  </button>
</Link>
                <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 14,
            width: "100%",
            marginTop: 35,
          }}
        >
          {[
  { icon: "👥", value: "8", text: "TAKIM" },
  { icon: "⚽", value: "28", text: "MAÇ" },
  { icon: "📺", value: "TÜM", text: "CANLI YAYIN" },
  { icon: "🧑‍⚖️", value: "HAKEM", text: " TRİOSU" },
].map((item) => (
            <div
              key={item.text}
              style={{
                background: "rgba(15,15,15,.75)",
                border: "1px solid rgba(255,49,49,.30)",
                borderRadius: 18,
                padding: "18px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: 28 }}>{item.icon}</div>

              <div
                style={{
                  color: "#ff3131",
                  fontSize: 28,
                  fontWeight: 900,
                  marginTop: 10,
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>
              </div>
    </section>
  );
}