"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDuyurularPage() {
  const [baslik, setBaslik] = useState("");
  const [icerik, setIcerik] = useState("");
  const [loading, setLoading] = useState(false);

  async function yayinla() {
    if (!baslik.trim() || !icerik.trim()) {
      alert("Başlık ve duyuru metni boş olamaz.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("duyurular").insert([
      {
        baslik,
        icerik,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Duyuru başarıyla yayınlandı.");

    setBaslik("");
    setIcerik("");
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
          marginBottom: 35,
          fontSize: 30,
          fontWeight: 900,
        }}
      >
        📢 Duyuru Yayınla
      </h1>

      <div
        style={{
          maxWidth: 650,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <input
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="Duyuru Başlığı"
          style={{
            height: 55,
            borderRadius: 12,
            border: "1px solid #333",
            background: "#171717",
            color: "#fff",
            padding: "0 15px",
            fontSize: 17,
          }}
        />

        <textarea
          value={icerik}
          onChange={(e) => setIcerik(e.target.value)}
          placeholder="Duyuru Metni"
          rows={8}
          style={{
            borderRadius: 12,
            border: "1px solid #333",
            background: "#171717",
            color: "#fff",
            padding: 15,
            fontSize: 16,
            resize: "vertical",
          }}
        />

        <button
          onClick={yayinla}
          disabled={loading}
          style={{
            height: 58,
            border: "none",
            borderRadius: 12,
            background: "#ff3131",
            color: "#fff",
            fontWeight: 900,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {loading ? "Yayınlanıyor..." : "🚀 Yayınla"}
        </button>
      </div>
    </div>
  );
}