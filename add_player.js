const fs = require('fs');
const https = require('https');

const envVars = fs.readFileSync('.env.local', 'utf8').split('\n');
let url = '', key = '';
envVars.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const playerData = {
  ad_soyad: "Mehmet Devran",
  takim: "DİNAMO NALBANTOĞLU",
  mevki: "Orta Saha",
  genel_puan: 85,
  aktif: true
};

function addPlayer() {
  return new Promise(resolve => {
    const req = https.request(url + '/rest/v1/oyuncular', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log("Player added:", data);
        resolve();
      });
    });
    req.write(JSON.stringify(playerData));
    req.end();
  });
}

addPlayer();
