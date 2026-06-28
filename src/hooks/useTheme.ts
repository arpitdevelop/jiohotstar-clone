import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

export function useTheme() {
  const scheme = useColorScheme();
  // JioHotstar theme defaults to dark, or user preferred theme
  const theme = scheme === 'light' ? 'light' : 'dark'; 

  return {
    colors: Colors[theme],
    theme,
    isDark: theme === 'dark',
  };
}
