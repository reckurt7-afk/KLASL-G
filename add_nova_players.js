const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const players = [
    { name: "AHMET PALA", pos: "OS" },
    { name: "SEMİH AKSAKAL", pos: "OS" },
    { name: "ŞEHMUS ÇİÇEK", pos: "OS" },
    { name: "BERKAY FİKARA", pos: "OS" },
    { name: "YUSUF KARABULUT", pos: "OS" },
    { name: "ZEKİ", pos: "OS" },
    { name: "AHMET YILDIZ", pos: "OS" },
    { name: "YAĞIZ BERKAY ÖZTÜRK", pos: "KL" }
  ];

  const inserts = players.map(p => ({
    ad_soyad: p.name,
    takim: "NOVA FC",
    mevki: p.pos,
    genel_puan: 85,
    aktif: true
  }));

  const res = await fetch(`${URL}/rest/v1/oyuncular`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(inserts)
  });

  if (!res.ok) {
    console.error("Error inserting players:", await res.text());
  } else {
    console.log("Players inserted successfully!");
    const data = await res.json();
    console.log(`Added ${data.length} players to NOVA FC.`);
  }
}
run();
