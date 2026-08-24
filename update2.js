const fs = require('fs');
let text = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

const oldEvGol = `                  <button
                    onClick={async () => {
                      const golAtan = prompt(\`\${seciliMac.ev_sahibi} için golü kim attı? (Boş bırakabilirsiniz)\`);
                      const yeniSkor = seciliMac.ev_skor + 1;
                      golSesiCal(); // 🔊 GOOOL sesi!
                      
                      const { error } = await supabase
                        .from("maclar")
                        .update({ ev_skor: yeniSkor, durum: \`Canlı|\${golAtan || ""}\` })
                        .eq("id", seciliMac.id);
                        
                      if (!error) {
                        setSeciliMac({ ...seciliMac, ev_skor: yeniSkor });
                        await fetch("/api/send-notification", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            baslik: "⚽ GOOOL!",
                            mesaj: golAtan 
                              ? \`\${seciliMac.ev_sahibi} adına \${golAtan} topu ağlara gönderdi! Skor: \${yeniSkor}-\${seciliMac.dep_skor}\`
                              : \`\${seciliMac.ev_sahibi} gol attı! Skor: \${yeniSkor}-\${seciliMac.dep_skor}\`,
                          }),
                        });
                      }
                    }}
                    style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}
                  >
                    ⚽
                  </button>`;

const newEvGol = `                  <button
                    onClick={async () => {
                      const yeniSkor = seciliMac.ev_skor + 1;
                      golSesiCal(); // 🔊 GOOOL sesi!
                      
                      const { error } = await supabase
                        .from("maclar")
                        .update({ ev_skor: yeniSkor, durum: \`Canlı\` })
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
                    }}
                    style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}
                  >
                    ⚽
                  </button>`;

const oldDepGol = `                  <button
                    onClick={async () => {
                      const golAtan = prompt(\`\${seciliMac.deplasman} için golü kim attı? (Boş bırakabilirsiniz)\`);
                      const yeniSkor = seciliMac.dep_skor + 1;
                      golSesiCal(); // 🔊 GOOOL sesi!
                      
                      const { error } = await supabase
                        .from("maclar")
                        .update({ dep_skor: yeniSkor, durum: \`Canlı|\${golAtan || ""}\` })
                        .eq("id", seciliMac.id);
                        
                      if (!error) {
                        setSeciliMac({ ...seciliMac, dep_skor: yeniSkor });
                        await fetch("/api/send-notification", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            baslik: "⚽ GOOOL!",
                            mesaj: golAtan 
                              ? \`\${seciliMac.deplasman} adına \${golAtan} topu ağlara gönderdi! Skor: \${seciliMac.ev_skor}-\${yeniSkor}\`
                              : \`\${seciliMac.deplasman} gol attı! Skor: \${seciliMac.ev_skor}-\${yeniSkor}\`,
                          }),
                        });
                      }
                    }}
                    style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}
                  >
                    ⚽
                  </button>`;

const newDepGol = `                  <button
                    onClick={async () => {
                      const yeniSkor = seciliMac.dep_skor + 1;
                      golSesiCal(); // 🔊 GOOOL sesi!
                      
                      const { error } = await supabase
                        .from("maclar")
                        .update({ dep_skor: yeniSkor, durum: \`Canlı\` })
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
                    }}
                    style={{ ...skorBtnStyle, background: "#16a34a", border: "none" }}
                  >
                    ⚽
                  </button>`;

text = text.replace(oldEvGol, newEvGol);
text = text.replace(oldDepGol, newDepGol);

fs.writeFileSync('app/admin/canli-mac/page.tsx', text);
console.log('Fixed buttons');
