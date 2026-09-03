"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Duyuru = {
  id: number;
  baslik: string;
  aciklama: string;
  renk: string;
  aktif: boolean;
  created_at: string;
};

export default function DuyurularPage() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getir();
  }, []);

  async function getir() {
    setLoading(true);
    const { data, error } = await supabase
      .from("duyurular")
      .select("*")
      .eq("aktif", true)
      .neq("renk", "KAP")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDuyurular(data);
    }
    setLoading(false);
  }

  return (
    <main className="page">
      <div className="container max-w-[800px]">
        <div className="text-center mb-12">
          <h1 className="section-title">📢 DUYURULAR</h1>
          <p className="section-sub">LİGDEN SON HABERLER VE BİLGİLENDİRMELER</p>
        </div>

        <div className="flex flex-col gap-6">
          {loading ? (
            <>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="card p-6 flex flex-col gap-3">
                  <div className="skeleton h-7 w-2/3"></div>
                  <div className="skeleton h-4 w-1/4 mb-2"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-5/6"></div>
                </div>
              ))}
            </>
          ) : duyurular.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              Henüz duyuru bulunmuyor.
            </div>
          ) : (
            duyurular.map((duyuru) => (
              <div
                key={duyuru.id}
                className="card p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-white/10"
                style={{ borderLeft: `4px solid ${duyuru.renk || "#ceaa52"}` }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className="text-6xl text-[#ceaa52]">”</span>
                </div>
                
                <h2 className="text-white text-xl font-bold mb-2 pr-8 relative z-10">
                  {duyuru.baslik}
                </h2>
                
                <div className="text-[#ceaa52] text-xs font-bold tracking-widest uppercase mb-4">
                  {new Date(duyuru.created_at).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
                
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm relative z-10">
                  {duyuru.aciklama}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}