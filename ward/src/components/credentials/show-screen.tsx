import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { listar } from '@/services/credenciales';
import { asegurarHolderSecret } from '@/services/identity';
import { presentar } from '@/services/nodo';
import type { Credential } from '@/types/credential';

const colors = Colors.light;

type Paso = 'escanear' | 'enviando' | 'listo';

export function ShowScreen({
  credential,
  onBack,
}: {
  credential: Credential;
  onBack: () => void;
}) {
  const [paso, setPaso] = useState<Paso>('escanear');
  const [error, setError] = useState('');
  const [permiso, pedirPermiso] = useCameraPermissions();

  const alEscanear = async (data: string) => {
    if (paso !== 'escanear') return;
    setPaso('enviando');
    setError('');
    try {
      const pedido = JSON.parse(data);
      const cred = (await listar()).find((c) => c.id === credential.id);
      if (!cred) throw new Error('No encontramos esa credencial.');
      if (cred.emisorId !== pedido.emisorId)
        throw new Error('El pedido es de otro organismo.');

      await presentar({
        emisorId: pedido.emisorId,
        nonce: pedido.nonce,
        fechaConsulta: pedido.fechaConsulta,
        holderSecret: await asegurarHolderSecret(),
        credencial: cred,
      });
      setPaso('listo');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo presentar.');
      setPaso('escanear');
    }
  };

  const abrirCamara = async () => {
    if (!permiso?.granted) {
      const r = await pedirPermiso();
      if (!r.granted) return setError('Necesitamos la cámara.');
    }
  };

  return (
    <PageContainer>
      <BackButton onPress={onBack} />
      <View style={styles.wrap}>
        {paso === 'escanear' && (
          <>
            <Text style={styles.kicker}>Presentar</Text>
            <Text style={styles.titulo}>Escaneá el código del verificador</Text>
            <Text style={styles.ayuda}>
              Sólo se va a saber si tu {credential.title.toLowerCase()} está
              vigente. Ni tu nombre, ni tus datos, ni nada más.
            </Text>
            {permiso?.granted ? (
              <CameraView
                style={styles.camara}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={({ data }) => void alEscanear(data)}
              />
            ) : (
              <Button label="Abrir la cámara" onPress={abrirCamara} />
            )}
          </>
        )}

        {paso === 'enviando' && (
          <>
            <Text style={styles.titulo}>Probando…</Text>
            <Text style={styles.ayuda}>
              Se está generando la prueba. Puede tardar unos segundos.
            </Text>
          </>
        )}

        {paso === 'listo' && (
          <>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.titulo}>Listo</Text>
            <Text style={styles.ayuda}>
              El verificador ya puede ver la respuesta en su teléfono.
            </Text>
            <Button label="Volver" onPress={onBack} />
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
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
  camara: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  check: { color: colors.verified, fontSize: 52 },
  error: {
    color: colors.danger,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
});
