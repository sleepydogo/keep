import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { activar, disponible, pedir } from '@/services/biometria';
import { OnboardingLayout } from './onboarding-layout';

const colors = Colors.light;

export function BiometriaStep({ onListo }: { onListo: () => void }) {
  const [hay, setHay] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    disponible().then(setHay);
  }, []);

  const configurar = async () => {
    setError('');
    if (!(await pedir('Configurá el desbloqueo de WARD'))) {
      setError('No se pudo verificar. Probá de nuevo.');
      return;
    }
    await activar();
    onListo();
  };

  return (
    <OnboardingLayout>
      <View style={styles.copy}>
        <Text style={styles.kicker}>Seguridad</Text>
        <Text style={styles.titulo}>Sólo vos vas a poder abrirla</Text>
        <Text style={styles.body}>
          WARD guarda documentos que prueban cosas sobre vos, así que cada vez
          que la abras te vamos a pedir tu cara. Si alguien te agarra el
          teléfono desbloqueado, igual no puede entrar.
        </Text>
        {hay === false && (
          <Text style={styles.aviso}>
            Este dispositivo no tiene reconocimiento facial configurado. Podés
            seguir, pero WARD se va a abrir sin pedirte nada.
          </Text>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label={hay === false ? 'Continuar sin desbloqueo' : 'Activar desbloqueo'}
        onPress={hay === false ? onListo : configurar}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  copy: { gap: Spacing.two, alignItems: 'center', marginBottom: Spacing.four },
  kicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  titulo: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 360,
  },
  aviso: {
    color: colors.warning,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 360,
  },
  error: {
    color: colors.danger,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
});
