"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Takim = {
  id: number;
  ad: string;
};

export default function MacSonucuPage() {
  const [takimlar, setTakimlar] = useState<Takim[]>([]);
  const [evSahibi, setEvSahibi] = useState("");
  const [deplasman, setDeplasman] = useState("");
  const [evSkor, setEvSkor] = useState("");
  const [depSkor, setDepSkor] = useState("");
  const [hafta, setHafta] = useState("");

  useEffect(() => {
  async function getir() {
    const { data, error } = await supabase
      .from("takimlar")
      .select("*");

    console.log("TAKIMLAR:", data);
    console.log("HATA:", error);

    if (error) {
      alert(error.message);
      return;
    }

    setTakimlar(data || []);
  }

  getir();
}, []);

  async function kaydet() {
  if (!evSahibi || !deplasman || evSahibi === deplasman) {
    alert("Takımları doğru seç.");
    return;
  }

  const evGol = Number(evSkor);
  const depGol = Number(depSkor);

  // Maçı kaydet
  const { error } = await supabase
    .from("maclar")
    .insert({
      hafta: Number(hafta),
      ev_sahibi: evSahibi,
      deplasman: deplasman,
      ev_skor: evGol,
      dep_skor: depGol,
      oynandi: true,
    });

  if (error) {
    alert(error.message);
    return;
  }

  // Ev sahibi takımı getir
  const { data: evTakim, error: evHata } = await supabase
    .from("takimlar")
    .select("*")
    .eq("ad", evSahibi)
    .single();
console.log("EV TAKIM:", evTakim);

  // Deplasman takımını getir
  const { data: depTakim, error: depHata } = await supabase
    .from("takimlar")
    .select("*")
    .eq("ad", deplasman)
    .single();

console.log("DEP TAKIM:", depTakim);
  if (evHata || depHata || !evTakim || !depTakim) {
    alert("Takımlar okunamadı.");
    return;
  }

   // Ev sahibi yeni değerler
  let evOynanan = evTakim.oynanan + 1;
  let evGalibiyet = evTakim.galibiyet;
  let evBeraberlik = evTakim.beraberlik;
  let evMaglubiyet = evTakim.maglubiyet;
  let evAtilan = evTakim.atilan_gol + evGol;
  let evYenilen = evTakim.yenilen_gol + depGol;
  let evPuan = evTakim.puan;

  // Deplasman yeni değerler
  let depOynanan = depTakim.oynanan + 1;
  let depGalibiyet = depTakim.galibiyet;
  let depBeraberlik = depTakim.beraberlik;
  let depMaglubiyet = depTakim.maglubiyet;
  let depAtilan = depTakim.atilan_gol + depGol;
  let depYenilen = depTakim.yenilen_gol + evGol;
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

   // Ev sahibi güncelle
  const { error: evUpdateHata } = await supabase
    .from("takimlar")
    .update({
      oynanan: evOynanan,
      galibiyet: evGalibiyet,
      beraberlik: evBeraberlik,
      maglubiyet: evMaglubiyet,
      atilan_gol: evAtilan,
      yenilen_gol: evYenilen,
      averaj: evAveraj,
      puan: evPuan,
    })
    .eq("ad", evSahibi);
if (evUpdateHata) {
  console.log(evUpdateHata);
  alert(evUpdateHata.message);
  return;
}

console.log("EV GÜNCELLENDİ");

  // Deplasman güncelle
  const { error: depUpdateHata } = await supabase
    .from("takimlar")
    .update({
      oynanan: depOynanan,
      galibiyet: depGalibiyet,
      beraberlik: depBeraberlik,
      maglubiyet: depMaglubiyet,
      atilan_gol: depAtilan,
      yenilen_gol: depYenilen,
      averaj: depAveraj,
      puan: depPuan,
    })
    .eq("ad", deplasman);
console.log("DEP UPDATE HATA:", depUpdateHata);
 if (depUpdateHata) {
  console.log(depUpdateHata);
  alert(depUpdateHata.message);
  return;
}

console.log("DEP GÜNCELLENDİ");

  alert("✅ Maç sonucu kaydedildi ve puan durumu güncellendi.");

  setEvSahibi("");
  setDeplasman("");
  setEvSkor("");
  setDepSkor("");
  setHafta("");

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
          marginBottom: 30,
        }}
      >
        ⚽ MAÇ SONUCU GİR
      </h1>

      <div
        style={{
          maxWidth: 450,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <input
          placeholder="Hafta"
          value={hafta}
          onChange={(e) => setHafta(e.target.value)}
          style={inputStyle}
        />

        <select
          value={evSahibi}
          onChange={(e) => setEvSahibi(e.target.value)}
          style={inputStyle}
        >
          <option value="">Ev Sahibi</option>

          {takimlar.map((t) => (
            <option key={t.id} value={t.ad}>
              {t.ad}
            </option>
          ))}
        </select>

        <select
          value={deplasman}
          onChange={(e) => setDeplasman(e.target.value)}
          style={inputStyle}
        >
          <option value="">Deplasman</option>

          {takimlar.map((t) => (
            <option key={t.id} value={t.ad}>
              {t.ad}
            </option>
          ))}
        </select>

        <input
          placeholder="Ev Sahibi Skoru"
          value={evSkor}
          onChange={(e) => setEvSkor(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Deplasman Skoru"
          value={depSkor}
          onChange={(e) => setDepSkor(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={kaydet}
          style={{
            height: 55,
            border: "none",
            borderRadius: 12,
            background: "#ff3131",
            color: "#fff",
            fontWeight: 900,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          💾 MAÇI KAYDET
        </button>
      </div>
    </div>
  );
}