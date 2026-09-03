const fs = require('fs');
let code = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

code = code.replace(
  '          if (!selectedCityId && sorted.length > 0) {',
  '          setCities(sorted);\n          if (!selectedCityId && sorted.length > 0) {'
);

fs.writeFileSync('app/components/CityStoryBar.tsx', code, 'utf8');
console.log("Restored setCities!");
