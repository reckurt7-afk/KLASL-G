const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

// Update logo
page = page.replace(/\/icons\/logo\.png/g, '/icons/prolig-logo-final.jpg');

// Update KLAS LIG to PRO LIG
page = page.replace(/KLAS LİG/g, 'PRO LİG');
page = page.replace(/KLAS <span className="text-\[#e60000\]">LİG<\/span>/g, 'PRO <span className="text-[#e60000]">LİG</span>');
page = page.replace(/Klas Lig Logo/g, 'Pro Lig Logo');
page = page.replace(/Klas Lig TV/g, 'Pro Lig TV');
page = page.replace(/Klas Lig/g, 'Pro Lig');

// Fix encoding issues if any (it should be fine since it's from git)
fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log('Fixed old page!');
