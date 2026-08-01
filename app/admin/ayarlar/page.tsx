"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AYAR_ID = 9999; // Özel bir ID - maclar tablosunda sistem ayarı satırı

export default function AyarlarPage() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [mp4Link, setMp4Link] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kayitliLink, setKayitliLink] = useState("");

  useEffect(() => {
    async function getir() {
      const { data } = await supabase
        .from("ayarlar")
        .select("*")
        .eq("anahtar", "canli_yayin_link")
        .single();

      if (data && data.deger) {
        setYoutubeLink(data.deger);
        setKayitliLink(data.deger);
      }
      setYukleniyor(false);
    }
    getir();
  }, []);

  async function kaydet() {
    setKaydediliyor(true);

    // Önce var mı kontrol et
    const { data: mevcut } = await supabase
      .from("ayarlar")
      .select("id")
      .eq("anahtar", "canli_yayin_link")
      .single();

    if (mevcut) {
      await supabase
        .from("ayarlar")
        .update({ deger: youtubeLink })
        .eq("anahtar", "canli_yayin_link");
    } else {
      await supabase
        .from("ayarlar")
        .insert([{ anahtar: "canli_yayin_link", deger: youtubeLink }]);
    }

    setKayitliLink(youtubeLink);
    setKaydediliyor(false);
    alert("✅ Kaydedildi! Canlı Yayın sayfasını yenile.");
  }

  if (yukleniyor) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "90px 20px" }}>
      <h1 style={{ textAlign: "center", color: "#fff", marginBottom: 40, fontWeight: 900 }}>⚙️ GENEL AYARLAR</h1>

      <div style={{ maxWidth: 700, margin: "0 auto", background: "#151515", borderRadius: 16, padding: 30, border: "1px solid rgba(255,255,255,0.1)" }}>

        <h3 style={{ marginBottom: 10, color: "#ff3131" }}>📺 Canlı Yayın / Tanıtım Video Linki</h3>
        <p style={{ color: "#aaa", fontSize: 13, marginBottom: 20 }}>
          Buraya YouTube linki yapıştır. Canlı yayın sayfasında bu video gösterilecek.<br />
          Maç başlatırsan maçın yayını öncelikli gösterilir, maç bitince bu videoya döner.
        </p>

        {kayitliLink && (
          <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 10, padding: "10px 15px", marginBottom: 20, fontSize: 13, color: "#4ade80" }}>
            ✅ Şu an aktif link: <strong style={{ color: "#fff", wordBreak: "break-all" }}>{kayitliLink}</strong>
          </div>
        )}

        <input
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{ width: "100%", height: 50, padding: "0 20px", borderRadius: 12, background: "#222", border: "1px solid #333", color: "#fff", fontSize: 15, boxSizing: "border-box" }}
        />

        <button
          onClick={kaydet}
          disabled={kaydediliyor || !youtubeLink.trim()}
          style={{
            marginTop: 20,
            width: "100%",
            height: 55,
            background: (kaydediliyor || !youtubeLink.trim()) ? "#555" : "linear-gradient(135deg, #ff3131, #a11212)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 16,
            cursor: (kaydediliyor || !youtubeLink.trim()) ? "not-allowed" : "pointer",
            boxShadow: "0 10px 30px rgba(255,49,49,0.3)",
          }}
        >
          {kaydediliyor ? "Kaydediliyor..." : "💾 KAYDET"}
        </button>

        {youtubeLink.trim() && (
          <button
            onClick={async () => {
              setKaydediliyor(true);
              const { data: mevcut } = await supabase.from("ayarlar").select("id").eq("anahtar", "canli_yayin_link").single();
              if (mevcut) {
                await supabase.from("ayarlar").update({ deger: "" }).eq("anahtar", "canli_yayin_link");
              }
              setYoutubeLink("");
              setKayitliLink("");
              setKaydediliyor(false);
              alert("Link kaldırıldı.");
            }}
            style={{
              marginTop: 10,
              width: "100%",
              height: 45,
              background: "transparent",
              color: "#aaa",
              border: "1px solid #333",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            🗑️ Linki Kaldır
          </button>
        )}
      </div>
    </div>
  );
}
