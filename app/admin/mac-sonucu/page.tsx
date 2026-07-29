"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
};

export default function MacSonucuPage() {
  const [bekleyenMaclar, setBekleyenMaclar] = useState<Mac[]>([]);
  const [secilenMacId, setSecilenMacId] = useState<string>("");
  const [evSkor, setEvSkor] = useState("");
  const [depSkor, setDepSkor] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    maclariGetir();
  }, []);

  async function maclariGetir() {
    // Sadece skoru girilmemiş veya 'oynandi' false olan maçları getir
    const { data, error } = await supabase
      .from("maclar")
      .select("id, hafta, ev_sahibi, deplasman")
      .eq("oynandi", false)
      .order("hafta", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setBekleyenMaclar(data || []);
  }

  async function kaydet() {
    if (!secilenMacId) {
      alert("Lütfen bir maç seçin.");
      return;
    }
    if (evSkor === "" || depSkor === "") {
      alert("Lütfen skorları girin.");
      return;
    }

    setIsSaving(true);
    const evGol = Number(evSkor);
    const depGol = Number(depSkor);

    const seciliMac = bekleyenMaclar.find((m) => m.id.toString() === secilenMacId);
    if (!seciliMac) {
      alert("Seçilen maç bulunamadı.");
      setIsSaving(false);
      return;
    }

    const { ev_sahibi, deplasman } = seciliMac;

    // 1. Maçı güncelle
    const { error: macError } = await supabase
      .from("maclar")
      .update({
        ev_skor: evGol,
        dep_skor: depGol,
        oynandi: true,
        durum: "Maç Sona Erdi",
        canli: false,
      })
      .eq("id", seciliMac.id);

    if (macError) {
      alert("Maç kaydedilirken hata oluştu: " + macError.message);
      setIsSaving(false);
      return;
    }

    // 2. Takımları getir (Puan durumu için)
    const { data: evTakim } = await supabase.from("takimlar").select("*").eq("ad", ev_sahibi).single();
    const { data: depTakim } = await supabase.from("takimlar").select("*").eq("ad", deplasman).single();

    if (!evTakim || !depTakim) {
      alert("Takım bilgileri alınamadığı için puan durumu güncellenemedi.");
      setIsSaving(false);
      return;
    }

    // Ev sahibi yeni değerler
    const evOynanan = evTakim.oynanan + 1;
    let evGalibiyet = evTakim.galibiyet;
    let evBeraberlik = evTakim.beraberlik;
    let evMaglubiyet = evTakim.maglubiyet;
    const evAtilan = evTakim.atilan_gol + evGol;
    const evYenilen = evTakim.yenilen_gol + depGol;
    let evPuan = evTakim.puan;

    // Deplasman yeni değerler
    const depOynanan = depTakim.oynanan + 1;
    let depGalibiyet = depTakim.galibiyet;
    let depBeraberlik = depTakim.beraberlik;
    let depMaglubiyet = depTakim.maglubiyet;
    const depAtilan = depTakim.atilan_gol + depGol;
    const depYenilen = depTakim.yenilen_gol + evGol;
    let depPuan = depTakim.puan;

    // Sonucu hesapla
    if (evGol > depGol) {
      evGalibiyet += 1;
      evPuan += 3;
      depMaglubiyet += 1;
    } else if (evGol < depGol) {
      depGalibiyet += 1;
      depPuan += 3;
      evMaglubiyet += 1;
    } else {
      evBeraberlik += 1;
      depBeraberlik += 1;
      evPuan += 1;
      depPuan += 1;
    }

    const evAveraj = evAtilan - evYenilen;
    const depAveraj = depAtilan - depYenilen;

    // 3. Puan Durumlarını Güncelle
    await supabase.from("takimlar").update({
      oynanan: evOynanan,
      galibiyet: evGalibiyet,
      beraberlik: evBeraberlik,
      maglubiyet: evMaglubiyet,
      atilan_gol: evAtilan,
      yenilen_gol: evYenilen,
      averaj: evAveraj,
      puan: evPuan,
    }).eq("ad", ev_sahibi);

    await supabase.from("takimlar").update({
      oynanan: depOynanan,
      galibiyet: depGalibiyet,
      beraberlik: depBeraberlik,
      maglubiyet: depMaglubiyet,
      atilan_gol: depAtilan,
      yenilen_gol: depYenilen,
      averaj: depAveraj,
      puan: depPuan,
    }).eq("ad", deplasman);

    // 4. Bildirim Gönder
    try {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baslik: "🏆 PUAN DURUMU GÜNCELLENDİ!",
          mesaj: `Maç Sonucu: ${ev_sahibi} ${evGol} - ${depGol} ${deplasman}. Puan durumu an itibarıyla güncellenmiştir!`,
        }),
      });
    } catch (err) {
      console.error("Bildirim gönderilirken hata:", err);
    }

    alert("✅ Maç sonucu başarıyla kaydedildi, puan durumu güncellendi ve bildirim gönderildi!");

    // Sıfırla
    setSecilenMacId("");
    setEvSkor("");
    setDepSkor("");
    setIsSaving(false);
    maclariGetir(); // Listeyi yenile
  }

  const inputStyle = {
    width: "100%",
    height: 52,
    borderRadius: 12,
    border: "1px solid #333",
    background: "#181818",
    color: "#fff",
    padding: "0 15px",
    fontSize: 16,
    outline: "none"
  } as const;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: "90px 20px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: 10,
          fontWeight: 900
        }}
      >
        ⚽ MAÇ SONUCU GİR
      </h1>
      <p style={{ color: "#aaa", textAlign: "center", marginBottom: 30, fontSize: 14 }}>
        Oynanmamış maçlardan birini seçip skoru girin. Puan durumu otomatik hesaplanacaktır.
      </p>

      <div
        style={{
          maxWidth: 450,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 15,
          background: "#151515",
          padding: 25,
          borderRadius: 16,
          border: "1px solid rgba(255,49,49,0.2)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}
      >
        <select
          value={secilenMacId}
          onChange={(e) => setSecilenMacId(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">-- Oynanmamış Bir Maç Seçin --</option>
          {bekleyenMaclar.map((m) => (
            <option key={m.id} value={m.id}>
              {m.hafta}. Hafta: {m.ev_sahibi} vs {m.deplasman}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: "#aaa", fontSize: 12, marginBottom: 5, display: "block", marginLeft: 5 }}>Ev Sahibi Skor</label>
            <input
              type="number"
              placeholder="0"
              min={0}
              value={evSkor}
              onChange={(e) => setEvSkor(e.target.value)}
              style={{ ...inputStyle, textAlign: "center", fontSize: 24, fontWeight: "bold" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: "#aaa", fontSize: 12, marginBottom: 5, display: "block", marginLeft: 5 }}>Deplasman Skor</label>
            <input
              type="number"
              placeholder="0"
              min={0}
              value={depSkor}
              onChange={(e) => setDepSkor(e.target.value)}
              style={{ ...inputStyle, textAlign: "center", fontSize: 24, fontWeight: "bold" }}
            />
          </div>
        </div>

        <button
          onClick={kaydet}
          disabled={isSaving}
          style={{
            height: 55,
            border: "none",
            borderRadius: 12,
            background: isSaving ? "#666" : "linear-gradient(90deg, #ff3131, #a11212)",
            color: "#fff",
            fontWeight: 900,
            fontSize: 18,
            cursor: isSaving ? "not-allowed" : "pointer",
            marginTop: 15,
            boxShadow: isSaving ? "none" : "0 5px 15px rgba(255,49,49,0.3)"
          }}
        >
          {isSaving ? "⏳ KAYDEDİLİYOR..." : "💾 MAÇI KAYDET"}
        </button>
      </div>
    </div>
  );
}