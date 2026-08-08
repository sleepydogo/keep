import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from './onboarding-layout';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { asegurarHolderSecret } from '@/services/identity';

type IdentityStepProps = {
  onComplete: () => void;
};

const colors = Colors.light;

export function IdentityStep({ onComplete }: IdentityStepProps) {
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState('');

  const crear = async () => {
    setCreando(true);
    setError('');
    try {
      await asegurarHolderSecret();
      onComplete();
    } catch {
      setError('No se pudo guardar tu identidad en este dispositivo.');
      setCreando(false);
    }
  };

  return (
    <OnboardingLayout>
      <View style={styles.copy}>
        <Text style={styles.kicker}>Tu identidad</Text>
        <Text style={styles.title}>Se crea en este dispositivo</Text>
        <Text style={styles.body}>
          WARD genera una clave que queda guardada acá y nunca se envía. Es lo que
          le permite a un organismo emitir una credencial a tu nombre y a nadie más.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label={creando ? 'Creando…' : 'Crear mi identidad'}
        disabled={creando}
        onPress={crear}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  copy: {
    gap: Spacing.two,
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  kicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 36,
    lineHeight: 42,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 340,
  },
  error: {
    color: '#E53935',
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
});
