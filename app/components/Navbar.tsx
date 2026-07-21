"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 70,
          background: "rgba(10,10,10,.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,0,0,.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          zIndex: 99999,
        }}
      >
        <button
  onClick={() => setOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: 32,
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        <Image
          src="/logo.png"
          alt="KLAS Lig"
          width={42}
          height={42}
          priority
        />

        <div style={{ width: 32 }} />
      </header>
            {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.6)",
              zIndex: 99998,
            }}
          />

          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 290,
              height: "100vh",
              background: "#111",
              zIndex: 99999,
              padding: "25px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              borderRight: "1px solid rgba(255,0,0,.25)",
            }}
          >
            <Image
              src="/logo.png"
              alt="KLAS Lig"
              width={70}
              height={70}
            />

            <h2
              style={{
                color: "#fff",
                margin: 0,
                fontSize: 22,
              }}
            >
              KLAS LİG BURSA
            </h2>

            <hr
              style={{
                width: "100%",
                borderColor: "rgba(255,0,0,.25)",
              }}
            />

            <div style={{ color: "#fff" }}>🏠 Ana Sayfa</div>
            <Link
  href="/takimlar"
  onClick={() => setOpen(false)}
  style={{
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
  }}
>
  👥 Takımlar
</Link>
            <Link
  href="/fikstur"
  onClick={() => setOpen(false)}
  style={{
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
  }}
>
  📅 Fikstür
</Link>
            <Link
  href="/puan-durumu"
  onClick={() => setOpen(false)}
  style={{
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 600,
  }}
>
  📊 Puan Durumu
</Link>
            
            <div style={{ color: "#fff" }}>🏅 Haftanın En İyi 11</div>
            <div style={{ color: "#fff" }}>🎥 Canlı Yayınlar</div>
            <div style={{ color: "#fff" }}>📰 Haberler</div>
            <div style={{ color: "#fff" }}>🤝 Sponsorlar</div>
            <div style={{ color: "#fff" }}>📞 İletişim</div>
          </aside>
        </>
      )}
    </>
  );
}