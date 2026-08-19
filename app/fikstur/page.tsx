"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const logolar: Record<string, string> = {
  "Dinamo Nalbantoğlu": "/logos/dinamo-nalbantoglu.png",
  "Krokodilla FK": "/logos/krokodilla-fc.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "Yeşil Bursa FC": "/logos/yesil-bursa-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "Gravyer FC": "/logos/gravyer-fc.png",
  "Yediyol Black FC": "/logos/yediyol-black-fc.png",
  "Dündar Köyü": "/logos/dundar-koyu.png",
  "PS 5": "/logos/ps5.jpg",
};

const haftalar = [
  {
    hafta: "1. HAFTA",
    maclar: [
      ["Yeşil Bursa FC", "BİSKREM FC"],
      ["Dündar Köyü", "Gravyer FC"],
    ],
  },
  {
    hafta: "2. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "BİSKREM FC"],
      ["Krokodilla FK", "Gravyer FC"],
      ["Yeşil Bursa FC", "PS 5"],
      ["Dündar Köyü", "Yediyol Black FC"],
    ],
  },
  {
    hafta: "3. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Gravyer FC"],
      ["BİSKREM FC", "PS 5"],
      ["Krokodilla FK", "Yediyol Black FC"],
      ["Yeşil Bursa FC", "Dündar Köyü"],
    ],
  },
  {
    hafta: "4. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "PS 5"],
      ["Gravyer FC", "Yediyol Black FC"],
      ["BİSKREM FC", "Dündar Köyü"],
      ["Krokodilla FK", "Yeşil Bursa FC"],
    ],
  },
  {
    hafta: "5. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Yediyol Black FC"],
      ["PS 5", "Dündar Köyü"],
      ["Gravyer FC", "Yeşil Bursa FC"],
      ["BİSKREM FC", "Krokodilla FK"],
    ],
  },
  {
    hafta: "6. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Dündar Köyü"],
      ["Yediyol Black FC", "Yeşil Bursa FC"],
      ["PS 5", "Krokodilla FK"],
      ["Gravyer FC", "BİSKREM FC"],
    ],
  },
  {
    hafta: "7. HAFTA",
    maclar: [
      ["Dinamo Nalbantoğlu", "Yeşil Bursa FC"],
      ["Dündar Köyü", "Krokodilla FK"],
      ["Yediyol Black FC", "BİSKREM FC"],
      ["PS 5", "Gravyer FC"],
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
  const [tumMaclar, setTumMaclar] = useState<any[]>([]);

  useEffect(() => {
    tahminSayilariniGetir();
    tumMaclariGetir();
  }, []);

  async function tumMaclariGetir() {
    const { data } = await supabase.from("maclar").select("*");
    if (data) {
      setTumMaclar(data);
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
    <div className="page min-h-screen" style={{ backgroundColor: "#070707" }}>
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="section-title text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">Fikstür</h1>
          <p className="section-sub text-[#ff3131] tracking-widest uppercase text-sm font-bold">Skor Tahminleri ve Eşleşmeler</p>
        </div>

        {/* Hafta Seçici */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar items-center md:justify-center">
          {haftalar.map((_, i) => (
            <button
              key={i}
              onClick={() => setAktifHafta(i)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300
                ${
                  aktifHafta === i
                    ? "bg-[#ff3131] text-white shadow-[0_0_15px_rgba(255,49,49,0.4)]"
                    : "bg-[#111] text-gray-400 hover:text-white border border-[rgba(255,255,255,0.07)]"
                }`}
            >
              {i + 1}. HAFTA
            </button>
          ))}
        </div>

        {/* Maçlar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {haftalar[aktifHafta].maclar.map((mac, index) => {
            const dbMatch = tumMaclar.find(
              (m) =>
                m.hafta === aktifHafta + 1 &&
                ((m.ev_sahibi.toUpperCase() === mac[0].toUpperCase() &&
                  m.deplasman.toUpperCase() === mac[1].toUpperCase()) ||
                  (m.ev_sahibi.toUpperCase() === mac[1].toUpperCase() &&
                    m.deplasman.toUpperCase() === mac[0].toUpperCase()))
            );

            const canliMi = dbMatch?.durum === "Canlı";
            const isOynandi = dbMatch?.oynandi || dbMatch?.ev_skor != null;
            const tahminSayisi =
              sayilar[`${aktifHafta + 1}-${mac[0]}-${mac[1]}`] || 0;

            return (
              <div
                key={index}
                className="card bg-[#111] border border-[rgba(255,255,255,0.07)] hover:border-[#ff3131]/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group flex flex-col"
              >
                <div className="flex justify-between items-center w-full mb-6 relative z-10">
                  {/* Ev Sahibi */}
                  <div className="flex flex-col items-center gap-3 w-[35%] text-center">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={logolar[mac[0]] || "/logos/default.png"}
                        alt={mac[0]}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-white font-bold text-xs md:text-sm line-clamp-2">
                      {mac[0]}
                    </span>
                  </div>

                  {/* Skor / VS / Durum */}
                  <div className="w-[30%] flex flex-col items-center justify-center text-center">
                    {isOynandi ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-white font-black text-3xl md:text-4xl">{dbMatch.ev_skor}</span>
                        <span className="text-[#ff3131] font-black text-xl">-</span>
                        <span className="text-white font-black text-3xl md:text-4xl">{dbMatch.dep_skor}</span>
                      </div>
                    ) : canliMi ? (
                      <div className="flex flex-col items-center animate-pulse">
                        <span className="bg-[#ff3131] text-white text-[10px] font-black px-2 py-1 rounded mb-2">CANLI</span>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-white font-black text-2xl">{dbMatch?.ev_skor || 0}</span>
                          <span className="text-gray-500 font-bold">-</span>
                          <span className="text-white font-black text-2xl">{dbMatch?.dep_skor || 0}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        {dbMatch?.tarih || dbMatch?.saat ? (
                          <div className="text-[10px] text-gray-400 font-medium mb-1">
                            {dbMatch?.tarih} {dbMatch?.saat}
                          </div>
                        ) : null}
                        <span className="text-[#ff3131] font-black text-xl md:text-2xl bg-[#ff3131]/10 px-3 py-1 rounded-lg">
                          VS
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Deplasman */}
                  <div className="flex flex-col items-center gap-3 w-[35%] text-center">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={logolar[mac[1]] || "/logos/default.png"}
                        alt={mac[1]}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-white font-bold text-xs md:text-sm line-clamp-2">
                      {mac[1]}
                    </span>
                  </div>
                </div>

                <div className="text-center text-gray-500 text-xs font-medium mb-4">
                  👥 {tahminSayisi} kişi tahmin yaptı
                </div>

                <div className="mt-auto">
                  {isOynandi ? (
                    <button
                      disabled
                      className="w-full py-3 bg-[rgba(255,255,255,0.03)] text-gray-500 rounded-xl font-bold cursor-not-allowed border border-[rgba(255,255,255,0.05)]"
                    >
                      MAÇ SONA ERDİ
                    </button>
                  ) : canliMi ? (
                    <button
                      disabled
                      className="w-full py-3 bg-[#ff3131]/10 text-[#ff3131] rounded-xl font-bold cursor-not-allowed border border-[#ff3131]/20"
                    >
                      TAHMİNLER KAPANDI
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
                      className="btn-primary w-full py-3 bg-[#ff3131] hover:bg-[#e02929] text-white rounded-xl font-black transition-colors"
                    >
                      SKOR TAHMİNİ YAP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {modalAcik && secilenMac && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
            <div className="w-full max-w-md bg-[#111] border border-[rgba(255,255,255,0.07)] rounded-3xl p-6 shadow-2xl relative">
              <button 
                onClick={() => setModalAcik(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              
              <h2 className="text-white text-2xl font-black text-center mb-6 uppercase">
                Skor Tahmini
              </h2>

              <div className="flex items-center justify-between bg-black/50 rounded-xl p-4 border border-[rgba(255,255,255,0.05)] mb-6">
                <span className="text-white font-bold flex-1 text-right text-sm">
                  {secilenMac.ev}
                </span>
                <span className="text-[#ff3131] font-black text-lg px-4">VS</span>
                <span className="text-white font-bold flex-1 text-left text-sm">
                  {secilenMac.dep}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  placeholder="Ad Soyad"
                  value={adSoyad}
                  onChange={(e) => setAdSoyad(e.target.value)}
                  className="w-full bg-black/50 border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff3131] transition-colors"
                />
                <input
                  placeholder="Telefon (Örn: 05XXXXXXXXX)"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  className="w-full bg-black/50 border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff3131] transition-colors"
                />
              </div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={evSkor}
                  onChange={(e) => setEvSkor(e.target.value)}
                  className="w-20 h-20 bg-black/50 border border-[rgba(255,255,255,0.1)] rounded-2xl text-center text-3xl font-black text-white focus:outline-none focus:border-[#ff3131] transition-colors"
                />
                <span className="text-gray-500 font-black text-2xl">-</span>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={depSkor}
                  onChange={(e) => setDepSkor(e.target.value)}
                  className="w-20 h-20 bg-black/50 border border-[rgba(255,255,255,0.1)] rounded-2xl text-center text-3xl font-black text-white focus:outline-none focus:border-[#ff3131] transition-colors"
                />
              </div>

              <button
                onClick={tahminKaydet}
                className="w-full py-4 bg-[#ff3131] hover:bg-[#e02929] text-white rounded-xl font-black transition-colors"
              >
                TAHMİNİ GÖNDER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}