const fs = require('fs');
let content = fs.readFileSync('app/takim-kur/page.tsx', 'utf8');

const injection = `
      if (insertError) throw insertError;

      try {
        const selectedLeague = leagues.find(l => l.id.toString() === formData.leagueId);
        const leagueName = selectedLeague ? selectedLeague.name.toUpperCase() : "KLAS LİG";
        
        await fetch("/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baslik: "🚀 YENİ TAKIM KATILDI!",
            mesaj: \`\${leagueName}'UN YENİ TAKIMI KLAS LİG AİLESİNE HOŞGELDİN \${formData.name.toUpperCase()}!\`,
            url: "/genel-bakis"
          })
        });
      } catch(e) {
        console.error("Bildirim gonderilemedi", e);
      }
`;

content = content.replace('if (insertError) throw insertError;', injection);
fs.writeFileSync('app/takim-kur/page.tsx', content, 'utf8');
console.log('Bildirim eklendi!');
