"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch, supabase } from "@/lib/supabase";

export default function AdminTransferPage() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    setLoading(true);
    // Fetch the setting
    const data = await publicFetch("ayarlar", "select=*&anahtar=eq.transfer_donemi");
    if (data && data.length > 0) {
      setIsOpen(data[0].deger === "acik");
    } else {
      // Default to closed if not exists
      setIsOpen(false);
    }
    setLoading(false);
  }

  const toggleStatus = async () => {
    setSaving(true);
    setMessage("");

    const newStatus = isOpen ? "kapali" : "acik";

    // Try updating first
    const { data: updateData, error: updateError } = await supabase
      .from("ayarlar")
      .update({ deger: newStatus })
      .eq("anahtar", "transfer_donemi")
      .select();

    if (updateError || !updateData || updateData.length === 0) {
      // If it fails or returns empty, it means the row doesn't exist. We must insert it.
      const { error: insertError } = await supabase
        .from("ayarlar")
        .insert([{ anahtar: "transfer_donemi", deger: newStatus }]);

      if (insertError) {
        setMessage("❌ Hata oluştu: " + insertError.message);
        setSaving(false);
        return;
      }
    }

    setIsOpen(newStatus === "acik");
    setSaving(false);
    setMessage(`🌟 Transfer dönemi başarıyla ${newStatus === "acik" ? "AÇILDI" : "KAPATILDI"}!`);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#ffd700] flex items-center gap-3">
              💸 TRANSFER BORSASI YÖNETİMİ
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Transfer pazarını buradan açıp kapatabilirsiniz.
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all shrink-0"
          >
            ← Admin Paneline Dön
          </Link>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-bold text-center">
            {message}
          </div>
        )}

        {/* TOGGLE CARD */}
        <div className="bg-[#121212] border border-[#ffd700]/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 shadow-xl text-center">
          <div className="text-6xl">{isOpen ? "🔓" : "🔒"}</div>
          
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">
              Transfer Dönemi Şu Anda:
            </h2>
            <div
              className={`text-3xl font-black tracking-widest uppercase ${
                isOpen ? "text-emerald-400" : "text-red-500"
              }`}
            >
              {isOpen ? "AÇIK" : "KAPALI"}
            </div>
          </div>

          <button
            onClick={toggleStatus}
            disabled={saving}
            className={`mt-4 px-10 py-4 font-black rounded-xl text-lg transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 ${
              isOpen
                ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                : "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            }`}
          >
            {saving
              ? "İşleniyor..."
              : isOpen
              ? "TRANSFERİ KAPAT ⛔"
              : "TRANSFERİ AÇ ✅"}
          </button>
        </div>
      </div>
    </div>
  );
}
