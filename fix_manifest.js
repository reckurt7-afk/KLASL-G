const fs = require('fs');
let content = fs.readFileSync('public/manifest.json', 'utf8');
content = content.replace(/\/icons\/prolig-logo-yeni\.jpg/g, '/icons/logo.png');
fs.writeFileSync('public/manifest.json', content, 'utf8');
console.log("Fixed manifest!");
