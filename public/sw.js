// MaisonCare Admin Service Worker - Push Notifications & Mobile Home Screen PWA
const CACHE_NAME = "maisoncare-admin-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Native Push Event Listener (Runs even when PWA is in background or closed)
self.addEventListener("push", (event) => {
  let data = {
    title: "🔔 MaisonCare VIP Alert",
    body: "New activity detected on MaisonCare portal.",
    url: "/admin",
    tag: "maisoncare-alert",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    vibrate: [200, 100, 200, 100, 300],
    tag: data.tag || "maisoncare-alert",
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || "/admin",
    },
    actions: [
      { action: "view", title: "Open MaisonCare" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Tap / Click Handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const targetUrl = event.notification.data?.url || "/admin";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If an admin window is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url.includes("/admin") && "focus" in client) {
            client.focus();
            if ("navigate" in client) {
              return client.navigate(targetUrl);
            }
            return client;
          }
        }
        // Otherwise open a new window to the admin portal
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

