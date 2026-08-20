"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inputStyle = {
  width: "100%",
  background: "#ffffff",
  border: "1px solid #cccccc",
  borderRadius: 14,
  padding: "16px 18px",
  color: "#1a1a1a",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block" as const,
  color: "#666666",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase" as const,
  marginBottom: 10,
};

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");
  const [basarili, setBasarili] = useState(false);

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: sifre,
    });

    if (error) {
      setHata("E-posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    setBasarili(true);
    setLoading(false);
    
    // Yönlendirme
    setTimeout(() => {
      router.push("/lig");
    }, 1500);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
        {/* Logo Bölümü */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 20px" }}>
            <Image
              src="/icons/logo.png"
              alt="KLAS LİG"
              fill
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 10px rgba(0,0,0,0.1))" }}
            />
          </div>
          <h1 style={{
            color: "#1a1a1a",
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: 6,
            margin: 0,
            lineHeight: 1,
          }}>KLAS LİG</h1>
        </div>

        {/* Kart */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #eaeaea",
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
        }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ color: "#1a1a1a", fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>
              Hoş Geldiniz 👤
            </h2>
            <p style={{ color: "#666666", fontSize: 15, margin: 0 }}>
              Hesabınıza giriş yapın.
            </p>
          </div>

          {hata && (
            <div style={{
              background: "rgba(255,49,49,0.08)",
              border: "1px solid rgba(255,49,49,0.3)",
              borderRadius: 12,
              padding: "14px 18px",
              color: "#e60000",
              fontSize: 15,
              fontWeight: 500,
              marginBottom: 24,
            }}>
              🚨 {hata}
            </div>
          )}

          {basarili && (
            <div style={{
              background: "rgba(22,163,74,0.1)",
              border: "1px solid rgba(22,163,74,0.3)",
              borderRadius: 12,
              padding: "14px 18px",
              color: "#16a34a",
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 24,
            }}>
              ✅ Giriş başarılı! Lige yönlendiriliyorsunuz...
            </div>
          )}

          <form onSubmit={girisYap} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={labelStyle}>E-posta</label>
              <input
                type="email"
                required
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#e60000"}
                onBlur={(e) => e.target.style.borderColor = "#cccccc"}
              />
            </div>

            <div>
              <label style={labelStyle}>Şifre</label>
              <input
                type="password"
                required
                placeholder="Şifreniz"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#e60000"}
                onBlur={(e) => e.target.style.borderColor = "#cccccc"}
              />
            </div>

            <button
              type="submit"
              disabled={loading || basarili}
              style={{
                width: "100%",
                padding: "18px",
                background: (loading || basarili) ? "#f87171" : "#e60000",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                fontSize: 17,
                fontWeight: 900,
                letterSpacing: 2,
                cursor: (loading || basarili) ? "not-allowed" : "pointer",
                marginTop: 6,
                transition: "all 0.2s",
              }}
            >
              {loading ? "GİRİŞ YAPILIYOR..." : basarili ? "BAŞARILI!" : "GİRİŞ YAP 🚀"}
            </button>
          </form>

          <div style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid #eaeaea",
            textAlign: "center",
          }}>
            <p style={{ color: "#666666", fontSize: 15, margin: 0 }}>
              Hesabın yok mu?{" "}
              <Link href="/kayit" style={{
                color: "#e60000",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: 15,
              }}>
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
