"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Duyuru = {
  id: number;
  baslik: string;
  icerik: string;
  created_at: string;
};

export default function DuyurularPage() {
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
          fontSize: 32,
          fontWeight: 900,
        }}
      >
        📢 Duyurular
      </h1>

      <div
        style={{
          maxWidth: 700,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {duyurular.map((duyuru) => (
          <div
            key={duyuru.id}
            style={{
              background: "#171717",
              border: "1px solid rgba(255,49,49,.25)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <h2
              style={{
                color: "#fff",
                margin: 0,
                marginBottom: 10,
              }}
            >
              {duyuru.baslik}
            </h2>

            <div
              style={{
                color: "#999",
                fontSize: 13,
                marginBottom: 15,
              }}
            >
              {new Date(duyuru.created_at).toLocaleDateString("tr-TR")}
            </div>

            <p
              style={{
                color: "#ddd",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {duyuru.icerik}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}