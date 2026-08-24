const fs = require('fs');
let text = fs.readFileSync('app/admin/canli-mac/page.tsx', 'utf8');

const oldOlayEkle = `  async function olayEkle() {
    if (!seciliMac || !olayOyuncu) return;
    const { error } = await supabase.from("mac_olaylari").insert({
      mac_id: seciliMac.id,
      dakika: seciliMac.dakika,
      tip: olayTipi,
      oyuncu: olayOyuncu,
      takim_yonu: olayTakimYonu
    });
    if (error) {
      alert("Olay eklenemedi: " + error.message);
    } else {
      alert("Olay başarıyla eklendi!");
      setOlayOyuncu("");
    }
  }`;

const newOlayEkle = `  async function olayEkle() {
    if (!seciliMac || !olayOyuncu) return;
    const { error } = await supabase.from("mac_olaylari").insert({
      mac_id: seciliMac.id,
      dakika: seciliMac.dakika,
      tip: olayTipi,
      oyuncu: olayOyuncu,
      takim_yonu: olayTakimYonu
    });
    if (error) {
      alert("Olay eklenemedi: " + error.message);
    } else {
      setOlayOyuncu("");
      
      const takim = olayTakimYonu === "ev" ? seciliMac.ev_sahibi : seciliMac.deplasman;
      let baslik = "";
      let mesaj = "";
      
      switch (olayTipi) {
        case "GOL":
          baslik = "⚽ GOOOL!";
          mesaj = \`\${takim} adına \${olayOyuncu} \${seciliMac.dakika}. dakikada topu ağlara gönderdi! Mevcut Skor: \${seciliMac.ev_skor}-\${seciliMac.dep_skor}\`;
          golSesiCal();
          break;
        case "ASIST":
          baslik = "👟 ASİST";
          mesaj = \`\${takim} takımından \${olayOyuncu} şık bir asiste imza attı!\`;
          break;
        case "SARI_KART":
          baslik = "🟨 SARI KART";
          mesaj = \`\${takim} takımından \${olayOyuncu} sarı kart gördü.\`;
          break;
        case "KIRMIZI_KART":
          baslik = "🟥 KIRMIZI KART";
          mesaj = \`\${takim} takımından \${olayOyuncu} kırmızı kart gördü!\`;
          break;
        case "DEGISIKLIK":
          baslik = "🔄 OYUNCU DEĞİŞİKLİĞİ";
          mesaj = \`\${takim} takımında \${olayOyuncu} oyuna dahil oldu.\`;
          break;
        default:
          baslik = "⚡ MAÇ OLAYI";
          mesaj = \`\${takim} takımından \${olayOyuncu} ile ilgili yeni bir gelişme var.\`;
      }

      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baslik, mesaj, url: "/" }),
      });
      alert("Olay başarıyla eklendi ve bildirim gönderildi!");
    }
  }`;

text = text.replace(oldOlayEkle, newOlayEkle);

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

text = text.replace(oldEvGol, newEvGol);

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

text = text.replace(oldDepGol, newDepGol);

fs.writeFileSync('app/admin/canli-mac/page.tsx', text);
console.log('done file fixes');
