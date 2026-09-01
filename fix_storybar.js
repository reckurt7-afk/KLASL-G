const fs = require('fs');

let content = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

// Add rounded-full to the logo
content = content.replace(/className="object-contain"/, 'className="rounded-full object-contain"');

// Shorten city.name by removing PRO LİG
content = content.replace(/{city\.name}/, "{city.name.replace(/^PRO LİG /i, '')}");

// Make the text slightly smaller just in case
content = content.replace(/text-\[11px\]/, 'text-[10px]');

fs.writeFileSync('app/components/CityStoryBar.tsx', content, 'utf8');
console.log('Fixed CityStoryBar!');
