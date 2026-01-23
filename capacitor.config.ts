import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3b1a310ad2194577a61a56f83cec0acb',
  appName: 'AlgoBell',
  webDir: 'dist',
  server: {
    url: 'https://3b1a310a-d219-4577-a61a-56f83cec0acb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#3B82F6',
      sound: 'alarm.wav'
    }
  }
};

export default config;
