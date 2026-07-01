import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

export function useTheme() {
  // Force dark theme for JioHotstar dark cinematic feel
  const theme = 'dark'; 

  return {
    colors: Colors[theme],
    theme,
    isDark: true,
  };
}
