import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trailsync.app',
  appName: 'TrailSync',
  webDir: 'out',
  plugins: {
    BackgroundGeolocation: {
      backgroundMessage: 'TrailSync is tracking your walk.',
      backgroundTitle: 'Walk Tracking Active',
      requestPermissions: true,
      stale: false,
      distanceFilter: 5,
    },
  },
  ios: {
    contentInset: 'never',
  },
  android: {
    backgroundColor: '#041e3d',
  },
};

export default config;
