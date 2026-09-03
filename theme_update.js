const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files').toString().split('\n').filter(Boolean);
const jsTsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.css'));

let changed = 0;

jsTsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;

  // Replace reds
  content = content.replace(/#e60000/gi, '#9e1b22');
  content = content.replace(/#cc0000/gi, '#9e1b22');
  content = content.replace(/#ff3333/gi, '#b82029');
  
  // Replace golds if any old ones existed like #d4af37
  content = content.replace(/#d4af37/gi, '#ceaa52');
  
  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
  }
});
console.log(`Updated theme colors in ${changed} files!`);
