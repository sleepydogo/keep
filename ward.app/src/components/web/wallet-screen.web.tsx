import { motion, useReducedMotion } from 'motion/react';
import { useCredentialOrder } from '@/hooks/use-credential-order';
import type { Credential } from '@/types/credential';

type WalletScreenProps = {
  credentials: Credential[];
  pending?: Credential;
  onOpen: (credential: Credential) => void;
  onPending?: () => void;
};

export function WalletScreen({ credentials, pending, onOpen, onPending }: WalletScreenProps) {
  const reduceMotion = useReducedMotion();
  const { items, draggingId, moveItem } = useCredentialOrder(credentials);

  return (
    <main className="wallet-shell">
      <header className="wallet-header">
        <div className="wallet-brand">
          <span>WARD</span>
          <i />
        </div>
        <span className="wallet-alias">@joaquin.night</span>
      </header>

      <section className="wallet-intro">
        <div>
          <p className="wallet-kicker">Tu espacio seguro</p>
          <h1>Tu tarjetero</h1>
        </div>
        <span className="wallet-local">Guardado en este dispositivo</span>
      </section>

      {pending && onPending && (
        <button className="pending-banner-web" onClick={onPending}>
          <span className="pending-mark" style={{ backgroundColor: pending.tone }}>
            ✓
          </span>
          <span>
            <small>Nueva credencial</small>
            <strong>{pending.title}</strong>
            <em>Enviada por {pending.issuer}</em>
          </span>
          <b>›</b>
        </button>
      )}

      <div className="wallet-list" aria-label="Tus credenciales">
        {items.map((credential, index) => (
          <motion.article
            key={credential.id}
            data-credential-id={credential.id}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.06,
              layout: { type: 'spring', stiffness: 430, damping: 34 },
            }}
            className={`wallet-card ${draggingId === credential.id ? 'is-dragging' : ''}`}
            whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.16 } }}
          >
            <button
              className="drag-handle"
              aria-label={`Mover ${credential.title}`}
              title="Arrastrar para ordenar"
            >
              ⠿
            </button>
            <button className="wallet-card-main" onClick={() => onOpen(credential)}>
              <span className="credential-mark" style={{ backgroundColor: credential.tone }}>
                {credential.mark}
              </span>
              <span className="credential-content">
                <span className="credential-type">{credential.type}</span>
                <strong>{credential.title}</strong>
                <span className="credential-issuer">{credential.issuer}</span>
                <span className="credential-footer">
                  <small>{credential.validUntil}</small>
                  <em>
                    <b /> Válida
                  </em>
                </span>
              </span>
              <span className="credential-arrow">›</span>
            </button>
            <div className="keyboard-actions">
              <button
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                aria-label="Mover arriba"
              >
                ↑
              </button>
              <button
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Mover abajo"
              >
                ↓
              </button>
            </div>
          </motion.article>
        ))}
      </div>
      <p className="wallet-hint">Arrastrá una tarjeta para cambiar su orden</p>
    </main>
  );
}
