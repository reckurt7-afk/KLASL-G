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

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    sifre: "",
    sifreTekrar: "",
  });

  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");
  const [basarili, setBasarili] = useState(false);

  function degistir(alan: string, deger: string) {
    setForm({ ...form, [alan]: deger });
  }

  async function kayitOl(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setBasarili(false);

    if (form.full_name.trim().length < 3) {
      setHata("Ad soyad en az 3 karakter olmalıdır.");
      return;
    }

    const telefonTemiz = form.phone.replace(/\s/g, "");
    if (!/^(05|5)\d{9}$/.test(telefonTemiz)) {
      setHata("Geçerli bir telefon numarası girin. (05XXXXXXXXX)");
      return;
    }

    if (form.sifre.length < 6) {
      setHata("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (form.sifre !== form.sifreTekrar) {
      setHata("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    const { data: varMi } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", telefonTemiz)
      .maybeSingle();

    if (varMi) {
      setHata("Bu telefon numarası ile zaten bir hesap açılmış. Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.sifre,
      options: {
        data: {
          full_name: form.full_name.trim(),
          phone: telefonTemiz,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        setHata("Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.");
      } else {
        setHata(error.message);
      }
      setLoading(false);
      return;
    }

    setBasarili(true);
    setLoading(false);
    
    setTimeout(() => {
      router.push("/lig");
    }, 2000);
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
              Kayıt Ol 👤
            </h2>
            <p style={{ color: "#666666", fontSize: 15, margin: 0 }}>
              Hemen üye ol, ligin içinde yerini al.
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
              ✅ Kayıt başarılı! Lige yönlendiriliyorsunuz...
            </div>
          )}

          <form onSubmit={kayitOl} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={labelStyle}>Ad Soyad</label>
              <input
                type="text"
                required
                placeholder="Adınız Soyadınız"
                value={form.full_name}
                onChange={(e) => degistir("full_name", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#e60000"}
                onBlur={(e) => e.target.style.borderColor = "#cccccc"}
              />
            </div>

            <div>
              <label style={labelStyle}>Telefon Numarası</label>
              <input
                type="tel"
                required
                placeholder="05XXXXXXXXX"
                value={form.phone}
                onChange={(e) => degistir("phone", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#e60000"}
                onBlur={(e) => e.target.style.borderColor = "#cccccc"}
              />
              <p style={{ color: "#888888", fontSize: 12, marginTop: 6 }}>
                Her kullanıcının yalnızca 1 hesabı olabilir.
              </p>
            </div>

            <div>
              <label style={labelStyle}>E-posta</label>
              <input
                type="email"
                required
                placeholder="ornek@mail.com"
                value={form.email}
                onChange={(e) => degistir("email", e.target.value)}
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
                placeholder="En az 6 karakter"
                value={form.sifre}
                onChange={(e) => degistir("sifre", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#e60000"}
                onBlur={(e) => e.target.style.borderColor = "#cccccc"}
              />
            </div>

            <div>
              <label style={labelStyle}>Şifre Tekrar</label>
              <input
                type="password"
                required
                placeholder="Şifrenizi tekrar girin"
                value={form.sifreTekrar}
                onChange={(e) => degistir("sifreTekrar", e.target.value)}
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
              {loading ? "KAYIT YAPILIYOR..." : basarili ? "BAŞARILI!" : "KAYIT OL 🚀"}
            </button>
          </form>

          <div style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid #eaeaea",
            textAlign: "center",
          }}>
            <p style={{ color: "#666666", fontSize: 15, margin: 0 }}>
              Zaten hesabın var mı?{" "}
              <Link href="/giris" style={{
                color: "#e60000",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: 15,
              }}>
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
