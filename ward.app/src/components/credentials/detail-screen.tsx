import React, { useState } from "react";
import { QRCode } from "@/components/ui/qr-code";
import type { Credential } from "@/types/credential";

type DetailScreenProps = {
  credential: Credential;
  credentials?: Credential[];
  onSelectCredential?: (cred: Credential) => void;
  onBack: () => void;
};

export function DetailScreen({
  credential,
  credentials = [],
  onSelectCredential,
  onBack,
}: DetailScreenProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentIndex = credentials.findIndex((c) => c.id === credential.id);
  const total = credentials.length;

  const handleNext = () => {
    if (currentIndex < total - 1 && onSelectCredential) {
      onSelectCredential(credentials[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && onSelectCredential) {
      onSelectCredential(credentials[currentIndex - 1]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const distance = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      handleNext();
    } else if (distance < -swipeThreshold) {
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <div
      className="apple-detail-shell"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="apple-detail-container">
        {/* Top Header */}
        <header className="apple-detail-header">
          <button
            className="apple-back-btn"
            onClick={onBack}
            aria-label="Volver al tarjetero"
          >
            ‹ Volver
          </button>
          <span className="apple-detail-title">{credential.title}</span>
          <div style={{ width: 40 }} />
        </header>

        {/* QR Code Embedded Container */}
        <div className="qr-glass-card">
          <span className="qr-glass-title">
            Código QR para Verificación Criptográfica
          </span>
          <div className="qr-box-white">
            <QRCode value={`ward:credential:${credential.id}`} size={160} />
          </div>
          <div className="valid-status-pill">
            <span>✓</span>
            <span>Credencial Verificada y Válida</span>
          </div>
        </div>

        {/* Credential Metadata Details */}
        <div className="meta-details-list">
          <div className="meta-item">
            <span className="meta-label">Categoría</span>
            <span className="meta-val">{credential.type}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Emisor</span>
            <span className="meta-val">{credential.issuer}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Entidad reguladora</span>
            <span className="meta-val">{credential.issuerDetail}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Fecha de emisión</span>
            <span className="meta-val">{credential.issued}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Válida hasta</span>
            <span className="meta-val">{credential.validUntil}</span>
          </div>
        </div>

        {/* Swipe Indicators */}
        {total > 1 && (
          <div className="wallet-hint" style={{ marginTop: '30px' }}>
            ↑↓ Deslizá para cambiar de credencial
          </div>
        )}
      </div>
    </div>
  );
}
