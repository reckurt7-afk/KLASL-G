const fs = require('fs');
let code = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

const newSortLogic = `
          const sorted = [...data];
          
          // 1. Karacabey'i en başa (1. sıraya) al
          const indexKaracabey = sorted.findIndex(c => c.name && c.name.toLowerCase().includes("karacabey"));
          if (indexKaracabey > -1) {
             const itemKaracabey = sorted.splice(indexKaracabey, 1)[0];
             sorted.unshift(itemKaracabey);
          }

          // 2. ID 8'i (4. Sezon vb) 2. sıraya (index 1) al
          const index8 = sorted.findIndex(c => c.id === 8);
          if (index8 > -1) {
             const item8 = sorted.splice(index8, 1)[0];
             sorted.splice(1, 0, item8);
          }
`;

code = code.replace(
  /\/\/ -zel Sralama: ID 8'i \(4\. Sezon\) ikinci sraya \(index 1\) al[\s\S]*?sorted\.splice\(1, 0, item8\); \/\/ 1\. indexe \(yani 2\. sraya\) yerleYtir\r?\n\s*\}/,
  newSortLogic
);

// Fallback if the weird encoding characters don't match
if (!code.includes("indexKaracabey")) {
  code = code.replace(
    /const sorted = \[\.\.\.data\];[\s\S]*?if \(!selectedCityId && sorted\.length > 0\)/,
    newSortLogic + "\n          if (!selectedCityId && sorted.length > 0)"
  );
}

fs.writeFileSync('app/components/CityStoryBar.tsx', code, 'utf8');
console.log("Updated CityStoryBar.tsx");
