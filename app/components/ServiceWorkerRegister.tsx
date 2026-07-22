"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log("✅ Service Worker kayıt edildi");
        })
        .catch((error) => {
          console.log("❌ Service Worker hatası:", error);
        });
    }
  }, []);

  return null;
}