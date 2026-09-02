
"use client";

import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MVPOylamaPage() {
  const { mac_id } = useParams();
  const { user, profil, loading: authLoading } = useAuth();
  const router = useRouter();

  const [mac, setMac] = useState<any>(null);
  const [takimArkadaslari, setTakimArkadaslari] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [secilenOyuncu, setSecilenOyuncu] = useState("");
  const [mesaj, setMesaj] = useState<{ tip: "ok"|"error", yazi: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/giris");
    }
    if (!authLoading && user && profil) {
      loadData();
    }
  }, [user, profil, authLoading]);

  async function loadData() {
    setLoading(true);
    
    // 1. Maci getir
    const { data: macData } = await supabase.from("maclar").select("*").eq("id", mac_id).single();
    
    if (!macData) {
      setMesaj({ tip: "error", yazi: "Maç bulunamadı." });
      setLoading(false);
      return;
    }

    setMac(macData);

    // 2. Kullanici macta oynayan bir takimda mi?
    if (profil?.takim !== macData.ev_sahibi && profil?.takim !== macData.deplasman) {
      setMesaj({ tip: "error", yazi: "Sadece bu maçta oynayan takımların oyuncuları oy kullanabilir." });
      setLoading(false);
      return;
    }

    // 3. Kullanici daha once oy kullanmis mi?
    const res = await fetch(`/api/mvp-vote?macId=${mac_id}`);
    const votesData = await res.json();
    const myVote = (votesData.votes || []).find((v: any) => v.anahtar === `mvp_vote_${mac_id}_${user?.id}`);
    
    if (myVote) {
      const voteValue = typeof myVote.deger === 'string' ? JSON.parse(myVote.deger) : myVote.deger;
      setMesaj({ tip: "error", yazi: `Zaten oy kullandınız! Verdiğiniz oy: ${voteValue.oylananOyuncu}` });
      setLoading(false);
      return;
    }

    // 4. Kullanicinin kendi takim arkadaslarini getir
    const { data: oyuncuData } = await supabase.from("oyuncular").select("*").eq("takim", profil?.takim);
    
    // Kendisini cikar
    const arkadaslar = (oyuncuData || []).filter(o => o.ad_soyad !== profil?.ad_soyad);
    setTakimArkadaslari(arkadaslar);
    setLoading(false);
  }

  async function oyGonder() {
    if (!secilenOyuncu) {
      setMesaj({ tip: "error", yazi: "Lütfen bir oyuncu seçin." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/mvp-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          macId: mac_id,
          userId: user?.id,
          takim: profil?.takim,
          oylananOyuncu: secilenOyuncu
        })
      });

      const data = await res.json();

      if (data.error) {
        setMesaj({ tip: "error", yazi: data.error });
      } else {
        setMesaj({ tip: "ok", yazi: `Oyunuz başarıyla ${secilenOyuncu} için kaydedildi! Sonuçlar maç bitiminde açıklanacak.` });
        setSecilenOyuncu("");
        setTakimArkadaslari([]);
      }
    } catch (err: any) {
      setMesaj({ tip: "error", yazi: err.message });
    }
    setIsSubmitting(false);
  }

  if (authLoading || loading) {
    return <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Ana Sayfaya Dön
        </Link>
        
        <div className="bg-[#121212] border border-[#d4af37]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[#d4af37]/10 blur-[50px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-center text-white mb-2 tracking-tight">🏆 MAÇIN <span className="text-[#d4af37]">ADAMI</span></h1>
            
            {mac && (
              <div className="text-center mb-8 bg-black/40 py-3 rounded-2xl border border-white/5">
                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">{mac.hafta}. HAFTA</p>
                <p className="text-lg font-black text-white">{mac.ev_sahibi} {mac.ev_skor} - {mac.dep_skor} {mac.deplasman}</p>
              </div>
            )}

            {mesaj && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center animate-fade-in ${mesaj.tip === 'ok' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {mesaj.yazi}
              </div>
            )}

            {takimArkadaslari.length > 0 && (!mesaj || mesaj.tip !== 'ok') && (
              <>
                <p className="text-gray-300 text-center text-sm mb-6 leading-relaxed">
                  Takımın <strong className="text-white">{profil?.takim}</strong> için sahanın yıldızı sence kimdi? Sadece 1 oy hakkın var, akıllıca kullan!
                </p>

                <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {takimArkadaslari.map(o => (
                    <div 
                      key={o.id} 
                      onClick={() => setSecilenOyuncu(o.ad_soyad)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${secilenOyuncu === o.ad_soyad ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${secilenOyuncu === o.ad_soyad ? 'border-[#d4af37] bg-[#d4af37]' : 'border-gray-500'}`}>
                        {secilenOyuncu === o.ad_soyad && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <div>
                        <p className="font-bold text-white text-base">{o.ad_soyad}</p>
                        <p className="text-xs text-gray-500 font-medium">{o.mevki || 'Belirsiz Mevki'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={oyGonder} 
                  disabled={isSubmitting || !secilenOyuncu}
                  className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b39024] hover:from-[#e3bd3f] hover:to-[#c29c27] text-black font-black text-lg rounded-2xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>MVP OYUMU GÖNDER <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
