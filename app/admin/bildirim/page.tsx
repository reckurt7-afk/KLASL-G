"use client";

import { useState } from "react";

export default function BildirimPage() {
  const [baslik, setBaslik] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);
  const [sonuc, setSonuc] = useState<{ tip: "ok" | "hata"; yazi: string } | null>(null);

  const gonder = async () => {
    if (!baslik.trim() || !mesaj.trim()) {
      setSonuc({ tip: "hata", yazi: "Başlık ve mesaj boş olamaz!" });
      return;
    }

    setLoading(true);
    setSonuc(null);

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baslik: baslik.trim(), mesaj: mesaj.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSonuc({ tip: "hata", yazi: "API Hatası: " + (data.error || response.status) });
      } else {
        setSonuc({
          tip: "ok",
          yazi: `✅ Bildirim gönderildi! ${data.gonderilen ?? 0} cihaza ulaştı.${data.hatali > 0 ? ` (${data.hatali} hatalı)` : ""}`,
        });
        setBaslik("");
        setMesaj("");
      }
    } catch (err: any) {
      setSonuc({ tip: "hata", yazi: "Bağlantı hatası: " + (err?.message || "Bilinmeyen hata") });
    }

    setLoading(false);
  };

  const hazirMesajlar = [
    { baslik: "📢 DUYURU", mesaj: "Önemli bir duyurumuz var, lütfen kontrol edin!" },
    { baslik: "⚽ MAÇ HATIRLATMA", mesaj: "Bugün maç var! Sahaya çıkın, heyecan başlıyor!" },
    { baslik: "🏆 PUAN DURUMU", mesaj: "Puan durumu güncellendi, kontrol etmeyi unutmayın!" },
    { baslik: "📅 PROGRAM DEĞİŞİKLİĞİ", mesaj: "Maç programında değişiklik yapıldı, fikstürü kontrol edin." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", padding: "90px 20px 120px" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", textAlign: "center", fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
          🔔 BİLDİRİM GÖNDER
        </h1>
        <p style={{ color: "#666", textAlign: "center", fontSize: 14, marginBottom: 30 }}>
          Tüm üyelere anlık bildirim gönder
        </p>

        {/* Sonuç mesajı */}
        {sonuc && (
          <div style={{
            background: sonuc.tip === "ok" ? "rgba(16,185,129,0.1)" : "rgba(212,175,55,0.1)",
            border: `1px solid ${sonuc.tip === "ok" ? "rgba(16,185,129,0.4)" : "rgba(212,175,55,0.4)"}`,
            borderRadius: 12,
            padding: "14px 18px",
            color: sonuc.tip === "ok" ? "#10b981" : "#ff6b6b",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 20,
          }}>
            {sonuc.yazi}
          </div>
        )}

        {/* Hazır Mesajlar */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "#888", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>
            HAZIR MESAJLAR
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {hazirMesajlar.map((h, i) => (
              <button
                key={i}
                onClick={() => { setBaslik(h.baslik); setMesaj(h.mesaj); setSonuc(null); }}
                style={{
                  background: "#151515",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  color: "#ccc",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {h.baslik}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: "#151515",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: 20,
          padding: 24,
        }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 2, display: "block", marginBottom: 8 }}>
              BAŞLIK
            </label>
            <input
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              placeholder="Bildirim başlığı..."
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 2, display: "block", marginBottom: 8 }}>
              MESAJ
            </label>
            <textarea
              value={mesaj}
              onChange={(e) => setMesaj(e.target.value)}
              placeholder="Bildirim mesajı..."
              rows={4}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            onClick={gonder}
            disabled={loading}
            style={{
              width: "100%",
              height: 56,
              border: "none",
              borderRadius: 14,
              background: loading ? "#333" : "linear-gradient(135deg, #ceaa52, #8c7324)",
              color: "#fff",
              fontSize: 17,
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 8px 20px rgba(212,175,55,0.35)",
              letterSpacing: 1,
            }}
          >
            {loading ? "⏳ Gönderiliyor..." : "🔔 TÜM ÜYELERİ BİLDİR"}
          </button>
        </div>
      </div>
    </div>
  );
}