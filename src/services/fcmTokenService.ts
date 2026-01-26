// FCM Token Service - Manages FCM tokens in the database
import { supabase } from '@/integrations/supabase/client';

class FCMTokenService {
  // Save FCM token to database for server-side notifications
  async saveToken(userId: string, token: string, deviceInfo?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fcm_tokens')
        .upsert(
          {
            user_id: userId,
            token: token,
            device_info: deviceInfo || navigator.userAgent,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,token',
          }
        );

      if (error) {
        console.error('Error saving FCM token:', error);
        return false;
      }

      console.log('FCM token saved successfully');
      return true;
    } catch (error) {
      console.error('Error in saveToken:', error);
      return false;
    }
  }

  // Remove FCM token from database
  async removeToken(token: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fcm_tokens')
        .delete()
        .eq('token', token);

      if (error) {
        console.error('Error removing FCM token:', error);
        return false;
      }

      console.log('FCM token removed successfully');
      return true;
    } catch (error) {
      console.error('Error in removeToken:', error);
      return false;
    }
  }

  // Get all tokens for a user
  async getUserTokens(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('fcm_tokens')
        .select('token')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user tokens:', error);
        return [];
      }

      return data?.map(row => row.token) || [];
    } catch (error) {
      console.error('Error in getUserTokens:', error);
      return [];
    }
  }

  // Send a test notification via server
  async sendTestNotification(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('send-fcm-notification', {
        body: {
          userId,
          notification: {
            title: '🔔 Test Notification',
            body: 'AlgoBell notifications are working! You\'ll receive contest reminders here.',
            data: { type: 'test' },
          },
        },
      });

      if (error) {
        console.error('Error sending test notification:', error);
        return false;
      }

      console.log('Test notification result:', data);
      return data?.success || false;
    } catch (error) {
      console.error('Error in sendTestNotification:', error);
      return false;
    }
  }
}

export const fcmTokenService = new FCMTokenService();
