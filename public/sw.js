self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = {
        title: "KLAS LİG",
        body: event.data.text(),
      };
    }
  }

  const title = data.title || "KLAS LİG";

  const options = {
    body: data.body || "Yeni bildirim var!",
    icon: "/icons/logo.png",
    vibrate: [300, 100, 300, 100, 300], // Gol heyecanı için 3'lü titreme
    sound: data.ses || undefined, // Ses URL'i
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Eğer aynı sayfa açıksa, sadece o sekmeye odaklan
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Açık değilse yeni pencere aç
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});