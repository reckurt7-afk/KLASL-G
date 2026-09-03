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
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json')) results.push(file);
    }
  });
  return results;
}

const files = walk('app');
files.push('public/manifest.json');
files.push('public/sw.js');

let replacedCount = 0;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('/icons/logo.png')) {
      content = content.replace(/\/icons\/logo\.png/g, '/icons/prolig-logo-yeni.jpg');
      fs.writeFileSync(file, content, 'utf8');
      console.log("Updated:", file);
      replacedCount++;
    }
  }
});

console.log(`Replaced logo references in ${replacedCount} files.`);
