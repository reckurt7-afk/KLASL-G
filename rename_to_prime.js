const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files in git
const files = execSync('git ls-files').toString().split('\n').filter(Boolean);

const jsTsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.webmanifest'));

let changedFiles = 0;

jsTsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace logos
  content = content.replace(/\/icons\/prolig-logo-final\.jpg/g, '/icons/prime-logo.jpg');
  content = content.replace(/\/icons\/pro-lig-logo\.png/g, '/icons/prime-logo.jpg');

  // Replace texts
  content = content.replace(/PRO LİG/g, 'PRİME LİG');
  content = content.replace(/Pro Lig/g, 'Prime Lig');
  content = content.replace(/PRO LIG/g, 'PRİME LİG');
  content = content.replace(/prolig2026/gi, 'primelig2026');
  content = content.replace(/ProLig2026/g, 'PrimeLig2026');

  // Special JSX text splits
  // e.g. PRO <span className="text-[#e60000]">LİG</span> -> PRİME <span className="text-[#e60000]">LİG</span>
  content = content.replace(/PRO <span/g, 'PRİME <span');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files to PRİME LİG!`);
