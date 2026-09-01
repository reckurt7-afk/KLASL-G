const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

page = page.replace(
  /\{\/\* Top Badge \*\/\}/g,
  '{/* SAFARI SPACER */}\n          <div className="w-full h-[95px] md:h-[110px] shrink-0 relative z-10"></div>\n\n          {/* Top Badge */}'
);

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Safari physical spacer added BEFORE BADGE!");
