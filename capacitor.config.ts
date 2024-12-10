import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.capacitor.schedule',
  appName: 'Schedule',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f1f5f9",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#0D324D",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;