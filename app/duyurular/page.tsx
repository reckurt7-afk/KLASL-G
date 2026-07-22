"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Duyuru = {
  id: number;
  baslik: string;
  aciklama: string;
  renk: string;
  aktif: boolean;
  created_at: string;
};

export default function DuyurularPage() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);

  useEffect(() => {
    getir();
  }, []);

  async function getir() {
    const { data, error } = await supabase
      .from("duyurular")
      .select("*")
      .eq("aktif", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDuyurular(data);
    }
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
          fontSize: 32,
          fontWeight: 900,
          marginBottom: 30,
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
        {duyurular.length === 0 && (
          <div
            style={{
              color: "#999",
              textAlign: "center",
            }}
          >
            Henüz duyuru bulunmuyor.
          </div>
        )}

        {duyurular.map((duyuru) => (
          <div
            key={duyuru.id}
            style={{
              background: "#171717",
              borderLeft: `6px solid ${duyuru.renk || "#ff3131"}`,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h2
              style={{
                color: "#fff",
                marginBottom: 10,
              }}
            >
              {duyuru.baslik}
            </h2>

            <div
              style={{
                color: "#888",
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              {new Date(duyuru.created_at).toLocaleDateString("tr-TR")}
            </div>

            <p
              style={{
                color: "#ddd",
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {duyuru.aciklama}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}