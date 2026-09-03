const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files').toString().split('\n').filter(Boolean);
const jsTsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let changed = 0;

jsTsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // Blue #1e3a8a -> Burgundy #9e1b22
  content = content.replace(/#1e3a8a/gi, '#9e1b22');
  // Bright red rgba(230,0,0) -> Burgundy rgba(158,27,34)
  content = content.replace(/230,0,0/g, '158,27,34');
  // Bright red text-[#e60000] remaining
  content = content.replace(/#e60000/gi, '#9e1b22');

  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
  }
});
console.log(`Updated leftover colors in ${changed} files!`);
