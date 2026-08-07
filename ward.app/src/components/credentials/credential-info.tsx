import { StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Credential } from '@/types/credential';

type CredentialInfoProps = {
  credential: Credential;
};

const colors = Colors.light;

export function CredentialInfo({ credential }: CredentialInfoProps) {
  return (
    <View style={styles.info}>
      <View>
        <Text style={styles.infoLabel}>Emitida</Text>
        <Text style={styles.infoValue}>{credential.issued}</Text>
      </View>
      <View>
        <Text style={styles.infoLabel}>Válida hasta</Text>
        <Text style={styles.infoValue}>{credential.validUntil}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DED6C8',
    paddingVertical: Spacing.three,
    marginVertical: Spacing.two,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 10,
    marginBottom: 5,
  },
  infoValue: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
