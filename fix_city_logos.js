const fs = require('fs');
let page = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

page = page.replace(
  '<Image src="/icons/prime-logo.jpg" alt={city.name} fill className="rounded-full object-contain" />',
  '<Image src="/icons/prime-logo.jpg" alt={city.name} fill className="rounded-full object-cover scale-[1.4] drop-shadow-sm" />'
);

fs.writeFileSync('app/components/CityStoryBar.tsx', page, 'utf8');
console.log('Fixed city logos!');
