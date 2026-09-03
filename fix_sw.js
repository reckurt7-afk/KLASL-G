const fs = require('fs');
let sw = fs.readFileSync('public/sw.js', 'utf8');
sw = sw + "\n// Force cache bust: " + Date.now();
fs.writeFileSync('public/sw.js', sw, 'utf8');
