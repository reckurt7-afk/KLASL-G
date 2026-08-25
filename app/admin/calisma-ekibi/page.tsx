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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">ÇALIŞMA EKİBİ YÖNETİMİ</h1>
            <p className="text-gray-500 font-medium mt-1">Personelleri, yöneticileri ve hakemleri buradan kolayca ekleyin.</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-[#ff3131]/10 text-[#ff3131] px-4 py-2 rounded-lg font-bold text-sm">
              Toplam {ekip.length} Kişi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* YENİ ÜYE EKLE FORM */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-black text-gray-900 uppercase">Yeni Üye Ekle</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleEkle} className="flex flex-col gap-5">
                  
                  {/* Fotoğraf Yükleme */}
                  <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden relative group hover:border-[#ff3131] transition-colors cursor-pointer" onClick={() => document.getElementById('foto-upload')?.click()}>
                      {formData.fotoPreview ? (
                        <Image src={formData.fotoPreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-gray-400 group-hover:text-[#ff3131] transition-colors mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fotoğraf</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Değiştir</span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} id="foto-upload" className="hidden" />
                  </div>

                  {/* Inputlar */}
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5 block">Ad Soyad</label>
                    <input type="text" required value={formData.ad_soyad} onChange={e => setFormData({...formData, ad_soyad: e.target.value})} className="w-full bg-white border border-gray-300 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] rounded-xl p-3 text-gray-900 transition-all outline-none font-medium placeholder-gray-400" placeholder="Örn: Recep Şentürk" />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5 block">Görev / Unvan</label>
                    <input type="text" required value={formData.gorev} onChange={e => setFormData({...formData, gorev: e.target.value})} className="w-full bg-white border border-gray-300 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] rounded-xl p-3 text-gray-900 transition-all outline-none font-medium placeholder-gray-400" placeholder="Örn: Kurucu Başkan" />
                    <p className="text-[10px] text-gray-400 mt-1">İçinde "Ortak" veya "Başkan" geçerse en tepeye yerleşir.</p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5 block">Instagram (İsteğe Bağlı)</label>
                    <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full bg-white border border-gray-300 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] rounded-xl p-3 text-gray-900 transition-all outline-none font-medium placeholder-gray-400" placeholder="Örn: @klaslig" />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5 block">Sıralama (Opsiyonel)</label>
                    <input type="number" value={formData.sira} onChange={e => setFormData({...formData, sira: parseInt(e.target.value)})} className="w-full bg-white border border-gray-300 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] rounded-xl p-3 text-gray-900 transition-all outline-none font-medium placeholder-gray-400" />
                    <p className="text-[10px] text-gray-400 mt-1">1 en üstte çıkar, 99 en altta.</p>
                  </div>

                  <button type="submit" disabled={saving} className="mt-2 w-full bg-[#ff3131] text-white font-black py-3.5 rounded-xl hover:bg-[#d62020] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        EKİBE EKLE
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* MEVCUT EKİP LİSTESİ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 uppercase">Kayıtlı Ekip Üyeleri</h2>
                <div className="text-sm font-bold text-gray-400">{ekip.length} Kişi</div>
              </div>
              
              <div className="p-6 flex-1 bg-gray-50/50">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#ff3131]/20 border-t-[#ff3131] rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 font-medium">Ekip yükleniyor...</p>
                  </div>
                ) : ekip.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-1">Henüz kimse eklenmedi</h3>
                    <p className="text-gray-500 text-sm">Sol taraftaki formu kullanarak ekibe yeni üyeler ekleyebilirsiniz.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ekip.map((kisi) => (
                      <div key={kisi.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
                        
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-gray-100 shrink-0 overflow-hidden relative border border-gray-200">
                          {kisi.foto_url ? (
                            <Image src={kisi.foto_url} alt={kisi.ad_soyad} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Detaylar */}
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-gray-900 truncate">{kisi.ad_soyad}</div>
                          <div className="text-[11px] uppercase font-bold text-[#ff3131] truncate mb-0.5">{kisi.gorev}</div>
                          {kisi.instagram && (
                            <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                              {kisi.instagram}
                            </div>
                          )}
                        </div>
                        
                        {/* Sil Butonu */}
                        <button 
                          onClick={() => handleSil(kisi.id)} 
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg group-hover:bg-red-50 group-hover:text-red-500 hover:!bg-red-500 hover:!text-white transition-colors"
                          title="Sil"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
