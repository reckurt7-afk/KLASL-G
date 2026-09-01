import { publicFetch } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

type Haber = {
  id: number;
  baslik: string;
  ozet: string;
  detay: string;
  resim: string | null;
  kategori: string;
  created_at: string;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DuyuruDetayPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let haber: Haber | null = null;
  
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
      haber = {
        id: d.id,
        baslik: d.baslik,
        ozet,
        detay: detay || ozet,
        resim,
        kategori: d.renk || "DUYURU",
        created_at: d.created_at
      };
    }
  } catch (err) {
    console.error("Haber detayları çekilemedi:", err);
  }

  if (!haber) {
    notFound();
  }

  const formatFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${d.toLocaleString('tr-TR', { month: 'long' })} ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const showImage = haber.resim || (haber.kategori === "KAP" ? "/images/default-kap.jpg" : null);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-6 font-sans">
      
      {/* Görsel ve Başlık */}
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-md mb-6">
        {showImage ? (
          <img 
            src={showImage} 
            alt={haber.baslik} 
            className="w-full h-auto block" 
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-[#1a1a2e] to-[#1e3a8a]/80" />
        )}
        
        {/* Karartma Overlay Sadece Altta */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none z-20" />
        
        {/* Yazılar (Görselin Sol Alt Köşesinde) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-30">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-bold">
            <span className="bg-[#1e3a8a] text-white px-2 py-0.5 rounded uppercase tracking-wider">
              Ana Haber
            </span>
            <span className="bg-[#1a1a2e]/90 text-white px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
              {haber.kategori}
            </span>
            <span className="text-gray-300 ml-1">
              {formatFullDate(haber.created_at)}
            </span>
          </div>
          <h1 className="text-[18px] sm:text-[22px] md:text-[28px] font-black leading-tight uppercase drop-shadow">
            {haber.baslik}
          </h1>
        </div>
      </div>

      {/* Özet Kutusu */}
      <div className="bg-[#f0f4f8] border-l-4 border-[#1e3a8a] rounded-r-2xl p-5 mb-5 mt-6">
        <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-1">Özet</h4>
        <p className="text-[#1a1a2e] font-medium text-[14px] leading-relaxed">
          {haber.ozet}
        </p>
      </div>

      {/* Haber Detayı */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm mb-5">
        <h3 className="text-[14px] font-black text-[#1e3a8a] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#1e3a8a]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Haber Detayı
        </h3>
        <div className="text-gray-700 text-[14px] leading-relaxed space-y-4 font-medium whitespace-pre-line">
          {haber.detay}
        </div>
      </div>

      {/* Haber Bilgileri */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <h4 className="text-[12px] font-black text-gray-500 uppercase tracking-wider mb-3">Haber Bilgileri</h4>
        <div className="flex items-center gap-6 text-[12px] font-bold text-gray-700 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Yayın Tarihi:</span>
            <span>{formatFullDate(haber.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Geri Dön Butonu */}
      <Link href="/" className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#cc0000] text-white font-black px-5 py-2.5 rounded-lg transition-all shadow-md text-[13px]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Anasayfa
      </Link>
    </div>
  );
}
