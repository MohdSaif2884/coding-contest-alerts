// Firebase Cloud Messaging Service for background push notifications
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { firebaseConfig, vapidKey, isFirebaseConfigured } from '@/config/firebase';

class FirebaseMessagingService {
  private messaging: Messaging | null = null;
  private fcmToken: string | null = null;
  private initialized = false;

  async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    
    if (!isFirebaseConfigured()) {
      console.log('Firebase not configured - FCM disabled');
      return false;
    }

    try {
      // Initialize Firebase app if not already done
      const app = getApps().length === 0 
        ? initializeApp(firebaseConfig) 
        : getApps()[0];

      // Check if messaging is supported
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging not supported');
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);

      // Send Firebase config to service worker
      if (registration.active) {
        registration.active.postMessage({
          type: 'FIREBASE_CONFIG',
          config: firebaseConfig
        });
      }

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Initialize messaging
      this.messaging = getMessaging(app);
      this.initialized = true;

      // Set up foreground message handler
      this.setupForegroundHandler();

      console.log('Firebase Messaging initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Firebase Messaging:', error);
      return false;
    }
  }

  private setupForegroundHandler(): void {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);

      // Show notification even when app is in foreground
      if (Notification.permission === 'granted') {
        const title = payload.notification?.title || '🔔 Contest Alert';
        const options: NotificationOptions = {
          body: payload.notification?.body || 'Check your contests!',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: payload.data?.contestId || 'algobell-foreground',
          requireInteraction: true,
          data: payload.data
        };

        new Notification(title, options);
      }
    });
  }

  async requestPermissionAndGetToken(): Promise<string | null> {
    try {
      const initialized = await this.initialize();
      if (!initialized || !this.messaging) {
        return null;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      // Get the service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get FCM token
      const token = await getToken(this.messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: registration
      });

      if (token) {
        this.fcmToken = token;
        console.log('FCM Token obtained:', token.substring(0, 20) + '...');
        return token;
      }

      console.warn('No FCM token available');
      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  getFCMToken(): string | null {
    return this.fcmToken;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async isSupported(): Promise<boolean> {
    return (
      isFirebaseConfigured() &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }
}

export const firebaseMessagingService = new FirebaseMessagingService();
