import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AppleWalletCard } from '@/components/credentials/apple-wallet-card';
import { useCredentialOrder } from '@/hooks/use-credential-order';
import { useCardCustomisation } from '@/hooks/use-card-customisation';
import type { Credential } from '@/types/credential';

type WalletScreenProps = {
  credentials: Credential[];
  pending?: Credential;
  onOpen: (credential: Credential) => void;
  onAcceptPending?: () => void;
};

export function WalletScreen({
  credentials,
  pending,
  onOpen,
  onAcceptPending,
}: WalletScreenProps) {
  const reduceMotion = useReducedMotion();
  const { items, draggingId } = useCredentialOrder(credentials);
  const { masked, toggleMask, templateMap, setTemplate } = useCardCustomisation();
  const [alias, setAlias] = useState('joaquin.night');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAlias = localStorage.getItem('ward.user_alias');
      if (savedAlias) {
        setAlias(savedAlias);
      }
    }
  }, []);

  return (
    <main className="wallet-shell">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="wallet-header">
        <div className="wallet-brand">
          <span>WARD</span>
          <i />
        </div>
        <div className="wallet-header-actions">
          <span className="wallet-alias">@{alias}</span>
          {/* Eye — toggle privacy mask */}
          <button
            className="header-icon-btn"
            onClick={toggleMask}
            aria-label={masked ? 'Mostrar datos' : 'Ocultar datos'}
            title={masked ? 'Mostrar datos' : 'Ocultar datos'}
          >
            {masked ? (
              // Eye-off
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              // Eye-open
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Pending credential notification ─────────────── */}
      <AnimatePresence>
        {pending && onAcceptPending && (
          <motion.section
            key="pending"
            className="pending-section"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <article className="pending-card">
              <span className="pending-mark" style={{ backgroundColor: pending.tone }}>
                {pending.mark}
              </span>
              <div className="pending-copy">
                <small>Nueva credencial</small>
                <strong>{pending.title}</strong>
              </div>
              <button className="review-button" onClick={onAcceptPending}>
                Agregar
              </button>
            </article>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Card list ────────────────────────────────────── */}
      <section>
        <div className="apple-wallet-list">
          {items.map((credential, index) => {
            // Merge template override into credential object
            const enriched: Credential = templateMap[credential.id]
              ? { ...credential, templateId: templateMap[credential.id] }
              : credential;

            return (
              <motion.div
                key={credential.id}
                data-credential-id={credential.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{
                  delay: index * 0.055,
                  duration: 0.28,
                  layout: {
                    type: 'spring',
                    stiffness: 340,
                    damping: 30,
                    mass: 0.9,
                  },
                }}
                className={`apple-wallet-item-row${draggingId === credential.id ? ' is-dragging' : ''}`}
              >
                <AppleWalletCard
                  credential={enriched}
                  masked={masked}
                  onClick={() => onOpen(credential)}
                  onTemplateChange={(tid) => setTemplate(credential.id, tid)}
                />
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
