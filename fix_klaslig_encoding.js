const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = [...walk('app'), ...walk('public')];
let replacedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.match(/KLAS L.G/g)) {
    content = content.replace(/KLAS L.G/g, 'PRO LİG');
    changed = true;
  }
  
  if (content.includes('KLAS')) {
    content = content.replace(/KLAS/g, 'PRO');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated KLAS to PRO in:", file);
    replacedCount++;
  }
});

console.log(`Replaced in ${replacedCount} files.`);
