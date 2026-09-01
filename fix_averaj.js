const fs = require('fs');
const https = require('https');

const envVars = fs.readFileSync('.env.local', 'utf8').split('\n');
let url = '', key = '';
envVars.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const newStats = {
  'PS 5': { goals_for: 31, goals_against: 21, goal_difference: 10 },
  'GRAVYER FC': { goals_for: 30, goals_against: 14, goal_difference: 16 },
  'KROKODİLLA FC': { goals_for: 26, goals_against: 12, goal_difference: 14 },
  'YEŞİL BURSA FC': { goals_for: 26, goals_against: 18, goal_difference: 8 },
  'NOVA FC': { goals_for: 25, goals_against: 24, goal_difference: 1 },
  'DİNAMO NALBANTOĞLU': { goals_for: 11, goals_against: 19, goal_difference: -8 },
  'BİSKREM FC': { goals_for: 10, goals_against: 24, goal_difference: -14 },
  'YEDİYOL BLACK FC': { goals_for: 10, goals_against: 36, goal_difference: -26 }
};

function fetchTable(path, method, body) {
  return new Promise(resolve => {
    const req = https.request(url + '/rest/v1/' + path, {
      method: method,
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }
    }, res => {
      resolve();
    });
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  const teamsData = await new Promise(resolve => {
    https.get(url + '/rest/v1/teams?select=id,name', {
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });

  const normalize = s => s.trim().replace(/\s+/g, " ");

  for (let t of teamsData) {
    const stat = newStats[normalize(t.name)];
    if (stat) {
      await fetchTable(`teams?id=eq.${t.id}`, 'PATCH', JSON.stringify(stat));
    }
  }
  console.log('Successfully applied correct averages!');
}
run();
