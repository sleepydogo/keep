import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from './onboarding-layout';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type WelcomeStepProps = {
  onContinue: () => void;
};

const colors = Colors.light;

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <OnboardingLayout>
      <View style={styles.brandLockup}>
        <Text style={styles.logo}>WARD</Text>
        <View style={styles.headerDot} />
      </View>
      <View style={styles.onboardingHero}>
        <View style={styles.heroMark}>
          <Text style={styles.heroMarkText}>W</Text>
        </View>
        <Text style={styles.onboardingTitle}>Tu tarjetero personal</Text>
        <Text style={styles.onboardingBody}>
          Guardá tus credenciales importantes en un solo lugar.
        </Text>
      </View>
      <Button label="Continuar" onPress={onContinue} />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  logo: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
  },
  headerDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: colors.verified,
  },
  onboardingHero: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  heroMark: {
    width: 112,
    height: 112,
    borderRadius: 34,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  heroMarkText: {
    color: '#FFFDF8',
    fontFamily: Fonts.serif,
    fontSize: 62,
  },
  onboardingTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 40,
    lineHeight: 46,
    textAlign: 'center',
  },
  onboardingBody: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 390,
  },
});
