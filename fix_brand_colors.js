const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('app');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace Header/Navbar Brand text
  // Looking for: text-[#0f172a] (or similar) followed by PRO <span className="text-[#d4af37]">LİG</span>
  const brandRegex = /text-\[\#0f172a\]([^>]*)>PRO <span className="text-\[\#d4af37\]">L(İ|I|)G<\/span>/g;
  if (brandRegex.test(content)) {
    content = content.replace(brandRegex, 'text-[#cc0000]$1>PRO <span className="text-black">LİG</span>');
    changed = true;
  }
  
  const brandRegex2 = /text-\[\#0f172a\]([^>]*)>PRO <span className="text-\[\#d4af37\]">L&Iuml;G<\/span>/g;
  if (brandRegex2.test(content)) {
    content = content.replace(brandRegex2, 'text-[#cc0000]$1>PRO <span className="text-black">LİG</span>');
    changed = true;
  }

  // Same for white text versions (if any)
  const brandRegexWhite = /text-white([^>]*)>PRO <span className="text-\[\#d4af37\]">L(İ|I|)G<\/span>/g;
  if (brandRegexWhite.test(content)) {
    content = content.replace(brandRegexWhite, 'text-[#cc0000]$1>PRO <span className="text-black">LİG</span>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated brand colors in:", file);
  }
});

// Also fix CityStoryBar text color to be RED
const cityStoryBarPath = 'app/components/CityStoryBar.tsx';
let cityStoryBar = fs.readFileSync(cityStoryBarPath, 'utf8');
// text-[#1e3a8a] is selected state, text-gray-700 is unselected state.
// Make selected state RED and unselected RED as well? The user said "yazıları kırmızı yapsak rengini"
cityStoryBar = cityStoryBar.replace(
  /\$\{isSelected \? "text-\[\#1e3a8a\]" : "text-gray-700"\}/g,
  '${isSelected ? "text-[#cc0000]" : "text-[#cc0000]"}'
);
fs.writeFileSync(cityStoryBarPath, cityStoryBar, 'utf8');
console.log("Updated CityStoryBar colors");
