const fs = require('fs');
let content = fs.readFileSync('app/components/CityStoryBar.tsx', 'utf8');

// Replace the Image className
content = content.replace(/className="object-contain"/, 'className="rounded-full object-contain"');

// Replace the text inside the span
content = content.replace(/<span className=\{`text-\[11px\] font-bold leading-tight text-center \$\{isSelected \? "text-\[#1e3a8a\]" : "text-gray-700"\}`\}>\s*\{city\.name\}\s*<\/span>/, 
  '<span className={`text-[10px] font-bold leading-tight text-center ${isSelected ? "text-[#1e3a8a]" : "text-gray-700"}`}>\n                  {city.name.replace(/^PRO LİG /i, "")}\n                </span>');

fs.writeFileSync('app/components/CityStoryBar.tsx', content, 'utf8');
console.log("Fixed carefully!");
