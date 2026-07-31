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
  "Alaçam Spor": "/logos/alacam-spor.png",
  "ALAÇAM SPOR": "/logos/alacam-spor.png",
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

type Oyuncu = {
  id: number;
  ad_soyad: string;
  forma_no: number;
  mevki: string;
};

export default function EsameListesiPage() {
  const [aktifHafta, setAktifHafta] = useState(0);
  const [secilenMac, setSecilenMac] = useState<{ hafta: string; ev: string; dep: string } | null>(null);
  
  // Auth state
  const [authAcik, setAuthAcik] = useState(false);
  const [secilenTakim, setSecilenTakim] = useState("");
  const [sifre, setSifre] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  
  // Form State
  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Selections
  const [ilk7, setIlk7] = useState<number[]>([]);
  const [kaptanId, setKaptanId] = useState<number | null>(null);
  const [yedekler, setYedekler] = useState<number[]>([]);

  const macSec = (ev: string, dep: string) => {
    setSecilenMac({ hafta: haftalar[aktifHafta].hafta, ev, dep });
    setAuthAcik(true);
    setIsAuth(false);
    setSecilenTakim("");
    setSifre("");
    setIlk7([]);
    setYedekler([]);
    setKaptanId(null);
  };

  const sifreKontrolEt = async () => {
    if (!secilenTakim) return alert("Lütfen takımınızı seçin!");
    if (sifre !== "klas2026") return alert("Kaptan şifresi hatalı!");
    
    setIsAuth(true);
    setLoading(true);
    
    const { data } = await supabase
      .from("oyuncular")
      .select("id, ad_soyad, forma_no, mevki, takim");
      
    if (data) {
      // JavaScript üzerinde Türkçe karakter duyarlılığına takılmadan eşleştirme yapıyoruz
      const hedefTakim = secilenTakim.toLocaleUpperCase("tr-TR").trim();
      
      const takimOyunculari = data.filter((o) => {
        if (!o.takim) return false;
        const dbTakim = o.takim.toLocaleUpperCase("tr-TR").trim();
        // Takım isimleri tam eşleşiyorsa veya ilk kelimeleri eşleşiyorsa al
        return dbTakim === hedefTakim || dbTakim.includes(hedefTakim.split(' ')[0]);
      });
      
      setOyuncular(takimOyunculari);
    }
    setLoading(false);
  };

  const oyuncuToggle = (id: number, type: "ilk7" | "yedek") => {
    if (type === "ilk7") {
      if (ilk7.includes(id)) {
        setIlk7(ilk7.filter(i => i !== id));
        if (kaptanId === id) setKaptanId(null);
      } else {
        if (ilk7.length >= 7) return alert("İlk 7 için en fazla 7 oyuncu seçebilirsiniz!");
        setIlk7([...ilk7, id]);
        setYedekler(yedekler.filter(i => i !== id));
      }
    } else {
      if (yedekler.includes(id)) {
        setYedekler(yedekler.filter(i => i !== id));
      } else {
        setYedekler([...yedekler, id]);
        setIlk7(ilk7.filter(i => i !== id));
        if (kaptanId === id) setKaptanId(null);
      }
    }
  };

  const kadroyuGonder = async () => {
    if (ilk7.length < 7) {
      return alert("Lütfen İlk 7 için tam 7 oyuncu seçiniz!");
    }
    if (!kaptanId) {
      return alert("Lütfen kaptanı seçiniz!");
    }

    if (!secilenMac) return;

    try {
      const records = [];
      const macAdi = `${secilenMac.hafta} - ${secilenMac.ev} 🆚 ${secilenMac.dep}`;

      for (const id of ilk7) {
        const o = oyuncular.find(x => x.id === id);
        if (!o) continue;
        records.push({
          mac_id: macAdi,
          takim_id: secilenTakim,
          oyuncu_no: 0,
          forma_no: o.forma_no || 0,
          ad_soyad: o.ad_soyad,
          pozisyon: o.mevki || "Belirsiz",
          ilk_yedi: true,
          kaptan: kaptanId === id,
        });
      }

      for (const id of yedekler) {
        const o = oyuncular.find(x => x.id === id);
        if (!o) continue;
        records.push({
          mac_id: macAdi,
          takim_id: secilenTakim,
          oyuncu_no: 0,
          forma_no: o.forma_no || 0,
          ad_soyad: o.ad_soyad,
          pozisyon: o.mevki || "Belirsiz",
          ilk_yedi: false,
          kaptan: false,
        });
      }

      const { error } = await supabase.from("mac_esameleri").insert(records);
      
      if (error) {
        console.error(error);
        alert("Gönderim sırasında hata oluştu: " + error.message);
        return;
      }

      alert("✅ Kadro başarıyla yönetime iletildi!");
      setAuthAcik(false);
      setIsAuth(false);
    } catch (err) {
      alert("Beklenmeyen bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "url('/images/stadium.png')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707]/90 via-[#070707]/80 to-[#070707]/95"></div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto pt-[40px] px-4 pb-24">
        
        <div className="bg-[#151515]/60 backdrop-blur-xl border border-[#ff3131]/20 rounded-3xl p-6 mb-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h1 className="text-white text-3xl md:text-4xl font-black m-0 drop-shadow-[0_0_15px_rgba(255,49,49,0.4)]">
            📋 ESAME LİSTESİ
          </h1>
          <div className="text-[#ff3131] mt-2 text-xs md:text-sm tracking-[0.4em] font-black uppercase">
            Kaptan Kadro Seçimi
          </div>
        </div>

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

        <div className="flex items-center gap-4 mb-8">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#ff3131]/50"></div>
          <h2 className="text-white text-2xl md:text-3xl font-black italic drop-shadow-[0_0_10px_rgba(255,49,49,0.5)] text-center">
            {haftalar[aktifHafta].hafta}
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#ff3131]/50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {haftalar[aktifHafta].maclar.map((mac, index) => (
            <div
              key={index}
              className="group relative bg-[#151515]/70 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[#ff3131]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(255,49,49,0.15)] flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff3131]/0 to-[#ff3131]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

              <div className="flex justify-between items-center w-full mb-6">
                <div className="flex flex-col items-center gap-2 w-[40%] text-center">
                  <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,49,49,0.3)]">
                    <Image src={logolar[mac[0]] || "/icons/logo.png"} alt={mac[0]} fill className="object-contain" />
                  </div>
                  <span className="text-white font-bold text-sm md:text-base">{mac[0]}</span>
                </div>

                <span className="text-[#ff3131] font-black text-2xl italic drop-shadow-[0_0_10px_rgba(255,49,49,0.8)] w-[20%] text-center">VS</span>

                <div className="flex flex-col items-center gap-2 w-[40%] text-center">
                  <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,49,49,0.3)]">
                    <Image src={logolar[mac[1]] || "/icons/logo.png"} alt={mac[1]} fill className="object-contain" />
                  </div>
                  <span className="text-white font-bold text-sm md:text-base">{mac[1]}</span>
                </div>
              </div>

              <button
                onClick={() => macSec(mac[0], mac[1])}
                className="w-full py-3 bg-[#222] hover:bg-gradient-to-r hover:from-[#ff3131] hover:to-[#a11212] border border-white/10 hover:border-transparent text-gray-300 hover:text-white rounded-xl font-black shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                📝 KADRO OLUŞTUR
              </button>
            </div>
          ))}
        </div>

        {authAcik && secilenMac && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center z-[99999] p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-[#111] border border-[#ff3131]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] my-8">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl md:text-2xl font-black drop-shadow-[0_0_10px_rgba(255,49,49,0.4)]">
                  {isAuth ? "KADRO SEÇİMİ" : "KAPTAN GİRİŞİ"}
                </h2>
                <button onClick={() => setAuthAcik(false)} className="text-gray-400 hover:text-[#ff3131] text-2xl font-black transition-colors">&times;</button>
              </div>

              {!isAuth ? (
                <div className="space-y-6">
                  <p className="text-gray-400 text-sm">Maç kadrosunu oluşturmak için takımınızı seçin ve kaptan şifresini girin.</p>
                  
                  <div>
                    <label className="text-[#ff3131] font-bold text-sm mb-2 block">Takımınız</label>
                    <select
                      value={secilenTakim}
                      onChange={(e) => setSecilenTakim(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#ff3131]/50"
                    >
                      <option value="">Takım Seçin...</option>
                      <option value={secilenMac.ev}>{secilenMac.ev}</option>
                      <option value={secilenMac.dep}>{secilenMac.dep}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#ff3131] font-bold text-sm mb-2 block">Kaptan Şifresi</label>
                    <input
                      type="password"
                      placeholder="Şifreyi giriniz"
                      value={sifre}
                      onChange={(e) => setSifre(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-[#ff3131]/50"
                    />
                  </div>

                  <button
                    onClick={sifreKontrolEt}
                    className="w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#a11212] text-white rounded-xl font-black shadow-[0_5px_15px_rgba(255,49,49,0.3)] hover:shadow-[0_5px_20px_rgba(255,49,49,0.6)] transition-all"
                  >
                    GİRİŞ YAP VE KADROYU KUR
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#ff3131]/20 flex items-center justify-between">
                    <div>
                      <div className="text-[#ff3131] font-black text-xs tracking-widest">{secilenMac.hafta}</div>
                      <div className="text-white font-bold text-sm md:text-base mt-1">{secilenMac.ev} 🆚 {secilenMac.dep}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs font-bold">İlk 7 Seçimi</div>
                      <div className={`font-black text-xl ${ilk7.length === 7 ? "text-green-500" : "text-yellow-500"}`}>
                        {ilk7.length}/7
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center text-gray-400 py-10">Oyuncular Yükleniyor...</div>
                  ) : oyuncular.length === 0 ? (
                    <div className="text-center text-red-400 py-10 font-bold border border-red-500/20 rounded-xl bg-red-500/10">
                      Takımınıza ait kayıtlı oyuncu bulunamadı. Lütfen önce 'Oyuncular' sayfasından kayıt oluşturun.
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-400 text-xs md:text-sm">
                        Oyuncularınızı <b>İlk 7</b> veya <b>Yedek</b> olarak işaretleyin. Kaptanı belirlemeyi unutmayın!
                      </p>

                      <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {oyuncular.map((o) => {
                          const asilMi = ilk7.includes(o.id);
                          const yedekMi = yedekler.includes(o.id);
                          const isKaptan = kaptanId === o.id;

                          return (
                            <div key={o.id} className={`p-3 rounded-xl border transition-colors ${asilMi ? 'bg-[#ff3131]/10 border-[#ff3131]/30' : yedekMi ? 'bg-white/5 border-white/20' : 'bg-[#1a1a1a] border-white/5'}`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-black/50 border border-white/10 flex items-center justify-center font-black text-gray-300 text-xs">
                                    {o.forma_no || "-"}
                                  </div>
                                  <div className="min-w-0">
                                    <div className={`font-bold truncate ${asilMi ? 'text-white' : 'text-gray-300'}`}>{o.ad_soyad}</div>
                                    <div className="text-xs text-gray-500 truncate">{o.mevki || "Mevki Belirtilmemiş"}</div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-1 sm:mt-0 sm:flex sm:flex-wrap sm:justify-end">
                                  <button
                                    onClick={() => oyuncuToggle(o.id, "ilk7")}
                                    className={`w-full sm:w-auto px-1 py-2 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-colors ${asilMi ? 'bg-[#ff3131] text-white shadow-lg' : 'bg-[#222] text-gray-400 hover:bg-[#333]'}`}
                                  >
                                    İlk 7
                                  </button>
                                  <button
                                    onClick={() => oyuncuToggle(o.id, "yedek")}
                                    className={`w-full sm:w-auto px-1 py-2 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-colors ${yedekMi ? 'bg-gray-600 text-white' : 'bg-[#222] text-gray-400 hover:bg-[#333]'}`}
                                  >
                                    Yedek
                                  </button>
                                  
                                  {asilMi ? (
                                    <button
                                      onClick={() => setKaptanId(isKaptan ? null : o.id)}
                                      className={`w-full sm:w-auto px-1 py-2 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black border transition-all ${isKaptan ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-[#222] text-yellow-600 border-yellow-600/30 hover:bg-yellow-500/10'}`}
                                    >
                                      © KPT
                                    </button>
                                  ) : (
                                    <div className="w-full sm:hidden"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={kadroyuGonder}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-black shadow-[0_5px_15px_rgba(34,197,94,0.3)] hover:shadow-[0_5px_20px_rgba(34,197,94,0.6)] transition-all"
                      >
                        ✅ KADROYU YÖNETİME GÖNDER
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
