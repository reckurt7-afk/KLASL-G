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
  return { id: h.id, baslik: h.baslik, ozet, detay, resim, kategori: h.renk || "Manşet", aktif: h.aktif, created_at: h.created_at };
}

const KATEGORILER = ["Manşet", "Röportaj", "Duyuru", "Transfer", "Analiz", "Galeri"];

export default function AdminGundemPage() {
  const [haberler, setHaberler] = useState<ReturnType<typeof parseHaber>[]>([]);
  const [baslik, setBaslik] = useState("");
  const [ozet, setOzet] = useState("");
  const [detay, setDetay] = useState("");
  const [kategori, setKategori] = useState("Manşet");
  const [resimUrl, setResimUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tip: "ok" | "hata"; yazi: string } | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadHaberler(); }, []);

  async function loadHaberler() {
    const { data } = await supabase.from("duyurular").select("*").neq("renk", "KAP").order("created_at", { ascending: false });
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
      aciklama: JSON.stringify({ ozet: ozet.trim(), detay: detay.trim(), resim: resimUrl || null }),
      renk: kategori,
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

    setSaving(false);
    if (error) { setMsg({ tip: "hata", yazi: error.message }); return; }

    if (editId === null) {
      try {
        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "PRO LİG BURSA BİR YENİ HABER VAR",
            mesaj: baslik.trim(),
            url: newId ? `/duyuru/${newId}` : "/duyurular"
          }),
        });
      } catch (err) {
        console.error("Bildirim hatası:", err);
      }
    }

    setMsg({ tip: "ok", yazi: editId ? "Haber güncellendi!" : "Haber eklendi ve yayınlandı! Bildirim gönderildi." });
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
    setDetay(h.detay);
    setKategori(h.kategori);
    setResimUrl(h.resim || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditId(null);
    setBaslik("");
    setOzet("");
    setDetay("");
    setKategori("Manşet");
    setResimUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const formatDate = (s: string) => new Date(s).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#e60000] rounded-xl flex items-center justify-center text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
        </div>
        <div>
          <h1 className="text-[20px] font-black text-[#1a1a2e]">Gündem / Haberler Yönetimi</h1>
          <p className="text-[12px] text-gray-500">Eklediğiniz haberler anasayfada Gündem bölümünde görünür</p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-[16px] font-black text-[#1a1a2e] mb-5">
          {editId ? "📝 Haberi Düzenle" : "➕ Yeni Haber Ekle"}
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
              rows={2}
              placeholder="Haberin kısa özeti..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]/20 resize-none"
            />
          </div>

          {/* Detay */}
          <div className="md:col-span-2">
            <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Haber Detayı (İçerik)</label>
            <textarea
              value={detay}
              onChange={(e) => setDetay(e.target.value)}
              rows={8}
              placeholder="Haberin tüm detayları..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]/20"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-bold text-gray-900 focus:outline-none focus:border-[#e60000]"
            >
              {KATEGORILER.map((kat) => (
                <option key={kat} value={kat}>{kat}</option>
              ))}
            </select>
          </div>

          {/* Resim */}
          <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1.5">Görsel (Dosya Yükle veya Link Gir)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={resimUrl}
                onChange={(e) => setResimUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:border-[#e60000] focus:ring-1 focus:ring-[#e60000]/20"
              />
              <input
                type="file"
                ref={fileRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadImage(file);
                    if (url) setResimUrl(url);
                  }
                }}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 rounded-xl text-[13px] border border-gray-200 transition-colors disabled:opacity-50"
              >
                {uploading ? "..." : "Yükle"}
              </button>
            </div>
          </div>

          {/* Butonlar */}
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-3 border-t border-gray-50">
            {editId && (
              <button
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl transition-colors text-[14px]"
              >
                Vazgeç
              </button>
            )}
            <button
              onClick={kaydet}
              disabled={saving}
              className="bg-[#e60000] hover:bg-[#cc0000] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:opacity-50 text-[14px]"
            >
              {saving ? "Kaydediliyor..." : (editId ? "Değişiklikleri Kaydet" : "Haber Yayınla")}
            </button>
          </div>
        </div>
      </div>

      {/* LİSTE */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-[16px] font-black text-[#1a1a2e] mb-5">Yayındaki Haberler ({haberler.length})</h2>

        <div className="space-y-4">
          {haberler.map((h) => (
            <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 gap-4">
              <div className="flex items-start gap-4">
                {h.resim && (
                  <img
                    src={h.resim}
                    alt={h.baslik}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] bg-red-50 text-[#e60000] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      {h.kategori}
                    </span>
                    <span className="text-[11px] text-gray-400">{formatDate(h.created_at)}</span>
                    {!h.aktif && <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded font-bold">GİZLİ</span>}
                  </div>
                  <h3 className="font-black text-[14px] text-[#1a1a2e] leading-tight mb-0.5">{h.baslik}</h3>
                  <p className="text-[12px] text-gray-500 line-clamp-2">{h.ozet}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAktif(h.id, h.aktif)}
                  className={`text-[12px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${h.aktif ? "bg-white text-gray-600 border-gray-200 hover:bg-gray-50" : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"}`}
                >
                  {h.aktif ? "Gizle" : "Göster"}
                </button>
                <button
                  onClick={() => duzle(h)}
                  className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563eb] hover:bg-blue-100 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => sil(h.id)}
                  className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-red-50 text-[#e60000] hover:bg-red-100 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}

          {haberler.length === 0 && (
            <p className="text-gray-500 font-bold text-center py-6">Kayıtlı haber bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}
