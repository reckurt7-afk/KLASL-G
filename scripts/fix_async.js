const fs = require('fs');

let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

content = content.replace(
  /onClick=\{\(\) => \{([\s\S]*?)macGuncelle\('ev_skor', \(seciliMac\.ev_skor \|\| 0\) \+ 1\);([\s\S]*?)golSesiCal\(\);([\s\S]*?)fetch\('\/api\/send-notification',/g,
  "onClick={async () => {$1await macGuncelle('ev_skor', (seciliMac.ev_skor || 0) + 1);$2golSesiCal();$3await fetch('/api/send-notification',"
);

content = content.replace(
  /onClick=\{\(\) => \{([\s\S]*?)macGuncelle\('dep_skor', \(seciliMac\.dep_skor \|\| 0\) \+ 1\);([\s\S]*?)golSesiCal\(\);([\s\S]*?)fetch\('\/api\/send-notification',/g,
  "onClick={async () => {$1await macGuncelle('dep_skor', (seciliMac.dep_skor || 0) + 1);$2golSesiCal();$3await fetch('/api/send-notification',"
);

content = content.replace(
  /onClick=\{\(\) => \{([\s\S]*?)canliDurumGuncelle\(true\);([\s\S]*?)setSureCalisiyor\(true\);([\s\S]*?)fetch\('\/api\/send-notification',/g,
  "onClick={async () => {$1await canliDurumGuncelle(true);$2setSureCalisiyor(true);$3await fetch('/api/send-notification',"
);

const olayRegex = /fetch\('\/api\/send-notification',/g;
// Wait, I can't blindly replace all. Let me just replace the specific string in olayEkle
content = content.replace(
  "fetch('/api/send-notification', { method: 'POST'",
  "await fetch('/api/send-notification', { method: 'POST'"
);

fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
console.log('Async fixes applied');
