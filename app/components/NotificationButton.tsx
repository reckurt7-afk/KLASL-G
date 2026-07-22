"use client";

import { supabase } from "@/lib/supabase";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function NotificationButton() {
  const enableNotifications = async () => {
    try {
      if (!("Notification" in window)) {
        alert("Bu cihaz web bildirimlerini desteklemiyor.");
        return;
      }

      if (!("serviceWorker" in navigator)) {
        alert("Service Worker desteklenmiyor.");
        return;
      }
console.log("Notification:", "Notification" in window);
console.log("ServiceWorker:", "serviceWorker" in navigator);
console.log("PushManager:", "PushManager" in window);
console.log("Standalone:", window.matchMedia("(display-mode: standalone)").matches);

if (!("PushManager" in window)) {
      
        alert(
          "Bu cihazda Push Bildirim desteği bulunmuyor. Eğer iPhone kullanıyorsanız uygulamayı önce Ana Ekrana ekleyip oradan açmanız gerekir."
        );
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Bildirim izni verilmedi.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        });
      }

      const { error } = await supabase
        .from("bildirim_aboneleri")
        .upsert({
          endpoint: subscription.endpoint,
          p256dh: btoa(
            String.fromCharCode(
              ...new Uint8Array(subscription.getKey("p256dh")!)
            )
          ),
          auth: btoa(
            String.fromCharCode(
              ...new Uint8Array(subscription.getKey("auth")!)
            )
          ),
        });

      if (error) {
  console.error(error);
  alert(JSON.stringify(error, null, 2));
  return;
}

      new Notification("KLAS LİG", {
        body: "🔔 Bildirimler başarıyla açıldı.",
        icon: "/icons/logo.png",
      });

      alert("✅ Bildirimler başarıyla aktif edildi.");
    } catch (err: any) {
      console.error(err);
      alert("Bir hata oluştu: " + err.message);
    }
  };

  return (
    <button
      onClick={enableNotifications}
      style={{
        width: "100%",
        maxWidth: 320,
        height: 56,
        marginTop: 15,
        border: "1px solid #ff3131",
        borderRadius: 999,
        background: "rgba(255,49,49,.12)",
        color: "#ff3131",
        fontSize: 18,
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      🔔 BİLDİRİMLERİ AÇ
    </button>
  );
}