"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  mevki: string;
  forma_no: number;
};

const takimBilgileri: Record<
  string,
  {
    ad: string;
    logo: string;
  }
> = {
  "alacam-spor": {
    ad: "ALAÇAM SPOR",
    logo: "/logos/alacam-spor.png",
  },
  "dinamo-nalbantoglu": {
    ad: "DİNAMO NALBANTOĞLU",
    logo: "/logos/dinamo-nalbantoglu.png",
  },
  "krokodilla-fc": {
    ad: "KROKODİLLA FC",
    logo: "/logos/krokodilla-fc.png",
  },
  "dundar-koyu": {
    ad: "DÜNDAR KÖYÜ",
    logo: "/logos/dundar-koyu.png",
  },
  "yesil-bursa-fc": {
    ad: "YEŞİL BURSA FC",
    logo: "/logos/yesil-bursa-fc.png",
  },
  "yediyol-black-fc": {
    ad: "YEDİYOL BLACK FC",
    logo: "/logos/yediyol-black-fc.png",
  },
  "gravyer-fc": {
    ad: "GRAVYER FC",
    logo: "/logos/gravyer-fc.png",
  },
  "biskrem-fc": {
    ad: "BİSKREM FC",
    logo: "/logos/biskrem-fc.png",
  },
};

const kartStyle = {
  background: "rgba(20,20,20,.78)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,215,0,.15)",
  borderRadius: 20,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,.35)",
} as const;
export default function TakimDetayPage() {
  const params = useParams();
  const slug = params.slug as string;

  const takim = takimBilgileri[slug];

  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);

  useEffect(() => {
   if (takim) getir();
}, [takim]);

async function getir() {
    const { data } = await supabase
      .from("oyuncular")
      .select("*")
      .eq("takim", takim.ad)
      .order("forma_no");

    setOyuncular(data || []);
  }

  if (!takim) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0b0b",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        Takım bulunamadı.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/stadium.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "90px 15px 30px",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,.72)",
          minHeight: "100vh",
          padding: 15,
          borderRadius: 20,
        }}
>
            <div style={kartStyle}>
        <div
          style={{
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Büyük şeffaf logo */}
          <Image
            src={takim.logo}
            alt={takim.ad}
            width={240}
            height={240}
            style={{
              position: "absolute",
              right: -30,
              top: -20,
              opacity: 0.06,
            }}
          />

          <Image
            src={takim.logo}
            alt={takim.ad}
            width={130}
            height={130}
            style={{
              filter: "drop-shadow(0 0 20px rgba(255,215,0,.4))",
            }}
          />

          <h1
            style={{
              color: "#fff",
              fontSize: 32,
              marginTop: 20,
              marginBottom: 8,
              fontWeight: 900,
            }}
          >
            {takim.ad}
          </h1>

          <div
            style={{
              color: "#FFD700",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            👥 {oyuncular.length} Oyuncu
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div
              style={{
                background: "#181818",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div style={{ fontSize: 28 }}>👥</div>
              <div style={{ color: "#888" }}>Oyuncu</div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 26,
                }}
              >
                {oyuncular.length}
              </div>
            </div>

            <div
              style={{
                background: "#181818",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <div style={{ fontSize: 28 }}>🛡️</div>
              <div style={{ color: "#888" }}>Takım</div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 16,
                }}
              >
                {takim.ad}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />

      {oyuncular.length === 0 && (
        <div
          style={{
            color: "#aaa",
            textAlign: "center",
            marginTop: 30,
          }}
        >
          Henüz oyuncu bulunmuyor.
        </div>
      )}
            {oyuncular.map((o) => (
        <div
          key={o.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(20,20,20,.78)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,215,0,.12)",
            borderRadius: 20,
            padding: 18,
            marginBottom: 15,
            boxShadow: "0 10px 30px rgba(0,0,0,.35)",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#ff3131",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {o.forma_no}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              {o.ad_soyad}
            </div>

            <div
              style={{
                color: "#FFD700",
                marginTop: 6,
                fontWeight: 700,
              }}
            >
              ⚽ {o.mevki}
            </div>
          </div>

          <div
            style={{
              color: "#666",
              fontSize: 28,
            }}
          >
            ›
          </div>
        </div>
      ))}
    </div>
  </div>
);
}