"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function AdminCalismaEkibi() {
  const [ekip, setEkip] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    ad_soyad: "",
    gorev: "",
    instagram: "",
    sira: 99,
    fotoFile: null as File | null,
    fotoPreview: "",
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEkip();
  }, []);

  async function fetchEkip() {
    setLoading(true);
    const { data } = await supabase.from("calisma_ekibi").select("*").order("sira", { ascending: true });
    setEkip(data || []);
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        fotoFile: file,
        fotoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ad_soyad || !formData.gorev) return alert("Ad ve görev zorunludur!");
    
    setSaving(true);
    try {
      let finalFotoUrl = null;

      if (formData.fotoFile) {
        const fileExt = formData.fotoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("staff-photos")
          .upload(filePath, formData.fotoFile);

        if (uploadError) throw new Error("Fotoğraf yüklenemedi: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("staff-photos")
          .getPublicUrl(filePath);

        finalFotoUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("calisma_ekibi").insert([{
        ad_soyad: formData.ad_soyad,
        gorev: formData.gorev,
        instagram: formData.instagram,
        sira: formData.sira,
        foto_url: finalFotoUrl
      }]);

      if (insertError) throw insertError;

      alert("Ekip üyesi başarıyla eklendi!");
      setFormData({ ad_soyad: "", gorev: "", instagram: "", sira: 99, fotoFile: null, fotoPreview: "" });
      fetchEkip();
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSil = async (id: number) => {
    if (!confirm("Bu kişiyi ekipten silmek istediğinize emin misiniz?")) return;
    await supabase.from("calisma_ekibi").delete().eq("id", id);
    fetchEkip();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">ÇALIŞMA EKİBİ YÖNETİMİ</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="bg-[#121212] p-6 rounded-2xl border border-white/10 lg:col-span-1 h-fit">
          <h2 className="text-xl font-bold text-[#00ff66] mb-6">Yeni Üye Ekle</h2>
          <form onSubmit={handleEkle} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-2 text-center items-center">
              <div className="w-24 h-24 rounded-full bg-black border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative mb-2">
                {formData.fotoPreview ? (
                  <Image src={formData.fotoPreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <span className="text-gray-500 text-xs">Foto</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} id="foto-upload" className="hidden" />
              <label htmlFor="foto-upload" className="bg-white/10 hover:bg-white/20 text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors">
                Fotoğraf Seç
              </label>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Ad Soyad</label>
              <input type="text" required value={formData.ad_soyad} onChange={e => setFormData({...formData, ad_soyad: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" placeholder="Örn: Recep Şentürk" />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Görev / Unvan</label>
              <input type="text" required value={formData.gorev} onChange={e => setFormData({...formData, gorev: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" placeholder="Örn: Kurucu Başkan" />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Instagram Kullanıcı Adı (İsteğe Bağlı)</label>
              <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" placeholder="Örn: @klaslig" />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Sıralama (1 en üstte)</label>
              <input type="number" value={formData.sira} onChange={e => setFormData({...formData, sira: parseInt(e.target.value)})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white" />
            </div>

            <button type="submit" disabled={saving} className="mt-4 w-full bg-[#00ff66] text-black font-black py-4 rounded-xl hover:bg-[#00cc52] transition-colors disabled:opacity-50">
              {saving ? "Ekleniyor..." : "EKİBE EKLE"}
            </button>
          </form>
        </div>

        {/* LİSTE */}
        <div className="lg:col-span-2">
          <div className="bg-[#121212] p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Mevcut Ekip ({ekip.length})</h2>
            
            {loading ? (
              <div className="text-gray-500">Yükleniyor...</div>
            ) : ekip.length === 0 ? (
              <div className="text-gray-500">Henüz kimse eklenmemiş.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ekip.map((kisi) => (
                  <div key={kisi.id} className="bg-black border border-white/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-900 shrink-0 overflow-hidden relative border border-[#00ff66]/30">
                      {kisi.foto_url ? (
                        <Image src={kisi.foto_url} alt={kisi.ad_soyad} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Yok</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{kisi.ad_soyad}</div>
                      <div className="text-xs text-[#00ff66] font-medium mb-1">{kisi.gorev}</div>
                      {kisi.instagram && <div className="text-xs text-gray-500">{kisi.instagram}</div>}
                    </div>
                    <button onClick={() => handleSil(kisi.id)} className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
