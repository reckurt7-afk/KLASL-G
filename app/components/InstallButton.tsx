"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [loading, setLoading] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) {
      alert(
        "📲 Bu cihazda otomatik yükleme kullanılamıyor.\n\nTarayıcınızın 'Ana Ekrana Ekle' özelliğini kullanarak uygulamayı yükleyebilirsiniz."
      );
      return;
    }

    setLoading(true);

    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch (err) {
      console.error(err);
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
        cursor: loading ? "default" : "pointer",
      }}
    >
      {loading ? "Yükleniyor..." : "📲 UYGULAMAYI YÜKLE"}
    </button>
  );
}