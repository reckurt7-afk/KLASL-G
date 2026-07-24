"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BildirimPage() {
  const [baslik, setBaslik] = useState("");
  const [mesaj, setMesaj] = useState("");

  const gonder = async () => {
    if (!baslik || !mesaj) {
      alert("Başlık ve mesaj giriniz.");
      return;
    }

    const { error } = await supabase.from("bildirimler").insert([
      {
        baslik,
        mesaj,
        tip: "genel",
      },
    ]);

    if (error) {
      alert("Hata: " + error.message);
      return;
    }

    try {
      const response = await fetch("/api/send-notification", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    baslik,
    mesaj,
  }),
});
      const sonuc = await response.json();
alert(JSON.stringify(sonuc));
      if (!response.ok) {
        alert("Bildirim gönderilemedi: " + sonuc.error);
        return;
      }

      alert(`🔔 Bildirim gönderildi! (${sonuc.gonderilen} cihaz)`);

      setBaslik("");
      setMesaj("");
    } catch (err) {
      console.error(err);
      alert("Sunucuya bağlanırken hata oluştu.");
    }
  };

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
          fontSize: 30,
          fontWeight: 900,
        }}
      >
        🔔 BİLDİRİM GÖNDER
      </h1>

      <div
        style={{
          maxWidth: 450,
          margin: "40px auto",
          background: "#151515",
          padding: 25,
          borderRadius: 20,
          border: "1px solid rgba(255,49,49,.3)",
        }}
      >
        <input
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="Bildirim başlığı"
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 12,
            border: "none",
            marginBottom: 15,
          }}
        />

        <textarea
          value={mesaj}
          onChange={(e) => setMesaj(e.target.value)}
          placeholder="Bildirim mesajı"
          rows={5}
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 12,
            border: "none",
            marginBottom: 15,
          }}
        />

        <button
          onClick={gonder}
          style={{
            width: "100%",
            height: 55,
            border: "none",
            borderRadius: 999,
            background: "#ff3131",
            color: "#fff",
            fontSize: 18,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          🔔 GÖNDER
        </button>
      </div>
    </div>
  );
}