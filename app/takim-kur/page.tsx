"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function TakimKurPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    leagueId: "",
    name: "",
    logoFile: null as File | null,
    logoPreview: "",
  });

  useEffect(() => {
    async function getLeagues() {
      const { data } = await supabase
        .from("cities")
        .select("*")
        .eq("status", "AKTIF")
        .order("id", { ascending: true });
        
      if (data) {
        const sorted = [...data];
        const index8 = sorted.findIndex(c => c.id === 8);
        if (index8 > -1) {
           const item8 = sorted.splice(index8, 1)[0];
           sorted.splice(1, 0, item8);
        }
        
        setLeagues(sorted);
        if (sorted.length > 0) {
          
        }
      }
    }
    getLeagues();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.leagueId) return alert("Takım adı ve lig seçimi zorunludur!");
    
    setLoading(true);
    try {
      let logoUrl = null;

      if (formData.logoFile) {
        const fileExt = formData.logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("team-logos")
          .upload(filePath, formData.logoFile);

        if (uploadError) throw new Error("Logo yüklenemedi: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("team-logos")
          .getPublicUrl(filePath);

        logoUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("teams").insert([{
        name: formData.name,
        league_id: parseInt(formData.leagueId),
        logo: logoUrl,
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0
      }]);

      
      if (insertError) throw insertError;

      try {
        const selectedLeague = leagues.find(l => l.id.toString() === formData.leagueId);
        const leagueName = selectedLeague ? selectedLeague.name.toUpperCase() : "KLAS LİG";
        
        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "🔥 SAVAŞA YENİ BİR TAKIM KATILDI!",
            mesaj: `${formData.name.toUpperCase()}, resmen ${leagueName} arenasında! Klas Lig ailesine hoş geldiniz. 🏆`,
            url: "/genel-bakis"
          })
        });
      } catch(e) {
        console.error("Bildirim gonderilemedi", e);
      }


      alert("Harika! Takımınız başarıyla kuruldu. Artık istatistiklerde yerinizi aldınız!");
      setFormData({ leagueId: leagues[0]?.id.toString() || "", name: "", logoFile: null, logoPreview: "" });
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-8 pb-20 font-sans">
      <div className="max-w-[800px] mx-auto px-4 md:px-6">
        
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
            🛡️ TAKIM KUR
          </h2>
          <p className="section-sub mt-2 tracking-[0.2em] font-bold text-[#ff3131] uppercase">
            YENİ SEZON KAYITLARI BAŞLADI
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* LİG SEÇİMİ */}
            <div>
              <label className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#ff3131] text-white flex items-center justify-center text-xs">1</span>
                Hangi Lige Katılacaksın?
              </label>
              <select 
                value={formData.leagueId} 
                onChange={e => setFormData({...formData, leagueId: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] rounded-xl p-4 text-gray-900 font-bold outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>Lütfen Katılacağınız Ligi Seçiniz</option>
                {leagues.map(l => (
                  <option key={l.id} value={l.id}>{l.name} {l.season && `(Sezon ${l.season})`}</option>
                ))}
              </select>
            </div>

            {/* TAKIM ADI */}
            <div>
              <label className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#ff3131] text-white flex items-center justify-center text-xs">2</span>
                Takım Adı
              </label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] rounded-xl p-4 text-gray-900 font-bold outline-none transition-all placeholder-gray-400" 
                placeholder="Örn: Klas FC" 
              />
            </div>

            {/* LOGO SEÇİMİ */}
            <div>
              <label className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#ff3131] text-white flex items-center justify-center text-xs">3</span>
                Takım Logosu
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                <div className="w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative shadow-inner">
                  {formData.logoPreview ? (
                    <Image src={formData.logoPreview} alt="Preview" fill className="object-cover p-2" />
                  ) : (
                    <div className="text-center p-2 text-gray-400">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-xs font-bold uppercase">Logo Yok</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full sm:w-auto">
                  <input type="file" accept="image/*" onChange={handleFileChange} id="logo-upload" className="hidden" />
                  <label 
                    htmlFor="logo-upload" 
                    className="w-full sm:w-auto block text-center bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl cursor-pointer transition-colors shadow-md"
                  >
                    Bilgisayardan / Telefondan Logo Seç
                  </label>
                  <p className="text-xs text-gray-500 mt-3 font-medium text-center sm:text-left">
                    Sadece JPG, PNG veya WebP. Max 5MB önerilir.
                  </p>
                </div>
              </div>
            </div>

            {/* GÖNDER */}
            <button 
              type="submit" 
              disabled={loading} 
              className="mt-6 w-full bg-gradient-to-r from-[#ff3131] to-[#d62020] text-white font-black text-lg py-5 rounded-xl hover:shadow-[0_10px_20px_rgba(255,49,49,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? "TAKIM KURULUYOR..." : "SAVAŞA HAZIRIM! (TAKIMI KUR)"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
