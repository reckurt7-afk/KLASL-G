const fs = require('fs');
let content = fs.readFileSync('app/components/PuanDurumuTablosu.tsx', 'utf8');

content = content.replace(/t\.name/g, 't.ad');
content = content.replace(/t\.played/g, 't.oynanan');
content = content.replace(/t\.won/g, 't.galibiyet');
content = content.replace(/t\.drawn/g, 't.beraberlik');
content = content.replace(/t\.lost/g, 't.maglubiyet');
content = content.replace(/t\.goal_difference/g, 't.averaj');
content = content.replace(/t\.points/g, 't.puan');

fs.writeFileSync('app/components/PuanDurumuTablosu.tsx', content, 'utf8');
console.log('Fixed PuanDurumuTablosu fields!');
