const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  // fetch cities
  const res = await fetch(`${URL}/rest/v1/cities?select=*`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const cities = await res.json();
  console.log("Current cities:", cities.map(c => `${c.id}: ${c.name}`));
  
  // Find "PRİME LİG BURSA 4. SEZON"
  const target = cities.find(c => c.name.includes("PRİME LİG BURSA 4. SEZON"));
  if (target) {
    const newName = target.name.replace("4. SEZON", "1. SEZON");
    const updateRes = await fetch(`${URL}/rest/v1/cities?id=eq.${target.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    });
    console.log(`Renamed from ${target.name} to ${newName}. Status:`, updateRes.status);
  } else {
    console.log("Target league not found!");
  }
}
run();
