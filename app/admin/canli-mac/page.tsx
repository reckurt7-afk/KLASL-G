"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number;
  dep_skor: number;
  dakika: number;
  durum: string;
  canli: boolean;
  hakem: string;
  youtube_link: string;
};

export default function CanliMacPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [seciliMac, setSeciliMac] = useState<Mac | null>(null);

  useEffect(() => {
    maclariGetir();
  }, []);
useEffect(() => {
  if (!seciliMac?.canli) return;

  const interval = setInterval(async () => {
    if (!seciliMac) return;

    const { data } = await supabase
  .from("maclar")
  .select("dakika")
  .eq("id", seciliMac.id)
  .single();

if (!data) return;

const yeniDakika = data.dakika + 1;

await macGuncelle("dakika", yeniDakika);

    // İlk yarı bitti
    if (yeniDakika === 25) {
      await macGuncelle("dakika", 25);
      clearInterval(interval);
      alert("⏸️ DEVRE ARASI");
      return;
    }

    // Maç bitti
    if (yeniDakika === 50) {
      await macGuncelle("dakika", 50);
      clearInterval(interval);
      await canliDurumGuncelle(false);
      alert("🏁 MAÇ SONA ERDİ");
      return;
    }

    await macGuncelle("dakika", yeniDakika);
  }, 60000);

  return () => clearInterval(interval);
}, [seciliMac]);
  async function maclariGetir() {
    const { data, error } = await supabase
      .from("maclar")
      .select("*")
      .order("hafta", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setMaclar(data || []);
  }

  async function macGuncelle(alan: keyof Mac, deger: any) {
    if (!seciliMac) return;

    const { error } = await supabase
      .from("maclar")
      .update({
        [alan]: deger,
      })
      .eq("id", seciliMac.id);

    if (error) {
      alert(error.message);
      return;
    }

    setSeciliMac({
      ...seciliMac,
      [alan]: deger,
    });
  }

  async function canliDurumGuncelle(canli: boolean) {
    if (!seciliMac) return;

    // Önce tüm maçları kapat
    if (canli) {
      await supabase
        .from("maclar")
        .update({
          canli: false,
          durum: "Bekliyor",
        })
        .neq("id", 0);
    }

    // Seçilen maçı güncelle
    const { error } = await supabase
      .from("maclar")
      .update({
        canli: canli,
        durum: canli ? "Canlı" : "Bekliyor",
      })
      .eq("id", seciliMac.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (canli) {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baslik: "▶️ MAÇ BAŞLADI!",
          mesaj: `${seciliMac.ev_sahibi} ile ${seciliMac.deplasman} arasındaki zorlu mücadele başladı!`,
        }),
      });
    }

    setSeciliMac({
      ...seciliMac,
      canli: canli,
      durum: canli ? "Canlı" : "Bekliyor",
    });

    maclariGetir();
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: "90px 20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ff3131",
          marginBottom: 30,
          fontWeight: 900,
        }}
      >
        🔴 CANLI MAÇ YÖNETİMİ
      </h1>
            <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          background: "#151515",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <select
          value={seciliMac?.id || ""}
          onChange={(e) => {
            const mac = maclar.find((m) => m.id === Number(e.target.value));
            setSeciliMac(mac || null);
          }}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 10,
            background: "#222",
            color: "#fff",
            padding: "0 15px",
          }}
        >
          <option value="">Maç Seçiniz</option>

          {maclar.map((m) => (
            <option key={m.id} value={m.id}>
              {m.hafta}. Hafta | {m.ev_sahibi} - {m.deplasman}
            </option>
          ))}
        </select>

        {seciliMac && (
          <>
            <h2
              style={{
                textAlign: "center",
                marginTop: 30,
                marginBottom: 25,
              }}
            >
              {seciliMac.ev_sahibi}
              <br />
              🆚
              <br />
              {seciliMac.deplasman}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                textAlign: "center",
                gap: 20,
              }}
            >
              <div>
                <button
                  onClick={async () => {
                    const yeniSkor = Math.max(0, seciliMac.ev_skor - 1);
                    if (yeniSkor < seciliMac.ev_skor) {
                      await macGuncelle("ev_skor", yeniSkor);
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          baslik: "❌ GOL İPTAL",
                          mesaj: `${seciliMac.ev_sahibi} golü iptal edildi! Güncel Skor: ${yeniSkor}-${seciliMac.dep_skor}`,
                        }),
                      });
                    }
                  }}
                  style={{ fontSize: 24, padding: "10px 20px", background: "#333", border: "none", borderRadius: 10, cursor: "pointer", color: "white" }}
                >
                  ➖
                </button>

                <h1 style={{ fontSize: 40, margin: 0 }}>{seciliMac.ev_skor}</h1>
<button
  onClick={async () => {
    const yeniSkor = seciliMac.ev_skor + 1;

    await macGuncelle("ev_skor", yeniSkor);

    await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        baslik: "⚽ GOOOL!",
        mesaj: `${seciliMac.ev_sahibi} ${yeniSkor}-${seciliMac.dep_skor} öne geçti!`,
      }),
    });
  }}
>
  ➕
</button>
              </div>

              <h1>-</h1>

              <div>
                <button
                  onClick={async () => {
                    const yeniSkor = Math.max(0, seciliMac.dep_skor - 1);
                    if (yeniSkor < seciliMac.dep_skor) {
                      await macGuncelle("dep_skor", yeniSkor);
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          baslik: "❌ GOL İPTAL",
                          mesaj: `${seciliMac.deplasman} golü iptal edildi! Güncel Skor: ${seciliMac.ev_skor}-${yeniSkor}`,
                        }),
                      });
                    }
                  }}
                  style={{ fontSize: 24, padding: "10px 20px", background: "#333", border: "none", borderRadius: 10, cursor: "pointer", color: "white" }}
                >
                  ➖
                </button>

                <h1 style={{ fontSize: 40, margin: 0 }}>{seciliMac.dep_skor}</h1>

                <button
  onClick={async () => {
    const yeniSkor = seciliMac.dep_skor + 1;

    await macGuncelle("dep_skor", yeniSkor);

    await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        baslik: "⚽ GOOOL!",
        mesaj: `${seciliMac.deplasman} ${seciliMac.ev_skor}-${yeniSkor} öne geçti!`,
      }),
    });
  }}
>
  ➕
</button>
              </div>
            </div>
                        <div style={{ marginTop: 30 }}>
              <h3>Dakika</h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() =>
                    macGuncelle(
                      "dakika",
                      Math.max(0, seciliMac.dakika - 1)
                    )
                  }
                >
                  ➖
                </button>

                <h2>{seciliMac.dakika}'</h2>

                <button
                  onClick={() =>
                    macGuncelle("dakika", seciliMac.dakika + 1)
                  }
                >
                  ➕
                </button>
              </div>
            </div>

            <div style={{ marginTop: 25 }}>
              <h3>Hakem</h3>

              <input
                value={seciliMac.hakem || ""}
                onChange={(e) =>
                  macGuncelle("hakem", e.target.value)
                }
                placeholder="Hakem adı"
                style={{
                  width: "100%",
                  height: 45,
                  padding: "0 15px",
                  borderRadius: 10,
                }}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>YouTube Yayın Linki</h3>

              <input
                value={seciliMac.youtube_link || ""}
                onChange={(e) =>
                  macGuncelle("youtube_link", e.target.value)
                }
                placeholder="https://youtube.com/..."
                style={{
                  width: "100%",
                  height: 45,
                  padding: "0 15px",
                  borderRadius: 10,
                }}
              />
            </div>

            <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginTop: 30,
  }}
>
  <button
    onClick={() => canliDurumGuncelle(true)}
    style={{
      height: 50,
      background: "#16a34a",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    ▶️ Başlat
  </button>

  <button
    onClick={async () => {
      if (!seciliMac) return;

      const { error } = await supabase
        .from("maclar")
        .update({
          canli: false,
          durum: "Devre Arası",
        })
        .eq("id", seciliMac.id);

      if (!error) {
        setSeciliMac({
          ...seciliMac,
          canli: false,
          durum: "Devre Arası",
        });
        
        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "⏸️ DEVRE ARASI",
            mesaj: `İlk yarı sona erdi. Skor: ${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,
          }),
        });
      }
    }}
    style={{
      height: 50,
      background: "#f59e0b",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    ⏸️ Devre
  </button>

  <button
    onClick={async () => {
      if (!seciliMac) return;

      const { error } = await supabase
        .from("maclar")
        .update({
          canli: true,
          durum: "Canlı",
        })
        .eq("id", seciliMac.id);

      if (!error) {
        setSeciliMac({
          ...seciliMac,
          canli: true,
          durum: "Canlı",
        });

        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "▶️ İKİNCİ YARI",
            mesaj: `${seciliMac.ev_sahibi} - ${seciliMac.deplasman} maçında ikinci yarı heyecanı başladı!`,
          }),
        });
      }
    }}
    style={{
      height: 50,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    ▶️ 2.Yarı
  </button>

  <button
    onClick={async () => {
      if (!seciliMac) return;

      const { error } = await supabase
        .from("maclar")
        .update({
          canli: false,
          durum: "Maç Sona Erdi",
        })
        .eq("id", seciliMac.id);

      if (!error) {
        setSeciliMac({
          ...seciliMac,
          canli: false,
          durum: "Maç Sona Erdi",
        });

        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "🏁 MAÇ SONA ERDİ!",
            mesaj: `${seciliMac.ev_sahibi} ${seciliMac.ev_skor}-${seciliMac.dep_skor} ${seciliMac.deplasman}`,
          }),
        });
      }
    }}
    style={{
      height: 50,
      background: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 800,
      cursor: "pointer",
    }}
  >
    🏁 Bitir
  </button>
</div>

          </>
        )}
      </div>
    </div>
  );
}