const fs = require('fs');

let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// 1. Update Mac type
if (!content.includes('ev_logo?: string;')) {
    content = content.replace(
      'youtube_link: string;',
      'youtube_link: string;\n  ev_logo?: string;\n  dep_logo?: string;'
    );
}

// 2. maclariGetir
const targetMaclariGetir = `  async function maclariGetir() {
    const data = await publicFetch("maclar", "select=*&order=hafta.asc");
    // null olan skorları 0'a çevir
    const normalize = (data || []).map((m: any) => ({`;

const newMaclariGetir = `  async function maclariGetir() {
    const [macData, teamData] = await Promise.all([
      publicFetch("maclar", "select=*&order=hafta.asc"),
      publicFetch("teams", "select=name,logo")
    ]);
    const teams = teamData || [];
    const getLogo = (name: string) => teams.find((t: any) => t.name === name)?.logo || "";

    const normalize = (macData || []).map((m: any) => ({
      ev_logo: getLogo(m.ev_sahibi || ""),
      dep_logo: getLogo(m.deplasman || ""),`;

const parts = content.split('const data = await publicFetch("maclar", "select=*&order=hafta.asc");');
if(parts.length > 1) {
    const secondPart = parts[1].replace('const normalize = (data || []).map((m: any) => ({', 
      `const teamData = await publicFetch("teams", "select=name,logo");
    const teams = teamData || [];
    const getLogo = (name: string) => teams.find((t: any) => t.name === name)?.logo || "";

    const normalize = (data || []).map((m: any) => ({
      ev_logo: getLogo(m.ev_sahibi || ""),
      dep_logo: getLogo(m.deplasman || ""),`);
    content = parts[0] + 'const data = await publicFetch("maclar", "select=*&order=hafta.asc");\n' + secondPart;
}

// 3. UI Logos
content = content.replace(
  /<div className="w-16 h-16 rounded-xl bg-\[#1a1a1a\] flex items-center justify-center border border-gray-800 mb-3 text-\[10px\] text-gray-600 text-center leading-tight overflow-hidden">\s*Logo\s*<\/div>/g,
  function(match, offset, string) {
    if (!this.evDone) {
        this.evDone = true;
        return `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 overflow-hidden">
                    {seciliMac.ev_logo ? <img src={seciliMac.ev_logo} alt="logo" className="w-full h-full object-contain p-1" /> : <span className="text-[10px] text-gray-600">Logo</span>}
                  </div>`;
    } else {
        return `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 overflow-hidden">
                    {seciliMac.dep_logo ? <img src={seciliMac.dep_logo} alt="logo" className="w-full h-full object-contain p-1" /> : <span className="text-[10px] text-gray-600">Logo</span>}
                  </div>`;
    }
  }
);

// 4. Gol buttons
content = content.replace(
  /onClick=\{\(\) => \{ macGuncelle\('ev_skor', \(seciliMac\.ev_skor \|\| 0\) \+ 1\); golSesiCal\(\); \}\}/,
  `onClick={() => { 
    macGuncelle('ev_skor', (seciliMac.ev_skor || 0) + 1); 
    golSesiCal(); 
    fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '⚽ GOL! | ' + seciliMac.ev_sahibi + ' ' + ((seciliMac.ev_skor || 0) + 1) + ' - ' + (seciliMac.dep_skor || 0) + ' ' + seciliMac.deplasman, mesaj: seciliMac.dakika + ". Dakika", url: "/" }) }); 
  }}`
);

content = content.replace(
  /onClick=\{\(\) => \{ macGuncelle\('dep_skor', \(seciliMac\.dep_skor \|\| 0\) \+ 1\); golSesiCal\(\); \}\}/,
  `onClick={() => { 
    macGuncelle('dep_skor', (seciliMac.dep_skor || 0) + 1); 
    golSesiCal(); 
    fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '⚽ GOL! | ' + seciliMac.ev_sahibi + ' ' + (seciliMac.ev_skor || 0) + ' - ' + ((seciliMac.dep_skor || 0) + 1) + ' ' + seciliMac.deplasman, mesaj: seciliMac.dakika + ". Dakika", url: "/" }) }); 
  }}`
);

// 5. Baslat button
content = content.replace(
  /onClick=\{\(\) => \{ canliDurumGuncelle\(true\); setSureCalisiyor\(true\); \}\}/,
  `onClick={() => { 
    canliDurumGuncelle(true); 
    setSureCalisiyor(true); 
    fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '▶ MAÇ BAŞLADI | ' + seciliMac.ev_sahibi + ' - ' + seciliMac.deplasman, mesaj: 'Maç an itibariyle başladı!', url: "/" }) }); 
  }}`
);

// 6. olayEkle notification
const olayRegex = /if \(error\) \{\s*alert\("Olay eklenemedi: " \+ error\.message\);\s*\} else \{\s*alert\("Olay ba[^"]+"[^;]*;\s*setOlayOyuncu\(""\);\s*\}/;
const replaceOlay = `if (error) {
      alert("Olay eklenemedi: " + error.message);
    } else {
      alert("Olay başarıyla eklendi!");
      let emoji = "🔔";
      if (olayTipi === "GOL") emoji = "⚽ GOL!";
      if (olayTipi === "SARI_KART") emoji = "🟨 SARI KART";
      if (olayTipi === "KIRMIZI_KART") emoji = "🟥 KIRMIZI KART";
      if (olayTipi === "ASIST") emoji = "🎯 ASİST";
      if (olayTipi === "DEGISIKLIK") emoji = "🔄 DEĞİŞİKLİK";
      const takimAdi = olayTakimYonu === "ev" ? seciliMac.ev_sahibi : seciliMac.deplasman;
      fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: emoji + ' | ' + takimAdi, mesaj: seciliMac.dakika + ". Dakika - Oyuncu: " + olayOyuncu, url: "/" }) });
      setOlayOyuncu("");
    }`;

content = content.replace(olayRegex, replaceOlay);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
console.log('Safe patch applied via script');
