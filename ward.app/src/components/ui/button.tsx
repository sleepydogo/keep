import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const colors = Colors.light;

export function Button({ label, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.action,
    borderRadius: 12,
    minHeight: 50,
    paddingHorizontal: Spacing.four,
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#FFFDF8',
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
