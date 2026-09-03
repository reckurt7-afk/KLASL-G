"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Haber = {
  id: number;
  baslik: string;
  aciklama: string;
  renk: string; 
  aktif: boolean;
  created_at: string;
  resim?: string | null; 
};

function parseHaber(h: any) {
  let ozet = h.aciklama || "";
  let resim: string | null = null;
  let detay = "";
  try {
    const parsed = JSON.parse(h.aciklama || "{}");
    if (parsed.ozet !== undefined) {
      ozet = parsed.ozet;
      resim = parsed.resim || null;
      detay = parsed.detay || "";
    }
  } catch {}
  return { id: h.id, baslik: h.baslik, ozet, detay, resim, kategori: h.renk || "KAP", aktif: h.aktif, created_at: h.created_at };
}

export default function KapBildirimleriAdminPage() {
  const [haberler, setHaberler] = useState<ReturnType<typeof parseHaber>[]>([]);
  const [baslik, setBaslik] = useState("");
  const [ozet, setOzet] = useState("");
  const [detay, setDetay] = useState("");
  const [resimUrl, setResimUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tip: "ok" | "hata"; yazi: string } | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadHaberler(); }, []);

  async function loadHaberler() {
    const { data } = await supabase.from("duyurular").select("*").eq("renk", "KAP").order("created_at", { ascending: false });
    setHaberler((data || []).map(parseHaber));
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `kap/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("galeri").upload(path, file, { upsert: true });
      if (error) { setMsg({ tip: "hata", yazi: "Resim yüklenemedi: " + error.message }); return null; }
      const { data } = supabase.storage.from("galeri").getPublicUrl(path);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  }

  async function kaydet() {
    if (!baslik.trim()) { setMsg({ tip: "hata", yazi: "Başlık zorunludur." }); return; }
    setSaving(true); setMsg(null);

    const finalResimUrl = resimUrl.trim() || "/images/default-kap.jpg";

    const payload = {
      baslik: baslik.trim(),
      aciklama: JSON.stringify({ ozet: ozet.trim(), detay: detay.trim(), resim: finalResimUrl }),
      renk: "KAP", 
      aktif: true,
    };

    let error;
    let newId = null;

    if (editId !== null) {
      ({ error } = await supabase.from("duyurular").update(payload).eq("id", editId));
    } else {
      const { data, error: insertError } = await supabase.from("duyurular").insert(payload).select("id").single();
      error = insertError;
      newId = data?.id;
    }

    if (error) {
      setSaving(false);
      setMsg({ tip: "hata", yazi: error.message });
      return;
    }

    // Yeni eklendiyse telefonlara otomatik push bildirim gönder
    if (editId === null) {
      try {
        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "PRİME LİG BURSA KAP BİLDİRİMİ",
            mesaj: baslik.trim(),
            url: newId ? `/duyuru/${newId}` : "/lig"
          }),
        });
      } catch (err) {
        console.error("Bildirim gönderme hatası:", err);
      }
    }

    setSaving(false);
    setMsg({ tip: "ok", yazi: editId ? "KAP Bildirimi güncellendi!" : "KAP Bildirimi eklendi ve yayınlandı!" });
    resetForm();
    loadHaberler();
  }

  async function sil(id: number) {
    if (!confirm("Bu KAP Bildirimini silmek istediğinize emin misiniz?")) return;
    await supabase.from("duyurular").delete().eq("id", id);
    loadHaberler();
  }

  function duzle(h: ReturnType<typeof parseHaber>) {
    setEditId(h.id);
    setBaslik(h.baslik);
    setOzet(h.ozet);
    setDetay(h.detay);
    setResimUrl(h.resim || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditId(null);
    setBaslik("");
    setOzet("");
    setDetay("");
    setResimUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-[#1a1a2e]">
            KAP Bildirimleri
          </h1>
          <p className="text-gray-500 font-medium mt-1">Buradan lig sayfasındaki KAP Bildirimlerini yönetebilirsiniz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Alanı */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{editId ? "KAP Düzenle" : "Yeni KAP Ekle"}</h2>

            {msg && (
              <div className={`p-4 rounded-xl mb-6 text-[13px] font-bold border ${msg.tip === "ok" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-[#ceaa52] border-red-200"}`}>
                {msg.yazi}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Başlık *</label>
                <input value={baslik} onChange={e => setBaslik(e.target.value)} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all" placeholder="Örn: Hafta Sonu Derbisi" />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Kısa Özet</label>
                <textarea value={ozet} onChange={e => setOzet(e.target.value)} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all resize-none" placeholder="Kısa liste özeti..." />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Haber Detayı (İçerik)</label>
                <textarea value={detay} onChange={e => setDetay(e.target.value)} rows={6} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all" placeholder="Tüm haber detayları..." />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Kapak Görseli (Görsel URL veya Yükle)</label>
                <div className="flex gap-2">
                  <input type="text" value={resimUrl} onChange={e => setResimUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]" />
                  <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await uploadImage(f);
                      if (url) setResimUrl(url);
                    }
                  }} />
                  <button onClick={() => fileRef.current?.click()} type="button" disabled={uploading} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-xl text-[12px] border border-gray-200 transition-colors">
                    Yükle
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button onClick={kaydet} disabled={saving} className="flex-1 bg-[#1e3a8a] hover:bg-[#9e1b22] text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-[14px]">
                  {saving ? "Kaydediliyor..." : (editId ? "Güncelle" : "Yayınla")}
                </button>
                {editId && (
                  <button onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-3 rounded-xl transition-colors text-[14px]">
                    İptal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Liste Alanı */}
        <div className="lg:col-span-2 space-y-4">
          {haberler.map(h => (
            <div key={h.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex gap-5 items-start group">
              <div className="w-[100px] sm:w-[140px] aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-50">
                {h.resim ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${h.resim})` }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-0.5 rounded">KAP BİLDİRİMİ</span>
                  <span className="text-[11px] font-bold text-gray-400">{new Date(h.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <h3 className="text-[15px] sm:text-[17px] font-black text-[#1a1a2e] mb-1.5 leading-tight">{h.baslik}</h3>
                <p className="text-[12px] sm:text-[13px] text-gray-500 line-clamp-2 leading-relaxed">{h.ozet}</p>
                
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => duzle(h)} className="text-[#2563eb] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors">
                    Düzenle
                  </button>
                  <button onClick={() => sil(h.id)} className="text-[#1e3a8a] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors">
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
          {haberler.length === 0 && (
            <div className="bg-white border border-gray-100 border-dashed rounded-2xl p-12 text-center">
              <p className="text-gray-500 font-bold">KAP Bildirimi bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
