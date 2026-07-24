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

export default function MacSaatleriPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);

  useEffect(() => {
    maclariGetir();
  }, []);

  async function maclariGetir() {
    const { data, error } = await supabase
      .from("maclar")
      .select("id,hafta,ev_sahibi,deplasman,tarih,saat,saha")
      .order("hafta", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMaclar(data || []);
  }

  const haftalar = [...new Set(maclar.map((m) => m.hafta))];

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
          textAlign: "center",
          color: "#fff",
          marginBottom: 30,
        }}
      >
        ⏰ MAÇ SAATLERİ
      </h1>

      {haftalar.map((hafta) => (
        <div key={hafta}>
          <h2
            style={{
              color: "#ff3131",
              marginBottom: 15,
            }}
          >
            {hafta}. HAFTA
          </h2>

          {maclar
            .filter((m) => m.hafta === hafta)
            .map((mac) => (
              <div
                key={mac.id}
                style={{
                  background: "#151515",
                  borderRadius: 15,
                  padding: 18,
                  marginBottom: 15,
                  border: "1px solid #333",
                }}
              >
                <div style={{ color: "#fff", marginBottom: 8 }}>
                  🏟 {mac.saha || "Saha Belirlenmedi"}
                </div>

                <div style={{ color: "#fff", marginBottom: 8 }}>
                  📅 {mac.tarih || "Tarih Belirlenmedi"}
                </div>

                <div style={{ color: "#fff", marginBottom: 15 }}>
                  ⏰ {mac.saat || "Saat Belirlenmedi"}
                </div>

                <div
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  {mac.ev_sahibi}
                  <br />
                  <span
                    style={{
                      color: "#ff3131",
                      fontSize: 22,
                    }}
                  >
                    VS
                  </span>
                  <br />
                  {mac.deplasman}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}