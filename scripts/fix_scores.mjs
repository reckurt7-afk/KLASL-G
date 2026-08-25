import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tebmmmmbwsholknougiw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYm1tbW1id3Nob2xrbm91Z2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzE1NjIsImV4cCI6MjA5OTU0NzU2Mn0.m9Op9xMoxPndfl3IdZculYHPVF7hRUHwEpb1mTywKNw"
);

async function fix() {
  // Sıfırla
  await supabase.from("takimlar").update({
    oynanan: 0, galibiyet: 0, beraberlik: 0, maglubiyet: 0,
    atilan_gol: 0, yenilen_gol: 0, averaj: 0, puan: 0
  }).neq("id", 0);
  
  await supabase.from("maclar").update({
    ev_skor: null, dep_skor: null, oynandi: false, durum: null
  }).neq("id", 0);

  const results = [
    { ev: "YEŞİL BURSA FC", dep: "BİSKREM FC", evSkor: 11, depSkor: 3 },
    { ev: "DÜNDAR KÖYÜ", dep: "GRAVYER FC", evSkor: 6, depSkor: 4 },
    { ev: "KROKODİLLA FC", dep: "DİNAMO NALBANTOĞLU", evSkor: 8, depSkor: 4 },
    { ev: "YEDİYOL BLACK FC", dep: "ALAÇAM SPOR", evSkor: 9, depSkor: 4 }
  ];

  const { data: maclar } = await supabase.from("maclar").select("*");
  const { data: takimlar } = await supabase.from("takimlar").select("*");
  
  const norm = (name) => {
    const map = {
      "Dinamo Nalbantoğlu": "DİNAMO NALBANTOĞLU", "Krokodilla FK": "KROKODİLLA FC", "Krokodilla FC": "KROKODİLLA FC",
      "Yeşil Bursa FC": "YEŞİL BURSA FC", "Biskrem FC": "BİSKREM FC", "BİSKREM FC": "BİSKREM FC",
      "Gravyer FC": "GRAVYER FC", "Yediyol Black FC": "YEDİYOL BLACK FC", "Dündar Köyü": "DÜNDAR KÖYÜ", "Alaçam Spor": "ALAÇAM SPOR"
    };
    return map[name] || name.toLocaleUpperCase("tr-TR");
  };

  const stats = {};
  for (let t of takimlar) {
    stats[t.ad] = { oynanan: 0, galibiyet: 0, beraberlik: 0, maglubiyet: 0, atilan_gol: 0, yenilen_gol: 0, puan: 0 };
  }

  for (let r of results) {
    const match = maclar.find(m => 
      (norm(m.ev_sahibi) === r.ev && norm(m.deplasman) === r.dep) ||
      (norm(m.ev_sahibi) === r.dep && norm(m.deplasman) === r.ev)
    );

    if (match) {
      const isEv = norm(match.ev_sahibi) === r.ev;
      const dbEvSkor = isEv ? r.evSkor : r.depSkor;
      const dbDepSkor = isEv ? r.depSkor : r.evSkor;

      await supabase.from("maclar").update({
        ev_skor: dbEvSkor, dep_skor: dbDepSkor, oynandi: true, durum: "Maç Sona Erdi"
      }).eq("id", match.id);

      const evT = norm(match.ev_sahibi);
      const depT = norm(match.deplasman);

      stats[evT].oynanan++; stats[depT].oynanan++;
      stats[evT].atilan_gol += dbEvSkor; stats[evT].yenilen_gol += dbDepSkor;
      stats[depT].atilan_gol += dbDepSkor; stats[depT].yenilen_gol += dbEvSkor;

      if (dbEvSkor > dbDepSkor) {
        stats[evT].galibiyet++; stats[evT].puan += 3;
        stats[depT].maglubiyet++;
      } else if (dbDepSkor > dbEvSkor) {
        stats[depT].galibiyet++; stats[depT].puan += 3;
        stats[evT].maglubiyet++;
      } else {
        stats[evT].beraberlik++; stats[evT].puan++;
        stats[depT].beraberlik++; stats[depT].puan++;
      }
    } else {
        console.log("MATCH NOT FOUND:", r);
    }
  }

  for (let tName of Object.keys(stats)) {
    const s = stats[tName];
    await supabase.from("takimlar").update({
      oynanan: s.oynanan, galibiyet: s.galibiyet, beraberlik: s.beraberlik, maglubiyet: s.maglubiyet,
      atilan_gol: s.atilan_gol, yenilen_gol: s.yenilen_gol, averaj: s.atilan_gol - s.yenilen_gol, puan: s.puan
    }).eq("ad", tName);
  }
  
  console.log("DONE");
}
fix();
