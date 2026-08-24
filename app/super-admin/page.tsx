"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const { user, profil, role, loading } = useAuth();
  const router = useRouter();
  const [cities, setCities] = useState<any[]>([]);
  const [stats, setStats] = useState({ takimlar: 0, oyuncular: 0, maclar: 0 });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCity, setNewCity] = useState({ name: "", slug: "", code: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Manage Modal State
  const [manageCity, setManageCity] = useState<any>(null);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/giris");
      return;
    }

    // Kurucu Yetkisi Kontrolü (Sadece sana özel)
    const isRecep = profil?.ad_soyad?.toLowerCase().includes("recep");
    const isSuperRole = role === "super_admin";
    
    if (isRecep || isSuperRole) {
      setIsSuperAdmin(true);
      setCheckingRole(false);
      loadDashboardData();
    } else {
      // Yetkisiz girişi engelle ve geri gönder
      alert("Bu sayfaya erişim yetkiniz bulunmuyor! Sadece sistem kurucusu erişebilir.");
      router.push("/");
    }
  }, [user, profil, role, loading, router]);

  const handleDeleteCity = async (cityId: number, cityName: string) => {
    if (!window.confirm(`DİKKAT! ${cityName} şehrini tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) return;
    
    const { error } = await supabase.from('cities').delete().eq('id', cityId);
    if (error) {
      alert('Silme hatası: ' + error.message);
    } else {
      alert('Şehir başarıyla silindi!');
      setManageCity(null);
      loadDashboardData();
    }
  };

  const loadDashboardData = async () => {
    const { data: cityData } = await supabase.from("cities").select("*").order("id", { ascending: true });
    if (cityData) setCities(cityData);

    const [takimRes, oyuncuRes, macRes] = await Promise.all([
      supabase.from("takimlar").select("id", { count: "exact" }),
      supabase.from("oyuncular").select("id", { count: "exact" }),
      supabase.from("maclar").select("id", { count: "exact" })
    ]);

    setStats({
      takimlar: takimRes.count || 0,
      oyuncular: oyuncuRes.count || 0,
      maclar: macRes.count || 0
    });
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.name || !newCity.slug || !newCity.code) return alert("Lütfen tüm alanları doldurun.");
    
    setIsSubmitting(true);
    const nextId = cities.length > 0 ? Math.max(...cities.map(c => Number(c.id))) + 1 : 1;

    const { error } = await supabase.from("cities").insert({
      id: nextId,
      name: newCity.name.toUpperCase(),
      slug: newCity.slug.toLowerCase(),
      code: newCity.code,
      status: "AKTIF"
    });

    if (error) {
      alert("Şehir eklenirken bir hata oluştu: " + error.message);
    } else {
      alert("Şehir başarıyla eklendi!");
      setNewCity({ name: "", slug: "", code: "" });
      setIsModalOpen(false);
      loadDashboardData();
    }
    setIsSubmitting(false);
  };

  if (loading || checkingRole) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">Yükleniyor...</div>;
  }

  if (!isSuperAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Merkez Yönetim (Super Admin)</h1>
            <p className="text-gray-500 mt-1">Tüm şehirleri ve tenantları buradan yönetebilirsiniz.</p>
          </div>
          <Link href="/admin" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors">
            Kendi Şehrime Dön
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-[#e60000] mb-2">{cities.length}</span>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Kayıtlı Şehir</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900 mb-2">{stats.takimlar}</span>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Toplam Takım</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900 mb-2">{stats.oyuncular}</span>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Toplam Oyuncu</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900 mb-2">{stats.maclar}</span>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Oynanan Maç</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Şehir Temsilcilikleri</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#e60000] hover:bg-[#cc0000] text-white px-5 py-2 rounded-lg font-bold transition-colors"
          >
            + Yeni Şehir Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div key={city.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 relative">
                {city.status === 'AKTIF' ? (
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">AKTİF</span>
                ) : (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">PASİF</span>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-gray-900 mb-1">{city.name}</h3>
                <p className="text-sm text-gray-500 mb-4">/{city.slug} - Kod: {city.code}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-400">Tenant ID: {city.id}</span>
                  <button onClick={() => setManageCity(city)} className="text-[#e60000] hover:text-[#cc0000] text-sm font-bold">
                    Yönet -&gt;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <h2 className="text-xl font-black text-gray-900 mb-4">Yeni Şehir Ekle</h2>
            
            <form onSubmit={handleCreateCity} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Şehir Adı (Örn: KLAS LİG İSTANBUL)</label>
                <input type="text" value={newCity.name} onChange={(e) => setNewCity({...newCity, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e60000] focus:border-transparent outline-none" placeholder="KLAS LİG İSTANBUL" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL için, Örn: istanbul)</label>
                <input type="text" value={newCity.slug} onChange={(e) => setNewCity({...newCity, slug: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e60000] focus:border-transparent outline-none" placeholder="istanbul" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Plaka / Şehir Kodu (Örn: 34)</label>
                <input type="text" value={newCity.code} onChange={(e) => setNewCity({...newCity, code: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e60000] focus:border-transparent outline-none" placeholder="34" required />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#e60000] hover:bg-[#cc0000] text-white font-bold py-3 rounded-lg transition-colors mt-4">
                {isSubmitting ? "Ekleniyor..." : "Şehri Oluştur ve Sistemi Başlat"}
              </button>
            </form>
          </div>
        </div>
      )}

      {manageCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => {setManageCity(null); setAdminEmail('');}} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <h2 className="text-2xl font-black text-gray-900 mb-6">{manageCity.name} Yönetimi</h2>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Şehir Temsilcisi (Admin) Ata</h3>
              <p className="text-sm text-gray-500 mb-4">
                Bu şehri yönetecek kişinin e-posta adresini girin. (Kullanıcının önce siteye kayıt olmuş olması gerekir.)
              </p>
              <div className="flex gap-2">
                <input 
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="temsilci@klaslig.com"
                  className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e60000] focus:border-transparent outline-none"
                />
                <button 
                  onClick={async () => {
                    if(!adminEmail) return alert('Lütfen e-posta girin');
                    const { data, error } = await supabase.rpc('assign_city_admin_by_email', {
                      admin_email: adminEmail,
                      target_city_id: manageCity.id
                    });
                    if(error) alert('Hata: ' + error.message);
                    else { alert(data); setAdminEmail(''); }
                  }}
                  className="bg-[#e60000] hover:bg-[#cc0000] text-white font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  Yetki Ver
                </button>
              </div>
            </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button 
                  onClick={() => handleDeleteCity(manageCity.id, manageCity.name)} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Şehri Sil
                </button>
                <button onClick={() => setManageCity(null)} className="text-gray-500 hover:text-gray-900 font-bold px-4 py-2 rounded-lg transition-colors">Kapat</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
