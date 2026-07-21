"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
 
  const [time, setTime] = useState({
    gun: 0,
    saat: 0,
    dakika: 0,
    saniye: 0,
  });

 useEffect(() => {
  const hedef = new Date("2026-07-25T21:00:00");

  const guncelle = () => {
    const simdi = new Date();
    const fark = hedef.getTime() - simdi.getTime();

    if (fark <= 0) {
      setTime({
        gun: 0,
        saat: 0,
        dakika: 0,
        saniye: 0,
      });
      return;
    }

    setTime({
      gun: Math.floor(fark / (1000 * 60 * 60 * 24)),
      saat: Math.floor((fark / (1000 * 60 * 60)) % 24),
      dakika: Math.floor((fark / (1000 * 60)) % 60),
      saniye: Math.floor((fark / 1000) % 60),
    });
  };

  guncelle(); // İlk açılışta hemen çalıştır

  const interval = setInterval(guncelle, 1000);

  return () => clearInterval(interval);
}, []);
return (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 12,
      width: "100%",
    }}
  >
    {[
      { value: time.gun, label: "GÜN" },
      { value: time.saat, label: "SAAT" },
      { value: time.dakika, label: "DAKİKA" },
      { value: time.saniye, label: "SANİYE" },
    ].map((item) => (
      <div
        key={item.label}
        style={{
          background: "rgba(20,20,20,.75)",
          border: "1px solid rgba(255,49,49,.35)",
          borderRadius: 16,
          padding: "14px 8px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 900,
          }}
        >
          {String(item.value).padStart(2, "0")}
        </div>

        <div
          style={{
            color: "#ff3131",
            fontSize: 12,
            fontWeight: 700,
            marginTop: 6,
          }}
        >
          {item.label}
        </div>
      </div>
    ))}
  </div>
);
}