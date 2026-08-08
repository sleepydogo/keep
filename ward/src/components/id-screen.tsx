import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { QRCode } from '@/components/ui/qr-code';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { asegurarHolderSecret } from '@/services/identity';
import { holderIdDe } from '@/services/holder-id';
import { agregar, parsearQr } from '@/services/credenciales';

const colors = Colors.light;

type Paso = 'mostrar' | 'escanear' | 'listo';

export function IdScreen({ onBack }: { onBack: () => void }) {
  const [paso, setPaso] = useState<Paso>('mostrar');
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [permiso, pedirPermiso] = useCameraPermissions();

  useEffect(() => {
    asegurarHolderSecret().then(holderIdDe).then(setId);
  }, []);

  const alEscanear = async (data: string) => {
    if (paso !== 'escanear') return;
    try {
      await agregar(parsearQr(data));
      setPaso('listo');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo leer el QR.');
    }
  };

  const irAEscanear = async () => {
    setError('');
    if (!permiso?.granted) {
      const r = await pedirPermiso();
      if (!r.granted) return setError('Necesitamos la cámara para recibirla.');
    }
    setPaso('escanear');
  };

  return (
    <PageContainer>
      <BackButton onPress={onBack} label="Volver" />

      {paso === 'mostrar' && (
        <View style={styles.wrap}>
          <Text style={styles.kicker}>Paso 1 de 2</Text>
          <Text style={styles.title}>Mostrá tu código</Text>
          <Text style={styles.help}>
            El organismo escanea este código para saber que la credencial es
            para vos. No es una contraseña: podés mostrarlo sin riesgo.
          </Text>
          <QRCode value={id} size={200} />
          <Text selectable style={styles.code}>
            {id || 'Generando…'}
          </Text>
          <Button label="Ya lo escanearon" onPress={irAEscanear} />
        </View>
      )}

      {paso === 'escanear' && (
        <View style={styles.wrap}>
          <Text style={styles.kicker}>Paso 2 de 2</Text>
          <Text style={styles.title}>Escaneá tu credencial</Text>
          <Text style={styles.help}>
            Apuntá la cámara al código que te muestra el organismo.
          </Text>
          <CameraView
            style={styles.camara}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={({ data }) => void alEscanear(data)}
          />
        </View>
      )}

      {paso === 'listo' && (
        <View style={styles.wrap}>
          <Text style={styles.check}>✓</Text>
          <Text style={styles.title}>Credencial guardada</Text>
          <Text style={styles.help}>Ya está guardada en WARD.</Text>
          <Button label="Ir a mis credenciales" onPress={onBack} />
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.three },
  kicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 34,
    textAlign: 'center',
  },
  help: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  code: {
    color: colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    textAlign: 'center',
  },
  camara: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  check: { color: colors.verified, fontSize: 52 },
  error: {
    color: '#E53935',
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
});
