"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Esame = {
  id: number;
  mac_id: string;
  takim_id: string;
  ad_soyad: string;
  forma_no: number;
  pozisyon: string;
  ilk_yedi: boolean;
  kaptan: boolean;
};

export default function AdminEsamelerPage() {
  const [esameler, setEsameler] = useState<Esame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getir() {
      const { data, error } = await supabase
        .from("mac_esameleri")
        .select("*")
        .order("id", { ascending: false });

      if (data) {
        setEsameler(data);
      }
      setLoading(false);
    }
    getir();
  }, []);

  // Maçlara göre grupla
  const macGruplari = esameler.reduce((acc: Record<string, Esame[]>, cur) => {
    if (!acc[cur.mac_id]) acc[cur.mac_id] = [];
    acc[cur.mac_id].push(cur);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#070707] text-white p-6 pt-24">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-black text-[#d4af37] mb-8 border-b border-[#d4af37]/20 pb-4">
          🛡️ GELEN ESAME LİSTELERİ
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Yükleniyor...</div>
        ) : Object.keys(macGruplari).length === 0 ? (
          <div className="bg-[#111] border border-[#333] p-10 rounded-2xl text-center text-gray-400">
            Henüz gönderilen bir esame listesi bulunmuyor.
          </div>
        ) : (
          <div className="space-y-10">
            {Object.keys(macGruplari).map((macId) => {
              const macOyunculari = macGruplari[macId];
              
              // Takımlara göre ayır (Ev ve Deplasman kadrosu olarak)
              const takimGruplari = macOyunculari.reduce((acc: Record<string, Esame[]>, cur) => {
                if (!acc[cur.takim_id]) acc[cur.takim_id] = [];
                acc[cur.takim_id].push(cur);
                return acc;
              }, {});

              // Maç isminden ev ve deplasmanı ayıkla (Örn: "1. HAFTA - Yeşil Bursa FC 🆚 BİSKREM FC")
              let evTakimi = "Ev Takımı";
              let depTakimi = "Deplasman Takımı";
              
              try {
                if (macId.includes(" 🆚 ")) {
                  const parts = macId.split(" - ");
                  const takımlar = parts.length > 1 ? parts[1].split(" 🆚 ") : parts[0].split(" 🆚 ");
                  evTakimi = takımlar[0].trim();
                  depTakimi = takımlar[1].trim();
                }
              } catch (e) {}

              const RenderKadro = (takimAdi: string) => {
                const kadro = takimGruplari[takimAdi] || [];
                const asil = kadro.filter(o => o.ilk_yedi);
                const yedek = kadro.filter(o => !o.ilk_yedi);

                if (kadro.length === 0) {
                  return (
                    <div className="bg-[#111] p-6 h-full flex flex-col items-center justify-center text-gray-600 border-b border-white/5">
                      <div className="text-3xl mb-3">⏳</div>
                      <div className="text-sm md:text-base font-bold text-center">
                        {takimAdi}<br/>henüz kadro girmedi.
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="bg-[#111] p-6 border-b border-white/5">
                    <h3 className="text-lg md:text-xl font-black text-yellow-500 mb-6 pb-3 border-b border-white/5 truncate">
                      🛡️ {takimAdi}
                    </h3>

                    {/* İlk 7 */}
                    <div className="mb-6">
                      <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">İlk 7 ({asil.length})</div>
                      <div className="space-y-3">
                        {asil.map(o => (
                          <div key={o.id} className={`flex items-center gap-4 p-3 rounded-xl ${o.kaptan ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-[#1a1a1a] border border-transparent'}`}>
                            <div className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center text-sm font-black text-gray-400 border border-white/5">
                              {o.forma_no || "-"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-base truncate ${o.kaptan ? 'text-yellow-500' : 'text-gray-200'}`}>{o.ad_soyad}</div>
                              <div className="text-xs text-gray-500 truncate">{o.pozisyon}</div>
                            </div>
                            {o.kaptan && <span className="text-xs bg-yellow-500 text-black font-black px-3 py-1 rounded-md">© KAPTAN</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Yedekler */}
                    {yedek.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Yedekler ({yedek.length})</div>
                        <div className="space-y-3">
                          {yedek.map(o => (
                            <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#1a1a1a]/50 border border-white/5 opacity-70">
                              <div className="w-10 h-10 shrink-0 rounded-full bg-black flex items-center justify-center text-sm font-black text-gray-500 border border-white/5">
                                {o.forma_no || "-"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-base text-gray-400 truncate">{o.ad_soyad}</div>
                                <div className="text-xs text-gray-600 truncate">{o.pozisyon}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <div key={macId} className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  {/* Maç Başlığı */}
                  <div className="bg-[#1a1a1a] p-4 border-b border-[#d4af37]/20 flex justify-between items-center">
                    <h2 className="text-sm md:text-xl font-black text-white truncate pr-2">{macId}</h2>
                    <span className="shrink-0 bg-[#d4af37]/10 text-[#d4af37] px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border border-[#d4af37]/20">
                      {macOyunculari.length} Oyuncu
                    </span>
                  </div>

                  <div className="flex flex-col gap-px bg-white/5">
                    {RenderKadro(evTakimi)}
                    {RenderKadro(depTakimi)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
