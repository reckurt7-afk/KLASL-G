const fs = require('fs');
let text = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

const oldEvMinus = `onClick={() => macGuncelle('ev_skor', Math.max(0, (seciliMac.ev_skor || 0) - 1))}`;
const newEvMinus = `onClick={async () => {
  if ((seciliMac.ev_skor || 0) <= 0) return;
  const yeniSkor = (seciliMac.ev_skor || 0) - 1;
  const { error } = await supabase.from('maclar').update({ ev_skor: yeniSkor }).eq('id', seciliMac.id);
  if (!error) {
    setSeciliMac({ ...seciliMac, ev_skor: yeniSkor });
    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baslik: "❌ GOL İPTAL",
        mesaj: \`\${seciliMac.ev_sahibi} golü iptal edildi. Skor: \${yeniSkor}-\${seciliMac.dep_skor || 0}\`,
        url: "/"
      }),
    });
  }
}}`;

const oldDepMinus = `onClick={() => macGuncelle('dep_skor', Math.max(0, (seciliMac.dep_skor || 0) - 1))}`;
const newDepMinus = `onClick={async () => {
  if ((seciliMac.dep_skor || 0) <= 0) return;
  const yeniSkor = (seciliMac.dep_skor || 0) - 1;
  const { error } = await supabase.from('maclar').update({ dep_skor: yeniSkor }).eq('id', seciliMac.id);
  if (!error) {
    setSeciliMac({ ...seciliMac, dep_skor: yeniSkor });
    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baslik: "❌ GOL İPTAL",
        mesaj: \`\${seciliMac.deplasman} golü iptal edildi. Skor: \${seciliMac.ev_skor || 0}-\${yeniSkor}\`,
        url: "/"
      }),
    });
  }
}}`;

text = text.replace(oldEvMinus, newEvMinus);
text = text.replace(oldDepMinus, newDepMinus);

fs.writeFileSync('app/admin/canli-mac/page.tsx', text);
console.log('Replaced minus buttons');
