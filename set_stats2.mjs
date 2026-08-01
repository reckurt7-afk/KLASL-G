import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tebmmmmbwsholknougiw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYm1tbW1id3Nob2xrbm91Z2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzE1NjIsImV4cCI6MjA5OTU0NzU2Mn0.m9Op9xMoxPndfl3IdZculYHPVF7hRUHwEpb1mTywKNw"
);

async function fix() {
  const results = [
    { ev: "Yeşil Bursa FC", dep: "BİSKREM FC", evSkor: 11, depSkor: 3 },
    { ev: "Dündar Köyü", dep: "Gravyer FC", evSkor: 6, depSkor: 4 },
    { ev: "Krokodilla FK", dep: "Dinamo Nalbantoğlu", evSkor: 8, depSkor: 4 },
    { ev: "Dinamo Nalbantoğlu", dep: "Krokodilla FK", evSkor: 4, depSkor: 8 },
    { ev: "Yediyol Black FC", dep: "Alaçam Spor", evSkor: 9, depSkor: 4 },
    { ev: "Alaçam Spor", dep: "Yediyol Black FC", evSkor: 4, depSkor: 9 }
  ];

  const { data: maclar } = await supabase.from("maclar").select("*");
  for (const m of maclar) {
    let matched = false;
    for (const r of results) {
      if (
        (m.ev_sahibi.toLocaleLowerCase('tr-TR') === r.ev.toLocaleLowerCase('tr-TR') && m.deplasman.toLocaleLowerCase('tr-TR') === r.dep.toLocaleLowerCase('tr-TR')) ||
        (m.ev_sahibi.toLocaleLowerCase('tr-TR') === r.dep.toLocaleLowerCase('tr-TR') && m.deplasman.toLocaleLowerCase('tr-TR') === r.ev.toLocaleLowerCase('tr-TR'))
      ) {
        matched = true;
        const isEv = m.ev_sahibi.toLocaleLowerCase('tr-TR') === r.ev.toLocaleLowerCase('tr-TR');
        await supabase.from("maclar").update({
          ev_skor: isEv ? r.evSkor : r.depSkor,
          dep_skor: isEv ? r.depSkor : r.evSkor,
          oynandi: true,
          durum: "Maç Sona Erdi"
        }).eq("id", m.id);
        break;
      }
    }
  }
  console.log("DONE");
}
fix();
