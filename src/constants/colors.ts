export const Colors = {
  light: {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    accent: '#0078FF', // Jio Blue
    premium: '#E2B616', // Gold
    border: '#E2E8F0',
    success: '#10B981',
    error: '#EF4444',
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#0078FF',
    tabBarInactive: '#64748B',
    overlay: 'rgba(0,0,0,0.5)',
  },
  dark: {
    background: '#09101A', // Hotstar Deep Navy
    card: '#131C2E', // Lighter navy card
    text: '#FFFFFF',
    textSecondary: '#8F98A6',
    accent: '#0078FF', // Jio Blue
    premium: '#E2B616', // Gold
    border: '#1F2C3F',
    success: '#10B981',
    error: '#EF4444',
    tabBarBackground: '#060B12',
    tabBarActive: '#FFFFFF',
    tabBarInactive: '#8F98A6',
    overlay: 'rgba(0,0,0,0.7)',
  },
} as const;

export type ThemeType = 'light' | 'dark';
export type AppColors = typeof Colors.dark;
