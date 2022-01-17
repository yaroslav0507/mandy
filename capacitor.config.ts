import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mandy.app',
  appName: 'Mandy',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration:        3000,
      launchAutoHide:            true,
      backgroundColor:           '#262933',
      androidSplashResourceName: 'splash',
      androidScaleType:          'CENTER_CROP',
      androidSpinnerStyle:       'large',
      iosSpinnerStyle:           'small',
      spinnerColor:              '#ffffff',
      showSpinner:               true,
      splashFullScreen:          true,
      splashImmersive:           true
    },
  }
};

export default config;
