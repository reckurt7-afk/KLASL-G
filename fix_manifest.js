const fs = require('fs');
let content = fs.readFileSync('public/manifest.json', 'utf8');
content = content.replace(/KLAS LİG BURSA/g, 'PRO LİG BURSA');
content = content.replace(/KLAS LİG/g, 'PRO LİG');
fs.writeFileSync('public/manifest.json', content, 'utf8');

let webmanifest = fs.readFileSync('public/manifest.webmanifest', 'utf8');
webmanifest = webmanifest.replace(/KLAS LİG BURSA/g, 'PRO LİG BURSA');
webmanifest = webmanifest.replace(/KLAS LİG/g, 'PRO LİG');
fs.writeFileSync('public/manifest.webmanifest', webmanifest, 'utf8');
console.log('Fixed manifests!');
