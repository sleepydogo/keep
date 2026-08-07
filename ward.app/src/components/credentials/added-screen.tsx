import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type AddedScreenProps = {
  onView: () => void;
  onBack: () => void;
};

const colors = Colors.light;

export function AddedScreen({ onView, onBack }: AddedScreenProps) {
  return (
    <PageContainer>
      <BackButton onPress={onBack} />
      <View style={styles.reviewWrap}>
        <View style={styles.successMark}>
          <Text style={styles.successText}>✓</Text>
        </View>
        <Text style={styles.reviewKicker}>Listo</Text>
        <Text style={styles.reviewTitle}>Agregada a WARD</Text>
        <Text style={styles.reviewIssuer}>Tu credencial ya está disponible en tu tarjetero.</Text>
        <Button label="Ver credencial" onPress={onView} />
        <Pressable onPress={onBack} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Volver al tarjetero</Text>
        </Pressable>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  reviewWrap: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  successMark: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  successText: {
    color: '#FFFDF8',
    fontSize: 42,
  },
  reviewKicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  reviewTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 36,
    textAlign: 'center',
  },
  reviewIssuer: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    textAlign: 'center',
  },
  secondaryButton: {
    padding: Spacing.two,
  },
  secondaryText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
