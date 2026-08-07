import { useState, type FormEvent } from "react";
import type { User } from "./api.js";

const TIPOS_CREDENCIAL = [
  { value: "un_solo_uso", label: "Un solo uso" },
  { value: "recurrente", label: "Recurrente" },
  { value: "de_por_vida", label: "De por vida" },
] as const;

type TipoCredencial = (typeof TIPOS_CREDENCIAL)[number]["value"];

type CredentialPayload = {
  destinatario: string;
  tipo: TipoCredencial;
  titulo: string;
  descripcion: string;
  expiraEl: string | null;
  diasValidez: number | null;
  emisor: { userId: string; orgId: string; orgName: string; devicePublicKey: string };
};

const fechaEnDias = (dias: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

type Props = {
  user: User;
  devicePublicKey: string;
  onLogout: () => void;
};

export const EmitForm = ({ user, devicePublicKey, onLogout }: Props) => {
  const [destinatario, setDestinatario] = useState("");
  const [tipo, setTipo] = useState<TipoCredencial>("un_solo_uso");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [expiraEl, setExpiraEl] = useState("");
  const [diasValidez, setDiasValidez] = useState("");

  const esRecurrente = tipo === "recurrente";
  const pideFechaExpiracion = tipo === "un_solo_uso";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dias = esRecurrente ? Number(diasValidez) : null;
    const payload: CredentialPayload = {
      destinatario: destinatario.trim(),
      tipo,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      expiraEl: esRecurrente
        ? fechaEnDias(dias!)
        : pideFechaExpiracion
          ? expiraEl
          : null,
      diasValidez: dias,
      emisor: {
        userId: user.id,
        orgId: user.orgId,
        orgName: user.orgName,
        devicePublicKey,
      },
    };
    console.log("Payload del certificado", payload);
  };

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <h1>KEEP</h1>
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
            onChange={(e) => setDestinatario(e.target.value)}
            required
            autoComplete="off"
          />
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

        <button type="submit">Emitir certificado</button>
      </form>
    </main>
  );
};
