"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Oyuncu = {
  adSoyad: string;
  formaNo: string;
  pozisyon: string;
  ilk11: boolean;
  kaptan: boolean;
};

const takimlar = [
  "PS 5",
  "Dinamo Nalbantoğlu",
  "Dündar Köyü",
  "KROKODİLLA FC",
  "Yeşil Bursa FC",
  "Yediyol Black FC",
  "BİSKREM FC",
  "GRAVYER FC",
];

const haftalar = [
  {
    hafta: "1. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "KROKODİLLA FC"],
      ["Yeşil Bursa FC", "BİSKREM FC"],
      ["Dündar Köyü", "GRAVYER FC"],
      ["Yediyol Black FC", "PS 5"],
    ],
  },
  {
    hafta: "2. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "BİSKREM FC"],
      ["KROKODİLLA FC", "GRAVYER FC"],
      ["Yeşil Bursa FC", "PS 5"],
      ["Dündar Köyü", "Yediyol Black FC"],
    ],
  },
  {
    hafta: "3. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "GRAVYER FC"],
      ["BİSKREM FC", "PS 5"],
      ["KROKODİLLA FC", "Yediyol Black FC"],
      ["Yeşil Bursa FC", "Dündar Köyü"],
    ],
  },
  {
    hafta: "4. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "PS 5"],
      ["GRAVYER FC", "Yediyol Black FC"],
      ["BİSKREM FC", "Dündar Köyü"],
      ["KROKODİLLA FC", "Yeşil Bursa FC"],
    ],
  },
];

export default function MacEsameleriPage() {
  const [takim, setTakim] = useState("");
  const [mac, setMac] = useState("");

  const [adSoyad, setAdSoyad] = useState("");
  const [formaNo, setFormaNo] = useState("");
  const [pozisyon, setPozisyon] = useState("Kaleci");
  const [ilk11, setIlk11] = useState(false);
  const [kaptan, setKaptan] = useState(false);

  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);

  const maclar = haftalar.flatMap((h) =>
    h.maclar
      .filter((m) => m[0] === takim || m[1] === takim)
      .map((m) => ({
        hafta: h.hafta,
        mac: `${m[0]} 🆚 ${m[1]}`,
      }))
  );
    function oyuncuEkle() {
    if (!adSoyad || !formaNo) {
      alert("Oyuncu adı ve forma numarası zorunludur.");
      return;
    }

    setOyuncular([
      ...oyuncular,
      {
        adSoyad,
        formaNo,
        pozisyon,
        ilk11,
        kaptan,
      },
    ]);

    setAdSoyad("");
    setFormaNo("");
    setPozisyon("Kaleci");
    setIlk11(false);
    setKaptan(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        padding: 20,
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ff3131",
          fontWeight: 900,
          marginBottom: 25,
        }}
      >
        📄 MAÇ ESAMELERİ
      </h1>

      <div
        style={{
          background: "#171717",
          padding: 20,
          borderRadius: 15,
        }}
      >
        <h3>🏆 Takım Seç</h3>

        <select
          value={takim}
          onChange={(e) => setTakim(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <option value="">Takım Seçiniz</option>

          {takimlar.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <h3>📅 Maç Seç</h3>

        <select
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <option value="">Maç Seçiniz</option>

          {maclar.map((m, index) => (
            <option
              key={index}
              value={m.mac}
            >
              {m.hafta} - {m.mac}
            </option>
          ))}
        </select>

        <hr />

        <h2>👤 Oyuncu Bilgileri</h2>

        <input
          placeholder="Ad Soyad"
          value={adSoyad}
          onChange={(e) => setAdSoyad(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
          }}
        />

        <input
          placeholder="Forma No"
          value={formaNo}
          onChange={(e) => setFormaNo(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            marginBottom: 12,
          }}
        />        <select
          value={pozisyon}
          onChange={(e) => setPozisyon(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <option>Kaleci</option>
          <option>Defans</option>
          <option>Orta Saha</option>
          <option>Kanat</option>
          <option>Forvet</option>
        </select>

        <label
          style={{
            display: "block",
            marginBottom: 10,
          }}
        >
          <input
            type="checkbox"
            checked={ilk11}
            onChange={(e) => setIlk11(e.target.checked)}
          />{" "}
          İlk 11
        </label>

        <label
          style={{
            display: "block",
            marginBottom: 20,
          }}
        >
          <input
            type="checkbox"
            checked={kaptan}
            onChange={(e) => setKaptan(e.target.checked)}
          />{" "}
          Kaptan
        </label>

        <button
          onClick={oyuncuEkle}
          style={{
            width: "100%",
            padding: 15,
            border: "none",
            borderRadius: 12,
            background: "#ff3131",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ➕ Oyuncuyu Listeye Ekle
        </button>

        <h2
          style={{
            marginTop: 30,
            color: "#ff3131",
          }}
        >
          📋 Eklenen Oyuncular
        </h2>

        {oyuncular.length === 0 ? (
          <p style={{ color: "#999" }}>
            Henüz oyuncu eklenmedi.
          </p>
        ) : (
          oyuncular.map((o, index) => (
            <div
              key={index}
              style={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: 12,
                padding: 15,
                marginBottom: 12,
              }}
            >
              <b>{o.adSoyad}</b>

              <br />

              🔢 {o.formaNo}

              <br />

              ⚽ {o.pozisyon}

              <br />

              {o.ilk11 ? "✅ İlk 11" : "🪑 Yedek"}

              <br />

              {o.kaptan && "©️ Kaptan"}

              <br />

              <button
                onClick={() =>
                  setOyuncular(
                    oyuncular.filter((_, i) => i !== index)
                  )
                }
                style={{
                  marginTop: 10,
                  background: "#c62828",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                🗑 Oyuncuyu Sil
              </button>
            </div>
          ))
        )}
                <button
          onClick={async () => {
            if (!takim) {
              alert("Takım seçiniz.");
              return;
            }

            if (!mac) {
              alert("Maç seçiniz.");
              return;
            }

            if (oyuncular.length === 0) {
              alert("En az 1 oyuncu ekleyiniz.");
              return;
            }

            const kayitlar = oyuncular.map((o) => ({
              mac_id: mac,
              takim_id: takim,
              oyuncu_no: 0,
              forma_no: Number(o.formaNo),
              ad_soyad: o.adSoyad,
              pozisyon: o.pozisyon,
              ilk_11: o.ilk11,
              kaptan: o.kaptan,
            }));

            const { error } = await supabase
              .from("mac_esameleri")
              .insert(kayitlar);

            if (error) {
              alert(error.message);
              return;
            }

            alert("✅ Maç esamesi başarıyla gönderildi.");

            setOyuncular([]);
            setTakim("");
            setMac("");
          }}
          style={{
            width: "100%",
            marginTop: 25,
            padding: 16,
            border: "none",
            borderRadius: 12,
            background: "#00b050",
            color: "#fff",
            fontWeight: 900,
            fontSize: 17,
            cursor: "pointer",
          }}
        >
          📤 ESAMEYİ GÖNDER
        </button>
      </div>
    </div>
  );
}