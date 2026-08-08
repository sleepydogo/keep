import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

type OnboardingLayoutProps = {
  children: ReactNode;
};

const colors = Colors.light;

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <ScrollView contentContainerStyle={styles.onboardingPage}>
      <View style={styles.onboardingContainer}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  onboardingPage: {
    minHeight: '100%',
    backgroundColor: colors.background,
    padding: Spacing.four,
    justifyContent: 'center',
  },
  onboardingContainer: {
    width: '100%',
    maxWidth: 520,
    minHeight: 560,
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.five,
  },
});
