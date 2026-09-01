const fs = require('fs');

function replaceFile(path, regex, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content, 'utf8');
}

replaceFile('app/components/Header.tsx', /KLAS <span/g, 'PRO <span');
replaceFile('app/page.tsx', /KLAS <span/g, 'PRO <span');
replaceFile('app/admin-giris/page.tsx', /KlasLig2026!/g, 'ProLig2026!');
replaceFile('app/components/MacDetayModal.tsx', /Klas Saha 1/g, 'Pro Saha 1');
replaceFile('app/components/NotificationButton.tsx', /KLAS LIG BURSA/g, 'PRO LIG BURSA');
replaceFile('app/esame-listesi/page.tsx', /klas2026/g, 'pro2026');
replaceFile('app/profil/page.tsx', />KLAS<\/div>/g, '>PRO</div>');
replaceFile('app/super-admin/page.tsx', /temsilci@klaslig\.com/g, 'temsilci@prolig.com');
replaceFile('app/takim/[slug]/page.tsx', />KLAS<\/div>/g, '>PRO</div>');
replaceFile('app/takim-kur/page.tsx', /Klas FC/g, 'Pro FC');

console.log('Fixed remaining KLAS text!');
