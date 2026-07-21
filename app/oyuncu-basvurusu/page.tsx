"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const takimlar = [
  "ALAÇAM SPOR",
  "DİNAMO NALBANTOĞLU",
  "KROKODİLLA FC",
  "DÜNDAR KÖYÜ",
  "YEŞİL BURSA FC",
  "YEDİYOL BLACK FC",
  "GRAVYER FC",
  "BİSKREM FC",
];

export default function OyuncuBasvurusuPage() {
  const [form, setForm] = useState({
    ad_soyad: "",
    telefon: "",
    dogum_tarihi: "",
    takim: "",
    mevki: "",
    forma_no: "",
    aciklama: "",
  });

  async function gonder() {
   const { data, error } = await supabase
  .from("oyuncu_basvurulari")
  .insert({
    ...form,
    forma_no: Number(form.forma_no),
  })
  .select();

console.log("DATA:", data);
console.log("ERROR:", error);

if (error) {
  console.error(error);
  alert(JSON.stringify(error, null, 2));
  return;
}

    alert("✅ Başvurunuz alındı. Onay bekleniyor.");

    setForm({
      ad_soyad: "",
      telefon: "",
      dogum_tarihi: "",
      takim: "",
      mevki: "",
      forma_no: "",
      aciklama: "",
    });
  }

  function degistir(
    alan: string,
    deger: string
  ) {
    setForm({
      ...form,
      [alan]: deger,
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: "90px 20px 30px",
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
        👤 OYUNCU BAŞVURUSU
      </h1>

      <div
        style={{
          maxWidth: 430,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <input
          placeholder="Ad Soyad"
          style={input}
          value={form.ad_soyad}
          onChange={(e) =>
            degistir("ad_soyad", e.target.value)
          }
        />

        <input
          placeholder="Telefon"
          style={input}
          value={form.telefon}
          onChange={(e) =>
            degistir("telefon", e.target.value)
          }
        />

        <input
          type="date"
          style={input}
          value={form.dogum_tarihi}
          onChange={(e) =>
            degistir("dogum_tarihi", e.target.value)
          }
        />

        <select
          style={input}
          value={form.takim}
          onChange={(e) =>
            degistir("takim", e.target.value)
          }
        >
          <option value="">
            Takım Seç
          </option>

          {takimlar.map((t) => (
            <option key={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          style={input}
          value={form.mevki}
          onChange={(e) =>
            degistir("mevki", e.target.value)
          }
        >
          <option value="">
            Mevki Seç
          </option>
          <option>Kaleci</option>
          <option>Defans</option>
          <option>Orta Saha</option>
          <option>Forvet</option>
        </select>

        <input
          placeholder="Forma No"
          style={input}
          value={form.forma_no}
          onChange={(e) =>
            degistir("forma_no", e.target.value)
          }
        />

        <textarea
          placeholder="Kendini tanıt..."
          style={{
            ...input,
            height: 100,
          }}
          value={form.aciklama}
          onChange={(e) =>
            degistir("aciklama", e.target.value)
          }
        />

        <button
          onClick={gonder}
          style={{
            height: 55,
            background: "#ff3131",
            border: "none",
            borderRadius: 14,
            color: "#fff",
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          BAŞVURU GÖNDER
        </button>
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  height: 52,
  background: "#151515",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 12,
  padding: "0 15px",
  fontSize: 16,
} as const;