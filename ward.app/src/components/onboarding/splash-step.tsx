import { StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';

const colors = Colors.light;

export function SplashStep() {
  return (
    <View style={styles.splash}>
      <Text style={styles.splashLogo}>WARD</Text>
      <View style={styles.splashDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.one,
  },
  splashLogo: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 6,
  },
  splashDot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: colors.verified,
  },
});
