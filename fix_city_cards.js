const fs = require('fs');
let content = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

// Increase card size
content = content.replace(
  /className=\{`w-\[120px\] h-\[90px\] rounded-2xl/g,
  'className={`w-[135px] h-[105px] md:w-[145px] md:h-[110px] rounded-2xl'
);

// Increase logo size inside the card
content = content.replace(
  /<div className="w-8 h-8 relative">/g,
  '<div className="w-10 h-10 md:w-11 md:h-11 relative">'
);

// Increase font size for the city name
content = content.replace(
  /text-\[10px\] font-bold leading-tight text-center break-words w-full px-1/g,
  'text-[11px] md:text-[12px] font-black leading-snug text-center break-words w-full px-2'
);

// Increase font size for AKTİF status
content = content.replace(
  /text-\[8px\] text-gray-500 font-bold/g,
  'text-[9px] md:text-[10px] tracking-widest text-gray-400 font-bold'
);

fs.writeFileSync('app/components/CityStoryBar.tsx', content, 'utf8');
console.log("Improved CityStoryBar readability!");
