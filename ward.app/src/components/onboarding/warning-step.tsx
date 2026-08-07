import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { OnboardingLayout } from './onboarding-layout';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type WarningStepProps = {
  onConfirm: () => void;
  onEnterDemo: () => void;
};

const colors = Colors.light;

export function WarningStep({ onConfirm, onEnterDemo }: WarningStepProps) {
  const [understood, setUnderstood] = useState(false);

  return (
    <OnboardingLayout>
      <View style={styles.onboardingCopy}>
        <Text style={styles.kicker}>Antes de empezar</Text>
        <Text style={styles.onboardingTitle}>Tu espacio queda en este dispositivo</Text>
        <Text style={styles.onboardingBody}>
          WARD guarda tus credenciales solamente acá. Nadie más puede acceder a ellas.
        </Text>
      </View>

      <View style={styles.warning}>
        <Text style={styles.warningTitle}>Importante</Text>
        <Text style={styles.warningBody}>
          Si perdés este dispositivo o borrás los datos de WARD, no vas a poder recuperar tus credenciales.
        </Text>
      </View>

      <Checkbox
        checked={understood}
        onToggle={() => setUnderstood(!understood)}
        label="Entiendo que no puedo recuperar mis credenciales si pierdo este dispositivo."
      />

      <View style={styles.bottomActions}>
        <Button label="Crear mi espacio" disabled={!understood} onPress={onConfirm} />
        <Pressable onPress={onEnterDemo} style={styles.demoButton}>
          <Text style={styles.demoText}>Omitir credencial e ingresar con datos de prueba</Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  onboardingCopy: {
    gap: Spacing.two,
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
  warning: {
    borderWidth: 1,
    borderColor: colors.verified,
    borderRadius: 14,
    padding: Spacing.three,
    backgroundColor: '#EEE5D5',
    gap: Spacing.one,
  },
  warningTitle: {
    color: colors.verified,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  warningBody: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  bottomActions: {
    gap: Spacing.two,
  },
  demoButton: {
    alignItems: 'center',
    padding: Spacing.two,
  },
  demoText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
