import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type VerifierScanningScreenProps = {
  onBack: () => void;
  onProcessed: () => void;
};

const colors = Colors.light;

export function VerifierScanningScreen({ onBack, onProcessed }: VerifierScanningScreenProps) {
  React.useEffect(() => {
    const timer = setTimeout(onProcessed, 2500);
    return () => clearTimeout(timer);
  }, [onProcessed]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>KEEP</Text>
          <View style={styles.brandDot} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.viewfinder}>
          <Text style={styles.viewfinderIcon}>📷</Text>
        </View>

        <Text style={styles.title}>Escaneando...</Text>
        <Text style={styles.subtitle}>Apuntá al código que muestra la otra persona</Text>

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
  viewfinder: {
    width: 200,
    height: 200,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.action,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242, 84, 45, 0.08)',
    marginBottom: Spacing.two,
  },
  viewfinderIcon: {
    fontSize: 64,
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
