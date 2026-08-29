"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TakimYonetimiPage() {
  const [takimlar, setTakimlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTakimlar();
  }, []);

  async function fetchTakimlar() {
    setLoading(true);
    const { data } = await supabase
      .from("teams")
      .select("*, cities(name)")
      .order("created_at", { ascending: false });

    if (data) setTakimlar(data);
    setLoading(false);
  }

  async function takimSil(id: number, name: string) {
    if (!window.confirm(DİKKAT:  takımını silmek istediğinize emin misiniz? Bu işlem geri alınamaz!)) return;

    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) {
      alert("Hata: " + error.message);
    } else {
      alert("Takım başarıyla silindi!");
      setTakimlar(takimlar.filter(t => t.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1000px] mx-auto">
        
        <h1 className="text-3xl font-black uppercase tracking-wider mb-8 text-[#ff3131]">
          TAKIM YÖNETİMİ
        </h1>

        <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#161616]">
            <h2 className="text-lg font-bold text-gray-300">Tüm Takımlar ({takimlar.length})</h2>
            <button onClick={fetchTakimlar} className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
              Yenile
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a] text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b border-gray-800">Logo</th>
                  <th className="p-4 border-b border-gray-800">Takım Adı</th>
                  <th className="p-4 border-b border-gray-800">Lig / Sezon</th>
                  <th className="p-4 border-b border-gray-800">Kayıt Tarihi</th>
                  <th className="p-4 border-b border-gray-800 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-500">Yükleniyor...</td></tr>
                ) : takimlar.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-gray-500">Kayıtlı takım bulunamadı.</td></tr>
                ) : (
                  takimlar.map(t => (
                    <tr key={t.id} className="hover:bg-[#161616] transition-colors border-b border-gray-800/50">
                      <td className="p-4">
                        <div className="w-10 h-10 bg-black rounded-full overflow-hidden border border-gray-800 flex items-center justify-center">
                          {t.logo ? (
                            <img src={t.logo} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-600">Yok</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white">{t.name}</td>
                      <td className="p-4 text-gray-400 text-sm">{t.cities?.name || "-"}</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(t.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => takimSil(t.id, t.name)}
                          className="bg-red-900/40 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors"
                        >
                          SİL
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
