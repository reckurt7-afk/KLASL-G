"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profil: { ad_soyad: string; telefon: string; avatar_url?: string; takim?: string; } | null;
  role: string | null;
  adminCityId: number | null;
  cikisYap: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profil: null,
  role: null,
  adminCityId: null,
  cikisYap: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profil, setProfil] = useState<{ ad_soyad: string; telefon: string; avatar_url?: string; takim?: string; } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [adminCityId, setAdminCityId] = useState<number | null>(null);

  useEffect(() => {
    // Mevcut oturumu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfil(session.user.id);
        fetchRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfil(session.user.id);
        fetchRole(session.user.id);
      } else {
        setProfil(null);
        setRole(null);
        setAdminCityId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role, city_id")
        .eq("user_id", userId)
        .single();
        
      if (data) {
        setRole(data.role);
        setAdminCityId(data.city_id);
      }
    } catch (error) {
      console.error("Role fetch error:", error);
    }
  };

  const fetchProfil = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiller")
        .select("ad_soyad, telefon, avatar_url, takim")
        .eq("id", userId)
        .single();
      
      if (data) {
        setProfil(data);
      } else {
        // Profil tablosunda yoksa Auth user metasından al (Fallback)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setProfil({
            ad_soyad: user.user_metadata?.ad_soyad || "Kullanıcı",
            telefon: user.user_metadata?.telefon || "",
            takim: user.user_metadata?.takim || "",
          });
        }
      }
    } catch (error) {
      console.error("Profil fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  async function cikisYap() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfil(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, profil, role, adminCityId, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
