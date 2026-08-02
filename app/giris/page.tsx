"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: sifre,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
        setHata("E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
      } else if (error.message.includes("Email not confirmed")) {
        setHata("E-posta adresin henüz doğrulanmamış.");
      } else if (error.message.includes("Too many requests")) {
        setHata("Çok fazla deneme yapıldı. Lütfen birkaç dakika bekleyin.");
      } else {
        setHata("Giriş yapılamadı: " + error.message);
      }
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070707",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Arka plan glow efekti */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 600,
        height: 600,
        background: "radial-gradient(circle, rgba(255,49,49,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(40px)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>

        {/* Logo Bölümü */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 20px" }}>
            <Image
              src="/icons/logo.png"
              alt="KLAS LİG"
              fill
              style={{ objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(255,49,49,0.6))" }}
            />
          </div>
          <h1 style={{
            color: "#fff",
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: 6,
            margin: 0,
            lineHeight: 1,
          }}>KLAS LİG</h1>
          <div style={{
            color: "#ff3131",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 8,
            marginTop: 6,
          }}>BURSA</div>
        </div>

        {/* Kart */}
        <div style={{
          background: "rgba(17,17,17,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,49,49,0.05)",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>
              Hoş Geldin 👋
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, margin: 0 }}>
              Hesabınla giriş yap ve ligin keyfini çıkar.
            </p>
          </div>

          {hata && (
            <div style={{
              background: "rgba(255,49,49,0.08)",
              border: "1px solid rgba(255,49,49,0.3)",
              borderRadius: 12,
              padding: "14px 18px",
              color: "#ff6b6b",
              fontSize: 15,
              fontWeight: 500,
              marginBottom: 24,
            }}>
              ⚠️ {hata}
            </div>
          )}

          <form onSubmit={girisYap} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{
                display: "block",
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 10,
              }}>
                E-posta
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  color: "#fff",
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff3131"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 10,
              }}>
                Şifre
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "16px 18px",
                  color: "#fff",
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff3131"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                background: loading ? "rgba(255,49,49,0.5)" : "linear-gradient(135deg, #ff3131 0%, #c01010 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                fontSize: 17,
                fontWeight: 900,
                letterSpacing: 2,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 10px 30px rgba(255,49,49,0.35)",
                marginTop: 4,
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{
                    width: 20, height: 20,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    display: "inline-block",
                  }} />
                  Giriş yapılıyor...
                </span>
              ) : "GİRİŞ YAP →"}
            </button>
          </form>

          <div style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
              Hesabın yok mu?{" "}
              <Link href="/kayit" style={{
                color: "#ff3131",
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
