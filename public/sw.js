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
    badge: "/icons/logo.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/")
  );
});