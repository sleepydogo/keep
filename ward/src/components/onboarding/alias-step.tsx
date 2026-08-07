import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { OnboardingLayout } from './onboarding-layout';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { STORAGE_KEYS, storageService } from '@/services/storage';

type AliasStepProps = {
  onComplete: (alias: string) => void;
};

const colors = Colors.light;

export function AliasStep({ onComplete }: AliasStepProps) {
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (text: string) => {
    // Only allow lowercase letters (a-z)
    const sanitized = text.toLowerCase().replace(/[^a-z]/g, '');
    setAlias(sanitized);

    if (sanitized.length > 0 && sanitized.length < 3) {
      setError('El alias debe tener al menos 3 caracteres.');
    } else {
      setError('');
    }
  };

  const handlePress = () => {
    if (alias.length >= 3) {
      const fullAlias = `${alias}.night`;
      storageService.setItem('ward.user_alias', fullAlias);
      onComplete(fullAlias);
    }
  };

  return (
    <OnboardingLayout>
      <View style={styles.onboardingCopy}>
        <Text style={styles.kicker}>Tu identidad</Text>
        <Text style={styles.onboardingTitle}>Elegí tu alias único</Text>
        <Text style={styles.onboardingBody}>
          Este alias identificará tu tarjetero en tu dispositivo.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>@</Text>
        <TextInput
          style={styles.input}
          placeholder="joaquin"
          placeholderTextColor="#A6A39A"
          value={alias}
          onChangeText={handleInputChange}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={15}
        />
        <Text style={styles.suffix}>.night</Text>
      </View>
      
      <Text style={styles.hintText}>Solo letras (a-z), sin espacios ni números.</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        label="Crear mi espacio"
        disabled={alias.length < 3}
        onPress={handlePress}
      />
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  onboardingCopy: {
    gap: Spacing.two,
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  kicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  onboardingTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 36,
    lineHeight: 42,
    textAlign: 'center',
  },
  onboardingBody: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 340,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A473B',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    height: 52,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#565345',
    marginBottom: Spacing.one,
  },
  prefix: {
    color: '#F2542D',
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  suffix: {
    color: '#8A877B',
    fontFamily: Fonts.mono,
    fontSize: 16,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: Fonts.mono,
    fontSize: 16,
    padding: 0,
    outlineStyle: 'none', // For web view text input outline removal
  } as any,
  hintText: {
    color: '#A6A39A',
    fontFamily: Fonts.sans,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  errorText: {
    color: '#E53935',
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
});
