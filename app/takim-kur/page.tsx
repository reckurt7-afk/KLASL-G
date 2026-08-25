"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TakimKurPage() {
  const router = useRouter();
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    league_id: "",
    logoFile: null as File | null,
    logoPreview: "",
  });

  useEffect(() => {
    async function fetchLeagues() {
      const { data } = await supabase
        .from("cities")
        .select("*")
        .eq("status", "AKTIF")
        .order("id", { ascending: true });
      if (data && data.length > 0) {
        setLeagues(data);
        setFormData((prev) => ({ ...prev, league_id: data[0].id.toString() }));
      }
    }
    fetchLeagues();
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
    setLoading(true);
    setMessage("");
    setError("");

    if (!formData.name.trim()) {
      setError("Lütfen takım adını girin.");
      setLoading(false);
      return;
    }
    if (!formData.logoFile) {
      setError("Lütfen takımınız için bir logo seçin.");
      setLoading(false);
      return;
    }

    try {
      // 1. Logoyu Supabase Storage'a yükle (team-logos bucket'ı)
      const fileExt = formData.logoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("team-logos")
        .upload(filePath, formData.logoFile);

      if (uploadError) {
        throw new Error("Logo yüklenirken hata oluştu. 'team-logos' adında public bir bucket olduğundan emin olun.");
      }

      // Logonun public URL'ini al
      const { data: publicUrlData } = supabase.storage
        .from("team-logos")
        .getPublicUrl(filePath);

      const logoUrl = publicUrlData.publicUrl;

      // 2. Takımı teams tablosuna kaydet
      const { error: insertError } = await supabase.from("teams").insert([
        {
          name: formData.name.trim(),
          league_id: parseInt(formData.league_id),
          logo: logoUrl,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goals_for: 0,
          goals_against: 0,
          goal_difference: 0,
          points: 0
        },
      ]);

      if (insertError) throw insertError;

      setMessage("Takım başarıyla kuruldu! Lige hoş geldiniz.");
      setTimeout(() => {
        router.push("/takimlar");
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Bilinmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-black text-[#ff3131] tracking-tight uppercase">
            Takımını Kur
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            Yeni sezonda efsane olmaya hazır mısın? Takımının adını belirle, logonu yükle ve lige katıl!
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold text-center animate-pulse">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold text-center">
            {error}
          </div>
        )}

        <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* LİG SEÇİMİ */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                1. Hangi Lige Katılacaksın?
              </label>
              <select
                value={formData.league_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, league_id: e.target.value }))}
                className="w-full bg-[#0b0b0b] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#ff3131] focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {leagues.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TAKIM ADI */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                2. Takım Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Örn: Klas FC"
                className="w-full bg-[#0b0b0b] border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#ff3131] focus:outline-none transition-colors"
                autoComplete="off"
              />
            </div>

            {/* LOGO YÜKLEME */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                3. Takım Logosu
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 shrink-0 rounded-xl bg-[#0b0b0b] border border-dashed border-white/20 flex items-center justify-center overflow-hidden relative">
                  {formData.logoPreview ? (
                    <Image src={formData.logoPreview} alt="Logo Preview" fill className="object-contain p-2" />
                  ) : (
                    <span className="text-gray-600 text-xs text-center font-bold px-2">Logo Seçilmedi</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="logo-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold cursor-pointer transition-colors w-full text-center"
                  >
                    Bilgisayardan / Telefondan Logo Seç
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#cc0000] hover:from-[#cc0000] hover:to-[#990000] text-white font-black rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(255,49,49,0.3)] hover:shadow-[0_0_30px_rgba(255,49,49,0.5)] disabled:opacity-50 cursor-pointer uppercase tracking-wider"
            >
              {loading ? "TAKIM KURULUYOR..." : "SAVAŞA HAZIRIM! (TAKIMI KUR)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
