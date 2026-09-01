const fs = require('fs');
let content = fs.readFileSync('app/components/TakimlarListesi.tsx', 'utf8');

// Change fetch from teams to takimlar
content = content.replace(/publicFetch\("teams", `select=id,name,logo&league_id=eq\.\$\{selectedCityId\}&order=name\.asc`\);/, 
  'publicFetch("takimlar", `select=id,ad,logo&city_id=eq.${selectedCityId}&order=ad.asc`);\n        if (!data || data.length === 0) {\n          data = await publicFetch("takimlar", `select=id,ad,logo&order=ad.asc`);\n        }');

// Change name to ad
content = content.replace(/takim\.name/g, 'takim.ad');

fs.writeFileSync('app/components/TakimlarListesi.tsx', content, 'utf8');
console.log('Fixed TakimlarListesi!');
