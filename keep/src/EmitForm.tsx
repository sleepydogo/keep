import { useState, type FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { emitir } from "@keep/contract/credencial";
import type { User } from "./api.js";
import { empaquetar } from "./credencialQr.js";
import { deHex, type EmisorJubjub } from "./deviceKey.js";
import { HolderIdField } from "./HolderIdField.js";

const TIPOS_CREDENCIAL = [
  { value: "un_solo_uso", label: "Un solo uso" },
  { value: "recurrente", label: "Recurrente" },
  { value: "de_por_vida", label: "De por vida" },
] as const;

type TipoCredencial = (typeof TIPOS_CREDENCIAL)[number]["value"];

const DIA = 86400n;
const CIEN_ANIOS = 36500n * DIA;

const esHex64 = (s: string) => /^[0-9a-f]{64}$/.test(s.trim().toLowerCase());

type Props = {
  user: User;
  emisor: EmisorJubjub;
  onLogout: () => void;
};

export const EmitForm = ({ user, emisor, onLogout }: Props) => {
  const [holderId, setHolderId] = useState("");
  const [tipo, setTipo] = useState<TipoCredencial>("un_solo_uso");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [expiraEl, setExpiraEl] = useState("");
  const [diasValidez, setDiasValidez] = useState("");
  const [error, setError] = useState("");
  const [emitida, setEmitida] = useState("");

  const idOk = esHex64(holderId);
  const ahora = () => BigInt(Math.floor(Date.now() / 1000));

  const vencimiento = (): bigint => {
    if (tipo === "de_por_vida") return ahora() + CIEN_ANIOS;
    if (tipo === "recurrente") return ahora() + BigInt(diasValidez || 0) * DIA;
    return BigInt(Math.floor(new Date(expiraEl).getTime() / 1000));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setEmitida("");
    try {
      const credencial = emitir(
        emisor.sk,
        deHex(holderId.trim().toLowerCase()),
        vencimiento(),
        [111n, 222n, 333n],
      );
      setEmitida(empaquetar(emisor.emisorId, titulo.trim(), credencial));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo emitir");
    }
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1 className="brand-title">KEEP <i /></h1>
          <p className="subtitle">
            {user.orgName} · {user.username}
          </p>
        </div>
        <button type="button" className="ghost" onClick={onLogout}>
          Salir
        </button>
      </header>

      <p className="section-title">Nueva credencial</p>

      <form className="form" onSubmit={onSubmit}>
        <HolderIdField
          value={holderId}
          onChange={setHolderId}
          valido={idOk}
        />

        <label>
          Tipo de credencial
          <select
            name="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCredencial)}
          >
            {TIPOS_CREDENCIAL.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Título
          <input
            type="text"
            name="titulo"
            placeholder="Título de la credencial"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </label>

        <label>
          Descripción
          <textarea
            name="descripcion"
            placeholder="Información adicional (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
          />
        </label>

        {tipo === "recurrente" && (
          <label>
            Días de validez
            <input
              type="number"
              name="diasValidez"
              min={1}
              step={1}
              placeholder="30"
              value={diasValidez}
              onChange={(e) => setDiasValidez(e.target.value)}
              required
            />
          </label>
        )}

        {tipo === "un_solo_uso" && (
          <label>
            Expira el
            <input
              type="date"
              name="expiraEl"
              value={expiraEl}
              onChange={(e) => setExpiraEl(e.target.value)}
              required
            />
          </label>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={!idOk}>
          Emitir certificado
        </button>
      </form>

      {emitida && (
        <>
          <p className="section-title">Credencial firmada</p>
          <p className="hint">
            Que la escanee con WARD. {emitida.length} caracteres.
          </p>
          <div className="qr-emitida">
            <QRCodeSVG value={emitida} size={320} level="L" marginSize={2} />
          </div>
          <details>
            <summary className="hint">Ver el texto</summary>
            <textarea readOnly rows={8} value={emitida} />
          </details>
        </>
      )}
    </main>
  );
};
