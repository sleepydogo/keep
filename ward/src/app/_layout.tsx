import '../global.css';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Palette } from '@/constants/theme';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { LockGate } from '@/components/lock-gate';

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
      <LockGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Palette.background },
          }}
        />
      </LockGate>
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
