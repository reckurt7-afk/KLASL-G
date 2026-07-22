"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{
        position: "relative",
        background: "rgba(10,10,10,.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,215,0,.25)",
        zIndex: 99999,
      }}
    >
      {/* Üst Menü */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          padding: "12px",
        }}
      >
        <Link href="/puan-durumu" style={btn}>
          🏆 Puan Durumu
        </Link>

        <Link href="/fikstur" style={btn}>
          📅 Fikstür
        </Link>

        <Link href="/takimlar" style={btn}>
          👥 Takımlar
        </Link>

        <Link href="/duyurular" style={btn}>
          📢 Duyurular
        </Link>
      </div>

      
    </header>
  );
}

const btn = {
  textDecoration: "none",
  color: "#fff",
  background: "#171717",
  border: "1px solid rgba(255,215,0,.35)",
  borderRadius: 10,
 padding: "8px 12px",
  textAlign: "center" as const,
  fontSize: 13,
  fontWeight: 700,
};