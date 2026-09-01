const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');
page = page.replace(/text-\[20px\] md:text-\[22px\] tracking-tight text-\[#0f172a\] text-\[24px\] md:text-\[28px\]/, 'text-[#0f172a] text-[26px] md:text-[30px] tracking-tighter');
fs.writeFileSync('app/page.tsx', page, 'utf8');

let header = fs.readFileSync('app/components/Header.tsx', 'utf8');
header = header.replace(/text-gray-900 text-2xl/, 'text-[#0f172a] text-3xl tracking-tighter');
fs.writeFileSync('app/components/Header.tsx', header, 'utf8');

let nav = fs.readFileSync('app/components/Navbar.tsx', 'utf8');
nav = nav.replace(/text-xl font-black text-gray-900/, 'text-2xl font-black text-[#0f172a]');
fs.writeFileSync('app/components/Navbar.tsx', nav, 'utf8');

console.log('Fixed header text sizes!');
