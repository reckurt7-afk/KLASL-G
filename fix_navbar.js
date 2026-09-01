const fs = require('fs');
let content = fs.readFileSync('app/components/Navbar.tsx', 'utf8');

// Replace <span className="text-2xl font-black text-[#0f172a] tracking-widest leading-none group-hover:text-[#d4af37] transition-colors duration-300">PRO LİG</span>
content = content.replace(
  /<span className="text-2xl font-black text-\[\#0f172a\]([^>]*)>PRO L(İ|I|)G<\/span>/g,
  '<span className="text-2xl font-black text-[#cc0000] $1>PRO <span className="text-black">LİG</span></span>'
);

fs.writeFileSync('app/components/Navbar.tsx', content, 'utf8');
console.log("Updated Navbar!");
