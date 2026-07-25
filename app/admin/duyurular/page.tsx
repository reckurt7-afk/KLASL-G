"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Duyuru = {
  id: number;
  baslik: string;
  aciklama: string;
  created_at: string;
};

export default function AdminDuyurularPage() {
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [loading, setLoading] = useState(false);
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);

  useEffect(() => {
    getir();
  }, []);

  async function getir() {
    const { data } = await supabase
      .from("duyurular")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setDuyurular(data);
  }

  async function yayinla() {
    if (!baslik || !aciklama) {
      alert("Tüm alanları doldurun.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("duyurular").insert({
      baslik,
      aciklama,
      aktif: true,
      renk: "#ff3131",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setBaslik("");
    setAciklama("");
await fetch("/api/send-notification", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    baslik,
    mesaj: aciklama,
  }),
});
    alert("✅ Duyuru yayınlandı.");

    getir();
  }

  async function sil(id: number) {
    if (!confirm("Bu duyuru silinsin mi?")) return;

    const { error } = await supabase
      .from("duyurular")
      .delete()
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
        padding: "90px 20px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        📢 Duyuru Yönetimi
      </h1>

      <div
        style={{
          maxWidth: 650,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <input
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="Başlık"
        />

        <textarea
          rows={8}
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          placeholder="Duyuru"
        />

        <button onClick={yayinla} disabled={loading}>
          {loading ? "Yayınlanıyor..." : "🚀 Yayınla"}
        </button>

        <hr />

        <h2 style={{ color: "#fff" }}>Yayınlanan Duyurular</h2>

        {duyurular.map((duyuru) => (
          <div
            key={duyuru.id}
            style={{
              background: "#171717",
              borderRadius: 12,
              padding: 15,
              color: "#fff",
              marginBottom: 12,
            }}
          >
            <h3>{duyuru.baslik}</h3>

            <p>{duyuru.aciklama}</p>

            <button
              onClick={() => sil(duyuru.id)}
              style={{
                background: "#ff3131",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              🗑️ Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}