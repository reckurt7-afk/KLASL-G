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
        title: "PRİME LİG",
        body: event.data.text(),
      };
    }
  }

  const title = data.title || "PRİME LİG";

  const options = {
    body: data.body || "Yeni bildirim var!",
    icon: data.icon || "/icons/prime-logo.jpg",
    image: data.image,
    badge: data.badge,
    requireInteraction: data.requireInteraction,
    actions: data.actions,
    vibrate: data.vibrate || [300, 100, 300, 100, 300], // Gol heyecanı için 3'lü titreme
    sound: data.sound || undefined, // Ses URL'i
    data: {
      url: data.url || "/",
      youtube_link: data.youtube_link
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  let urlToOpen = event.notification.data?.url || "/";
  if (event.action === "youtube" && event.notification.data?.youtube_link) {
    urlToOpen = event.notification.data.youtube_link;
  } else if (event.action === "canli") {
    urlToOpen = "/";
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
// Force cache bust: 1788421555321