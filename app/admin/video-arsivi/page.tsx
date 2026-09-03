"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Video = { id: number; baslik: string; youtube_link: string; aciklama: string; tarih: string };

export default function AdminVideoArsivPage() {
  const [videolar, setVideolar] = useState<Video[]>([]);
  const [baslik, setBaslik] = useState("");
  const [link, setLink] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [tarih, setTarih] = useState(new Date().toISOString().split("T")[0]);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  useEffect(() => { getir(); }, []);

  async function getir() {
    const { data } = await supabase.from("videolar").select("*").order("tarih", { ascending: false });
    setVideolar(data || []);
  }

  async function ekle() {
    if (!baslik.trim() || !link.trim()) { alert("Başlık ve link zorunlu!"); return; }
    setKaydediliyor(true);
    await supabase.from("videolar").insert([{ baslik, youtube_link: link, aciklama, tarih }]);
    setBaslik(""); setLink(""); setAciklama(""); setTarih(new Date().toISOString().split("T")[0]);
    await getir();
    setKaydediliyor(false);
    alert("✅ Video eklendi!");
  }

  async function sil(id: number) {
    if (!confirm("Bu video silinecek. Emin misin?")) return;
    await supabase.from("videolar").delete().eq("id", id);
    await getir();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "90px 20px" }}>
      <h1 style={{ textAlign: "center", fontWeight: 900, marginBottom: 30 }}>🎬 VİDEO ARŞİVİ YÖNETİMİ</h1>

      {/* Ekleme Formu */}
      <div style={{ maxWidth: 700, margin: "0 auto 40px", background: "#151515", borderRadius: 16, padding: 25, border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 style={{ color: "#ceaa52", marginBottom: 20 }}>Yeni Video Ekle</h3>

        {[
          { label: "Başlık *", val: baslik, set: setBaslik, ph: "Maç adı veya video başlığı" },
          { label: "YouTube Linki *", val: link, set: setLink, ph: "https://www.youtube.com/watch?v=..." },
          { label: "Açıklama", val: aciklama, set: setAciklama, ph: "Kısa açıklama (opsiyonel)" },
        ].map(({ label, val, set, ph }) => (
          <div key={label} style={{ marginBottom: 15 }}>
            <div style={{ color: "#aaa", fontSize: 13, marginBottom: 6 }}>{label}</div>
            <input
              value={val}
              onChange={e => set(e.target.value)}
              placeholder={ph}
              style={{ width: "100%", height: 45, padding: "0 15px", borderRadius: 10, background: "#222", border: "1px solid #333", color: "#fff", boxSizing: "border-box" }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#aaa", fontSize: 13, marginBottom: 6 }}>Tarih</div>
          <input
            type="date"
            value={tarih}
            onChange={e => setTarih(e.target.value)}
            style={{ width: "100%", height: 45, padding: "0 15px", borderRadius: 10, background: "#222", border: "1px solid #333", color: "#fff", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={ekle}
          disabled={kaydediliyor}
          style={{
            width: "100%", height: 50,
            background: "linear-gradient(135deg, #ceaa52, #8c7324)",
            color: "#fff", border: "none", borderRadius: 12,
            fontWeight: 800, fontSize: 16, cursor: "pointer"
          }}
        >
          {kaydediliyor ? "Kaydediliyor..." : "➕ Video Ekle"}
        </button>
      </div>

      {/* Liste */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h3 style={{ fontWeight: 900, marginBottom: 20 }}>Mevcut Videolar ({videolar.length})</h3>
        {videolar.map(video => (
          <div key={video.id} style={{
            background: "#151515", borderRadius: 12, padding: "15px 20px", marginBottom: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 15
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: "#fff" }}>{video.baslik}</div>
              <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>{video.youtube_link}</div>
              <div style={{ color: "#ceaa52", fontSize: 12, marginTop: 4 }}>📅 {new Date(video.tarih).toLocaleDateString("tr-TR")}</div>
            </div>
            <button
              onClick={() => sil(video.id)}
              style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
            >
              🗑️ Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
