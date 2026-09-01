const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

const oldPayload = `baslik: "🔥 KLAS LİG'E YENİ BİR TAKIM KATILDI!",
            mesaj: \`\${formData.name.toUpperCase()}, resmen \${leagueName} arenasında! Klas Lig ailesine hoş geldiniz. 🏆\`,
            url: "/genel-bakis"`;

const newPayload = `baslik: "🔥 KLAS LİG'E YENİ BİR TAKIM KATILDI!",
            mesaj: \`\${formData.name.toUpperCase()}, resmen \${leagueName} arenasında! Klas Lig ailesine hoş geldiniz. 🏆\`,
            icon: logoUrl || "https://klaslig.vercel.app/icons/icon-192x192.png",
            url: "/genel-bakis"`;

content = content.replace(oldPayload, newPayload);

fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Added icon to notification payload!');
