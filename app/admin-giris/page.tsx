"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGirisPage() {
  const router = useRouter();

  const [kullanici, setKullanici] = useState("");
  const [sifre, setSifre] = useState("");

  function girisYap() {
    if (kullanici === "admin" && sifre === "ProLig2026!") {
      localStorage.setItem("adminGiris", "true");
      router.push("/admin");
    } else {
      alert("❌ Kullanıcı adı veya şifre hatalı");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#151515",
          padding: 30,
          borderRadius: 20,
          border: "1px solid rgba(212,175,55,.3)",
        }}
      >
        <h1
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 900,
            marginBottom: 25,
          }}
        >
          🔐 PRO LİG ADMIN
        </h1>

        <input
          placeholder="Kullanıcı Adı"
          value={kullanici}
          onChange={(e) => setKullanici(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Şifre"
          type="password"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          style={{
            ...inputStyle,
            marginTop: 15,
          }}
        />

        <button
          onClick={girisYap}
          style={{
            width: "100%",
            height: 55,
            marginTop: 20,
            border: "none",
            borderRadius: 14,
            background: "#d4af37",
            color: "#fff",
            fontWeight: 900,
            fontSize: 17,
            cursor: "pointer",
          }}
        >
          GİRİŞ YAP
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  height: 52,
  background: "#0b0b0b",
  border: "1px solid #333",
  borderRadius: 12,
  padding: "0 15px",
  color: "#fff",
  fontSize: 16,
} as const;