"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Foto = { id: number; url: string; baslik: string; created_at: string };

export default function AdminGaleriPage() {
  const [fotolar, setFotolar] = useState<Foto[]>([]);
  const [baslik, setBaslik] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [siliniyor, setSiliniyor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getir(); }, []);

  async function getir() {
    const { data } = await supabase.from("galeri").select("*").order("created_at", { ascending: false });
    setFotolar(data || []);
  }

  async function yukle(e: React.ChangeEvent<HTMLInputElement>) {
    const dosyalar = e.target.files;
    if (!dosyalar || dosyalar.length === 0) return;
    setYukleniyor(true);

    for (const dosya of Array.from(dosyalar)) {
      const uzanti = dosya.name.split(".").pop();
      const dosyaAdi = `galeri/${Date.now()}_${Math.random().toString(36).slice(2)}.${uzanti}`;

      // Supabase Storage'a yükle
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("galeri")
        .upload(dosyaAdi, dosya, { upsert: false });

      if (uploadError) {
        alert("Yükleme hatası: " + uploadError.message);
        continue;
      }

      // Public URL al
      const { data: urlData } = supabase.storage.from("galeri").getPublicUrl(dosyaAdi);

      // Veritabanına kaydet
      await supabase.from("galeri").insert([{ url: urlData.publicUrl, baslik: baslik || dosya.name }]);
    }

    setBaslik("");
    if (inputRef.current) inputRef.current.value = "";
    await getir();
    setYukleniyor(false);
    alert("✅ Fotoğraf(lar) yüklendi!");
  }

  async function sil(foto: Foto) {
    if (!confirm(`"${foto.baslik}" silinecek. Emin misin?`)) return;
    setSiliniyor(foto.id);

    // Storage'dan sil
    const path = foto.url.split("/galeri/")[1];
    if (path) await supabase.storage.from("galeri").remove([`galeri/${path}`]);

    // DB'den sil
    await supabase.from("galeri").delete().eq("id", foto.id);
    await getir();
    setSiliniyor(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "90px 20px" }}>
      <h1 style={{ textAlign: "center", fontWeight: 900, marginBottom: 30 }}>📸 GALERİ YÖNETİMİ</h1>

      {/* Yükleme Alanı */}
      <div style={{ maxWidth: 700, margin: "0 auto 40px", background: "#151515", borderRadius: 16, padding: 25, border: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 style={{ color: "#d4af37", marginBottom: 15 }}>Yeni Fotoğraf Yükle</h3>
        
        <input
          value={baslik}
          onChange={e => setBaslik(e.target.value)}
          placeholder="Fotoğraf başlığı (opsiyonel)"
          style={{ width: "100%", height: 45, padding: "0 15px", borderRadius: 10, background: "#222", border: "1px solid #333", color: "#fff", marginBottom: 15, boxSizing: "border-box" }}
        />

        <label style={{
          display: "block", border: "2px dashed rgba(212,175,55,0.4)", borderRadius: 12,
          padding: 30, textAlign: "center", cursor: "pointer",
          background: "rgba(212,175,55,0.05)", transition: "all 0.2s"
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📁</div>
          <div style={{ fontWeight: 700, color: "#d4af37" }}>{yukleniyor ? "Yükleniyor..." : "Fotoğraf Seç (Birden fazla seçebilirsin)"}</div>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 5 }}>JPG, PNG, WEBP desteklenir</div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={yukle}
            disabled={yukleniyor}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* Mevcut Fotoğraflar */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h3 style={{ fontWeight: 900, marginBottom: 20 }}>Mevcut Fotoğraflar ({fotolar.length})</h3>
        {fotolar.length === 0 ? (
          <p style={{ color: "#aaa" }}>Henüz fotoğraf yok.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 15 }}>
            {fotolar.map(foto => (
              <div key={foto.id} style={{ background: "#151515", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ position: "relative", paddingBottom: "66%", background: "#1a1a1a" }}>
                  <img src={foto.url} alt={foto.baslik} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{foto.baslik || "—"}</div>
                  <button
                    onClick={() => sil(foto)}
                    disabled={siliniyor === foto.id}
                    style={{ width: "100%", height: 35, background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                  >
                    {siliniyor === foto.id ? "Siliniyor..." : "🗑️ Sil"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
