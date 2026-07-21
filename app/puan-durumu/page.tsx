"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Takim = {
  id: number;
  ad: string;
  logo: string;
  oynanan: number;
  galibiyet: number;
  beraberlik: number;
  maglubiyet: number;
  averaj: number;
  puan: number;
};

export default function PuanDurumuPage() {
  const [takimlar, setTakimlar] = useState<Takim[]>([]);
async function getir() {
  useEffect(() => {
    getir();
  }, []);

  
  
  const { data, error } = await supabase
    .from("takimlar")
    .select("*")
    .order("puan", { ascending: false })
    .order("averaj", { ascending: false });

  console.log(data);

  if (error) {
    alert(error.message);
    return;
  }

  setTakimlar(data || []);
}


  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/stadium.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: "rgba(0,0,0,.82)",
          padding: "90px 12px 20px",
        }}
      >
      <div
  style={{
    background: "rgba(25,25,25,.65)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,215,0,.15)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    textAlign: "center",
  }}
>
  <h1
    style={{
      color: "#fff",
      fontSize: 30,
      fontWeight: 900,
      margin: 0,
    }}
  >
    🏆 PUAN DURUMU
  </h1>

  <div
    style={{
      color: "#FFD700",
      marginTop: 8,
      fontSize: 12,
      letterSpacing: 5,
      fontWeight: 700,
    }}
  >
    KLAS LİG BURSA
  </div>
</div>

        {/* Başlık */}
        <div
          style={{
            display: "grid",
           gridTemplateColumns: "24px 2fr 24px 24px 24px 24px 30px 24px",
            gap: 4,
            background: "rgba(25,25,25,.65)",
backdropFilter: "blur(18px)",
border: "1px solid rgba(255,215,0,.15)",
            color: "#ff3131",
            fontWeight: 800,
            fontSize: 12,
            padding: "10px 8px",
            borderRadius: 12,
            marginBottom: 10,
          }}
        >
          <div>S</div>
          <div>TAKIM</div>
          <div>O</div>
          <div>G</div>
          <div>B</div>
          <div>M</div>
          <div>AV</div>
          <div>P</div>
        </div>

        {takimlar.map((t, i) => (
          <div
            key={t.ad}
            style={{
              display: "grid",
              gridTemplateColumns: "30px 1fr 26px 26px 26px 26px 34px 26px",
              gap: 4,
              alignItems: "center",
             background: "rgba(25,25,25,.65)",
backdropFilter: "blur(18px)",
border: "1px solid rgba(255,215,0,.15)",
boxShadow: "0 10px 30px rgba(0,0,0,.4)",
              color: "#fff",
              padding: "10px 8px",
              borderRadius: 12,
              marginBottom: 8,
              borderLeft:
                i < 2 ? "5px solid #16a34a" : "5px solid transparent",
            }}
          >
            <div
  style={{
    fontWeight: 900,
    fontSize: 24,
    textAlign: "center",
  }}
>
 {i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
</div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 0,
              }}
            >
              <Image
                src={t.logo}
                alt={t.ad}
                width={36}
height={42}
style={{
  borderRadius: "50%",
  border: "2px solid rgba(255,215,0,.4)",
}}
              />

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                 
                }}
              >
             <>
  {t.ad}
  {i === 0 && (
    <span style={{ marginLeft: 6 }}>👑</span>
  )}
</>
              </span>
            </div>
<div>{t.oynanan}</div>
<div>{t.galibiyet}</div>
<div>{t.beraberlik}</div>
<div>{t.maglubiyet}</div>
<div>{t.averaj}</div>
<div style={{ fontWeight: 800 }}>{t.puan}</div>
            
          </div>
        ))}
      </div>
    </div>
  );
}