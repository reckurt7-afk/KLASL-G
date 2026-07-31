"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AyarlarPage() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    async function getir() {
      // id = 0 olan satır, global genel ayarları tutar.
      const { data } = await supabase.from("maclar").select("youtube_link").eq("id", 0).single();
      if (data && data.youtube_link) {
        setYoutubeLink(data.youtube_link);
      }
      setYukleniyor(false);
    }
    getir();
  }, []);

  async function kaydet() {
    setKaydediliyor(true);
    
    // id = 0 satırı yoksa oluştur, varsa güncelle (upsert mantığı)
    const { error } = await supabase.from("maclar").update({ youtube_link: youtubeLink }).eq("id", 0);
    
    // Eğer update hata verirse (belki id=0 satırı silinmiştir), insert ile oluşturmayı deneriz.
    if (error) {
       await supabase.from("maclar").insert([{ id: 0, youtube_link: youtubeLink, hafta: 0, ev_sahibi: "Sistem", deplasman: "Sistem", ev_skor: 0, dep_skor: 0, dakika: 0, durum: "Sistem", canli: false }]);
    }

    setKaydediliyor(false);
    alert("Ayarlar başarıyla kaydedildi! Canlı Yayın sayfasına yansıyacaktır.");
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
        
        <h3 style={{ marginBottom: 15, color: "#ff3131" }}>Varsayılan Canlı Yayın Linki (Tanıtım vs.)</h3>
        <p style={{ color: "#aaa", fontSize: 14, marginBottom: 20 }}>
          Sitede devam eden herhangi bir "Canlı Maç" yoksa, Canlı Yayın sayfasında aşağıdaki YouTube videosu gösterilir. Buraya bir tanıtım veya boş ekran videonuzun linkini koyabilirsiniz.
        </p>

        <input
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{ width: "100%", height: 50, padding: "0 20px", borderRadius: 12, background: "#222", border: "1px solid #333", color: "#fff", fontSize: 16 }}
        />

        <button
          onClick={kaydet}
          disabled={kaydediliyor}
          style={{
            marginTop: 25,
            width: "100%",
            height: 55,
            background: kaydediliyor ? "#555" : "linear-gradient(135deg, #ff3131, #a11212)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 16,
            cursor: kaydediliyor ? "not-allowed" : "pointer",
            boxShadow: "0 10px 30px rgba(255,49,49,0.3)",
          }}
        >
          {kaydediliyor ? "Kaydediliyor..." : "💾 KAYDET"}
        </button>
      </div>
    </div>
  );
}
