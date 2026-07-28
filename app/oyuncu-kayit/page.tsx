"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OyuncuKayitPage() {
  const [takimlar, setTakimlar] = useState<any[]>([]);
  const [adSoyad, setAdSoyad] = useState("");
  const [formaNo, setFormaNo] = useState("");
  const [takim, setTakim] = useState(""); // takim adı
  const [mevki, setMevki] = useState("");
  const [telefon, setTelefon] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    takimlariGetir();
  }, []);

  async function takimlariGetir() {
    const { data, error } = await supabase
      .from("takimlar")
      .select("id, ad")
      .order("ad");

    if (error) {
      console.error(error);
      return;
    }

    setTakimlar(data || []);
  }

  async function basvuruGonder() {
    if (!adSoyad || !formaNo || !takim) {
      alert("Lütfen gerekli alanları (Ad Soyad, Forma No, Takım) doldurun.");
      return;
    }

    setLoading(true);
    let foto_url = null;

    if (foto) {
      const fileExt = foto.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, foto);

      if (uploadError) {
        console.error("Foto yükleme hatası:", uploadError);
        alert("Fotoğraf yüklenirken hata oluştu.");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      foto_url = data.publicUrl;
    }

    // `oyuncu_basvurulari` tablosuna ekle
    const { error } = await supabase
      .from("oyuncu_basvurulari")
      .insert({
        ad_soyad: adSoyad,
        telefon: telefon,
        takim: takim,
        mevki: mevki,
        forma_no: Number(formaNo),
        durum: "beklemede",
        foto_url: foto_url // Veritabanınızda yoksa eklemeniz gerekebilir
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Başvuru gönderilirken bir hata oluştu: " + error.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#00ff00", marginBottom: 20 }}>✅ Başvurunuz Alındı!</h1>
          <p>Yönetici onayından sonra profiliniz aktif edilecektir.</p>
          <Link href="/oyuncular" style={{ color: "#ff3131", marginTop: 20, display: "inline-block" }}>Oyunculara Dön</Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: "100px 20px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          background: "#151515",
          borderRadius: 20,
          padding: 30,
          border: "1px solid #333",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#ff3131",
            marginBottom: 30,
          }}
        >
          👤 Oyuncu Kaydı
        </h1>

        <label>📸 Profil Fotoğrafı</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.length) {
              setFoto(e.target.files[0]);
            }
          }}
          style={inputStyle}
        />

        <label>👤 Ad Soyad</label>
        <input
          type="text"
          placeholder="Ad Soyad"
          value={adSoyad}
          onChange={(e) => setAdSoyad(e.target.value)}
          style={inputStyle}
        />

        <label>📞 Telefon (İsteğe Bağlı)</label>
        <input
          type="text"
          placeholder="05XX XXX XX XX"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          style={inputStyle}
        />

        <label>👕 Forma Numarası</label>
        <input
          type="number"
          placeholder="10"
          value={formaNo}
          onChange={(e) => setFormaNo(e.target.value)}
          style={inputStyle}
        />

        <label>⚽ Mevki (İsteğe Bağlı)</label>
        <select
          value={mevki}
          onChange={(e) => setMevki(e.target.value)}
          style={inputStyle}
        >
          <option value="">Mevki Seçiniz</option>
          <option value="Kaleci">Kaleci</option>
          <option value="Defans">Defans</option>
          <option value="Orta Saha">Orta Saha</option>
          <option value="Forvet">Forvet</option>
        </select>

        <label>👥 Takım</label>
        <select
          value={takim}
          onChange={(e) => setTakim(e.target.value)}
          style={{ ...inputStyle, marginBottom: 30 }}
        >
          <option value="">Takım Seçiniz</option>
          {takimlar.map((t) => (
            <option key={t.id} value={t.ad}>
              {t.ad}
            </option>
          ))}
        </select>

        <button
          onClick={basvuruGonder}
          disabled={loading}
          style={{
            width: "100%",
            height: 55,
            background: loading ? "#555" : "#ff3131",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "GÖNDERİLİYOR..." : "BAŞVURUYU GÖNDER"}
        </button>

        <Link
          href="/oyuncular"
          style={{
            display: "block",
            marginTop: 20,
            textAlign: "center",
            color: "#999",
          }}
        >
          ← Oyunculara Geri Dön
        </Link>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 20,
  background: "#222",
  border: "1px solid #444",
  color: "white",
  borderRadius: 8
};