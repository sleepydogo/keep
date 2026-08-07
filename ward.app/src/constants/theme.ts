/**
 * Centralized palette for KEEP / WARD.
 * Update colors here to re-skin the whole app.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Palette = {
  background: '#3D3B30',
  surface: '#4A473B',
  surfaceHover: '#565345',
  primary: '#F2542D',
  primaryHover: '#FF6B4A',
  text: '#FFFFFF',
  textSecondary: '#D9D6CC',
  textFaint: '#A6A39A',
  border: '#565345',
  success: '#4CAF50',
  warning: '#FFB74D',
  info: '#4FC3F7',
  danger: '#E53935',
};

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.background,
    backgroundElement: Palette.surface,
    backgroundSelected: Palette.surfaceHover,
    textSecondary: Palette.textSecondary,
    textFaint: Palette.textFaint,
    accent: Palette.primary,
    accentStrong: Palette.primaryHover,
    success: Palette.success,
    warning: Palette.warning,
    info: Palette.info,
    danger: Palette.danger,
    action: Palette.primary,
    verified: Palette.success,
    reject: Palette.danger,
    border: Palette.border,
    onAccent: Palette.text,
  },
  dark: {
    text: Palette.text,
    background: Palette.background,
    backgroundElement: Palette.surface,
    backgroundSelected: Palette.surfaceHover,
    textSecondary: Palette.textSecondary,
    textFaint: Palette.textFaint,
    accent: Palette.primary,
    accentStrong: Palette.primaryHover,
    success: Palette.success,
    warning: Palette.warning,
    info: Palette.info,
    danger: Palette.danger,
    action: Palette.primary,
    verified: Palette.success,
    reject: Palette.danger,
    border: Palette.border,
    onAccent: Palette.text,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
