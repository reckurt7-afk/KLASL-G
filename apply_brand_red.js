const fs = require('fs');

const files = ['app/page.tsx', 'app/components/Header.tsx', 'app/components/Navbar.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Header and page.tsx
  const brandRegex = /text-\[\#0f172a\]([^>]*)>PRO <span className="text-\[\#d4af37\]">L(İ|I|)G<\/span>/g;
  if (brandRegex.test(content)) {
    content = content.replace(brandRegex, 'text-[#cc0000]$1>PRO <span className="text-black">LİG</span>');
    changed = true;
  }

  // Navbar.tsx
  const navbarRegex = /text-\[\#0f172a\]([^>]*)>PRO L(İ|I|)G<\/span>/g;
  if (navbarRegex.test(content)) {
    content = content.replace(navbarRegex, 'text-[#cc0000]$1>PRO <span className="text-black">LİG</span></span>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated brand colors in:", file);
  }
});
