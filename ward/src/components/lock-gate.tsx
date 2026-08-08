import { ReactNode, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { activada, pedir } from '@/services/biometria';

const colors = Colors.light;

export function LockGate({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);

  const desbloquear = async () => {
    // Sin el paso de onboarding hecho, WARD no bloquea nada.
    if (!(await activada())) return setAbierto(true);
    setAbierto(await pedir('Desbloqueá WARD'));
  };

  useEffect(() => {
    desbloquear();
  }, []);

  return (
    <>
      {children}
      {!abierto && (
        <View style={styles.lock}>
          <View style={styles.mark}>
            <Text style={styles.markText}>W</Text>
          </View>
          <Text style={styles.title}>WARD está bloqueada</Text>
          <Text style={styles.body}>Usá tu cara para abrirla.</Text>
          <Pressable style={styles.boton} onPress={desbloquear}>
            <Text style={styles.botonText}>Desbloquear</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  lock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    zIndex: 900,
  },
  mark: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { color: colors.onAccent, fontFamily: Fonts.serif, fontSize: 52 },
  title: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 32,
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: colors.action,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: Spacing.five,
  },
  botonText: { color: colors.onAccent, fontFamily: Fonts.sans, fontWeight: '700' },
});
