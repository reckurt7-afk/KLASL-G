const fs = require('fs');
let text = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

const evBtn = `onClick={() => { macGuncelle('ev_skor', (seciliMac.ev_skor || 0) + 1); golSesiCal(); }}`;
const newEvBtn = `onClick={async () => { 
  const golAtan = prompt(\`\${seciliMac.ev_sahibi} için golü kim attı? (Boş bırakabilirsiniz)\`);
  const yeniSkor = (seciliMac.ev_skor || 0) + 1;
  const durum = \`Canlı|\${golAtan || ""}\`;
  const { error } = await supabase.from('maclar').update({ ev_skor: yeniSkor, durum }).eq('id', seciliMac.id);
  if (!error) {
    setSeciliMac({ ...seciliMac, ev_skor: yeniSkor, durum });
    golSesiCal();
    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baslik: "⚽ GOOOL!",
        mesaj: golAtan 
          ? \`\${seciliMac.ev_sahibi} adına \${golAtan} topu ağlara gönderdi! Skor: \${yeniSkor}-\${seciliMac.dep_skor || 0}\`
          : \`\${seciliMac.ev_sahibi} gol attı! Skor: \${yeniSkor}-\${seciliMac.dep_skor || 0}\`,
        url: "/"
      }),
    });
  }
}}`;

const depBtn = `onClick={() => { macGuncelle('dep_skor', (seciliMac.dep_skor || 0) + 1); golSesiCal(); }}`;
const newDepBtn = `onClick={async () => { 
  const golAtan = prompt(\`\${seciliMac.deplasman} için golü kim attı? (Boş bırakabilirsiniz)\`);
  const yeniSkor = (seciliMac.dep_skor || 0) + 1;
  const durum = \`Canlı|\${golAtan || ""}\`;
  const { error } = await supabase.from('maclar').update({ dep_skor: yeniSkor, durum }).eq('id', seciliMac.id);
  if (!error) {
    setSeciliMac({ ...seciliMac, dep_skor: yeniSkor, durum });
    golSesiCal();
    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baslik: "⚽ GOOOL!",
        mesaj: golAtan 
          ? \`\${seciliMac.deplasman} adına \${golAtan} topu ağlara gönderdi! Skor: \${seciliMac.ev_skor || 0}-\${yeniSkor}\`
          : \`\${seciliMac.deplasman} gol attı! Skor: \${seciliMac.ev_skor || 0}-\${yeniSkor}\`,
        url: "/"
      }),
    });
  }
}}`;

const baslatBtn = `onClick={() => { canliDurumGuncelle(true); setSureCalisiyor(true); }}`;
const newBaslatBtn = `onClick={async () => { 
  await canliDurumGuncelle(true); 
  setSureCalisiyor(true); 
  await fetch("/api/send-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      baslik: "▶️ MAÇ BAŞLADI!",
      mesaj: \`\${seciliMac.ev_sahibi} ile \${seciliMac.deplasman} arasındaki zorlu mücadele başladı!\`,
      url: "/"
    }),
  });
}}`;

text = text.replace(evBtn, newEvBtn);
text = text.replace(depBtn, newDepBtn);
text = text.replace(baslatBtn, newBaslatBtn);

fs.writeFileSync('app/admin/canli-mac/page.tsx', text);
console.log('Replaced');
