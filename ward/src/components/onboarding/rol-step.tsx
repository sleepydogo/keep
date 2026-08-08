import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Rol } from '@/services/rol';
import { OnboardingLayout } from './onboarding-layout';

const colors = Colors.light;

const OPCIONES: { rol: Rol; marca: string; titulo: string; texto: string }[] = [
  {
    rol: 'holder',
    marca: '🪪',
    titulo: 'Guardar mis credenciales',
    texto:
      'Recibís certificados de organismos y los mostrás cuando te los piden. Nada sale de tu teléfono salvo la respuesta puntual.',
  },
  {
    rol: 'verificador',
    marca: '🔎',
    titulo: 'Verificar credenciales',
    texto:
      'Pedís a otra persona que pruebe que su certificado está vigente. Ves un sí o un no, nunca sus datos.',
  },
];

export function RolStep({ onElegir }: { onElegir: (rol: Rol) => void }) {
  const [rol, setRol] = useState<Rol>('holder');

  return (
    <OnboardingLayout>
      <View style={styles.copy}>
        <Text style={styles.kicker}>Cómo vas a usar WARD</Text>
        <Text style={styles.titulo}>Elegí para qué la vas a usar</Text>
        <Text style={styles.body}>
          Podés cambiarlo después desde Ajustes.
        </Text>
      </View>

      <View style={styles.opciones}>
        {OPCIONES.map((o) => {
          const activa = rol === o.rol;
          return (
            <Pressable
              key={o.rol}
              onPress={() => setRol(o.rol)}
              style={[styles.opcion, activa && styles.opcionActiva]}
            >
              <Text style={styles.marca}>{o.marca}</Text>
              <View style={styles.opcionTexto}>
                <Text style={styles.opcionTitulo}>{o.titulo}</Text>
                <Text style={styles.opcionBody}>{o.texto}</Text>
              </View>
              <View style={[styles.radio, activa && styles.radioActivo]} />
            </Pressable>
          );
        })}
      </View>

      <Button label="Continuar" onPress={() => onElegir(rol)} />
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
    textAlign: 'center',
  },
  opciones: { gap: Spacing.three },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: colors.backgroundElement,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: Spacing.three,
  },
  opcionActiva: {
    borderColor: colors.accent,
    backgroundColor: colors.backgroundSelected,
  },
  marca: { fontSize: 30 },
  opcionTexto: { flex: 1, gap: Spacing.one },
  opcionTitulo: { color: colors.text, fontFamily: Fonts.sans, fontSize: 16 },
  opcionBody: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioActivo: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
});
