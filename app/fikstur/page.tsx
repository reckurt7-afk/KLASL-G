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
  <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/stadium.jpg')" }}>
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/90 via-[#070707]/80 to-[#070707]/95"></div>

    <div className="relative z-10 w-full max-w-[1200px] mx-auto pt-[40px] px-4 pb-24">
      
      {/* Başlık Alanı */}
      <div className="bg-[#151515]/60 backdrop-blur-xl border border-[#ff3131]/20 rounded-3xl p-6 mb-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <h1 className="text-white text-3xl md:text-4xl font-black m-0 drop-shadow-[0_0_15px_rgba(255,49,49,0.4)]">
          📅 FİKSTÜR
        </h1>
        <div className="text-[#ff3131] mt-2 text-xs md:text-sm tracking-[0.4em] font-black uppercase">
          Skor Tahminleri ve Eşleşmeler
        </div>
      </div>

      {/* Hafta Seçici (Yatay Scroll) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar items-center justify-start md:justify-center">
        {haftalar.map((_, i) => (
          <button
            key={i}
            onClick={() => setAktifHafta(i)}
            className={`flex-shrink-0 w-12 h-12 rounded-full font-black text-lg transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.3)]
              ${aktifHafta === i 
                ? "bg-gradient-to-br from-[#ff3131] to-[#a11212] text-white scale-110 shadow-[0_0_15px_rgba(255,49,49,0.6)]" 
                : "bg-[#1c1c1c] text-gray-400 hover:bg-[#252525] hover:text-white"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Aktif Hafta Başlığı */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#ff3131]/50"></div>
        <h2 className="text-white text-2xl md:text-3xl font-black italic drop-shadow-[0_0_10px_rgba(255,49,49,0.5)] text-center">
          {haftalar[aktifHafta].hafta}
        </h2>
        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#ff3131]/50"></div>
      </div>

      {/* Maç Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {haftalar[aktifHafta].maclar.map((mac, index) => {
          const canliMi = canliMaclar.some(
            (m) =>
              m.hafta === aktifHafta + 1 &&
              m.ev_sahibi === mac[0] &&
              m.deplasman === mac[1]
          );

          const tahminSayisi = sayilar[`${aktifHafta + 1}-${mac[0]}-${mac[1]}`] || 0;

          return (
            <div
              key={index}
              className="group relative bg-[#151515]/70 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#ff3131]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(255,49,49,0.15)] flex flex-col"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 to-[#ff3131]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

              {/* Takımlar ve Logolar */}
              <div className="flex justify-between items-center w-full mb-6">
                
                {/* Ev Sahibi */}
                <div className="flex flex-col items-center gap-2 w-[40%] text-center">
                  <div className="relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-black/40 rounded-full p-2 border border-white/10 group-hover:border-[#ff3131]/50 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <Image src={logolar[mac[0]]} alt={mac[0]} fill className="object-contain p-1" />
                  </div>
                  <span className="text-white font-bold text-sm md:text-base">{mac[0]}</span>
                </div>

                {/* VS */}
                <span className="text-[#ff3131] font-black text-2xl italic drop-shadow-[0_0_10px_rgba(255,49,49,0.8)] w-[20%] text-center">
                  VS
                </span>

                {/* Deplasman */}
                <div className="flex flex-col items-center gap-2 w-[40%] text-center">
                  <div className="relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-black/40 rounded-full p-2 border border-white/10 group-hover:border-[#ff3131]/50 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    <Image src={logolar[mac[1]]} alt={mac[1]} fill className="object-contain p-1" />
                  </div>
                  <span className="text-white font-bold text-sm md:text-base">{mac[1]}</span>
                </div>

              </div>

              {/* Tahmin Sayısı Info */}
              <div className="text-center text-gray-400 text-xs md:text-sm font-semibold mb-4 bg-black/30 py-2 rounded-lg border border-white/5">
                👥 {tahminSayisi} kişi bu maça tahmin yaptı
              </div>

              {/* Tahmin Butonu */}
              {canliMi ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-800 text-gray-400 rounded-xl font-bold border border-gray-700 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  🔒 Tahminler Kapandı
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSecilenMac({ hafta: aktifHafta + 1, ev: mac[0], dep: mac[1] });
                    setModalAcik(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white rounded-xl font-black shadow-[0_5px_15px_rgba(255,49,49,0.3)] hover:shadow-[0_5px_20px_rgba(255,49,49,0.6)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  ⚽ SKOR TAHMİNİ YAP
                </button>
              )}
            </div>
          );
        })}
      </div>

      {modalAcik && secilenMac && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] px-4">
          <div className="w-full max-w-md bg-[#151515] border border-[#ff3131]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300">
            
            <h2 className="text-white text-2xl font-black text-center mb-6 drop-shadow-[0_0_10px_rgba(255,49,49,0.4)]">
              🎯 SKOR TAHMİNİ
            </h2>
            
            {/* Maç Görünümü Modal İçi */}
            <div className="flex items-center justify-between bg-black/40 rounded-2xl p-4 border border-white/5 mb-6">
              <span className="text-white font-bold flex-1 text-right text-sm">{secilenMac.ev}</span>
              <span className="text-[#ff3131] font-black text-xl italic px-3">VS</span>
              <span className="text-white font-bold flex-1 text-left text-sm">{secilenMac.dep}</span>
            </div>

            <p className="text-gray-400 text-center text-xs mb-6 px-4">
              Her kullanıcı sadece <b className="text-[#ff3131]">1 kez</b> tahmin yapabilir. Doğru tahmin edenler arasından çekiliş yapılacaktır.
            </p>

            <div className="space-y-4 mb-6">
              <input
                placeholder="Ad Soyad"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff3131]/50 transition-colors"
              />

              <input
                placeholder="Telefon (Örn: 05XXXXXXXXX)"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff3131]/50 transition-colors"
              />
            </div>

            {/* Skor Giriş Alanı */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <input
                type="number"
                min={0}
                placeholder="0"
                value={evSkor}
                onChange={(e) => setEvSkor(e.target.value)}
                className="w-20 h-20 bg-black border-2 border-[#ff3131]/30 rounded-2xl text-center text-3xl font-black text-white focus:outline-none focus:border-[#ff3131] transition-colors"
              />
              <span className="text-gray-500 font-black text-3xl">-</span>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={depSkor}
                onChange={(e) => setDepSkor(e.target.value)}
                className="w-20 h-20 bg-black border-2 border-[#ff3131]/30 rounded-2xl text-center text-3xl font-black text-white focus:outline-none focus:border-[#ff3131] transition-colors"
              />
            </div>

            {/* Aksiyon Butonları */}
            <div className="space-y-3">
              <button
                onClick={tahminKaydet}
                className="w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white rounded-xl font-black shadow-[0_5px_15px_rgba(255,49,49,0.3)] hover:shadow-[0_5px_20px_rgba(255,49,49,0.6)] transition-all duration-300"
              >
                GÖNDER
              </button>
              
              <button
                onClick={() => setModalAcik(false)}
                className="w-full py-3 bg-transparent text-gray-400 hover:text-white rounded-xl font-bold transition-colors"
              >
                VAZGEÇ
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  </div>
  );
}