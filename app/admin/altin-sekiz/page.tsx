"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const DEFAULT_PLAYERS = [
  { id: "p1", name: "Ahmet Yılmaz", team: "Gravyer FC", pos: "KL", rating: 92, top: "88%", left: "50%" },
  { id: "p2", name: "Burak Demir", team: "Krokodilla", pos: "SĞB", rating: 89, top: "68%", left: "22%" },
  { id: "p3", name: "Can Kaya", team: "PS 5", pos: "ST", rating: 88, top: "72%", left: "50%" },
  { id: "p4", name: "Hasan Can", team: "Yediyol", pos: "SLB", rating: 87, top: "68%", left: "78%" },
  { id: "p5", name: "Ali Vefa", team: "Yeşil Bursa", pos: "SĞA", rating: 94, top: "42%", left: "22%" },
  { id: "p6", name: "Kemal Sun", team: "Gravyer FC", pos: "MO", rating: 95, top: "46%", left: "50%" },
  { id: "p7", name: "Emre Can", team: "Biskrem M.", pos: "SLA", rating: 90, top: "42%", left: "78%" },
  { id: "p8", name: "Mustafa S.", team: "Krokodilla", pos: "SNT", rating: 97, top: "16%", left: "50%" }
];

export default function AltinSekizAdmin() {
  const [players, setPlayers] = useState<any[]>(DEFAULT_PLAYERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from("ayarlar")
          .select("*")
          .eq("anahtar", "altin_sekiz_oyuncular")
          .single();

        if (data && data.deger) {
          const parsed = JSON.parse(data.deger);
          if (Array.isArray(parsed) && parsed.length === 8) {
            setPlayers(parsed);
          }
        }
      } catch (err) {
        console.error("Yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (index: number, field: string, value: string | number) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const jsonStr = JSON.stringify(players);

      const { data: mevcut } = await supabase
        .from("ayarlar")
        .select("id")
        .eq("anahtar", "altin_sekiz_oyuncular")
        .single();

      if (mevcut) {
        await supabase
          .from("ayarlar")
          .update({ deger: jsonStr })
          .eq("anahtar", "altin_sekiz_oyuncular");
      } else {
        await supabase
          .from("ayarlar")
          .insert([{ anahtar: "altin_sekiz_oyuncular", deger: jsonStr }]);
      }

      alert("Başarıyla kaydedildi!");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              ALTIN 8'İ GÜNCELLE
            </h1>
            <p className="text-gray-400">Haftanın en iyi 8 oyuncusunu buradan düzenleyebilirsin.</p>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-bold transition-colors">
            Geri Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {players.map((p, index) => (
            <div key={p.id} className="bg-[#111] border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="font-black text-amber-500 uppercase tracking-widest">{p.pos}</span>
                <span className="text-xs text-gray-500">Oyuncu {index + 1}</span>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Oyuncu Adı Soyadı</label>
                <input 
                  type="text" 
                  value={p.name} 
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 mb-1">Takımı</label>
                  <input 
                    type="text" 
                    value={p.team} 
                    onChange={(e) => handleChange(index, 'team', e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-bold text-gray-400 mb-1">Puan</label>
                  <input 
                    type="number" 
                    value={p.rating} 
                    onChange={(e) => handleChange(index, 'rating', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-amber-500 font-black text-center text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-black rounded-xl text-lg uppercase tracking-wider transition-all disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "KADROYU YAYINLA"}
        </button>

      </div>
    </div>
  );
}
