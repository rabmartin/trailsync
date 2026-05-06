import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trailsync.app',
  appName: 'TrailSync',
  webDir: 'out',
  server: {
    // In production remove this block — the app will load from the local static export.
    // During development point at your Next.js dev server so you get hot reload on device.
    url: 'https://trailsync.vercel.app',
    cleartext: false,
  },
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
    contentInset: 'automatic',
  },
  android: {
    backgroundColor: '#041e3d',
  },
};

export default config;
