const fs = require('fs');
const https = require('https');

const envVars = fs.readFileSync('.env.local', 'utf8').split('\n');
let url = '', key = '';
envVars.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

function fetchTable(table) {
  return new Promise(resolve => {
    https.get(url + '/rest/v1/' + table + '?select=*&limit=1', {
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
  });
}

async function run() {
  console.log('TAKIMLAR:', await fetchTable('takimlar'));
  console.log('TEAMS:', await fetchTable('teams'));
}
run();
