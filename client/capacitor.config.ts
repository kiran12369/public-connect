import type { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV !== 'production';
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.telangana.publicconnect',
  appName: 'Public Connect',
  webDir: 'out',
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: isDev && serverUrl.startsWith('http://'),
      }
    : undefined,
};

export default config;
