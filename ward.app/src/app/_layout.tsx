import '../global.css';
import { DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Palette } from '@/constants/theme';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

const WardTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Palette.background,
    card: Palette.background,
    text: Palette.text,
    border: Palette.border,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={WardTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Palette.background },
        }}
      />
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
