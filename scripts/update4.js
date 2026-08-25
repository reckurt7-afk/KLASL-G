const fs = require('fs');
let text = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

// Ev
let start = text.indexOf('onClick={async () => {\\n                    const golAtan = prompt');
if (start === -1) {
  start = text.indexOf('onClick={async () => {\\r\\n                    const golAtan = prompt');
}
if (start > -1) {
  let end = text.indexOf('}} style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}>⚽</button>', start);
  let newEv = `onClick={async () => {
                    const yeniSkor = seciliMac.ev_skor + 1;
                    golSesiCal(); 
                    
                    const { error } = await supabase
                      .from("maclar")
                      .update({ ev_skor: yeniSkor, durum: "Canlı" })
                      .eq("id", seciliMac.id);
                      
                    if (!error) {
                      setSeciliMac({ ...seciliMac, ev_skor: yeniSkor });
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          baslik: "⚽ GOOOL!",
                          mesaj: \`\${seciliMac.ev_sahibi} gol attı! Skor: \${yeniSkor}-\${seciliMac.dep_skor}\`,
                        }),
                      });
                    }
                  `;
  text = text.substring(0, start) + newEv + text.substring(end);
}

// Dep
let startDep = text.indexOf('onClick={async () => {\\n                    const golAtan = prompt', start + 10);
if (startDep === -1) {
  startDep = text.indexOf('onClick={async () => {\\r\\n                    const golAtan = prompt', start + 10);
}
if (startDep > -1) {
  let endDep = text.indexOf('}} style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}>⚽</button>', startDep);
  let newDep = `onClick={async () => {
                    const yeniSkor = seciliMac.dep_skor + 1;
                    golSesiCal(); 
                    
                    const { error } = await supabase
                      .from("maclar")
                      .update({ dep_skor: yeniSkor, durum: "Canlı" })
                      .eq("id", seciliMac.id);
                      
                    if (!error) {
                      setSeciliMac({ ...seciliMac, dep_skor: yeniSkor });
                      await fetch("/api/send-notification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          baslik: "⚽ GOOOL!",
                          mesaj: \`\${seciliMac.deplasman} gol attı! Skor: \${seciliMac.ev_skor}-\${yeniSkor}\`,
                        }),
                      });
                    }
                  `;
  text = text.substring(0, startDep) + newDep + text.substring(endDep);
}

fs.writeFileSync('app/admin/canli-mac/page.tsx', text);
console.log('Done with JS');
