import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GearIcon } from '@/components/ui/gear-icon';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { QRCode } from '@/components/ui/qr-code';
import { EMISORES, type Emisor } from '@/constants/emisores';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { consultar, estaRegistrado, nuevoPedido, type Estado } from '@/services/nodo';

const colors = Colors.light;
const ESPERA_MS = 60_000;

type Paso = 'elegir' | 'esperando' | 'resultado';

export function VerifierScreen({ onSettings }: { onSettings: () => void }) {
  const [paso, setPaso] = useState<Paso>('elegir');
  const [emisor, setEmisor] = useState<Emisor>(EMISORES[0]);
  const [registrado, setRegistrado] = useState<boolean | null>(null);
  const [pedido, setPedido] = useState('');
  const [estado, setEstado] = useState<Estado>('pendiente');
  const [error, setError] = useState('');
  const cancelado = useRef(false);

  useEffect(() => {
    setRegistrado(null);
    setError('');
    estaRegistrado(emisor.id)
      .then((r) => setRegistrado(r.registrado))
      .catch((e) => setError(e.message));
  }, [emisor]);

  const pedir = async () => {
    setError('');
    try {
      const p = await nuevoPedido(emisor.id);
      setPedido(
        JSON.stringify({
          v: 1,
          emisorId: p.emisorId,
          nonce: p.nonce,
          fechaConsulta: p.fechaConsulta,
        }),
      );
      setPaso('esperando');
      cancelado.current = false;
      esperar(p.presentacionId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo pedir.');
    }
  };

  // La respuesta llega por la cadena, no por el otro teléfono. Timeout es no.
  const esperar = async (presentacionId: string) => {
    const hasta = Date.now() + ESPERA_MS;
    while (Date.now() < hasta && !cancelado.current) {
      await new Promise((r) => setTimeout(r, 2000));
      if (cancelado.current) return;
      try {
        const { estado: e } = await consultar(presentacionId);
        if (e !== 'pendiente') {
          setEstado(e);
          return setPaso('resultado');
        }
      } catch {
        /* el indexer todavía no lo vio */
      }
    }
    if (!cancelado.current) {
      setEstado('no-vigente');
      setPaso('resultado');
    }
  };

  const cancelar = () => {
    cancelado.current = true;
    setPaso('elegir');
  };

  const vigente = estado === 'vigente';

  return (
    <PageContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>WARD</Text>
          <Text style={styles.rol}>Verificador</Text>
        </View>
        <Pressable style={styles.icono} onPress={onSettings} accessibilityLabel="Ajustes">
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

          <Text
            style={[
              styles.chip,
              { color: registrado === false ? colors.danger : colors.verified },
            ]}
          >
            {registrado === null
              ? 'Consultando la cadena…'
              : registrado
                ? '✓ Organismo registrado on-chain'
                : '✕ Ese organismo no está registrado'}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label="Pedir verificación"
            disabled={!registrado}
            onPress={pedir}
          />
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
          <Pressable onPress={cancelar}>
            <Text style={styles.cancelar}>Cancelar</Text>
          </Pressable>
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
              : `No hubo respuesta o el certificado de ${emisor.nombre} no está vigente.`}
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
  rol: { color: colors.accent, fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 1 },
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
  filaActiva: { borderColor: colors.accent, backgroundColor: colors.backgroundSelected },
  filaTexto: { flex: 1, gap: 2 },
  filaTitulo: { color: colors.text, fontFamily: Fonts.sans, fontSize: 16 },
  filaDetalle: { color: colors.textSecondary, fontFamily: Fonts.sans, fontSize: 13 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioActivo: { borderColor: colors.accent, backgroundColor: colors.accent },
  chip: { fontFamily: Fonts.mono, fontSize: 12, textAlign: 'center' },
  centro: { alignItems: 'center', gap: Spacing.three },
  esperando: { color: colors.textSecondary, fontFamily: Fonts.mono, fontSize: 13 },
  cancelar: { color: colors.textFaint, fontFamily: Fonts.sans, fontSize: 14 },
  sello: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selloMarca: { color: colors.onAccent, fontSize: 46 },
  error: { color: colors.danger, fontFamily: Fonts.sans, fontSize: 13, textAlign: 'center' },
});
