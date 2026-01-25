// Push Notification Service for web browsers with Firebase Cloud Messaging
import { firebaseMessagingService } from './firebaseMessagingService';
import { isFirebaseConfigured } from '@/config/firebase';

class PushNotificationService {
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Push notifications denied by user');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribe(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return false;
      }

      // Try Firebase Cloud Messaging first for background support
      if (isFirebaseConfigured()) {
        const token = await firebaseMessagingService.requestPermissionAndGetToken();
        if (token) {
          console.log('Subscribed to FCM for background notifications');
          return true;
        }
      }

      // Fallback to browser notifications
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return false;
      }

      console.log('Push notifications enabled via browser Notification API');
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('Cannot show notification - permission not granted');
      return;
    }

    // Use browser Notification API
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: true,
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  async scheduleContestReminder(
    contestId: string,
    contestName: string,
    platform: string,
    startTime: Date,
    offsetMinutes: number
  ): Promise<void> {
    const notificationTime = new Date(startTime.getTime() - offsetMinutes * 60 * 1000);
    const now = Date.now();
    
    if (notificationTime.getTime() <= now) {
      console.log('Notification time is in the past, skipping');
      return;
    }

    const delay = notificationTime.getTime() - now;
    const notificationKey = `${contestId}-${offsetMinutes}`;
    
    // Clear existing notification for this key
    if (this.scheduledNotifications.has(notificationKey)) {
      clearTimeout(this.scheduledNotifications.get(notificationKey));
    }

    // Schedule the notification
    const timeoutId = setTimeout(async () => {
      await this.showNotification(
        `🔔 ${contestName}`,
        {
          body: offsetMinutes === 0 
            ? `Contest is LIVE NOW on ${platform}! 🚀`
            : `Starts in ${offsetMinutes} minutes on ${platform}!`,
          tag: contestId,
          data: { contestId, platform },
        }
      );
      this.scheduledNotifications.delete(notificationKey);
    }, delay);

    this.scheduledNotifications.set(notificationKey, timeoutId);
    console.log(`Push notification scheduled for ${contestName} at ${notificationTime.toLocaleString()}`);
  }

  cancelScheduledNotification(contestId: string, offsetMinutes?: number): void {
    if (offsetMinutes !== undefined) {
      const key = `${contestId}-${offsetMinutes}`;
      if (this.scheduledNotifications.has(key)) {
        clearTimeout(this.scheduledNotifications.get(key));
        this.scheduledNotifications.delete(key);
      }
    } else {
      // Cancel all notifications for this contest
      for (const [key, timeoutId] of this.scheduledNotifications.entries()) {
        if (key.startsWith(contestId)) {
          clearTimeout(timeoutId);
          this.scheduledNotifications.delete(key);
        }
      }
    }
  }

  async isSupported(): Promise<boolean> {
    return 'Notification' in window;
  }

  async getPermissionStatus(): Promise<NotificationPermission | 'unsupported'> {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  async isFCMEnabled(): Promise<boolean> {
    return isFirebaseConfigured() && firebaseMessagingService.isInitialized();
  }

  getFCMToken(): string | null {
    return firebaseMessagingService.getFCMToken();
  }
}

export const pushNotificationService = new PushNotificationService();
