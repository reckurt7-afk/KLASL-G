"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Haber = {
  id: number;
  baslik: string;
  aciklama: string;
  renk: string; // kategori (Manşet, Röportaj, Duyuru, Transfer)
  aktif: boolean;
  created_at: string;
  resim?: string | null; // stored as JSON in aciklama: {ozet, resim}
};

type HaberData = {
  ozet: string;
  resim: string | null;
};

function parseHaber(h: any): { baslik: string; ozet: string; resim: string | null; kategori: string; aktif: boolean; id: number; created_at: string } {
  let ozet = h.aciklama || "";
  let resim: string | null = null;
  try {
    const parsed = JSON.parse(h.aciklama || "{}");
    if (parsed.ozet !== undefined) {
      ozet = parsed.ozet;
      resim = parsed.resim || null;
    }
  } catch {}
  return { id: h.id, baslik: h.baslik, ozet, resim, kategori: h.renk || "Manşet", aktif: h.aktif, created_at: h.created_at };
}

const KATEGORILER = ["Manşet", "Röportaj", "Duyuru", "Transfer", "Analiz", "Galeri"];

export default function AdminGundemPage() {
  const [haberler, setHaberler] = useState<ReturnType<typeof parseHaber>[]>([]);
  const [baslik, setBaslik] = useState("");
  const [ozet, setOzet] = useState("");
  const [kategori, setKategori] = useState("Manşet");
  const [resimUrl, setResimUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tip: "ok" | "hata"; yazi: string } | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadHaberler(); }, []);

  async function loadHaberler() {
    const { data } = await supabase.from("duyurular").select("*").order("created_at", { ascending: false });
    setHaberler((data || []).map(parseHaber));
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `gundem/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
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

    const payload = {
      baslik: baslik.trim(),
      aciklama: JSON.stringify({ ozet: ozet.trim(), resim: resimUrl || null }),
      renk: kategori,
      aktif: true,
    };

    let error;
    if (editId !== null) {
      ({ error } = await supabase.from("duyurular").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("duyurular").insert(payload));
      
      if (!error) {
        // Yeni haber eklendiğinde abonelere bildirim gönder
        fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "KAP BİLDİRİMİ: " + baslik.trim(),
            mesaj: ozet.trim() || "Klas Lig sistemine yeni bir duyuru eklendi, hemen incele!",
          })
        }).catch(err => console.error("Bildirim gönderme hatası:", err));
      }
    }

    setSaving(false);
    if (error) { setMsg({ tip: "hata", yazi: error.message }); return; }
    setMsg({ tip: "ok", yazi: editId ? "Haber güncellendi!" : "Haber eklendi ve yayınlandı!" });
    resetForm();
    loadHaberler();
  }

  async function sil(id: number) {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    await supabase.from("duyurular").delete().eq("id", id);
    loadHaberler();
  }

  async function toggleAktif(id: number, aktif: boolean) {
    await supabase.from("duyurular").update({ aktif: !aktif }).eq("id", id);
    loadHaberler();
  }

  function duzle(h: ReturnType<typeof parseHaber>) {
    setEditId(h.id);
    setBaslik(h.baslik);
    setOzet(h.ozet);
    setKategori(h.kategori);
    setResimUrl(h.resim || "");
  }

  function resetForm() {
    setEditId(null); setBaslik(""); setOzet(""); setKategori("Manşet"); setResimUrl("");
  }

  const formatDate = (s: string) => new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#e60000] rounded-xl flex items-center justify-center text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
        </div>
        <div>
          <h1 className="text-[20px] font-black text-[#1a1a2e]">Gündem / Haberler Yönetimi</h1>
          <p className="text-[12px] text-gray-500">Eklediğin haberler anasayfada Gündem bölümünde görünür</p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-[16px] font-black text-[#1a1a2e] mb-5">
          {editId ? "✏️ Haberi Düzenle" : "➕ Yeni Haber Ekle"}
        </h2>

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-[13px] font-bold ${msg.tip === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {msg.yazi}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Başlık */}
          <div className="md:col-span-2">
            <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Haber Başlığı *</label>
            <input
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              placeholder="Büyük Randevu Bursa'da!"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-bold text-gray-900 focus:outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]/20"
            />
          </div>

          {/* Özet */}
          <div className="md:col-span-2">
            <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Kısa Özet</label>
            <textarea
              value={ozet}
              onChange={(e) => setOzet(e.target.value)}
              rows={3}
              placeholder="Haberin kısa özeti..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]/20 resize-none"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-bold text-gray-900 focus:outline-none focus:border-[#e60000] bg-white"
            >
              {KATEGORILER.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>

          {/* Resim */}
          <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Haber Resmi</label>
            <div className="flex gap-2">
              <input
                value={resimUrl}
                onChange={(e) => setResimUrl(e.target.value)}
                placeholder="https://... veya dosya seç"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-700 focus:outline-none focus:border-[#e60000]"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[12px] px-4 py-3 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {uploading ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Yükle
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setResimUrl(url);
                }}
              />
            </div>
            {resimUrl && (
              <div className="mt-2 relative w-full h-[120px] rounded-lg overflow-hidden border border-gray-200">
                <img src={resimUrl} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setResimUrl("")} className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={kaydet}
            disabled={saving || uploading}
            className="bg-[#e60000] hover:bg-[#cc0000] text-white font-bold px-8 py-3 rounded-xl text-[14px] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : editId ? "Güncelle" : "Yayınla"}
          </button>
          {editId && (
            <button onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl text-[14px] transition-colors">
              İptal
            </button>
          )}
        </div>
      </div>

      {/* Haberler Listesi */}
      <div className="space-y-3">
        <h2 className="text-[15px] font-black text-[#1a1a2e] mb-3">Yayındaki Haberler ({haberler.length})</h2>
        {haberler.length === 0 && (
          <div className="bg-gray-50 rounded-xl py-12 text-center text-gray-400 text-[14px]">Henüz haber eklenmedi.</div>
        )}
        {haberler.map((h) => (
          <div key={h.id} className={`bg-white border rounded-xl p-4 flex gap-4 items-start transition-all ${h.aktif ? "border-gray-100 shadow-sm" : "border-gray-100 opacity-60"}`}>
            {/* Resim */}
            <div className="w-[80px] h-[60px] rounded-lg overflow-hidden shrink-0 bg-gray-100">
              {h.resim ? (
                <img src={h.resim} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#e60000] text-white text-[10px] font-bold px-2 py-0.5 rounded">{h.kategori}</span>
                <span className="text-[11px] text-gray-400">{formatDate(h.created_at)}</span>
                {!h.aktif && <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded font-bold">GİZLİ</span>}
              </div>
              <h3 className="font-black text-[14px] text-[#1a1a2e] leading-tight mb-0.5 truncate">{h.baslik}</h3>
              <p className="text-[12px] text-gray-500 truncate">{h.ozet}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleAktif(h.id, h.aktif)}
                title={h.aktif ? "Gizle" : "Yayınla"}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${h.aktif ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button
                onClick={() => duzle(h)}
                className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button
                onClick={() => sil(h.id)}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
