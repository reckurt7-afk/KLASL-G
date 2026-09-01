const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

const regex = /baslik:\s*"🚀 YENİ TAKIM KATILDI!",\s*mesaj:\s*`\$\{leagueName\}'UN YENİ TAKIMI KLAS LİG AİLESİNE HOŞGELDİN \$\{formData\.name\.toUpperCase\(\)\}!`/;

const newPayload = `baslik: "🔥 SAVAŞA YENİ BİR TAKIM KATILDI!",
            mesaj: \`\${formData.name.toUpperCase()}, resmen \${leagueName} arenasında! Klas Lig ailesine hoş geldiniz. 🏆\``;

content = content.replace(regex, newPayload);

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Bildirim mesaji guncellendi!');
