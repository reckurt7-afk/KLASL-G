const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const insert = {
    ad_soyad: "SAMET ÇALIŞKAN",
    takim: "DİNAMO NALBANTOĞLU",
    mevki: "OS", // Varsayılan
    genel_puan: 85,
    aktif: true
  };

  const res = await fetch(`${URL}/rest/v1/oyuncular`, {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify([insert])
  });

  if (!res.ok) {
    console.error("Error inserting player:", await res.text());
  } else {
    console.log("Player inserted successfully!");
  }
}
run();
