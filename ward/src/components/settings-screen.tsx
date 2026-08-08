import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { borrarTodas, listar } from '@/services/credenciales';
import type { Rol } from '@/services/rol';

const colors = Colors.light;

type Props = {
  onBack: () => void;
  rol: Rol;
  onCambiarRol: (rol: Rol) => void;
};

const ROLES: { rol: Rol; label: string }[] = [
  { rol: 'holder', label: 'Mis credenciales' },
  { rol: 'verificador', label: 'Verificar' },
];

export function SettingsScreen({ onBack, rol, onCambiarRol }: Props) {
  const [cuantas, setCuantas] = useState(0);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    listar().then((cs) => setCuantas(cs.length));
  }, []);

  const borrar = async () => {
    await borrarTodas();
    setCuantas(0);
    setConfirmando(false);
  };

  return (
    <PageContainer>
      <BackButton onPress={onBack} label="Volver" />
      <View style={styles.wrap}>
        <Text style={styles.title}>Ajustes</Text>

        <Text style={styles.seccion}>Cómo usás WARD</Text>
        <View style={styles.segmento}>
          {ROLES.map((r) => (
            <Pressable
              key={r.rol}
              onPress={() => onCambiarRol(r.rol)}
              style={[styles.opcion, rol === r.rol && styles.opcionActiva]}
            >
              <Text
                style={[
                  styles.opcionTexto,
                  rol === r.rol && styles.opcionTextoActivo,
                ]}
              >
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.seccion}>Credenciales</Text>
        <Text style={styles.help}>
          Tenés {cuantas} {cuantas === 1 ? 'credencial' : 'credenciales'}{' '}
          guardadas en este dispositivo.
        </Text>
        {confirmando ? (
          <>
            <Text style={styles.aviso}>
              Se borran del teléfono y no se pueden recuperar. Hay que pedirlas
              de nuevo al organismo.
            </Text>
            <Button label="Sí, borrar todo" onPress={borrar} />
            <Button label="Cancelar" onPress={() => setConfirmando(false)} />
          </>
        ) : (
          <Button
            label="Borrar todas las credenciales"
            onPress={() => setConfirmando(true)}
          />
        )}
        <Text style={styles.nota}>
          Tu identidad no se borra: seguís teniendo el mismo código.
        </Text>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  title: { color: colors.text, fontFamily: Fonts.serif, fontSize: 38 },
  seccion: {
    color: colors.textFaint,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    marginTop: Spacing.two,
  },
  segmento: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundElement,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  opcion: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },
  opcionActiva: { backgroundColor: colors.accent },
  opcionTexto: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  opcionTextoActivo: { color: colors.onAccent, fontWeight: '700' },
  help: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  aviso: {
    color: colors.danger,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  nota: {
    color: colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 11,
    lineHeight: 17,
  },
});
