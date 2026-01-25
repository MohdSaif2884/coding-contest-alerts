// Firebase Messaging Service Worker for background notifications
// This runs in the background even when the browser is closed

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Firebase config will be passed during initialization
let firebaseConfig = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    firebaseConfig = event.data.config;
    initializeFirebase();
  }
});

function initializeFirebase() {
  if (!firebaseConfig) {
    console.log('Firebase config not available yet');
    return;
  }

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || '🔔 Contest Reminder';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'A contest is starting soon!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: payload.data?.contestId || 'contest-reminder',
      requireInteraction: true,
      data: payload.data || {},
      actions: [
        { action: 'open', title: 'Open Contest' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const contestUrl = event.notification.data?.url || '/dashboard';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already an open window
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(contestUrl);
        }
      })
    );
  }
});

// Handle push events directly (for server-sent pushes)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.notification?.title || data.title || '🔔 Contest Alert';
    const options = {
      body: data.notification?.body || data.body || 'Check your upcoming contests!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.data?.contestId || 'algobell-notification',
      requireInteraction: true,
      data: data.data || {}
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error processing push event:', error);
  }
});
