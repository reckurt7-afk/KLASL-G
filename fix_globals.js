const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace(/--primary: #e60000;/g, '--primary: #d4af37;');
css = css.replace(/--primary-dark: #cc0000;/g, '--primary-dark: #b5952f;');
css = css.replace(/--border-red: rgba\(255, 49, 49, 0\.25\);/g, '--border-red: rgba(212, 175, 55, 0.25);');
css = css.replace(/rgba\(230,0,0,/g, 'rgba(212,175,55,');
css = css.replace(/#e60000/g, '#d4af37');
fs.writeFileSync('app/globals.css', css, 'utf8');
console.log('Fixed globals.css!');
