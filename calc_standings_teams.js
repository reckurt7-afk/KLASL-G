const fs = require('fs');
const https = require('https');

const envVars = fs.readFileSync('.env.local', 'utf8').split('\n');
let url = '', key = '';
envVars.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

function fetchTable(table, query) {
  return new Promise(resolve => {
    https.get(url + '/rest/v1/' + table + '?' + query, {
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

async function run() {
  const teams = await fetchTable('teams', 'select=id,name');
  const maclar = await fetchTable('maclar', 'select=ev_sahibi,deplasman,ev_skor,dep_skor,oynandi&oynandi=eq.true');
  
  let stats = {};
  const normalize = s => s.trim().replace(/\s+/g, " ");

  teams.forEach(t => {
    stats[normalize(t.name)] = { 
      id: t.id,
      played: 0, 
      won: 0, 
      drawn: 0, 
      lost: 0, 
      goals_for: 0, 
      goals_against: 0, 
      goal_difference: 0, 
      points: 0 
    };
  });

  maclar.forEach(m => {
    let ev = stats[normalize(m.ev_sahibi)];
    let dep = stats[normalize(m.deplasman)];
    
    if (ev && dep) {
      ev.played += 1;
      dep.played += 1;
      
      ev.goals_for += m.ev_skor;
      ev.goals_against += m.dep_skor;
      
      dep.goals_for += m.dep_skor;
      dep.goals_against += m.ev_skor;
      
      if (m.ev_skor > m.dep_skor) {
        ev.won += 1; ev.points += 3;
        dep.lost += 1;
      } else if (m.ev_skor < m.dep_skor) {
        dep.won += 1; dep.points += 3;
        ev.lost += 1;
      } else {
        ev.drawn += 1; ev.points += 1;
        dep.drawn += 1; dep.points += 1;
      }
      
      ev.goal_difference = ev.goals_for - ev.goals_against;
      dep.goal_difference = dep.goals_for - dep.goals_against;
    }
  });

  console.log(stats);
  
  // write the reset requests to a file
  let queries = Object.values(stats).map(s => {
    return `await fetchTable('teams?id=eq.${s.id}', 'PATCH', JSON.stringify({played: ${s.played}, won: ${s.won}, drawn: ${s.drawn}, lost: ${s.lost}, goals_for: ${s.goals_for}, goals_against: ${s.goals_against}, goal_difference: ${s.goal_difference}, points: ${s.points}}));`
  });
  
  const scriptStr = `
const https = require('https');
const url = '${url}';
const key = '${key}';
function fetchTable(path, method, body) {
  return new Promise(resolve => {
    const req = https.request(url + '/rest/v1/' + path, {
      method: method,
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }
    }, res => {
      resolve();
    });
    req.write(body);
    req.end();
  });
}
async function update() {
  ${queries.join('\n  ')}
  console.log('RESET DONE FOR TEAMS TABLE');
}
update();
`;
  fs.writeFileSync('do_reset_teams.js', scriptStr);
}
run();
