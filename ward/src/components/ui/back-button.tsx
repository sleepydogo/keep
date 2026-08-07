import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type BackButtonProps = {
  onPress: () => void;
  label?: string;
};

const colors = Colors.light;

export function BackButton({ onPress, label = 'Volver' }: BackButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.back}>
      <Text style={styles.backArrow}>‹</Text>
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.two,
  },
  backArrow: {
    color: colors.text,
    fontSize: 25,
  },
  backText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
