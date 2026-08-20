"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profil: { ad_soyad: string; telefon: string; avatar_url?: string; takim?: string; } | null;
  cikisYap: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profil: null,
  cikisYap: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profil, setProfil] = useState<{ ad_soyad: string; telefon: string; avatar_url?: string; takim?: string; } | null>(null);

  useEffect(() => {
    // Mevcut oturumu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) profilGetir(session.user.id);
      setLoading(false);
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) profilGetir(session.user.id);
      else setProfil(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function profilGetir(userId: string) {
    const { data } = await supabase
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
  }

  async function cikisYap() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfil(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, profil, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
