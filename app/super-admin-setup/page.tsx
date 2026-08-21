"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function SetupAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [msg, setMsg] = useState("Yükleniyor...");

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      setMsg("Önce giriş yapmalısınız! /giris sayfasına gidin.");
      return;
    }

    async function makeAdmin() {
      setMsg("Hesabınız yetkilendiriliyor...");
      
      const { error } = await supabase.from("user_roles").upsert({
        user_id: user!.id,
        city_id: 1,
        role: "super_admin"
      }, { onConflict: "user_id, city_id" });

      if (error) {
        setMsg("Hata: " + error.message);
      } else {
        setMsg("BAŞARILI! Artık Süper Adminsiniz. Yönlendiriliyorsunuz...");
        setTimeout(() => {
          window.location.href = "/super-admin";
        }, 1500);
      }
    }

    makeAdmin();
  }, [user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-4">Yetkilendirme</h1>
        <p className="text-gray-600 font-semibold">{msg}</p>
      </div>
    </div>
  );
}
