"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type CanliMac = {
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  durum: string;
  tarih: string | null;
  saat: string | null;
  saha: string | null;
};

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
  const [modalAcik, setModalAcik] = useState(false);

  const [secilenMac, setSecilenMac] = useState<{
    hafta: number;
    ev: string;
    dep: string;
  } | null>(null);

  const [adSoyad, setAdSoyad] = useState("");
  const [telefon, setTelefon] = useState("");
  const [evSkor, setEvSkor] = useState("");
  const [depSkor, setDepSkor] = useState("");

  const [sayilar, setSayilar] = useState<Record<string, number>>({});
  const [canliMaclar, setCanliMaclar] = useState<CanliMac[]>([]);
  useEffect(() => {
  tahminSayilariniGetir();
  canliMaclariGetir();
}, []);

async function canliMaclariGetir() {
  const { data } = await supabase
    .from("maclar")
    .select("hafta,ev_sahibi,deplasman,durum,tarih,saat,saha")
    .eq("durum", "Canlı");

  if (data) {
    setCanliMaclar(data);
  }
}

async function tahminSayilariniGetir() {
  const { data } = await supabase
    .from("tahminler")
    .select("hafta,ev_sahibi,deplasman");

  if (!data) return;

  const yeni: Record<string, number> = {};

  data.forEach((t) => {
    const key = `${t.hafta}-${t.ev_sahibi}-${t.deplasman}`;
    yeni[key] = (yeni[key] || 0) + 1;
  });

  setSayilar(yeni);
}

async function tahminKaydet() {
  if (!secilenMac) return;

  if (!adSoyad || !telefon) {
    alert("Ad Soyad ve Telefon giriniz.");
    return;
  }

  if (evSkor === "" || depSkor === "") {
    alert("Skor giriniz.");
    return;
  }

  const { data: varMi } = await supabase
    .from("tahminler")
    .select("id")
    .eq("telefon", telefon)
    .eq("hafta", secilenMac.hafta)
    .eq("ev_sahibi", secilenMac.ev)
    .eq("deplasman", secilenMac.dep)
    .maybeSingle();

  if (varMi) {
    alert("❌ Bu telefon ile bu maç için zaten tahmin yapılmış.");
    return;
  }
    const { error } = await supabase.from("tahminler").insert({
    hafta: secilenMac.hafta,
    ev_sahibi: secilenMac.ev,
    deplasman: secilenMac.dep,
    ad_soyad: adSoyad,
    telefon,
    ev_skor: Number(evSkor),
    dep_skor: Number(depSkor),
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("✅ Tahmin başarıyla kaydedildi.");

  tahminSayilariniGetir();

  setModalAcik(false);
  setAdSoyad("");
  setTelefon("");
  setEvSkor("");
  setDepSkor("");
}

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
    {haftalar[aktifHafta].maclar.map((mac, index) => {
  const canliMi = canliMaclar.some(
    (m) =>
      m.hafta === aktifHafta + 1 &&
      m.ev_sahibi === mac[0] &&
      m.deplasman === mac[1]
  );

  return (
    <div
      key={index}
      style={{
        background: "#151515",
        border: "1px solid rgba(255,49,49,.25)",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
            }}
          >
            {mac[0]}
          </span>
        </div>

        <span
          style={{
            color: "#ff3131",
            fontWeight: 900,
            fontSize: 22,
          }}
        >
          VS
        </span>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            width: "42%",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
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

      <div
        style={{
          textAlign: "center",
          color: "#bbb",
          marginTop: 12,
          marginBottom: 10,
          fontSize: 14,
        }}
      >
        👥{" "}
        {sayilar[
          `${aktifHafta + 1}-${mac[0]}-${mac[1]}`
        ] || 0} kişi tahmin yaptı
      </div>
            {canliMi ? (
        <button
          disabled
          style={{
            width: "100%",
            padding: 12,
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 800,
            cursor: "not-allowed",
          }}
        >
          🔒 Tahminler Kapandı
        </button>
      ) : (
        <button
          onClick={() => {
            setSecilenMac({
              hafta: aktifHafta + 1,
              ev: mac[0],
              dep: mac[1],
            });

            setModalAcik(true);
          }}
          style={{
            width: "100%",
            padding: 12,
            background: "#ff3131",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          ⚽ Tahmin Yap
        </button>
      )}
    </div>
  );
})}
      {modalAcik && secilenMac && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "95%",
              maxWidth: 420,
              background: "#1b1b1b",
              borderRadius: 15,
              padding: 20,
            }}
          >
            <h2
              style={{
                color: "#fff",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              🎯 MAÇ SKOR TAHMİNİ
            </h2>
<div
  style={{
    textAlign: "center",
    color: "#fff",
    fontWeight: 700,
    marginBottom: 15,
  }}
>
  {secilenMac.ev}

  <div
    style={{
      color: "#ff3131",
      fontSize: 22,
      fontWeight: 900,
      margin: "8px 0",
    }}
  >
    VS
  </div>

  {secilenMac.dep}
</div>

<p
  style={{
    color: "#aaa",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  }}
>
  Her kullanıcı sadece <b>1 kez</b> tahmin yapabilir.
  <br />
  Doğru tahmin edenler arasından çekiliş yapılacaktır.
</p>
            <input
              placeholder="Ad Soyad"
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
              }}
            />

            <input
              placeholder="05XXXXXXXXX"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 20,
                borderRadius: 8,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <input
                type="number"
                min={0}
                value={evSkor}
                onChange={(e) => setEvSkor(e.target.value)}
                style={{
                  width: 70,
                  height: 50,
                  textAlign: "center",
                  fontSize: 22,
                  borderRadius: 10,
                }}
              />

              <span
                style={{
                  color: "#fff",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                -
              </span>

              <input
                type="number"
                min={0}
                value={depSkor}
                onChange={(e) => setDepSkor(e.target.value)}
                style={{
                  width: 70,
                  height: 50,
                  textAlign: "center",
                  fontSize: 22,
                  borderRadius: 10,
                }}
              />
            </div>

            <button
              onClick={tahminKaydet}
              style={{
                width: "100%",
                padding: 14,
                background: "#ff3131",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Tahmini Gönder
            </button>

            <button
              onClick={() => setModalAcik(false)}
              style={{
                width: "100%",
                padding: 12,
                marginTop: 10,
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
          </div>
  );
}