const fs = require('fs');
let content = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

const injection = `
        if (data) {
          // Özel Sıralama: ID 8'i (4. Sezon) ikinci sıraya (index 1) al
          const sorted = [...data];
          const index8 = sorted.findIndex(c => c.id === 8);
          if (index8 > -1) {
             const item8 = sorted.splice(index8, 1)[0];
             sorted.splice(1, 0, item8); // 1. indexe (yani 2. sıraya) yerleştir
          }
          
          setCities(sorted);
          if (!selectedCityId && sorted.length > 0) {
            setSelectedCityId(sorted[0].id);
          }
        }
`;

// Original lines to replace:
//        if (data) {
//          setCities(data);
//          // Eğer seçili şehir yoksa veya listede yoksa, varsayılan olarak Bursa'yı (1) veya ilk şehri seç
//          if (!selectedCityId && data.length > 0) {
//            setSelectedCityId(data[0].id);
//          }
//        }

const original = `        if (data) {
          setCities(data);
          // EYer seili Yehir yoksa veya listede yoksa, varsaylan olarak Bursa'y (1) veya ilk Yehri se
          if (!selectedCityId && data.length > 0) {
            setSelectedCityId(data[0].id);
          }
        }`;

// Using Regex to reliably match and replace
const regex = /if \(data\) \{\s*setCities\(data\);\s*\/\/[^\n]*\n\s*if \(!selectedCityId && data\.length > 0\) \{\s*setSelectedCityId\(data\[0\]\.id\);\s*\}\s*\}/m;

content = content.replace(regex, injection.trim());

fs.writeFileSync('app/components/CityStoryBar.tsx', content, 'utf8');
console.log('Fixed CityStoryBar sorting!');
