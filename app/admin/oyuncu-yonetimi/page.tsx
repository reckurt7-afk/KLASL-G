"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function OyuncuYonetimiPage() {
  const [oyuncular, setOyuncular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOyuncular();
  }, []);

  async function fetchOyuncular() {
    const { data } = await supabase.from("oyuncular").select("*").order("takim", { ascending: true });
    setOyuncular(data || []);
    setLoading(false);
  }

  async function handleUpdate(id: number, field: string, value: string) {
    const { error } = await supabase.from("oyuncular").update({ [field]: value }).eq("id", id);
    if (error) alert("Hata: " + error.message);
    else fetchOyuncular();
  }

  async function sil(id: number, name: string) {
    if (!window.confirm(`${name} silinecek, emin misin?`)) return;
    await supabase.from("oyuncular").delete().eq("id", id);
    fetchOyuncular();
  }

  if (loading) return <div className="text-white p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-black text-[#d4af37]">Oyuncu Yönetimi</h1>
          <Link href="/admin" className="px-4 py-2 bg-white/10 rounded-xl">Geri Dön</Link>
        </div>
        <div className="bg-[#121212] rounded-xl overflow-hidden border border-white/10 p-4">
          <p className="text-gray-400 mb-4 text-sm">İsim veya takımı düzenlemek için kutuya tıklayıp değiştirin, çıkınca otomatik kaydeder.</p>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400">
              <tr>
                <th className="p-3">Oyuncu Adı</th>
                <th className="p-3">Takımı</th>
                <th className="p-3">Mevki</th>
                <th className="p-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {oyuncular.map((o) => (
                <tr key={o.id} className="border-t border-white/5">
                  <td className="p-3"><input type="text" defaultValue={o.ad_soyad} onBlur={(e) => handleUpdate(o.id, 'ad_soyad', e.target.value)} className="w-full bg-[#1a1a1a] p-2 rounded border border-white/20" /></td>
                  <td className="p-3"><input type="text" defaultValue={o.takim} onBlur={(e) => handleUpdate(o.id, 'takim', e.target.value)} className="w-full bg-[#1a1a1a] p-2 rounded border border-white/20" /></td>
                  <td className="p-3"><input type="text" defaultValue={o.mevki} onBlur={(e) => handleUpdate(o.id, 'mevki', e.target.value)} className="w-20 bg-[#1a1a1a] p-2 rounded border border-white/20" /></td>
                  <td className="p-3 text-right"><button onClick={() => sil(o.id, o.ad_soyad)} className="px-3 py-1 bg-red-600 rounded text-white text-xs">Sil</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
