const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// 1. Update Mac type
content = content.replace(
  'youtube_link: string;',
  'youtube_link: string;\n  ev_logo?: string;\n  dep_logo?: string;'
);

// 2. Update maclariGetir
const targetMac = `  async function maclariGetir() {
    const data = await publicFetch("maclar", "select=*&order=hafta.asc");
    // null olan skorları 0'a çevir
    const normalize = (data || []).map((m: any) => ({
      ...m,
      ev_skor: m.ev_skor ?? 0,
      dep_skor: m.dep_skor ?? 0,
      dakika: m.dakika ?? 0,
      ev_sahibi: m.ev_sahibi || "Ev Sahibi",
      deplasman: m.deplasman || "Deplasman",
    }));
    setMaclar(normalize);
  }`;
const replaceMac = `  async function maclariGetir() {
    const [macData, teamData] = await Promise.all([
      publicFetch("maclar", "select=*&order=hafta.asc"),
      publicFetch("teams", "select=name,logo")
    ]);
    const teams = teamData || [];
    const getLogo = (name) => teams.find((t) => t.name === name)?.logo || "";

    const normalize = (macData || []).map((m) => ({
      ...m,
      ev_skor: m.ev_skor ?? 0,
      dep_skor: m.dep_skor ?? 0,
      dakika: m.dakika ?? 0,
      ev_sahibi: m.ev_sahibi || "Ev Sahibi",
      deplasman: m.deplasman || "Deplasman",
      ev_logo: getLogo(m.ev_sahibi),
      dep_logo: getLogo(m.deplasman)
    }));
    setMaclar(normalize);
  }`;
content = content.replace(targetMac, replaceMac);

// 3. Update the display of the logos in the UI
content = content.replace(
  `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 text-[10px] text-gray-600 text-center leading-tight overflow-hidden">
                    Logo
                  </div>`,
  `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 overflow-hidden">
                    {seciliMac.ev_logo ? <img src={seciliMac.ev_logo} alt="logo" className="w-full h-full object-contain p-1" /> : <span className="text-[10px] text-gray-600">Logo</span>}
                  </div>`
);

content = content.replace(
  `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 text-[10px] text-gray-600 text-center leading-tight overflow-hidden">
                    Logo
                  </div>`,
  `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 overflow-hidden">
                    {seciliMac.dep_logo ? <img src={seciliMac.dep_logo} alt="logo" className="w-full h-full object-contain p-1" /> : <span className="text-[10px] text-gray-600">Logo</span>}
                  </div>`
);

// 4. Implement notification for Goal button
const golSesiRegexEv = /macGuncelle\('ev_skor', \(seciliMac\.ev_skor \|\| 0\) \+ 1\); golSesiCal\(\);/g;
const golSesiReplaceEv = `macGuncelle('ev_skor', (seciliMac.ev_skor || 0) + 1); golSesiCal(); fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '⚽ GOL! | ' + seciliMac.ev_sahibi + ' ' + ((seciliMac.ev_skor || 0) + 1) + ' - ' + (seciliMac.dep_skor || 0) + ' ' + seciliMac.deplasman, mesaj: seciliMac.dakika + ". Dakika", url: "/" }) });`;
content = content.replace(golSesiRegexEv, golSesiReplaceEv);

const golSesiRegexDep = /macGuncelle\('dep_skor', \(seciliMac\.dep_skor \|\| 0\) \+ 1\); golSesiCal\(\);/g;
const golSesiReplaceDep = `macGuncelle('dep_skor', (seciliMac.dep_skor || 0) + 1); golSesiCal(); fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '⚽ GOL! | ' + seciliMac.ev_sahibi + ' ' + (seciliMac.ev_skor || 0) + ' - ' + ((seciliMac.dep_skor || 0) + 1) + ' ' + seciliMac.deplasman, mesaj: seciliMac.dakika + ". Dakika", url: "/" }) });`;
content = content.replace(golSesiRegexDep, golSesiReplaceDep);

// 5. Implement notification for Başlat
const baslatRegex = /canliDurumGuncelle\(true\); setSureCalisiyor\(true\);/;
const baslatReplace = `canliDurumGuncelle(true); setSureCalisiyor(true); fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '▶ MAÇ BAŞLADI', mesaj: seciliMac.ev_sahibi + ' 0 - 0 ' + seciliMac.deplasman, url: "/" }) });`;
content = content.replace(baslatRegex, baslatReplace);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
console.log('done');
