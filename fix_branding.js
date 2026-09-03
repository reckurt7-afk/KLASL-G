const fs = require('fs');
let page = fs.readFileSync('app/page.tsx', 'utf8');

// Logo
page = page.replace(/\/icons\/logo\.png/g, '/icons/prolig-logo-final.jpg');

// Video src
page = page.replace(/\/hero-bg-2\.mp4/g, '/hero-bg-classic.mp4');

// Text
page = page.replace(/KLAS LİG/g, 'PRO LİG');
page = page.replace(/Klas Lig/g, 'Pro Lig');
page = page.replace(/KLAS <span className="text-\[#e60000\]">LİG<\/span>/g, 'PRO <span className="text-[#e60000]">LİG</span>');

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed page.tsx!');
