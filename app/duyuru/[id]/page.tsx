"use client";

import { use, useEffect, useState } from "react";
import { publicFetch } from "@/lib/supabase";
import Link from "next/link";

type Haber = {
  id: number;
  baslik: string;
  ozet: string;
  detay: string;
  resim: string | null;
  kategori: string;
  created_at: string;
};

export default function DuyuruDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [haber, setHaber] = useState<Haber | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetay() {
      try {
        const data = await publicFetch("duyurular", `select=*&id=eq.${id}`);
        if (data && data.length > 0) {
          const d = data[0];
          let ozet = d.aciklama || "";
          let resim = null;
          let detay = "";
          try {
            const j = JSON.parse(d.aciklama || "{}");
            if (j.ozet !== undefined) {
              ozet = j.ozet;
              resim = j.resim || null;
              detay = j.detay || "";
            }
          } catch {}
          setHaber({
            id: d.id,
            baslik: d.baslik,
            ozet,
            detay: detay || ozet, // Detay yoksa özeti göster
            resim,
            kategori: d.renk || "DUYURU",
            created_at: d.created_at
          });
        }
      } catch (err) {
        console.error("Haber detayları çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    getDetay();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!haber) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Haber bulunamadı.</h2>
        <Link href="/" className="bg-[#e60000] text-white px-6 py-2.5 rounded-xl font-bold">
          Anasayfaya Dön
        </Link>
      </div>
    );
  }

  const formatFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${d.toLocaleString('tr-TR', { month: 'long' })} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 font-sans">
      {/* Resim Alanı */}
      {haber.resim && (
        <div className="w-full aspect-[2/1] max-h-[500px] rounded-3xl overflow-hidden border border-gray-100 mb-6 shadow-sm">
          <img src={haber.resim} alt={haber.baslik} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Üst Bilgi Satırı */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-[12px] font-bold text-gray-500">
        <span className="bg-[#e60000] text-white text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
          Ana Haber
        </span>
        <span className="bg-[#1a1a2e] text-white text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
          {haber.kategori.toUpperCase()}
        </span>
        <span className="text-gray-400 ml-1">
          {formatFullDate(haber.created_at)}
        </span>
      </div>

      {/* Başlık */}
      <h1 className="text-[24px] md:text-[30px] font-black text-[#1a1a2e] leading-tight mb-8 uppercase">
        {haber.baslik}
      </h1>

      {/* Özet Kutusu */}
      <div className="bg-[#f0f4f8] border-l-4 border-[#e60000] rounded-r-2xl p-5 mb-6">
        <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-1">Özet</h4>
        <p className="text-[#1a1a2e] font-medium text-[15px] leading-relaxed">
          {haber.ozet}
        </p>
      </div>

      {/* Haber Detayı */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h3 className="text-[16px] font-black text-[#1a1a2e] mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e60000" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Haber Detayı
        </h3>
        <div className="text-gray-700 text-[14px] md:text-[15px] leading-relaxed space-y-4 font-medium whitespace-pre-line">
          {haber.detay}
        </div>
      </div>

      {/* Haber Bilgileri */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h4 className="text-[13px] font-black text-gray-500 uppercase tracking-wider mb-3">Haber Bilgileri</h4>
        <div className="flex items-center gap-6 text-[12px] font-bold text-gray-700 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Yayın Tarihi:</span>
            <span>{formatFullDate(haber.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Geri Dön Butonu */}
      <Link href="/" className="inline-flex items-center gap-2 bg-[#e60000] hover:bg-[#cc0000] text-white font-black px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-[14px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Anasayfa
      </Link>
    </div>
  );
}
