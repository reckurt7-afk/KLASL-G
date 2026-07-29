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
  ilk_11: boolean;
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
        <h1 className="text-3xl font-black text-[#ff3131] mb-8 border-b border-[#ff3131]/20 pb-4">
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

              return (
                <div key={macId} className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  {/* Maç Başlığı */}
                  <div className="bg-[#1a1a1a] p-4 border-b border-[#ff3131]/20 flex justify-between items-center">
                    <h2 className="text-xl font-black text-white">{macId}</h2>
                    <span className="bg-[#ff3131]/10 text-[#ff3131] px-3 py-1 rounded-full text-xs font-bold border border-[#ff3131]/20">
                      {macOyunculari.length} Oyuncu Bildirildi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                    {Object.keys(takimGruplari).map(takimAdi => {
                      const kadro = takimGruplari[takimAdi];
                      const asil = kadro.filter(o => o.ilk_11);
                      const yedek = kadro.filter(o => !o.ilk_11);

                      return (
                        <div key={takimAdi} className="bg-[#111] p-6">
                          <h3 className="text-lg font-black text-yellow-500 mb-4 pb-2 border-b border-white/5">
                            🛡️ {takimAdi} KADROSU
                          </h3>

                          {/* İlk 7 */}
                          <div className="mb-6">
                            <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">İlk 7 ({asil.length})</div>
                            <div className="space-y-2">
                              {asil.map(o => (
                                <div key={o.id} className={`flex items-center gap-3 p-2 rounded-lg ${o.kaptan ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-[#1a1a1a] border border-transparent'}`}>
                                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs font-black text-gray-400">
                                    {o.forma_no || "-"}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`font-bold ${o.kaptan ? 'text-yellow-500' : 'text-gray-200'}`}>{o.ad_soyad}</div>
                                    <div className="text-[10px] text-gray-500">{o.pozisyon}</div>
                                  </div>
                                  {o.kaptan && <span className="text-xs bg-yellow-500 text-black font-black px-2 py-0.5 rounded">©</span>}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Yedekler */}
                          {yedek.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Yedekler ({yedek.length})</div>
                              <div className="space-y-2">
                                {yedek.map(o => (
                                  <div key={o.id} className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1a1a]/50 border border-white/5 opacity-70">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs font-black text-gray-500">
                                      {o.forma_no || "-"}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-bold text-gray-400">{o.ad_soyad}</div>
                                      <div className="text-[10px] text-gray-600">{o.pozisyon}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
