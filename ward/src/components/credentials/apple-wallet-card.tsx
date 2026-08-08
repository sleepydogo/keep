import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Credential } from '@/types/credential';
import { getTemplate } from '@/constants/card-templates';
import { TemplateSelector } from './template-selector';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type AppleWalletCardProps = {
  credential: Credential;
  onClick?: () => void;
  masked?: boolean;
  onTemplateChange?: (templateId: string) => void;
};

const colors = Colors.light;

export function AppleWalletCard({
  credential,
  onClick,
  masked = false,
  onTemplateChange,
}: AppleWalletCardProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const template = getTemplate(credential.templateId);
  const accentColor = template.accent || colors.action;
  const cardBg = credential.tone || colors.backgroundElement;

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: cardBg },
          pressed && styles.pressed,
        ]}
        onPress={onClick}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={[styles.markIcon, { borderColor: `${accentColor}40`, backgroundColor: `${accentColor}22` }]}>
              <Text style={[styles.markText, { color: accentColor }]}>{credential.mark}</Text>
            </View>
            <Text style={styles.issuerName}>
              {masked ? '••••••••' : credential.issuer}
            </Text>
          </View>
          <View style={styles.categoryWrap}>
            <View style={[styles.categoryBadge, { borderColor: `${accentColor}40` }]}>
              <Text style={[styles.categoryText, { color: accentColor }]}>
                {credential.badge || credential.type}
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: accentColor }}>📡</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {masked ? '•••• ••••' : credential.title}
          </Text>
        </View>

        {/* Bottom Footer */}
        <View style={styles.footer}>
          <View style={styles.numberBox}>
            <Text style={[styles.cardNumber, { color: accentColor }]}>
              {masked ? '•••• ••••' : (credential.cardNumber || `•••• ${credential.id.slice(0, 4)}`)}
            </Text>
            <Text style={styles.validity}>
              {masked ? '•• / ••' : `HASTA ${credential.validUntil.toUpperCase()}`}
            </Text>
          </View>

          {onTemplateChange && (
            <Pressable
              style={styles.gearBtn}
              onPress={() => {
                setShowTemplates(true);
              }}
            >
              <Text style={styles.gearText}>⚙</Text>
            </Pressable>
          )}
        </View>
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
    borderRadius: 20,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 180,
    justifyContent: 'space-between',
    marginVertical: Spacing.one,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
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
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    paddingVertical: Spacing.one,
  },
  title: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  numberBox: {
    gap: 2,
  },
  cardNumber: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  validity: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 11,
  },
  gearBtn: {
    padding: Spacing.one,
  },
  gearText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});
