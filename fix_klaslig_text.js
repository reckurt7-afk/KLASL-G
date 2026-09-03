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
  
  if (content.includes('KLAS LİG')) {
    content = content.replace(/KLAS LİG/g, 'PRO LİG');
    changed = true;
  }
  
  // also check for KLAS LIG (without dotted I)
  if (content.includes('KLAS LIG')) {
    content = content.replace(/KLAS LIG/g, 'PRO LİG');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated KLAS LİG to PRO LİG in:", file);
    replacedCount++;
  }
});

console.log(`Replaced in ${replacedCount} files.`);
