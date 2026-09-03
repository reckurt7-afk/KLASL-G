const fs = require('fs');
let route = fs.readFileSync('app/api/send-notification/route.ts', 'utf8');

route = route.replace(
  'const vapidEmail = process.env.VAPID_EMAIL;',
  'const vapidEmail = process.env.VAPID_EMAIL || "mailto:info@prolig.com";'
);

fs.writeFileSync('app/api/send-notification/route.ts', route, 'utf8');
console.log('Fixed vapidEmail fallback!');
