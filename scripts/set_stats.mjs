import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tebmmmmbwsholknougiw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYm1tbW1id3Nob2xrbm91Z2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzE1NjIsImV4cCI6MjA5OTU0NzU2Mn0.m9Op9xMoxPndfl3IdZculYHPVF7hRUHwEpb1mTywKNw"
);

const stats = {
  "YEŞİL BURSA FC": { W: 1, D: 0, L: 0, GF: 11, GA: 3, GD: 8, Pts: 3 },
  "YEDİYOL BLACK FC": { W: 1, D: 0, L: 0, GF: 9, GA: 4, GD: 5, Pts: 3 },
  "KROKODİLLA FC": { W: 1, D: 0, L: 0, GF: 8, GA: 4, GD: 4, Pts: 3 },
  "DÜNDAR KÖYÜ": { W: 1, D: 0, L: 0, GF: 6, GA: 4, GD: 2, Pts: 3 },
  "GRAVYER FC": { W: 0, D: 0, L: 1, GF: 4, GA: 6, GD: -2, Pts: 0 },
  "DİNAMO NALBANTOĞLU": { W: 0, D: 0, L: 1, GF: 4, GA: 8, GD: -4, Pts: 0 },
  "ALAÇAM SPOR": { W: 0, D: 0, L: 1, GF: 4, GA: 9, GD: -5, Pts: 0 },
  "BİSKREM FC": { W: 0, D: 0, L: 1, GF: 3, GA: 11, GD: -8, Pts: 0 }
};

async function fix() {
  for (const [ad, s] of Object.entries(stats)) {
    const oynanan = s.W + s.D + s.L;
    await supabase.from("takimlar").update({
      oynanan, galibiyet: s.W, beraberlik: s.D, maglubiyet: s.L,
      atilan_gol: s.GF, yenilen_gol: s.GA, averaj: s.GD, puan: s.Pts
    }).eq("ad", ad);
  }
  
  // also fix matches in db if possible
  const results = [
    { ev: "YEŞİL BURSA FC", dep: "BİSKREM FC", evSkor: 11, depSkor: 3 },
    { ev: "DÜNDAR KÖYÜ", dep: "GRAVYER FC", evSkor: 6, depSkor: 4 },
    { ev: "KROKODİLLA FC", dep: "DİNAMO NALBANTOĞLU", evSkor: 8, depSkor: 4 },
    { ev: "YEDİYOL BLACK FC", dep: "ALAÇAM SPOR", evSkor: 9, depSkor: 4 },
    { ev: "Dinamo Nalbantoğlu", dep: "Krokodilla FK", evSkor: 4, depSkor: 8 },
    { ev: "Alaçam Spor", dep: "Yediyol Black FC", evSkor: 4, depSkor: 9 }
  ];

  const { data: maclar } = await supabase.from("maclar").select("*");
  for (const m of maclar) {
    let matched = false;
    for (const r of results) {
      if (
        (m.ev_sahibi.toUpperCase() === r.ev.toUpperCase() && m.deplasman.toUpperCase() === r.dep.toUpperCase()) ||
        (m.ev_sahibi.toUpperCase() === r.dep.toUpperCase() && m.deplasman.toUpperCase() === r.ev.toUpperCase())
      ) {
        matched = true;
        const isEv = m.ev_sahibi.toUpperCase() === r.ev.toUpperCase();
        await supabase.from("maclar").update({
          ev_skor: isEv ? r.evSkor : r.depSkor,
          dep_skor: isEv ? r.depSkor : r.evSkor,
          oynandi: true,
          durum: "Maç Sona Erdi"
        }).eq("id", m.id);
        break;
      }
    }
    if (!matched) {
      await supabase.from("maclar").update({ ev_skor: null, dep_skor: null, oynandi: false, durum: null }).eq("id", m.id);
    }
  }

  console.log("DONE");
}
fix();
