self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "KLAS LİG";
  const options = {
    body: data.body || "Yeni bildirim var!",
    icon: "/icons/logo.png",
    badge: "/icons/logo.png",
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});