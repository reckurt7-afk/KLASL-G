"use client";

import { useState } from "react";
import Image from "next/image";
const logolar: Record<string, string> = {
  "Dinamo Nalbantoğlu": "/logos/dinamo-nalbantoglu.png",
  "Krokodilla FK": "/logos/krokodilla-fc.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "Yeşil Bursa FC": "/logos/yesil-bursa-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "Gravyer FC": "/logos/gravyer-fc.png",
  "Yediyol Black FC": "/logos/yediyol-black-fc.png",
  "Dündar Köyü": "/logos/dundar-koyu.png",
  "Alaçam Spor": "/logos/alacam-spor.png",
  "ALAÇAM SPOR": "/logos/alacam-spor.png",
};
const haftalar = [
  {
    hafta: "1. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Krokodilla FK"],
      ["Yeşil Bursa FC", "BİSKREM FC"],
      ["Dündar Köyü", "Gravyer FC"],
      ["Yediyol Black FC", "Alaçam Spor"],
    ],
  },
  {
    hafta: "2. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "BİSKREM FC"],
      ["Krokodilla FK", "Gravyer FC"],
      ["Yeşil Bursa FC", "Alaçam Spor"],
      ["Dündar Köyü", "Yediyol Black FC"],
    ],
  },
  {
    hafta: "3. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Gravyer FC"],
      ["BİSKREM FC", "Alaçam Spor"],
      ["Krokodilla FK", "Yediyol Black FC"],
      ["Yeşil Bursa FC", "Dündar Köyü"],
    ],
  },
  {
    hafta: "4. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Alaçam Spor"],
      ["Gravyer FC", "Yediyol Black FC"],
      ["BİSKREM FC", "Dündar Köyü"],
      ["Krokodilla FK", "Yeşil Bursa FC"],
    ],
  },
  {
    hafta: "5. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Yediyol Black FC"],
      ["Alaçam Spor", "Dündar Köyü"],
      ["Gravyer FC", "Yeşil Bursa FC"],
      ["BİSKREM FC", "Krokodilla FK"],
    ],
  },
  {
    hafta: "6. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Dündar Köyü"],
      ["Yediyol Black FC", "Yeşil Bursa FC"],
      ["Alaçam Spor", "Krokodilla FK"],
      ["Gravyer FC", "BİSKREM FC"],
    ],
  },
  {
    hafta: "7. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Yeşil Bursa FC"],
      ["Dündar Köyü", "Krokodilla FK"],
      ["Yediyol Black FC", "BİSKREM FC"],
      ["Alaçam Spor", "Gravyer FC"],
    ],
  },
];

export default function FiksturPage() {
  const [aktifHafta, setAktifHafta] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: "90px 15px 20px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 20,
        }}
      >
        📅 FİKSTÜR
      </h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          marginBottom: 25,
          paddingBottom: 5,
        }}
      >
        {haftalar.map((_, i) => (
          <button
            key={i}
            onClick={() => setAktifHafta(i)}
            style={{
              minWidth: 46,
              height: 46,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: aktifHafta === i ? "#ff3131" : "#1c1c1c",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <h2
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {haftalar[aktifHafta].hafta}
      </h2>

      {haftalar[aktifHafta].maclar.map((mac, index) => (
  <div
    key={index}
    style={{
      background: "#151515",
      border: "1px solid rgba(255,49,49,.25)",
      borderRadius: 18,
      padding: "16px",
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {/* Sol Takım */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "42%",
      }}
    >
      <Image
        src={logolar[mac[0]]}
        alt={mac[0]}
        width={40}
        height={40}
      />

      <span
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {mac[0]}
      </span>
    </div>

    {/* VS */}
    <div
      style={{
        color: "#ff3131",
        fontWeight: 900,
        fontSize: 22,
      }}
    >
      VS
    </div>

    {/* Sağ Takım */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        width: "42%",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          textAlign: "right",
        }}
      >
        {mac[1]}
      </span>

      <Image
        src={logolar[mac[1]]}
        alt={mac[1]}
        width={40}
        height={40}
      />
    </div>
  </div>
))}
    </div>
  );
}