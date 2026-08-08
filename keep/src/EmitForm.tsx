import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User } from "./api.js";
import type { EmisorJubjub } from "./deviceKey.js";
import { resolverDestinatario, type DestinoResuelto } from "./midnames.js";

const TIPOS_CREDENCIAL = [
  { value: "un_solo_uso", label: "Un solo uso" },
  { value: "recurrente", label: "Recurrente" },
  { value: "de_por_vida", label: "De por vida" },
] as const;

type TipoCredencial = (typeof TIPOS_CREDENCIAL)[number]["value"];

type CredentialPayload = {
  alias: string;
  destinatario: string;
  addressType: string;
  tipo: TipoCredencial;
  titulo: string;
  descripcion: string;
  expiraEl: string | null;
  diasValidez: number | null;
  emisorId: string;
  pk: { x: string; y: string };
};

const fechaEnDias = (dias: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

const acortar = (addr: string) =>
  addr.length <= 20 ? addr : `${addr.slice(0, 10)}…${addr.slice(-8)}`;

type Props = {
  user: User;
  emisor: EmisorJubjub;
  onLogout: () => void;
};

export const EmitForm = ({ user, emisor, onLogout }: Props) => {
  const [destinatario, setDestinatario] = useState("");
  const [tipo, setTipo] = useState<TipoCredencial>("un_solo_uso");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [expiraEl, setExpiraEl] = useState("");
  const [diasValidez, setDiasValidez] = useState("");
  const [destino, setDestino] = useState<DestinoResuelto | null>(null);
  const [resolviendo, setResolviendo] = useState(false);
  const [errorDominio, setErrorDominio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  const esRecurrente = tipo === "recurrente";
  const pideFechaExpiracion = tipo === "un_solo_uso";
  const dominioOk = destino !== null && !errorDominio && !resolviendo;

  const validarDominio = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setDestino(null);
      setErrorDominio("");
      setResolviendo(false);
      return;
    }

    const id = ++reqId.current;
    setResolviendo(true);
    setErrorDominio("");
    setDestino(null);

    try {
      const resolved = await resolverDestinatario(trimmed);
      if (id !== reqId.current) return;
      setDestino(resolved);
      setErrorDominio("");
    } catch (err) {
      if (id !== reqId.current) return;
      setDestino(null);
      setErrorDominio(
        err instanceof Error ? err.message : "No se pudo resolver el dominio",
      );
    } finally {
      if (id === reqId.current) setResolviendo(false);
    }
  };

  useEffect(() => {
    const trimmed = destinatario.trim();
    if (!trimmed) {
      setDestino(null);
      setErrorDominio("");
      setResolviendo(false);
      return;
    }

    const t = window.setTimeout(() => {
      void validarDominio(trimmed);
    }, 500);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce solo por destinatario
  }, [destinatario]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    let resolved = destino;
    if (!resolved) {
      setLoading(true);
      try {
        resolved = await resolverDestinatario(destinatario);
        setDestino(resolved);
      } catch (err) {
        setErrorDominio(
          err instanceof Error ? err.message : "No se pudo resolver el dominio",
        );
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const dias = esRecurrente ? Number(diasValidez) : null;
      const payload: CredentialPayload = {
        alias: resolved.alias,
        destinatario: resolved.address,
        addressType: resolved.addressType,
        tipo,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        expiraEl: esRecurrente
          ? fechaEnDias(dias!)
          : pideFechaExpiracion
            ? expiraEl
            : null,
        diasValidez: dias,
        emisorId: emisor.emisorId,
        pk: emisor.pk,
      };
      console.log("Payload del certificado", payload);
    } finally {
      setLoading(false);
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
        <label>
          Destinatario
          <input
            type="text"
            name="destinatario"
            placeholder="usuario.night"
            value={destinatario}
            onChange={(e) => {
              setDestinatario(e.target.value);
              setDestino(null);
              setErrorDominio("");
            }}
            onBlur={() => {
              if (destinatario.trim()) void validarDominio(destinatario);
            }}
            required
            autoComplete="off"
          />
          {resolviendo && (
            <span className="hint">Resolviendo dominio…</span>
          )}
          {!resolviendo && destino && (
            <span className="hint ok">
              {destino.alias} → {acortar(destino.address)} ({destino.addressType})
            </span>
          )}
          {!resolviendo && errorDominio && (
            <span className="hint bad">{errorDominio}</span>
          )}
          {!resolviendo && !destino && !errorDominio && (
            <span className="hint">
              Midnames Preview: se valida al escribir o al salir del campo.
            </span>
          )}
        </label>

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

        {esRecurrente && (
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
            <span className="hint">
              Expira a los {diasValidez || "—"} días desde hoy.
            </span>
          </label>
        )}

        {pideFechaExpiracion && (
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

        <button type="submit" disabled={loading || resolviendo || !dominioOk}>
          {loading ? "Emitiendo…" : "Emitir certificado"}
        </button>
      </form>
    </main>
  );
};
