
const https = require('https');
const url = 'https://tebmmmmbwsholknougiw.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlYm1tbW1id3Nob2xrbm91Z2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzE1NjIsImV4cCI6MjA5OTU0NzU2Mn0.m9Op9xMoxPndfl3IdZculYHPVF7hRUHwEpb1mTywKNw';
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
  await fetchTable('takimlar?id=eq.8', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 0, beraberlik: 0, maglubiyet: 1, atilan_gol: 0, yenilen_gol: 3, averaj: -3, puan: 0}));
  await fetchTable('takimlar?id=eq.3', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 1, beraberlik: 0, maglubiyet: 0, atilan_gol: 3, yenilen_gol: 0, averaj: 3, puan: 3}));
  await fetchTable('takimlar?id=eq.2', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 1, beraberlik: 0, maglubiyet: 0, atilan_gol: 3, yenilen_gol: 0, averaj: 3, puan: 3}));
  await fetchTable('takimlar?id=eq.6', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 0, beraberlik: 0, maglubiyet: 1, atilan_gol: 0, yenilen_gol: 3, averaj: -3, puan: 0}));
  await fetchTable('takimlar?id=eq.1', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 0, beraberlik: 0, maglubiyet: 1, atilan_gol: 6, yenilen_gol: 9, averaj: -3, puan: 0}));
  await fetchTable('takimlar?id=eq.10', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 1, beraberlik: 0, maglubiyet: 0, atilan_gol: 9, yenilen_gol: 6, averaj: 3, puan: 3}));
  await fetchTable('takimlar?id=eq.7', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 1, beraberlik: 0, maglubiyet: 0, atilan_gol: 6, yenilen_gol: 2, averaj: 4, puan: 3}));
  await fetchTable('takimlar?id=eq.5', 'PATCH', JSON.stringify({oynanan: 1, galibiyet: 0, beraberlik: 0, maglubiyet: 1, atilan_gol: 2, yenilen_gol: 6, averaj: -4, puan: 0}));
  console.log('RESET DONE');
}
update();
