"use client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
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
      if (!("PushManager" in window)) {
        alert("iPhone kullanıyorsanız uygulamayı Ana Ekrana ekleyip oradan açın.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Bildirim izni verilmedi. Tarayıcı ayarlarından izin verin.");
        return;
      }

      // Service Worker'ın hazır olmasını bekle
      const registration = await navigator.serviceWorker.ready;

      // Eski aboneliği tarayıcıdan kaldır
      const mevcutAbonelik = await registration.pushManager.getSubscription();
      if (mevcutAbonelik) {
        await mevcutAbonelik.unsubscribe();
      }

      // Yeni abonelik oluştur
      const yeniAbonelik = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      // Sunucuya gönder - /api/subscribe endpoint upsert yapıyor
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yeniAbonelik),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert("Kayıt hatası: " + (data.error || "Bilinmeyen hata"));
        return;
      }

      // Hoş geldin bildirimi gönder
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baslik: "PRO LIG BURSA",
          mesaj: "Bildirimler aktif! Artık gol, haber ve tüm gelişmeleri anında öğreneceksin.",
          url: "/",
        }),
      });

      alert("Bildirimler basariyla aktif edildi! Test bildirimi gonderildi.");
    } catch (err: any) {
      console.error(err);
      alert("Hata: " + (err?.message || JSON.stringify(err)));
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
      BILDIRIMLERI AC
    </button>
  );
}