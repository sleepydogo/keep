import React, { useState } from 'react';
import type { Credential } from '@/types/credential';
import { getTemplate } from '@/constants/card-templates';
import { TemplateSelector } from './template-selector';

export function ContactlessIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 18.5C6.5 15.5 6.5 8.5 4 5.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.5 20.5C13 16.5 13 7.5 9.5 3.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15 22.5C19.5 17.5 19.5 6.5 15 1.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

type AppleWalletCardProps = {
  credential: Credential;
  onClick?: () => void;
  masked?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onTemplateChange?: (templateId: string) => void;
};

export function AppleWalletCard({
  credential,
  onClick,
  masked = false,
  className = '',
  style,
  onTemplateChange,
}: AppleWalletCardProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const template = getTemplate(credential.templateId);

  const bgStyle: React.CSSProperties = {
    background: credential.gradient || template.gradient,
    ...style,
  };

  const accentColor = template.accent;

  const handleGear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTemplates(true);
  };

  return (
    <>
      <div
        className={`apple-pass-card ${className}`}
        style={bgStyle}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div className="pass-gloss-overlay" />
        <div className="pass-chip-pattern" />

        {/* Top Header */}
        <div className="pass-header">
          <div className="pass-brand">
            <span className="pass-mark-icon" style={{ borderColor: `${accentColor}40`, background: `${accentColor}22`, color: accentColor }}>
              {credential.mark}
            </span>
            <span className="pass-issuer-name">{masked ? '••••••••' : credential.issuer}</span>
          </div>
          <div className="pass-type-wrap">
            <span className="pass-category" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
              {credential.badge || credential.type}
            </span>
            <ContactlessIcon size={14} color={accentColor} />
          </div>
        </div>

        {/* Main Content */}
        <div className="pass-body">
          <h3 className="pass-title">{masked ? '•••• ••••' : credential.title}</h3>
        </div>

        {/* Bottom Footer */}
        <div className="pass-footer">
          <div className="pass-number-box">
            <span className="pass-number" style={{ color: accentColor }}>
              {masked ? '•••• ••••' : (credential.cardNumber || `•••• ${credential.id.slice(0, 4)}`)}
            </span>
            <span className="pass-validity">
              {masked ? '•• / ••' : `HASTA ${credential.validUntil.toUpperCase()}`}
            </span>
          </div>
          {/* Settings gear — only shows on hover via CSS */}
          {onTemplateChange && (
            <button className="card-settings-btn" onClick={handleGear} aria-label="Personalizar diseño">
              ⚙
            </button>
          )}
        </div>
      </div>

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
