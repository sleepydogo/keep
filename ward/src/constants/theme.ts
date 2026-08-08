import { Platform } from 'react-native';

export const colors = {
  background: '#1a1a1a',
  surface: '#2a2a2a',
  surfaceHover: '#3a3a3a',
  border: '#3a3a3a',
  text: '#FFFFFF',
  textSecondary: '#A6A39A',
  textFaint: '#6a6760',
  accent: '#F2542D',
  accentStrong: '#FF6B4A',
  success: '#4CAF50',
  warning: '#FFB74D',
  info: '#4FC3F7',
  danger: '#E53935',
};

export const Colors = {
  light: {
    text: colors.text,
    background: colors.background,
    backgroundElement: colors.surface,
    backgroundSelected: colors.surfaceHover,
    textSecondary: colors.textSecondary,
    textFaint: colors.textFaint,
    accent: colors.accent,
    accentStrong: colors.accentStrong,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    danger: colors.danger,
    action: colors.accent,
    verified: colors.success,
    reject: colors.danger,
    border: colors.border,
    onAccent: colors.text,
  },
  dark: {
    text: colors.text,
    background: colors.background,
    backgroundElement: colors.surface,
    backgroundSelected: colors.surfaceHover,
    textSecondary: colors.textSecondary,
    textFaint: colors.textFaint,
    accent: colors.accent,
    accentStrong: colors.accentStrong,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    danger: colors.danger,
    action: colors.accent,
    verified: colors.success,
    reject: colors.danger,
    border: colors.border,
    onAccent: colors.text,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'system-ui',
    serif: 'serif',
    rounded: 'system-ui',
    mono: 'monospace',
  },
});

export const MaxContentWidth = 440;
export const BottomTabInset = 0;
