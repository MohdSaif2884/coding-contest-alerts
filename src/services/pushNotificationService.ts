// Push Notification Service for web browsers

class PushNotificationService {
  private vapidKey: string | null = null;
  private subscription: PushSubscription | null = null;

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

      // Register service worker if not already registered
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return false;
      }

      // For now, we'll use browser notifications directly
      // In production, you'd register a service worker and use Push API
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
    
    // Schedule the notification
    setTimeout(async () => {
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
    }, delay);

    console.log(`Push notification scheduled for ${contestName} at ${notificationTime.toLocaleString()}`);
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
}

export const pushNotificationService = new PushNotificationService();
