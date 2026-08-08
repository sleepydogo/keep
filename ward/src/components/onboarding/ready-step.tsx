import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from './onboarding-layout';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type ReadyStepProps = {
  onReady: () => void;
};

const colors = Colors.light;

export function ReadyStep({ onReady }: ReadyStepProps) {
  return (
    <OnboardingLayout>
      <View style={styles.successMark}>
        <Text style={styles.successText}>✓</Text>
      </View>
      <View style={styles.onboardingCopy}>
        <Text style={styles.kicker}>Listo</Text>
        <Text style={styles.onboardingTitle}>Tu espacio está preparado</Text>
        <Text style={styles.onboardingBody}>
          Ahora podés recibir y guardar tus credenciales en WARD.
        </Text>
      </View>
      <Button label="Continuar" onPress={onReady} />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  successMark: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
    alignSelf: 'center',
  },
  successText: {
    color: '#FFFDF8',
    fontSize: 42,
  },
  onboardingCopy: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  kicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
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
