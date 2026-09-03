"use client";

import { useEffect, useState } from "react";
import { supabase, publicFetch } from "../../../lib/supabase";

type Mac = {
  id: number;
  hafta: number;
  ev_sahibi: string;
  deplasman: string;
  ev_skor: number | null;
  dep_skor: number | null;
  oynandi: boolean;
};

export default function MacSonucuPage() {
  const [maclar, setMaclar] = useState<Mac[]>([]);
  const [secilenMacId, setSecilenMacId] = useState<string>("");
  const [evSkor, setEvSkor] = useState("");
  const [depSkor, setDepSkor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "hata"; yazi: string } | null>(null);

  useEffect(() => {
    maclariGetir();
  }, []);

  async function maclariGetir() {
    // Tüm haftaların tüm maçlarını getir (publicFetch ile RLS bypass)
    const data = await publicFetch(
      "maclar",
      "select=id,hafta,ev_sahibi,deplasman,ev_skor,dep_skor,oynandi&order=hafta.asc,id.asc"
    );
    setMaclar(
      (data || []).map((m: any) => ({
        ...m,
        ev_sahibi: m.ev_sahibi || "Ev Sahibi",
        deplasman: m.deplasman || "Deplasman",
        ev_skor: m.ev_skor ?? null,
        dep_skor: m.dep_skor ?? null,
      }))
    );
  }

  const seciliMac = maclar.find((m) => m.id.toString() === secilenMacId);

  async function kaydet() {
    if (!secilenMacId) {
      setMesaj({ tip: "hata", yazi: "Lütfen bir maç seçin." });
      return;
    }
    if (evSkor === "" || depSkor === "") {
      setMesaj({ tip: "hata", yazi: "Lütfen iki takımın skorunu da girin." });
      return;
    }
    if (!seciliMac) {
      setMesaj({ tip: "hata", yazi: "Seçilen maç bulunamadı." });
      return;
    }

    setIsSaving(true);
    setMesaj(null);

    const evGol = Number(evSkor);
    const depGol = Number(depSkor);
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
      setMesaj({ tip: "hata", yazi: "Maç kaydedilirken hata: " + macError.message });
      setIsSaving(false);
      return;
    }

        // 2. Tüm takımları publicFetch ile çek (RLS bypass)
    const tumTakimlar = await publicFetch("teams", "select=*");

    const normalize = (s: string) =>
      (s || "").trim().replace(/\s+/g, " ");

    const evTakim = tumTakimlar?.find(
      (t: any) => normalize(t.name) === normalize(ev_sahibi)
    );
    const depTakim = tumTakimlar?.find(
      (t: any) => normalize(t.name) === normalize(deplasman)
    );

    if (!evTakim || !depTakim) {
      const bulunamayan = !evTakim ? ev_sahibi : deplasman;
      const mevcutlar = tumTakimlar?.map((t) => t.name).join(", ") || "";
      setMesaj({
        tip: "hata",
        yazi: `"${bulunamayan}" puan tablosunda bulunamadı. Mevcut takımlar: ${mevcutlar}`,
      });
      setIsSaving(false);
      return;
    }

    // EğER GÜNCELLEME İŞLEMİYSE, ESKİ VERİLERİ GERİ AL (ÇIKART)
    if (seciliMac.oynandi) {
      const eskiEvGol = seciliMac.ev_skor ?? 0;
      const eskiDepGol = seciliMac.dep_skor ?? 0;
      
      // Ev sahibinden çıkar
      evTakim.played = (evTakim.played ?? 1) - 1;
      evTakim.goals_for = (evTakim.goals_for ?? 0) - eskiEvGol;
      evTakim.goals_against = (evTakim.goals_against ?? 0) - eskiDepGol;
      if (eskiEvGol > eskiDepGol) { evTakim.won = (evTakim.won ?? 1) - 1; evTakim.points = (evTakim.points ?? 3) - 3; }
      else if (eskiEvGol < eskiDepGol) { evTakim.lost = (evTakim.lost ?? 1) - 1; }
      else { evTakim.drawn = (evTakim.drawn ?? 1) - 1; evTakim.points = (evTakim.points ?? 1) - 1; }

      // Deplasmandan çıkar
      depTakim.played = (depTakim.played ?? 1) - 1;
      depTakim.goals_for = (depTakim.goals_for ?? 0) - eskiDepGol;
      depTakim.goals_against = (depTakim.goals_against ?? 0) - eskiEvGol;
      if (eskiDepGol > eskiEvGol) { depTakim.won = (depTakim.won ?? 1) - 1; depTakim.points = (depTakim.points ?? 3) - 3; }
      else if (eskiDepGol < eskiEvGol) { depTakim.lost = (depTakim.lost ?? 1) - 1; }
      else { depTakim.drawn = (depTakim.drawn ?? 1) - 1; depTakim.points = (depTakim.points ?? 1) - 1; }
    }

    // 3. Puan hesapla (YENİ SKORLARI EKLE)
    const evAtilan = (evTakim.goals_for ?? 0) + evGol;
    const evYenilen = (evTakim.goals_against ?? 0) + depGol;
    const depAtilan = (depTakim.goals_for ?? 0) + depGol;
    const depYenilen = (depTakim.goals_against ?? 0) + evGol;

    let evGalibiyet = evTakim.won ?? 0;
    let evBeraberlik = evTakim.drawn ?? 0;
    let evMaglubiyet = evTakim.lost ?? 0;
    let evPuan = evTakim.points ?? 0;

    let depGalibiyet = depTakim.won ?? 0;
    let depBeraberlik = depTakim.drawn ?? 0;
    let depMaglubiyet = depTakim.lost ?? 0;
    let depPuan = depTakim.points ?? 0;

    if (evGol > depGol) {
      evGalibiyet += 1; evPuan += 3;
      depMaglubiyet += 1;
    } else if (evGol < depGol) {
      depGalibiyet += 1; depPuan += 3;
      evMaglubiyet += 1;
    } else {
      evBeraberlik += 1; evPuan += 1;
      depBeraberlik += 1; depPuan += 1;
    }

    // 4. Puan tablosunu güncelle - AD yerine ID ile (Türkçe karakter sorunu yok)
    await supabase.from("teams").update({
      played: (evTakim.played ?? 0) + 1,
      won: evGalibiyet,
      drawn: evBeraberlik,
      lost: evMaglubiyet,
      goals_for: evAtilan,
      goals_against: evYenilen,
      goal_difference: evAtilan - evYenilen,
      points: evPuan,
    }).eq("id", evTakim.id);

    await supabase.from("teams").update({
      played: (depTakim.played ?? 0) + 1,
      won: depGalibiyet,
      drawn: depBeraberlik,
      lost: depMaglubiyet,
      goals_for: depAtilan,
      goals_against: depYenilen,
      goal_difference: depAtilan - depYenilen,
      points: depPuan,
    }).eq("id", depTakim.id);

    // 5. Bildirim gönder - herkese
    const sonuc = evGol > depGol
      ? `${ev_sahibi} kazandı! 🏆`
      : evGol < depGol
      ? `${deplasman} kazandı! 🏆`
      : "Berabere bitti! 🤝";
    try {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baslik: "📊 PUAN DURUMU GÜNCELLENDİ!",
          mesaj: `${ev_sahibi} ${evGol} - ${depGol} ${deplasman} | ${sonuc} Güncel sıralamayı kontrol et!`,
        }),
      });
    } catch {}

    
    // MVP Oylamasi Bildirimi Gonder
    try {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baslik: "🏆 MAÇ BİTTİ! SENCE YILDIZ KİMDİ?",
          mesaj: `${ev_sahibi} ${evGol} - ${depGol} ${deplasman} maçı sona erdi. Hemen tıkla, kendi takımından sahanın yıldızını oyla!`,
          url: `/mvp-oylama/${seciliMac.id}`,
          requireInteraction: true,
          actions: [
            { action: "canli", title: "⭐ MVP OYUNU KULLAN" }
          ]
        })
      });
    } catch(err) {
      console.error("Bildirim gonderilemedi", err);
    }

    setMesaj({ tip: "ok", yazi: "Maç kaydedildi, puan durumu güncellendi ve MVP oylama bildirimleri gönderildi!" });
    setSecilenMacId("");
    setEvSkor("");
    setDepSkor("");
    setIsSaving(false);
    maclariGetir();
  }

  // Haftaya göre grupla
  const haftalar = [...new Set(maclar.map((m) => m.hafta))].sort((a, b) => a - b);

  const inputStyle = {
    width: "100%",
    height: 56,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "0 15px",
    fontSize: 16,
    outline: "none",
  } as const;

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", padding: "90px 20px 120px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 28, margin: 0 }}>⚽ MAÇ SONUCU GİR</h1>
          <p style={{ color: "#666", fontSize: 14, marginTop: 8 }}>
            Tüm haftalardan maç seçin → skoru girin → puan tablosu otomatik güncellenir
          </p>
        </div>

        {/* Mesaj */}
        {mesaj && (
          <div style={{
            background: mesaj.tip === "ok" ? "rgba(16,185,129,0.1)" : "rgba(212,175,55,0.1)",
            border: `1px solid ${mesaj.tip === "ok" ? "rgba(16,185,129,0.4)" : "rgba(212,175,55,0.4)"}`,
            borderRadius: 12,
            padding: "14px 18px",
            color: mesaj.tip === "ok" ? "#10b981" : "#ff6b6b",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 20,
          }}>
            {mesaj.yazi}
          </div>
        )}

        {/* Form Kartı */}
        <div style={{
          background: "#151515",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: 20,
          padding: 28,
        }}>
          {/* Maç Seçimi - Haftaya Göre Gruplu */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 10 }}>
              Maç Seç
            </label>
            <select
              value={secilenMacId}
              onChange={(e) => {
                setSecilenMacId(e.target.value);
                setEvSkor("");
                setDepSkor("");
                setMesaj(null);
              }}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">-- Hafta ve Maç Seçin --</option>
              {haftalar.map((hafta) => (
                <optgroup key={hafta} label={`──── ${hafta}. Hafta ────`}>
                  {maclar
                    .filter((m) => m.hafta === hafta)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.ev_sahibi} vs {m.deplasman}
                        {m.oynandi ? ` ✅ (${m.ev_skor ?? 0}-${m.dep_skor ?? 0})` : " ⏳ Bekliyor"}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Seçili maç bilgisi */}
          {seciliMac && (
            <div style={{
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20,
              textAlign: "center",
            }}>
              <div style={{ color: "#ceaa52", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
                {seciliMac.hafta}. HAFTA
              </div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
                {seciliMac.ev_sahibi} 🆚 {seciliMac.deplasman}
              </div>
              {seciliMac.oynandi && (
                <div style={{ color: "#10b981", fontSize: 12, marginTop: 4 }}>
                  ✅ Bu maç daha önce girildi: {seciliMac.ev_skor ?? 0} - {seciliMac.dep_skor ?? 0} (Güncelleme yapılacak)
                </div>
              )}
            </div>
          )}

          {/* Skor Girişi */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end", marginBottom: 24 }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                {seciliMac ? seciliMac.ev_sahibi.split(" ")[0] : "Ev Sahibi"}
              </label>
              <input
                type="number"
                placeholder="0"
                min={0}
                value={evSkor}
                onChange={(e) => setEvSkor(e.target.value)}
                style={{ ...inputStyle, textAlign: "center", fontSize: 32, fontWeight: 900 }}
              />
            </div>
            <div style={{ color: "#555", fontSize: 28, fontWeight: 900, paddingBottom: 8 }}>-</div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                {seciliMac ? seciliMac.deplasman.split(" ")[0] : "Deplasman"}
              </label>
              <input
                type="number"
                placeholder="0"
                min={0}
                value={depSkor}
                onChange={(e) => setDepSkor(e.target.value)}
                style={{ ...inputStyle, textAlign: "center", fontSize: 32, fontWeight: 900 }}
              />
            </div>
          </div>

          {/* Kaydet Butonu */}
          <button
            onClick={kaydet}
            disabled={isSaving}
            style={{
              width: "100%",
              height: 56,
              border: "none",
              borderRadius: 14,
              background: isSaving ? "#333" : "linear-gradient(135deg, #ceaa52, #8c7324)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 17,
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: isSaving ? "none" : "0 8px 20px rgba(212,175,55,0.35)",
              letterSpacing: 1,
            }}
          >
            {isSaving ? "⏳ Kaydediliyor..." : "💾 KAYDET → PUAN TABLOSUNU GÜNCELLE"}
          </button>
        </div>

        {/* Tüm Maçlar Listesi */}
        <div style={{ marginTop: 30 }}>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 18, marginBottom: 16 }}>📋 Tüm Maçlar</h2>
          {haftalar.map((hafta) => (
            <div key={hafta} style={{ marginBottom: 20 }}>
              <div style={{
                color: "#ceaa52",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 3,
                marginBottom: 8,
              }}>
                {hafta}. HAFTA
              </div>
              {maclar.filter((m) => m.hafta === hafta).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSecilenMacId(m.id.toString());
                    setEvSkor(m.ev_skor !== null ? String(m.ev_skor) : "");
                    setDepSkor(m.dep_skor !== null ? String(m.dep_skor) : "");
                    setMesaj(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: secilenMacId === m.id.toString() ? "rgba(212,175,55,0.1)" : "#151515",
                    border: secilenMacId === m.id.toString() ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginBottom: 6,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{m.ev_sahibi}</span>
                  <span style={{
                    color: m.oynandi ? "#10b981" : "#666",
                    fontWeight: 900,
                    fontSize: 15,
                    minWidth: 60,
                    textAlign: "center",
                  }}>
                    {m.oynandi ? `${m.ev_skor ?? 0} - ${m.dep_skor ?? 0}` : "vs"}
                  </span>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, textAlign: "right" }}>{m.deplasman}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}