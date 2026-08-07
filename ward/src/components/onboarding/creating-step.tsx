import { StyleSheet, Text, View } from 'react-native';
import { OnboardingLayout } from './onboarding-layout';
import { Colors, Fonts, Spacing } from '@/constants/theme';

const colors = Colors.light;

export function CreatingStep() {
  return (
    <OnboardingLayout>
      <View style={styles.creating}>
        <View style={styles.loadingMark}>
          <Text style={styles.loadingMarkText}>W</Text>
        </View>
        <Text style={styles.onboardingTitle}>Preparando tu espacio</Text>
        <Text style={styles.onboardingBody}>Esto solo va a tomar un momento.</Text>
        <View style={styles.loadingLine}>
          <View style={styles.loadingFill} />
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  creating: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  loadingMark: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMarkText: {
    color: '#FFFDF8',
    fontFamily: Fonts.serif,
    fontSize: 52,
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
  loadingLine: {
    width: 180,
    height: 4,
    backgroundColor: '#DED6C8',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: Spacing.two,
  },
  loadingFill: {
    width: '65%',
    height: '100%',
    backgroundColor: colors.verified,
  },
});
