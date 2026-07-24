"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  tarih: string | null;
  saat: string | null;
  saha: string | null;
};

export default function FiksturAdminPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);

  useEffect(() => {
    maclariGetir();
  }, []);

  async function maclariGetir() {
    const { data, error } = await supabase
      .from("maclar")
      .select("*")
      .order("hafta", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMaclar(data || []);
  }

  async function kaydet(
  id: number,
  tarih: string,
  saat: string,
  saha: string
) {
  const { error } = await supabase
    .from("maclar")
    .update({
      tarih,
      saat,
      saha,
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("✅ Kaydedildi");
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: "90px 15px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ff3131",
          fontWeight: 900,
          marginBottom: 30,
        }}
      >
        📅 FİKSTÜR DÜZENLE
      </h1>

      {maclar.map((mac) => (
        <div
          key={mac.id}
          style={{
            background: "#151515",
            borderRadius: 15,
            padding: 20,
            marginBottom: 15,
          }}
        >
          <h3 style={{ textAlign: "center" }}>
            {mac.hafta}. Hafta
          </h3>

          <p style={{ textAlign: "center", fontWeight: 800 }}>
            {mac.ev_sahibi}
            <br />
            🆚
            <br />
            {mac.deplasman}
          </p>

          <input
  placeholder="📅 Tarih"
  defaultValue={mac.tarih || ""}
  id={`tarih-${mac.id}`}
  style={{
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  }}
/>

          <input
  placeholder="⏰ Saat"
  defaultValue={mac.saat || ""}
  id={`saat-${mac.id}`}
  style={{
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  }}
/>

          <input
  placeholder="🏟 Saha"
  defaultValue={mac.saha || ""}
  id={`saha-${mac.id}`}
  style={{
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  }}
/>
<button
  onClick={() => {
    const tarih = (
      document.getElementById(`tarih-${mac.id}`) as HTMLInputElement
    ).value;

    const saat = (
      document.getElementById(`saat-${mac.id}`) as HTMLInputElement
    ).value;

    const saha = (
      document.getElementById(`saha-${mac.id}`) as HTMLInputElement
    ).value;

    kaydet(mac.id, tarih, saat, saha);
  }}
  style={{
    width: "100%",
    padding: 12,
    background: "#ff3131",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 800,
    marginTop: 10,
  }}
>
  💾 Kaydet
</button>
        </div>
      ))}
    </div>
  );
}