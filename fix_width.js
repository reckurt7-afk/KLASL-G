const fs = require('fs');
let content = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');
content = content.replace(/w-\[100px\] h-\[80px\]/g, 'w-[120px] h-[90px]');
fs.writeFileSync('app/components/CityStoryBar.tsx', content, 'utf8');
console.log("Width increased");
