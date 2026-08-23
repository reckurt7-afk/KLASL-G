const fs = require('fs');
let content = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

content = content.replace(/await fetch\('\/api\/send-notification'([^;]+);/g, (match) => {
  return `try {
    const res = ${match.slice(0, -1)};
    const text = await res.text();
    if (!res.ok) alert('BİLDİRİM API HATASI: ' + text);
    // else alert('BAŞARILI: ' + text); // optional
  } catch(e) {
    alert('BİLDİRİM AĞ HATASI: ' + e.message);
  }`;
});

fs.writeFileSync('app/admin/canli-mac/page.tsx', content);
console.log("Added alerts");
