import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getRandomBytes } from 'expo-crypto';
import { GearIcon } from '@/components/ui/gear-icon';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { QRCode } from '@/components/ui/qr-code';
import { EMISORES, type Emisor } from '@/constants/emisores';
import { Colors, Fonts, Spacing } from '@/constants/theme';

const colors = Colors.light;

type Paso = 'elegir' | 'esperando' | 'resultado';

const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, '0')).join('');

export function VerifierScreen({ onSettings }: { onSettings: () => void }) {
  const [paso, setPaso] = useState<Paso>('elegir');
  const [emisor, setEmisor] = useState<Emisor>(EMISORES[0]);
  const [pedido, setPedido] = useState('');
  const [vigente, setVigente] = useState(false);

  const pedir = () => {
    setPedido(
      JSON.stringify({
        v: 1,
        emisorId: emisor.id,
        nonce: hex(getRandomBytes(32)),
        fecha: Math.floor(Date.now() / 1000),
      }),
    );
    setPaso('esperando');
  };

  const responder = (ok: boolean) => {
    setVigente(ok);
    setPaso('resultado');
  };

  return (
    <PageContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>WARD</Text>
          <Text style={styles.rol}>Verificador</Text>
        </View>
        <Pressable
          style={styles.icono}
          onPress={onSettings}
          accessibilityLabel="Ajustes"
        >
          <GearIcon color={colors.text} />
        </Pressable>
      </View>

      {paso === 'elegir' && (
        <>
          <Text style={styles.titulo}>¿Qué querés verificar?</Text>
          <Text style={styles.ayuda}>
            Elegí el organismo que emitió el certificado. Vas a ver sólo si está
            vigente, ningún dato de la persona.
          </Text>
          <View style={styles.lista}>
            {EMISORES.map((e) => {
              const activo = e.id === emisor.id;
              return (
                <Pressable
                  key={e.id}
                  onPress={() => setEmisor(e)}
                  style={[styles.fila, activo && styles.filaActiva]}
                >
                  <View style={styles.filaTexto}>
                    <Text style={styles.filaTitulo}>{e.nombre}</Text>
                    <Text style={styles.filaDetalle}>{e.detalle}</Text>
                  </View>
                  <View style={[styles.radio, activo && styles.radioActivo]} />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipTexto}>✓ Organismo registrado</Text>
          </View>
          <Button label="Pedir verificación" onPress={pedir} />
        </>
      )}

      {paso === 'esperando' && (
        <View style={styles.centro}>
          <Text style={styles.titulo}>Mostrale este código</Text>
          <Text style={styles.ayuda}>
            La persona lo escanea con su WARD y responde desde su teléfono.
          </Text>
          <QRCode value={pedido} size={220} />
          <Text style={styles.esperando}>Esperando respuesta…</Text>
          <Pressable onPress={() => setPaso('elegir')}>
            <Text style={styles.cancelar}>Cancelar</Text>
          </Pressable>

          <View style={styles.debug}>
            <Text style={styles.debugTexto}>Sin cadena todavía — simular:</Text>
            <View style={styles.debugBotones}>
              <Pressable
                style={styles.debugBoton}
                onPress={() => responder(true)}
              >
                <Text style={styles.debugBotonTexto}>Vigente</Text>
              </Pressable>
              <Pressable
                style={styles.debugBoton}
                onPress={() => responder(false)}
              >
                <Text style={styles.debugBotonTexto}>No vigente</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {paso === 'resultado' && (
        <View style={styles.centro}>
          <View
            style={[
              styles.sello,
              { backgroundColor: vigente ? colors.verified : colors.reject },
            ]}
          >
            <Text style={styles.selloMarca}>{vigente ? '✓' : '✕'}</Text>
          </View>
          <Text style={styles.titulo}>
            {vigente ? 'Certificado vigente' : 'No vigente'}
          </Text>
          <Text style={styles.ayuda}>
            {vigente
              ? `${emisor.nombre} confirma que el certificado está vigente. No se reveló ningún otro dato.`
              : `No hay un certificado vigente de ${emisor.nombre} para esta persona.`}
          </Text>
          <Button label="Nueva verificación" onPress={() => setPaso('elegir')} />
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { color: colors.text, fontFamily: Fonts.serif, fontSize: 28, letterSpacing: 2 },
  rol: {
    color: colors.accent,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
  },
  icono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  ayuda: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  lista: { gap: Spacing.two },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: colors.backgroundElement,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: Spacing.three,
  },
  filaActiva: {
    borderColor: colors.accent,
    backgroundColor: colors.backgroundSelected,
  },
  filaTexto: { flex: 1, gap: 2 },
  filaTitulo: { color: colors.text, fontFamily: Fonts.sans, fontSize: 16 },
  filaDetalle: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioActivo: { borderColor: colors.accent, backgroundColor: colors.accent },
  chip: { alignSelf: 'center' },
  chipTexto: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  centro: { alignItems: 'center', gap: Spacing.three },
  esperando: {
    color: colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 13,
  },
  cancelar: {
    color: colors.textFaint,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  sello: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selloMarca: { color: '#FFFFFF', fontSize: 46 },
  debug: {
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  debugTexto: {
    color: colors.textFaint,
    fontFamily: Fonts.mono,
    fontSize: 11,
  },
  debugBotones: { flexDirection: 'row', gap: Spacing.two },
  debugBoton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  debugBotonTexto: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
});
