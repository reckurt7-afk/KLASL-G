"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch, supabase } from "@/lib/supabase";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  gol: number;
  asist: number;
  mac: number;
  genel_puan: number;
};

export default function AdminIstatistiklerPage() {
  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetchOyuncular();
  }, []);

  async function fetchOyuncular() {
    setLoading(true);
    // Fetch all players using publicFetch
    const data = await publicFetch("oyuncular", "select=*&order=gol.desc,ad_soyad.asc");
    if (data && data.length > 0) {
      // DEDUPLICATE BY NAME: Keep only 1 record per player name
      const map = new Map<string, Oyuncu>();
      data.forEach((o) => {
        const norm = (o.ad_soyad || "").trim().toLowerCase();
        if (!map.has(norm)) {
          map.set(norm, {
            ...o,
            gol: o.gol || 0,
            asist: o.asist || 0,
            mac: o.mac || 0,
            genel_puan: o.genel_puan || 85,
          });
        }
      });

      setOyuncular(Array.from(map.values()));
    }
    setLoading(false);
  }

  const handleStatChange = (id: number, field: keyof Oyuncu, value: any) => {
    setOyuncular((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const saveOyuncu = async (o: Oyuncu) => {
    setSavingId(o.id);
    setMessage("");
    const { error } = await supabase
      .from("oyuncular")
      .update({
        gol: Number(o.gol),
        asist: Number(o.asist),
        mac: Number(o.mac),
        genel_puan: Number(o.genel_puan),
        mevki: o.mevki || "OS",
      })
      .eq("id", o.id);

    setSavingId(null);
    if (!error) {
      setMessage(`✅ ${o.ad_soyad} istatistikleri başarıyla kaydedildi.`);
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(`❌ Kaydetme hatası: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-3">
              ⚡ GOL & ASİST KRALLIĞI YÖNETİMİ
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Oyuncuların Gol, Asist, Maç sayısı ve Rating değerlerini buradan anında güncelleyebilirsiniz. (Tekilleştirilmiş Liste)
            </p>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all"
          >
            ← Admin Paneline Dön
          </Link>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold text-center">
            {message}
          </div>
        )}

        {/* PLAYERS LIST TABLE */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-xs font-black border-b border-white/10">
                <tr>
                  <th className="p-4">Oyuncu Adı</th>
                  <th className="p-4">Takım</th>
                  <th className="p-4">Mevki</th>
                  <th className="p-4 text-center">⚽ Gol</th>
                  <th className="p-4 text-center">🎯 Asist</th>
                  <th className="p-4 text-center">👕 Maç</th>
                  <th className="p-4 text-center">⭐ Rating</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-400 font-bold">
                      Oyuncular Yükleniyor...
                    </td>
                  </tr>
                ) : oyuncular.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-400">
                      Kayıtlı oyuncu bulunamadı.
                    </td>
                  </tr>
                ) : (
                  oyuncular.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-black text-white">{o.ad_soyad}</td>
                      <td className="p-4 text-gray-400 font-semibold">{o.takim}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={o.mevki || ""}
                          onChange={(e) => handleStatChange(o.id, "mevki", e.target.value)}
                          className="w-16 bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-center font-bold text-white text-xs"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          value={o.gol}
                          onChange={(e) => handleStatChange(o.id, "gol", e.target.value)}
                          className="w-16 bg-black/60 border border-[#ff3131]/40 rounded-lg px-2 py-1 text-center font-black text-[#ff3131] text-sm"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          value={o.asist}
                          onChange={(e) => handleStatChange(o.id, "asist", e.target.value)}
                          className="w-16 bg-black/60 border border-blue-500/40 rounded-lg px-2 py-1 text-center font-black text-blue-400 text-sm"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          value={o.mac}
                          onChange={(e) => handleStatChange(o.id, "mac", e.target.value)}
                          className="w-16 bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-center font-bold text-gray-300 text-xs"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          value={o.genel_puan}
                          onChange={(e) => handleStatChange(o.id, "genel_puan", e.target.value)}
                          className="w-16 bg-black/60 border border-yellow-500/40 rounded-lg px-2 py-1 text-center font-black text-yellow-400 text-sm"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => saveOyuncu(o)}
                          disabled={savingId === o.id}
                          className="px-4 py-1.5 bg-[#ff3131] hover:bg-[#d61111] text-white font-black rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                        >
                          {savingId === o.id ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
