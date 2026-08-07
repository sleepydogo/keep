import React from 'react';
import { CARD_TEMPLATES, CardTemplate } from '@/constants/card-templates';

type TemplateSelectorProps = {
  currentId?: string;
  onSelect: (template: CardTemplate) => void;
  onClose: () => void;
};

export function TemplateSelector({ currentId, onSelect, onClose }: TemplateSelectorProps) {
  return (
    <div className="template-overlay" onClick={onClose}>
      <div className="template-panel" onClick={(e) => e.stopPropagation()}>
        <div className="template-panel-header">
          <span className="template-panel-title">Diseño de tarjeta</span>
          <button className="template-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="template-grid">
          {CARD_TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`template-chip ${t.id === currentId ? 'selected' : ''}`}
              style={{ background: t.gradient }}
              onClick={() => onSelect(t)}
              aria-label={`Template ${t.name}`}
            >
              <span className="template-chip-name" style={{ color: t.accent }}>{t.name}</span>
              {t.id === currentId && <span className="template-chip-check" style={{ color: t.accent }}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
