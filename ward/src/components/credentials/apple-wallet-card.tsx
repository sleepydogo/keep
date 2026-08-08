import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Credential } from '@/types/credential';
import { getTemplate } from '@/constants/card-templates';
import { TemplateSelector } from './template-selector';
import { AppIcon } from '@/components/ui/app-icon';
import { Spacing, BorderRadius, Fonts } from '@/constants/theme';

type AppleWalletCardProps = {
  credential: Credential;
  onClick?: () => void;
  masked?: boolean;
  onTemplateChange?: (templateId: string) => void;
};

export function AppleWalletCard({
  credential,
  onClick,
  masked = false,
  onTemplateChange,
}: AppleWalletCardProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const template = getTemplate(credential.templateId);
  const accentColor = template.accent;
  const gradColors = template.gradient.colors;

  return (
    <>
      <Pressable
        style={({ pressed }) => [pressed && styles.pressed]}
        onPress={onClick}
      >
        <LinearGradient
          colors={gradColors}
          start={template.gradient.start}
          end={template.gradient.end}
          style={styles.card}
        >
          <View style={styles.gloss} />

          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={[styles.markIcon, { borderColor: `${accentColor}60`, backgroundColor: `${accentColor}30` }]}>
                <Text style={[styles.markText, { color: accentColor }]}>{credential.mark}</Text>
              </View>
              <Text style={styles.issuerName}>
                {masked ? '••••••••' : credential.issuer}
              </Text>
            </View>
            {onTemplateChange && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Personalizar credencial"
                style={styles.settingsButton}
                onPress={(event) => {
                  event.stopPropagation();
                  setShowTemplates(true);
                }}
              >
                <AppIcon name="gearshape" size={17} tintColor={accentColor} />
                <Text style={[styles.settingsText, { color: accentColor }]}>Personalizar</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.body}>
            <Text style={[styles.type, { color: accentColor }]} numberOfLines={1}>
              {credential.badge || credential.type}
            </Text>
            <Text style={styles.title} numberOfLines={2}>
              {masked ? '•••• ••••' : credential.title}
            </Text>
            <Text style={styles.issuerDetail} numberOfLines={1}>
              {masked ? 'Emisor oculto' : credential.issuer}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.validity}>
                {masked ? 'Estado oculto' : `Válida hasta ${credential.validUntil}`}
              </Text>
            </View>
            <Text style={styles.credentialMark}>{credential.mark}</Text>
          </View>
        </LinearGradient>
      </Pressable>

      {showTemplates && (
        <TemplateSelector
          currentId={credential.templateId}
          onSelect={(t) => {
            onTemplateChange?.(t.id);
            setShowTemplates(false);
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    minHeight: 180,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  markIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    fontSize: 14,
    fontWeight: '700',
  },
  issuerName: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  settingsText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    paddingVertical: Spacing.one,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  type: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.one,
  },
  issuerDetail: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginTop: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#7DDB8A',
  },
  validity: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Fonts.sans,
    fontSize: 11,
  },
  credentialMark: {
    color: 'rgba(255,255,255,0.82)',
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
  },
});
