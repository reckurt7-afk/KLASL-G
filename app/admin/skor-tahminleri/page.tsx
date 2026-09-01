"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tahmin = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ad_soyad: string;
  telefon: string;
  ev_skor: number;
  dep_skor: number;
};

export default function SkorTahminleriPage() {
  const [tahminler, setTahminler] = useState<Tahmin[]>([]);
const [arama, setArama] = useState("");
  useEffect(() => {
    tahminleriGetir();
  }, []);
async function tahminSil(id: number) {
  if (!confirm("Bu tahmini silmek istiyor musun?")) return;

  const { error } = await supabase
    .from("tahminler")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  tahminleriGetir();
}
  async function tahminleriGetir() {
    const { data, error } = await supabase
      .from("tahminler")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setTahminler(data);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: 20,
      }}
    >
      <h1
      
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: 25,
        }}
      >
        🎯 Skor Tahminleri
      </h1>
      <input
  placeholder="Ad Soyad veya Telefon Ara..."
  value={arama}
  onChange={(e) => setArama(e.target.value)}
  style={{
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    border: "1px solid #333",
    background: "#1b1b1b",
    color: "#fff",
    outline: "none",
  }}
/>
           {tahminler
  .filter(
    (tahmin) =>
      tahmin.ad_soyad.toLowerCase().includes(arama.toLowerCase()) ||
      tahmin.telefon.includes(arama)
  )
  .map((tahmin) => (
        <div
          key={tahmin.id}
          style={{
            background: "#171717",
            border: "1px solid #333",
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
          }}
        >
          <div style={{ color: "#fff", fontWeight: 700 }}>
            👤 {tahmin.ad_soyad}
          </div>

          <div style={{ color: "#bbb", marginTop: 5 }}>
            📱 {tahmin.telefon}
          </div>

          <div style={{ color: "#fff", marginTop: 8 }}>
            📅 {tahmin.hafta}. Hafta
          </div>

          <div
            style={{
              color: "#ffd700",
              marginTop: 8,
              fontWeight: 700,
            }}
          >
            ⚽ {tahmin.ev_sahibi} {tahmin.ev_skor} - {tahmin.dep_skor}{" "}
            {tahmin.deplasman}
            <button
  onClick={() => tahminSil(tahmin.id)}
  style={{
    marginTop: 15,
    width: "100%",
    padding: 10,
    background: "#d4af37",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  }}
>
  🗑️ Tahmini Sil
</button>
          </div>
        </div>
      ))}
          </div>
  );
}