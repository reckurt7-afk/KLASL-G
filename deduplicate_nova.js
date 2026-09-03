const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const URL = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const KEY = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  const res = await fetch(`${URL}/rest/v1/oyuncular?takim=eq.NOVA%20FC&select=id,ad_soyad,mevki`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  const data = await res.json();
  
  // New names we just added (uppercase)
  const newNames = [
    "AHMET PALA",
    "SEMİH AKSAKAL",
    "ŞEHMUS ÇİÇEK",
    "BERKAY FİKARA",
    "YUSUF KARABULUT",
    "ZEKİ",
    "AHMET YILDIZ",
    "YAĞIZ BERKAY ÖZTÜRK"
  ];
  
  // Find duplicates
  const toDelete = [];
  
  for (const player of data) {
    // Skip if it's EXACTLY one of our new uppercase names (because we want to keep the new ones)
    if (newNames.includes(player.ad_soyad) && player.mevki !== null) {
      continue;
    }
    
    const lowerName = player.ad_soyad.toLowerCase('tr-TR').trim();
    
    // Check if lowerName is basically the same as any of the new names
    let isDuplicate = false;
    
    if (lowerName === "ahmet pala") isDuplicate = true;
    if (lowerName === "semih") isDuplicate = true; // Duplicate of SEMİH AKSAKAL
    if (lowerName === "şehmus") isDuplicate = true;
    if (lowerName === "berkay") isDuplicate = true; // Wait, there's "Berkay Aybey", is that "BERKAY FİKARA"? Maybe not.
    if (lowerName === "zeki") isDuplicate = true; // Although there is no old "Zeki", just checking.
    if (lowerName === "yusuf") isDuplicate = true;
    if (lowerName === "yağız") isDuplicate = true;
    
    // Also, some might be exact matches like "Ahmet Pala"
    if (isDuplicate) {
      toDelete.push(player);
    }
  }

  console.log("Will delete:", toDelete.map(p => p.ad_soyad));

  // Delete them
  for (const p of toDelete) {
    await fetch(`${URL}/rest/v1/oyuncular?id=eq.${p.id}`, {
      method: 'DELETE',
      headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
    });
    console.log(`Deleted: ${p.ad_soyad}`);
  }
}
run();
