import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface ContestAlarm {
  id: number;
  contestId: string;
  contestName: string;
  platform: string;
  startTime: Date;
  reminderOffset: number; // minutes before
}

class AlarmService {
  private isNative: boolean;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  async requestPermissions(): Promise<boolean> {
    if (!this.isNative) {
      // Web fallback - use Notification API
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }

    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  }

  async scheduleContestAlarm(alarm: ContestAlarm): Promise<void> {
    const notificationTime = new Date(alarm.startTime.getTime() - alarm.reminderOffset * 60 * 1000);
    
    if (notificationTime <= new Date()) {
      console.log('Notification time is in the past, skipping');
      return;
    }

    if (!this.isNative) {
      // Web fallback - schedule with setTimeout
      const delay = notificationTime.getTime() - Date.now();
      setTimeout(() => {
        this.playAlarmSound();
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🔔 ${alarm.contestName}`, {
            body: `Starts in ${alarm.reminderOffset} minutes on ${alarm.platform}!`,
            icon: '/favicon.ico',
            tag: alarm.contestId,
            requireInteraction: true
          });
        }
      }, delay);
      return;
    }

    // Native notification with alarm sound
    const options: ScheduleOptions = {
      notifications: [
        {
          id: alarm.id,
          title: `🔔 ${alarm.contestName}`,
          body: `Starts in ${alarm.reminderOffset} minutes on ${alarm.platform}!`,
          schedule: { at: notificationTime },
          sound: 'alarm.wav',
          extra: {
            contestId: alarm.contestId,
            platform: alarm.platform
          },
          actionTypeId: 'CONTEST_REMINDER',
          smallIcon: 'ic_stat_icon',
          largeIcon: 'ic_launcher',
        }
      ]
    };

    await LocalNotifications.schedule(options);
    console.log(`Alarm scheduled for ${alarm.contestName} at ${notificationTime}`);
  }

  async cancelAlarm(alarmId: number): Promise<void> {
    if (!this.isNative) return;
    
    await LocalNotifications.cancel({ notifications: [{ id: alarmId }] });
  }

  async cancelAllAlarms(): Promise<void> {
    if (!this.isNative) return;
    
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  }

  private playAlarmSound(): void {
    const audio = new Audio('/alarm.mp3');
    audio.loop = true;
    audio.play().catch(console.error);
    
    // Stop after 30 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 30000);
  }

  async getPendingAlarms(): Promise<{ notifications: { id: number }[] }> {
    if (!this.isNative) {
      return { notifications: [] };
    }
    return LocalNotifications.getPending();
  }
}

export const alarmService = new AlarmService();
