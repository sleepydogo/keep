import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GearIcon } from '@/components/ui/gear-icon';
import { PageContainer } from '@/components/ui/page-container';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Credential } from '@/types/credential';

type WalletScreenProps = {
  credentials: Credential[];
  onOpen: (credential: Credential) => void;
  onShowId: () => void;
  onSettings: () => void;
};

const colors = Colors.light;

export function WalletScreen({
  credentials,
  onOpen,
  onShowId,
  onSettings,
}: WalletScreenProps) {
  return (
    <PageContainer>
      <View style={styles.header}>
        <Text style={styles.brand}>WARD</Text>
        <View style={styles.acciones}>
          <Pressable
            style={styles.icono}
            onPress={onSettings}
            accessibilityLabel="Ajustes"
          >
            <GearIcon color={colors.text} />
          </Pressable>
          <Pressable
            style={styles.icono}
            onPress={onShowId}
            accessibilityLabel="Mostrar mi código para recibir credenciales"
          >
            <Text style={styles.iconoText}>+</Text>
          </Pressable>
        </View>
      </View>

      {credentials.length === 0 && (
        <View style={styles.vacio}>
          <Text style={styles.vacioTitulo}>Todavía no tenés credenciales</Text>
          <Text style={styles.vacioTexto}>
            Cuando un organismo te emita una credencial, va a aparecer acá.
            Tocá el + para mostrarle tu código y recibirla.
          </Text>
        </View>
      )}

      <View style={styles.list}>
        {credentials.map((credential) => (
          <Pressable
            key={credential.id}
            style={[styles.card, { backgroundColor: credential.tone }]}
            onPress={() => onOpen(credential)}
          >
            <Text style={styles.cardType}>{credential.type}</Text>
            <Text style={styles.cardTitle}>{credential.title}</Text>
            <Text style={styles.cardIssuer}>{credential.issuer}</Text>
          </Pressable>
        ))}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 28,
    letterSpacing: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  acciones: { flexDirection: 'row', gap: Spacing.two },
  icono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoText: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 24,
  },
  vacio: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  vacioTitulo: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 24,
  },
  vacioTexto: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  list: {
    gap: Spacing.three,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    gap: 6,
  },
  cardType: {
    color: '#FFFDF8',
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.8,
  },
  cardTitle: {
    color: '#FFFDF8',
    fontFamily: Fonts.serif,
    fontSize: 24,
  },
  cardIssuer: {
    color: '#FFFDF8',
    fontFamily: Fonts.sans,
    fontSize: 13,
    opacity: 0.85,
  },
});
