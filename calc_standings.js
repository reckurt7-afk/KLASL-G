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
  const takimlar = await fetchTable('takimlar', 'select=id,ad,city_id');
  const maclar = await fetchTable('maclar', 'select=ev_sahibi,deplasman,ev_skor,dep_skor,oynandi&oynandi=eq.true');
  
  let stats = {};
  takimlar.forEach(t => {
    stats[t.ad] = { 
      id: t.id,
      oynanan: 0, 
      galibiyet: 0, 
      beraberlik: 0, 
      maglubiyet: 0, 
      atilan_gol: 0, 
      yenilen_gol: 0, 
      averaj: 0, 
      puan: 0 
    };
  });

  maclar.forEach(m => {
    let ev = stats[m.ev_sahibi];
    let dep = stats[m.deplasman];
    
    if (ev && dep) {
      ev.oynanan += 1;
      dep.oynanan += 1;
      
      ev.atilan_gol += m.ev_skor;
      ev.yenilen_gol += m.dep_skor;
      
      dep.atilan_gol += m.dep_skor;
      dep.yenilen_gol += m.ev_skor;
      
      if (m.ev_skor > m.dep_skor) {
        ev.galibiyet += 1; ev.puan += 3;
        dep.maglubiyet += 1;
      } else if (m.ev_skor < m.dep_skor) {
        dep.galibiyet += 1; dep.puan += 3;
        ev.maglubiyet += 1;
      } else {
        ev.beraberlik += 1; ev.puan += 1;
        dep.beraberlik += 1; dep.puan += 1;
      }
      
      ev.averaj = ev.atilan_gol - ev.yenilen_gol;
      dep.averaj = dep.atilan_gol - dep.yenilen_gol;
    }
  });

  console.log(stats);
  
  // write the reset requests to a file
  let queries = Object.values(stats).map(s => {
    return `await fetchTable('takimlar?id=eq.${s.id}', 'PATCH', JSON.stringify({oynanan: ${s.oynanan}, galibiyet: ${s.galibiyet}, beraberlik: ${s.beraberlik}, maglubiyet: ${s.maglubiyet}, atilan_gol: ${s.atilan_gol}, yenilen_gol: ${s.yenilen_gol}, averaj: ${s.averaj}, puan: ${s.puan}}));`
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
  console.log('RESET DONE');
}
update();
`;
  fs.writeFileSync('do_reset.js', scriptStr);
}
run();
