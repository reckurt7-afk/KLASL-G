"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [loading, setLoading] = useState(false);
const [installPrompt, setInstallPrompt] = useState<any>(null);
useEffect(() => {
  const handler = (event: any) => {
    event.preventDefault();
    setInstallPrompt(event);
  };

  window.addEventListener("beforeinstallprompt", handler);

  return () => {
    window.removeEventListener("beforeinstallprompt", handler);
  };
}, []);
  const installApp = async () => {
  if (!installPrompt) {
    alert(
      "📱 Uygulama yükleme şu anda desteklenmiyor. Chrome üzerinden tekrar deneyin."
    );
    return;
  }

  setLoading(true);

  installPrompt.prompt();

  const result = await installPrompt.userChoice;

  if (result.outcome === "accepted") {
    console.log("Uygulama yüklendi");
  } else {
    console.log("Kullanıcı iptal etti");
  }

  setInstallPrompt(null);
  setLoading(false);
};

  return (
    <button
      onClick={installApp}
      disabled={loading}
      style={{
        width: "100%",
        maxWidth: 320,
        height: 56,
        marginTop: 15,
        border: "1px solid #FFD700",
        borderRadius: 999,
        background: "rgba(255,215,0,.12)",
        color: "#FFD700",
        fontSize: 18,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {loading ? "Yükleniyor..." : "📲 UYGULAMAYI YÜKLE"}
    </button>
  );
}