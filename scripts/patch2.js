const fs = require('fs');

function fixCanliMac() {
  let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

  // Replace type Mac
  if (!content.includes('ev_logo?: string;')) {
    content = content.replace(
      'youtube_link: string;',
      'youtube_link: string;\n  ev_logo?: string;\n  dep_logo?: string;'
    );
  }

  // Replace maclariGetir
  const maclariGetirRegex = /async function maclariGetir\(\) \{([\s\S]*?)setMaclar\(normalize\);\n  \}/;
  const newMaclariGetir = `async function maclariGetir() {
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
  content = content.replace(maclariGetirRegex, newMaclariGetir);

  // Replace Ev Logo div
  const evLogoDivRegex = /<div className="w-16 h-16 rounded-xl bg-\[#1a1a1a\] flex items-center justify-center border border-gray-800 mb-3 text-\[10px\] text-gray-600 text-center leading-tight overflow-hidden">\s*Logo\s*<\/div>/;
  const newEvLogoDiv = `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 overflow-hidden">
                    {seciliMac.ev_logo ? <img src={seciliMac.ev_logo} alt="logo" className="w-full h-full object-contain p-1" /> : <span className="text-[10px] text-gray-600">Logo</span>}
                  </div>`;
  content = content.replace(evLogoDivRegex, newEvLogoDiv);

  // Replace Dep Logo div
  const depLogoDivRegex = /<div className="w-16 h-16 rounded-xl bg-\[#1a1a1a\] flex items-center justify-center border border-gray-800 mb-3 text-\[10px\] text-gray-600 text-center leading-tight overflow-hidden">\s*Logo\s*<\/div>/;
  const newDepLogoDiv = `<div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-gray-800 mb-3 overflow-hidden">
                    {seciliMac.dep_logo ? <img src={seciliMac.dep_logo} alt="logo" className="w-full h-full object-contain p-1" /> : <span className="text-[10px] text-gray-600">Logo</span>}
                  </div>`;
  content = content.replace(depLogoDivRegex, newDepLogoDiv);

  // Update GOL! Ev
  const golEvRegex = /macGuncelle\('ev_skor', Math.max\(0, \(seciliMac\.ev_skor \|\| 0\) - 1\)\)}[\s\S]*?onClick=\{\(\) => \{ macGuncelle\('ev_skor', \(seciliMac\.ev_skor \|\| 0\) \+ 1\); golSesiCal\(\); \}\}/;
  if(content.match(golEvRegex)) {
    const newGolEv = content.match(golEvRegex)[0].replace(
      `onClick={() => { macGuncelle('ev_skor', (seciliMac.ev_skor || 0) + 1); golSesiCal(); }}`,
      `onClick={() => { macGuncelle('ev_skor', (seciliMac.ev_skor || 0) + 1); golSesiCal(); fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '⚽ GOL! | ' + seciliMac.ev_sahibi + ' ' + ((seciliMac.ev_skor || 0) + 1) + ' - ' + (seciliMac.dep_skor || 0) + ' ' + seciliMac.deplasman, mesaj: seciliMac.dakika + \\\". Dakika\\\", url: \\\"/\\\" }) }); }}`
    );
    content = content.replace(golEvRegex, newGolEv);
  }

  // Update GOL! Dep
  const golDepRegex = /onClick=\{\(\) => \{ macGuncelle\('dep_skor', \(seciliMac\.dep_skor \|\| 0\) \+ 1\); golSesiCal\(\); \}\}/;
  if(content.match(golDepRegex)) {
    const newGolDep = content.match(golDepRegex)[0].replace(
      `onClick={() => { macGuncelle('dep_skor', (seciliMac.dep_skor || 0) + 1); golSesiCal(); }}`,
      `onClick={() => { macGuncelle('dep_skor', (seciliMac.dep_skor || 0) + 1); golSesiCal(); fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '⚽ GOL! | ' + seciliMac.ev_sahibi + ' ' + (seciliMac.ev_skor || 0) + ' - ' + ((seciliMac.dep_skor || 0) + 1) + ' ' + seciliMac.deplasman, mesaj: seciliMac.dakika + \\\". Dakika\\\", url: \\\"/\\\" }) }); }}`
    );
    content = content.replace(golDepRegex, newGolDep);
  }

  // Update Başlat
  const baslatRegex = /canliDurumGuncelle\(true\); setSureCalisiyor\(true\);/g;
  content = content.replace(baslatRegex, `canliDurumGuncelle(true); setSureCalisiyor(true); fetch('/api/send-notification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baslik: '▶ MAÇ BAŞLADI | ' + seciliMac.ev_sahibi + ' - ' + seciliMac.deplasman, mesaj: 'Maç an itibariyle başladı!', url: '/' }) });`);

  fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
  console.log('Successfully patched!');
}

fixCanliMac();
