"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch, supabase } from "@/lib/supabase";

type Oyuncu = {
  id: number;
  ad_soyad: string;
  takim: string;
  mevki: string;
  genel_puan: number;
  foto_url?: string;
  is_premium?: boolean;
};

export default function AdminHaftaninYedisiPage() {
  const [oyuncular, setOyuncular] = useState<Oyuncu[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOyuncular();
  }, []);

  async function fetchOyuncular() {
    setLoading(true);
    const data = await publicFetch("oyuncular", "select=*&order=genel_puan.desc,ad_soyad.asc");

    if (data && data.length > 0) {
      // DEDUPLICATE BY NAME: Keep only 1 record per player name
      const map = new Map<string, Oyuncu>();
      data.forEach((o) => {
        const norm = (o.ad_soyad || "").trim().toLowerCase();
        if (!map.has(norm)) {
          map.set(norm, o);
        }
      });
      const uniqueOyuncular = Array.from(map.values());
      setOyuncular(uniqueOyuncular);

      // Selected top 7 or marked as is_premium
      const selected = uniqueOyuncular
        .filter((o) => o.is_premium)
        .map((o) => o.id);

      if (selected.length === 7) {
        setSelectedIds(selected);
      } else {
        // Default top 7 rating
        setSelectedIds(uniqueOyuncular.slice(0, 7).map((o) => o.id));
      }
    }
    setLoading(false);
  }

  const toggleSelectPlayer = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 7) {
        setMessage("⚠️ En fazla 7 oyuncu seçebilirsiniz!");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const kaydetKadro = async () => {
    setSaving(true);
    setMessage("");

    // 1. Reset all players is_premium = false
    const { error: resetError } = await supabase.from("oyuncular").update({ is_premium: false }).neq("id", 0);
    
    if (resetError) {
      setSaving(false);
      setMessage("❌ HATA: Kaydetme başarısız!");
      return;
    }

    // 2. Set selected 7 players is_premium = true
    if (selectedIds.length > 0) {
      for (let i = 0; i < selectedIds.length; i++) {
        const { error: updateError } = await supabase
          .from("oyuncular")
          .update({ is_premium: true })
          .eq("id", selectedIds[i]);
          
        if (updateError) {
          console.error("Güncelleme hatası:", updateError);
        }
      }
    }

    setSaving(false);
    setMessage("🌟 Haftanın 7'si kadrosu başarıyla kaydedildi!");
    setTimeout(() => setMessage(""), 5000);
  };

  // Filter players by search query
  const filteredOyuncular = oyuncular.filter(
    (o) =>
      o.ad_soyad.toLowerCase().includes(search.toLowerCase()) ||
      o.takim.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-[#ffd700] flex items-center gap-3">
              🌟 HAFTANIN 7'Sİ HIZLI SEÇİM PANELİ
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Listeden istediğiniz 7 oyuncunun üzerine tıklayarak yeşil saha kadrosunu hemen oluşturabilirsiniz.
            </p>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all shrink-0"
          >
            ← Admin Paneline Dön
          </Link>
        </div>

        {/* SEARCH & STATUS BAR */}
        <div className="bg-[#121212] border border-[#ffd700]/30 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
            <input
              type="text"
              placeholder="Oyuncu veya takım adı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/20 rounded-xl font-bold text-white text-sm focus:border-[#ffd700] outline-none"
            />
          </div>

          {/* STATUS COUNT & SAVE BUTTON */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="font-extrabold text-sm text-gray-300">
              Seçilen Oyuncular:{" "}
              <span className={`text-xl font-black ${selectedIds.length === 7 ? "text-emerald-400" : "text-yellow-400"}`}>
                {selectedIds.length} / 7
              </span>
            </div>

            <button
              onClick={kaydetKadro}
              disabled={saving || selectedIds.length !== 7}
              className="px-6 py-3 bg-gradient-to-r from-[#ffd700] via-[#ffb700] to-[#c48d00] text-black font-black rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] disabled:opacity-40 cursor-pointer hover:scale-105 active:scale-95"
            >
              {saving ? "Kaydediliyor..." : "💾 KADROYU KAYDET"}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-bold text-center">
            {message}
          </div>
        )}

        {/* PLAYERS SELECTION GRID WITH CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center p-8 text-gray-400 font-bold">
              Oyuncular Yükleniyor...
            </div>
          ) : filteredOyuncular.length === 0 ? (
            <div className="col-span-3 text-center p-8 text-gray-400 font-bold">
              Aranan kriterlere uygun oyuncu bulunamadı.
            </div>
          ) : (
            filteredOyuncular.map((o) => {
              const isSelected = selectedIds.includes(o.id);
              return (
                <div
                  key={o.id}
                  onClick={() => toggleSelectPlayer(o.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-gradient-to-b from-[#292211] via-[#1a1408] to-[#0f0c05] border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.35)] scale-[1.02]"
                      : "bg-[#141414] border-white/5 hover:border-white/20 text-gray-300 hover:bg-[#1a1a1a]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#ffd700] border-[#ffd700] text-black shadow-md"
                          : "border-gray-600 bg-black/50 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base">{o.ad_soyad}</h4>
                      <p className="text-gray-400 text-xs font-semibold">{o.takim} ({o.mevki || "OS"})</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[#ffd700] text-lg font-black">{o.genel_puan || 85}</span>
                    <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">RATING</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
