const fs = require('fs');

function updateBrandColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the old text with the new exact brand text and colors
  // Old: text-[#1a1a2e]">PRİME <span className="text-[#9e1b22]">LİG</span></span>
  const regex = /text-\[#1a1a2e\]">PRİME <span className="text-\[#9e1b22\]">LİG<\/span><\/span>/g;
  const newBrandText = 'text-[#ceaa52]">PRIME <span className="text-[#9e1b22]">LiG</span></span>';
  
  content = content.replace(regex, newBrandText);
  
  // Also try replacing PRO if it somehow remained
  const regex2 = /text-\[#1a1a2e\]">PRO <span className="text-\[#9e1b22\]">LİG<\/span><\/span>/g;
  content = content.replace(regex2, newBrandText);
  
  fs.writeFileSync(filePath, content, 'utf8');
}

updateBrandColors('app/page.tsx');
updateBrandColors('app/components/Header.tsx');
console.log('Brand text updated to PRIME (Gold) LiG (Burgundy)');
