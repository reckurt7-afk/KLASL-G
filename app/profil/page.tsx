"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const TEAM_LOGOS: Record<string, string> = {
  "PS 5": "/logos/ps5.png",
  "KROKODİLLA FC": "/logos/krokodilla-fc.png",
  "NOVA FC": "/logos/nova-fc.png",
  "YEŞİL BURSA FC": "/logos/yesil-bursa-fc.png",
  "YEDİYOL BLACK FC": "/logos/yediyol-black-fc.png",
  "GRAVYER FC": "/logos/gravyer-fc.png",
  "BİSKREM FC": "/logos/biskrem-fc.png",
  "DİNAMO NALBANTOĞLU": "/logos/dinamo-nalbantoglu.png",
};

export default function ProfilPage() {
  const { user, profil, loading, cikisYap } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/giris");
    }
  }, [user, loading]);

  if (loading || !user || !profil) {
    return (
      <div className="page flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ff3131] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profil.ad_soyad
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="section-title">👤 PROFİLİM</h1>
          <p className="section-sub">KLAS LİG BURSA</p>
        </div>

        {/* Profil Kartı */}
        <div className="card p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff3131] to-[#a11212] flex items-center justify-center text-white text-3xl font-black shadow-[0_0_20px_rgba(255,49,49,0.3)] shrink-0 overflow-hidden">
              {profil.avatar_url ? (
                <Image src={profil.avatar_url} alt={profil.ad_soyad} width={80} height={80} className="object-cover w-full h-full" />
              ) : initials}
            </div>
            <div>
              <h2 className="text-white text-2xl font-black">{profil.ad_soyad}</h2>
              <div className="flex items-center gap-2 mt-1">
                {user.email === "reckurt7@gmail.com" ? (
                  <p className="text-yellow-400 text-xs font-black tracking-widest uppercase bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(250,204,21,0.2)]">
                    👑 KURUCU
                  </p>
                ) : (
                  <p className="text-[#ff3131] text-xs font-bold tracking-widest uppercase">Klas Lig Üyesi</p>
                )}
                {(profil as any).takim && user.email !== "reckurt7@gmail.com" && (
                  <span className="text-[10px] bg-[#111] text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded uppercase font-bold">
                    Oyuncu
                  </span>
                )}
              </div>
            </div>
          </div>

          {(profil as any).takim && (
            <div className="flex justify-center mb-8">
              <div
                style={{
                  position: "relative",
                  width: 220,
                  height: 330,
                  background: "linear-gradient(135deg, #f6d365 0%, #ffb347 100%)",
                  borderRadius: "10% 10% 45% 45% / 10% 10% 15% 15%",
                  border: "3px solid #fff3cd",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ position: "absolute", top: 15, left: 15, textAlign: "center", zIndex: 2 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#4a3300", lineHeight: 1 }}>{(profil as any).genel_puan || "75"}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#4a3300", marginTop: 2 }}>{(profil as any).mevki ? (profil as any).mevki.substring(0,3).toUpperCase() : "OYT"}</div>
                  <div style={{ fontSize: 10, fontWeight: 900, color: "#4a3300", marginTop: 5, borderTop: "1px solid #855c0b", paddingTop: 3 }}>KLAS</div>
                </div>
                
                <div style={{ width: 140, height: 140, marginTop: 30, position: "relative", zIndex: 1 }}>
                  {profil.avatar_url ? (
                    <img src={profil.avatar_url} alt={profil.ad_soyad} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)", maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", fontSize: 100, color: "rgba(0,0,0,0.2)" }}>👤</div>
                  )}
                </div>

                <div style={{ width: "80%", textAlign: "center", borderBottom: "1px solid #855c0b", paddingBottom: 5, marginTop: 5, zIndex: 2 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#4a3300", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {profil.ad_soyad}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "85%", marginTop: 10, zIndex: 2 }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#4a3300" }}>{(profil as any).forma_no || "-"}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#855c0b" }}>FORMA</div>
                  </div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    {TEAM_LOGOS[(profil as any).takim] ? (
                      <img src={TEAM_LOGOS[(profil as any).takim]} alt={(profil as any).takim} style={{ width: 30, height: 30, objectFit: "contain" }} />
                    ) : (
                      <div style={{ width: 1, height: 25, background: "#855c0b", opacity: 0.5 }}></div>
                    )}
                  </div>
                  <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#4a3300", maxWidth: 70, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>{(profil as any).takim}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#855c0b", marginTop: 2 }}>TAKIM</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[rgba(255,255,255,0.06)]">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">E-posta</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[rgba(255,255,255,0.06)]">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Telefon</p>
              <p className="text-white font-medium">{profil.telefon}</p>
            </div>
            <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[rgba(255,255,255,0.06)]">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Üyelik ID</p>
              <p className="text-gray-400 font-mono text-xs">{user.id.slice(0, 16)}...</p>
            </div>
          </div>
        </div>



        {/* Çıkış ve Admin Butonları */}
        <div className="flex flex-col gap-3">
          {user.email === "reckurt7@gmail.com" && (
            <Link
              href="/admin"
              className="w-full py-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-black rounded-2xl hover:bg-yellow-500/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              👑 ADMİN PANELİNE GİT
            </Link>
          )}
          
          <button
            onClick={cikisYap}
            className="w-full py-4 bg-[#1a0a0a] border border-red-900/50 text-red-400 font-black rounded-2xl hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-200"
          >
            🚪 Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
