/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  // En RN 0.81 useColorScheme devuelve null cuando el sistema no lo define.
  return Colors[useColorScheme() ?? 'light'];
}
