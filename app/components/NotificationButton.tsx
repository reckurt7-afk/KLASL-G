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
        alert("Bu tarayıcı bildirimleri desteklemiyor.");
        return;
      }

      const izin = await Notification.requestPermission();

      if (izin !== "granted") {
        alert("Bildirim izni verilmedi.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
console.log("SW:", registration);
      // Eski abonelik varsa sil
      const oldSubscription =
        await registration.pushManager.getSubscription();

      if (oldSubscription) {
        await oldSubscription.unsubscribe();
      }

      // Yeni abonelik oluştur
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
console.log("Subscription:", subscription);
      const { error } = await supabase
        .from("bildirim_aboneleri")
        .insert([
          {
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
          },
        ]);

     if (error) {
  console.error(error);
  alert(JSON.stringify(error, null, 2));
  return;
}

      new Notification("KLAS LİG", {
        body: "🔔 Bildirimler başarıyla açıldı!",
        icon: "/icons/logo.png",
      });

      alert("✅ Telefon bildirim kaydı oluşturuldu.");

    } catch (err: any) {
      alert("Hata: " + err.message);
      console.error(err);
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