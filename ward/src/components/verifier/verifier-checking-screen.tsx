import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type VerifierCheckingScreenProps = {
  onBack: () => void;
  onResult: (result: 'valid' | 'invalid' | 'offline') => void;
  isOnline: boolean;
};

const colors = Colors.light;

export function VerifierCheckingScreen({ onBack, onResult, isOnline }: VerifierCheckingScreenProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onResult(isOnline ? 'valid' : 'offline');
    }, 2000);
    return () => clearTimeout(timer);
  }, [onResult, isOnline]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>KEEP</Text>
          <View style={styles.brandDot} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.spinnerWrap}>
          <ActivityIndicator size="large" color={colors.action} />
        </View>

        <Text style={styles.title}>Verificando credencial</Text>
        <Text style={styles.subtitle}>
          {isOnline
            ? 'Comprobando firma, emisor y estado de vigencia...'
            : 'Comprobando firma localmente...'}
        </Text>

        <Pressable
          style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
          onPress={onBack}
        >
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: Spacing.four,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 480,
    paddingBottom: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  brandText: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.action,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  spinnerWrap: {
    padding: Spacing.four,
    marginBottom: Spacing.two,
  },
  title: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
  },
  cancelBtn: {
    marginTop: Spacing.four,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    backgroundColor: colors.backgroundElement,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
