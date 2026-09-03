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

  // Listeyi yeniden yükle
  maclariGetir();
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
          color: "#ceaa52",
          fontWeight: 900,
          marginBottom: 30,
        }}
      >
        📅 FİKSTÜR DÜZENLE
      </h1>

      {/* Yeni Maç Ekle Alanı */}
      <div
        style={{
          background: "#151515",
          borderRadius: 15,
          padding: 20,
          marginBottom: 30,
          border: "1px solid #333"
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: 15, color: "#fff" }}>
          ➕ YENİ MAÇ EKLE
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            id="yeni-hafta"
            type="number"
            placeholder="Hafta (Örn: 3)"
            style={{ width: "100%", padding: 12, borderRadius: 10 }}
          />
          <input
            id="yeni-ev"
            placeholder="Ev Sahibi Takım"
            style={{ width: "100%", padding: 12, borderRadius: 10 }}
          />
          <input
            id="yeni-dep"
            placeholder="Deplasman Takımı"
            style={{ width: "100%", padding: 12, borderRadius: 10 }}
          />
          <button
            onClick={async () => {
              const hafta = (document.getElementById("yeni-hafta") as HTMLInputElement).value;
              const ev = (document.getElementById("yeni-ev") as HTMLInputElement).value;
              const dep = (document.getElementById("yeni-dep") as HTMLInputElement).value;

              if (!hafta || !ev || !dep) {
                alert("Lütfen hafta ve takım isimlerini doldurun.");
                return;
              }

              const { error } = await supabase.from("maclar").insert([
                {
                  hafta: Number(hafta),
                  ev_sahibi: ev,
                  deplasman: dep,
                  tarih: "",
                  saat: "",
                  saha: ""
                }
              ]);

              if (error) {
                alert(error.message);
                return;
              }

              alert("✅ Maç Başarıyla Eklendi!");
              (document.getElementById("yeni-ev") as HTMLInputElement).value = "";
              (document.getElementById("yeni-dep") as HTMLInputElement).value = "";
              maclariGetir();
            }}
            style={{
              width: "100%",
              padding: 12,
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              marginTop: 5,
            }}
          >
            Ekle
          </button>
        </div>
      </div>

      {maclar.map((mac) => (
        <div
          key={mac.id}
          style={{
            background: "#151515",
            borderRadius: 15,
            padding: 20,
            marginBottom: 15,
            position: "relative"
          }}
        >
          <button
            onClick={async () => {
              if(confirm("Bu maçı silmek istediğinize emin misiniz?")) {
                await supabase.from("maclar").delete().eq("id", mac.id);
                maclariGetir();
              }
            }}
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 5,
              padding: "5px 10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Sil
          </button>

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
              background: "#ceaa52",
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