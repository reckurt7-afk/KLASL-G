"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Basvuru = {
  id: number;
  ad_soyad: string;
  telefon: string;
  takim: string;
  mevki: string;
  forma_no: number;
  durum: string;
  foto_url?: string;
};

export default function BasvurularPage() {
  const [basvurular, setBasvurular] = useState<Basvuru[]>([]);

  useEffect(() => {
    getir();
  }, []);

  async function getir() {
    const { data, error } = await supabase
      .from("oyuncu_basvurulari")
      .select("*")
      .eq("durum", "beklemede")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setBasvurular(data || []);
  }

  async function onayla(b: Basvuru) {
    // Önce bu oyuncunun zaten olup olmadığını kontrol et
    const { data: mevcutOyuncu } = await supabase
      .from("oyuncular")
      .select("id")
      .eq("ad_soyad", b.ad_soyad)
      .eq("takim", b.takim)
      .maybeSingle();

    if (mevcutOyuncu) {
      // Oyuncu zaten varsa, bilgilerini (ve en önemlisi fotoğrafını) güncelle
      const { error: guncellemeHatasi } = await supabase
        .from("oyuncular")
        .update({
          telefon: b.telefon,
          mevki: b.mevki,
          forma_no: b.forma_no,
          foto_url: b.foto_url,
        })
        .eq("id", mevcutOyuncu.id);

      if (guncellemeHatasi) {
        alert("Güncelleme hatası: " + guncellemeHatasi.message);
        return;
      }
    } else {
      // Oyuncu yoksa yeni kayıt olarak ekle
      const { error: oyuncuHata } = await supabase
        .from("oyuncular")
        .insert({
          ad_soyad: b.ad_soyad,
          telefon: b.telefon,
          takim: b.takim,
          mevki: b.mevki,
          forma_no: b.forma_no,
          foto_url: b.foto_url,
        });

      if (oyuncuHata) {
        alert("Ekleme hatası: " + oyuncuHata.message);
        return;
      }
    }

    // Başvuruyu 'onaylandi' olarak işaretle
    const { error: basvuruHata } = await supabase
      .from("oyuncu_basvurulari")
      .update({ durum: "onaylandi" })
      .eq("id", b.id);

    if (basvuruHata) {
      alert(basvuruHata.message);
      return;
    }

    alert(mevcutOyuncu ? "Oyuncu bilgileri (Fotoğraf vs.) güncellendi." : "Yeni oyuncu takıma eklendi.");
    getir();
  }

  async function reddet(id: number) {
    const { error } = await supabase
      .from("oyuncu_basvurulari")
      .update({
        durum: "reddedildi",
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    getir();
  }
    return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: "90px 15px 30px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 25,
        }}
      >
        👤 OYUNCU BAŞVURULARI
      </h1>

      {basvurular.length === 0 && (
        <div
          style={{
            color: "#aaa",
            textAlign: "center",
          }}
        >
          Henüz başvuru yok.
        </div>
      )}

      {basvurular.map((b) => (
        <div
          key={b.id}
          style={{
            background: "#151515",
            borderRadius: 18,
            padding: 18,
            marginBottom: 15,
            border: "1px solid rgba(212,175,55,.25)",
          }}
        >
          <h2
            style={{
              color: "#fff",
              margin: 0,
            }}
          >
            👤 {b.ad_soyad}
          </h2>

          <p style={yazi}>📞 {b.telefon}</p>
          <p style={yazi}>🛡️ Takım: {b.takim}</p>
          <p style={yazi}>⚽ Mevki: {b.mevki}</p>
          <p style={yazi}>👕 Forma No: {b.forma_no}</p>

          <p
            style={{
              color:
                b.durum === "onaylandi"
                  ? "#00ff88"
                  : b.durum === "reddedildi"
                  ? "#d4af37"
                  : "#ffc107",
              fontWeight: 800,
            }}
          >
            Durum : {b.durum}
          </p>

          {b.durum === "beklemede" && (
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 15,
              }}
            >
              <button
                onClick={() => onayla(b)}
                style={onay}
              >
                ✅ ONAYLA
              </button>

              <button
                onClick={() => reddet(b.id)}
                style={red}
              >
                ❌ REDDET
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const yazi = {
  color: "#bbb",
  margin: "8px 0",
};

const onay = {
  flex: 1,
  height: 45,
  border: "none",
  borderRadius: 10,
  background: "#00a86b",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const red = {
  flex: 1,
  height: 45,
  border: "none",
  borderRadius: 10,
  background: "#d4af37",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};
