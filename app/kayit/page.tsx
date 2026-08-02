"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 14,
  padding: "16px 18px",
  color: "#fff",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block" as const,
  color: "rgba(255,255,255,0.5)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase" as const,
  marginBottom: 10,
};

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    ad_soyad: "",
    telefon: "",
    email: "",
    sifre: "",
    sifreTekrar: "",
  });
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");

  function degistir(alan: string, deger: string) {
    setForm({ ...form, [alan]: deger });
  }

  async function kayitOl(e: React.FormEvent) {
    e.preventDefault();
    setHata("");

    if (form.ad_soyad.trim().length < 3) {
      setHata("Ad soyad en az 3 karakter olmalıdır.");
      return;
    }

    const telefonTemiz = form.telefon.replace(/\s/g, "");
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
      .from("profiller")
      .select("id")
      .eq("telefon", telefonTemiz)
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
          ad_soyad: form.ad_soyad.trim(),
          telefon: telefonTemiz,
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

    if (data.user) {
      await supabase.from("profiller").insert({
        id: data.user.id,
        ad_soyad: form.ad_soyad.trim(),
        telefon: telefonTemiz,
        email: form.email.trim(),
      });
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
        top: "15%",
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
        <div style={{ textAlign: "center", marginBottom: 36 }}>
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
          padding: "36px 32px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,49,49,0.05)",
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>
              Kayıt Ol ⚽
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
              Hemen üye ol, ligin içinde yerini al.
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

          <form onSubmit={kayitOl} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={labelStyle}>Ad Soyad</label>
              <input
                type="text"
                required
                placeholder="Adınız Soyadınız"
                value={form.ad_soyad}
                onChange={(e) => degistir("ad_soyad", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#ff3131"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div>
              <label style={labelStyle}>Telefon Numarası</label>
              <input
                type="tel"
                required
                placeholder="05XXXXXXXXX"
                value={form.telefon}
                onChange={(e) => degistir("telefon", e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#ff3131"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 6 }}>
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
                onFocus={(e) => e.target.style.borderColor = "#ff3131"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
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
                onFocus={(e) => e.target.style.borderColor = "#ff3131"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
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
                marginTop: 6,
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
                  Kayıt yapılıyor...
                </span>
              ) : "KAYIT OL →"}
            </button>
          </form>

          <div style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
              Zaten hesabın var mı?{" "}
              <Link href="/giris" style={{
                color: "#ff3131",
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
