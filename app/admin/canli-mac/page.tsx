"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number;
  dep_skor: number;
  dakika: number;
  durum: string;
  canli: boolean;
};

export default function CanliMacPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [seciliMac, setSeciliMac] = useState<Mac | null>(null);

  useEffect(() => {
    maclariGetir();
  }, []);
async function canliDurumGuncelle(canli: boolean) {
  if (!seciliMac) return;

  const { error } = await supabase
    .from("maclar")
    .update({
      canli: canli,
      durum: canli ? "Canlı" : "Bekliyor",
    })
    .eq("id", seciliMac.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert(
    canli
      ? "🔴 Maç canlı başlatıldı"
      : "⛔ Canlı maç kapatıldı"
  );

  maclariGetir();

  setSeciliMac({
    ...seciliMac,
    canli,
    durum: canli ? "Canlı" : "Bekliyor",
  });
}
  async function maclariGetir() {
    const { data, error } = await supabase
      .from("maclar")
      .select("*")
      .order("hafta", { ascending: true });
console.log(data);
    if (error) {
      alert(error.message);
      return;
    }

    setMaclar(data || []);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: "90px 20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
          color: "#ff3131",
          fontWeight: 900,
        }}
      >
        🔴 CANLI MAÇ YÖNETİMİ
      </h1>

      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#151515",
          padding: 20,
          borderRadius: 15,
          border: "1px solid #333",
        }}
      >
        <div
          style={{
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          Maç Seç
        </div>

        <select
          style={{
            width: "100%",
            height: 50,
            background: "#222",
            color: "#fff",
            borderRadius: 10,
            padding: "0 15px",
            border: "1px solid #444",
          }}
          value={seciliMac?.id || ""}
          onChange={(e) => {
            const mac = maclar.find(
              (m) => m.id === Number(e.target.value)
            );

            setSeciliMac(mac || null);
          }}
        >
          <option value="">Maç Seçiniz</option>

          {maclar.map((m) => (
            <option key={m.id} value={m.id}>
              {m.hafta}. Hafta | {m.ev_sahibi} - {m.deplasman}
            </option>
          ))}
        </select>

        {seciliMac && (
          <div
            style={{
              marginTop: 30,
              background: "#1c1c1c",
              borderRadius: 15,
              padding: 20,
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {seciliMac.ev_sahibi}
              <br />
              🆚
              <br />
              {seciliMac.deplasman}
            </h2>
            <div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 25,
  }}
>
  <button
    onClick={() => canliDurumGuncelle(true)}
    style={{
      flex: 1,
      height: 50,
      background: "#ff3131",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    🔴 Canlı Başlat
  </button>

  <button
    onClick={() => canliDurumGuncelle(false)}
    style={{
      flex: 1,
      height: 50,
      background: "#444",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    ⛔ Canlıyı Bitir
  </button>
</div>
          </div>
        )}
      </div>
    </div>
  );
}