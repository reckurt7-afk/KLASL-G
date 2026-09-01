const fs = require('fs');
const https = require('https');

const envVars = fs.readFileSync('.env.local', 'utf8').split('\n');
let url = '', key = '';
envVars.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const newStats = {
  'DİNAMO NALBANTOĞLU': { played: 4, won: 1, drawn: 0, lost: 3, points: 3, goals_for: 3, goals_against: 0, goal_difference: 3 },
  'YEDİYOL BLACK FC': { played: 5, won: 0, drawn: 0, lost: 5, points: 0, goals_for: 0, goals_against: 3, goal_difference: -3 },
  'BİSKREM FC': { played: 4, won: 1, drawn: 0, lost: 3, points: 3, goals_for: 0, goals_against: 3, goal_difference: -3 },
  'KROKODİLLA FC': { played: 5, won: 4, drawn: 0, lost: 1, points: 12, goals_for: 3, goals_against: 0, goal_difference: 3 },
  'GRAVYER FC': { played: 5, won: 4, drawn: 0, lost: 1, points: 12, goals_for: 6, goals_against: 2, goal_difference: 4 },
  'YEŞİL BURSA FC': { played: 5, won: 2, drawn: 0, lost: 3, points: 6, goals_for: 2, goals_against: 6, goal_difference: -4 },
  'PS 5': { played: 4, won: 3, drawn: 0, lost: 1, points: 9, goals_for: 6, goals_against: 9, goal_difference: -3 },
  'NOVA FC': { played: 4, won: 3, drawn: 0, lost: 1, points: 9, goals_for: 9, goals_against: 6, goal_difference: 3 }
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
  console.log('Successfully applied accurate custom stats!');
}
run();
