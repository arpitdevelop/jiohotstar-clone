import { createTamagui } from 'tamagui';
import { config as configBase } from '@tamagui/config';

export const config = createTamagui(configBase);

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
