
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
  await fetchTable('teams?id=eq.3', 'PATCH', JSON.stringify({played: 1, won: 1, drawn: 0, lost: 0, goals_for: 3, goals_against: 0, goal_difference: 3, points: 3}));
  await fetchTable('teams?id=eq.4', 'PATCH', JSON.stringify({played: 1, won: 0, drawn: 0, lost: 1, goals_for: 0, goals_against: 3, goal_difference: -3, points: 0}));
  await fetchTable('teams?id=eq.5', 'PATCH', JSON.stringify({played: 1, won: 1, drawn: 0, lost: 0, goals_for: 3, goals_against: 0, goal_difference: 3, points: 3}));
  await fetchTable('teams?id=eq.6', 'PATCH', JSON.stringify({played: 1, won: 0, drawn: 0, lost: 1, goals_for: 2, goals_against: 6, goal_difference: -4, points: 0}));
  await fetchTable('teams?id=eq.7', 'PATCH', JSON.stringify({played: 1, won: 1, drawn: 0, lost: 0, goals_for: 6, goals_against: 2, goal_difference: 4, points: 3}));
  await fetchTable('teams?id=eq.8', 'PATCH', JSON.stringify({played: 1, won: 0, drawn: 0, lost: 1, goals_for: 0, goals_against: 3, goal_difference: -3, points: 0}));
  await fetchTable('teams?id=eq.9', 'PATCH', JSON.stringify({played: 1, won: 0, drawn: 0, lost: 1, goals_for: 6, goals_against: 9, goal_difference: -3, points: 0}));
  await fetchTable('teams?id=eq.10', 'PATCH', JSON.stringify({played: 1, won: 1, drawn: 0, lost: 0, goals_for: 9, goals_against: 6, goal_difference: 3, points: 3}));
  console.log('RESET DONE FOR TEAMS TABLE');
}
update();
