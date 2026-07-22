"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
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

      {/* Logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: 12,
        }}
      >
        <Image
          src="/logo.png"
          alt="KLAS Lig"
          width={50}
          height={50}
          priority
        />
      </div>
    </header>
  );
}

const btn = {
  textDecoration: "none",
  color: "#fff",
  background: "#171717",
  border: "1px solid rgba(255,215,0,.35)",
  borderRadius: 12,
  padding: "12px 8px",
  textAlign: "center" as const,
  fontSize: 14,
  fontWeight: 700,
};