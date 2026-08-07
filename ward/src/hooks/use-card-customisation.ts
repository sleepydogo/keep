import { useState, useCallback } from 'react';

/**
 * Manages per-credential template overrides, persisted in localStorage.
 * Also controls the global privacy mask for all cards.
 */
export function useCardCustomisation() {
  const [masked, setMasked] = useState(false);

  const [templateMap, setTemplateMap] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('ward.templateMap') || '{}');
    } catch {
      return {};
    }
  });

  const toggleMask = useCallback(() => setMasked((m) => !m), []);

  const setTemplate = useCallback((credentialId: string, templateId: string) => {
    setTemplateMap((prev) => {
      const next = { ...prev, [credentialId]: templateId };
      try { localStorage.setItem('ward.templateMap', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { masked, toggleMask, templateMap, setTemplate };
}
