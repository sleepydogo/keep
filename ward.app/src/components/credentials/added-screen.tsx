import { QRCode } from "@/components/ui/qr-code";
import type { Credential } from "@/types/credential";

type AddedScreenProps = {
  credential: Credential;
  onBack: () => void;
};

export function AddedScreen({ credential, onBack }: AddedScreenProps) {
  return (
    <div className="apple-detail-shell">
      <div className="apple-detail-container">
        {/* Top Header */}
        <header className="apple-detail-header">
          <button
            className="apple-back-btn"
            onClick={onBack}
            aria-label="Volver al tarjetero"
          >
            ‹ Volver al tarjetero
          </button>
          <div style={{ width: 40 }} />
        </header>

        {/* Selected Hero Card */}
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

        {/* Disclaimer / Success Message */}
        <div
          style={{
            textAlign: "center",
            padding: "16px 0",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "var(--success)",
              fontSize: "20px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
            }}
          >
            ✓ Agregada Exitosamente
          </h2>
          <p
            style={{
              margin: 0,
              color: "var(--text-secondary)",
              fontSize: "15px",
              fontFamily: "var(--font-display)",
              lineHeight: 1.4,
            }}
          >
            Tu credencial {credential.title} ya está disponible. Podés validarla
            escaneando o acercándola al lector NFC.
          </p>
        </div>
      </div>
    </div>
  );
}
