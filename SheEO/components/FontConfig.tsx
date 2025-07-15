import * as Font from 'expo-font';
import { Platform } from 'react-native';

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      'BrittiSansTrial-Regular': require('../assets/fonts/BrittiSansTrial-Regular.otf'),
      'BrittiSansTrial-Bold': require('../assets/fonts/BrittiSansTrial-Bold.otf'),
      'BrittiSansTrial-Medium': require('../assets/fonts/BrittiSansTrial-Medium.otf'),
      'BrittiSansTrial-Light': require('../assets/fonts/BrittiSansTrial-Light.otf'),
    });
    return true;
  } catch (error) {
    console.warn('Failed to load custom fonts:', error);
    return false;
  }
};

export const fontFamily = {
  regular: 'BrittiSansTrial-Regular',
  bold: 'BrittiSansTrial-Bold',
  medium: 'BrittiSansTrial-Medium',
  light: 'BrittiSansTrial-Light',
};

// System font fallbacks for Android
const systemFontFallbacks = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

export const getFontFamily = (
  weight: 'regular' | 'bold' | 'medium' | 'light' = 'regular',
  fontsLoaded: boolean = true
) => {
  if (fontsLoaded) {
    return fontFamily[weight];
  }
  return systemFontFallbacks[weight];
}; 