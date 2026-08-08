import { useState, type FormEvent } from "react";
import { api, type User } from "./api.js";

type Mode = "login" | "register";

type Props = {
  onAuth: (user: User) => void;
};

const DEMO_CREDENTIALS = { username: "demo", password: "demo1234" };

export const Auth = ({ onAuth }: Props) => {
  const [mode, setMode] = useState<Mode>("login");
  const [orgName, setOrgName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const useDemoCredentials = () => {
    setMode("login");
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError("");
  };

  const isDemo = import.meta.env.DEV;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } =
        mode === "register"
          ? await api.register({ orgName, username, password })
          : await api.login({ username, password });
      onAuth(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <h1 className="brand-title">KEEP <i /></h1>
      <p className="subtitle">
        {mode === "login"
          ? "Credenciales verificables para tu institución"
          : "Configurá una nueva institución emisora"}
      </p>
      {mode === "login" && (
        <p className="intro-copy">
          Emití credenciales protegiendo los datos privados de cada destinatario.
        </p>
      )}

      <form className="form" onSubmit={onSubmit}>
        {mode === "register" && (
          <label>
            Institución
            <input
              type="text"
              name="orgName"
              placeholder="Nombre de la organización"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              autoComplete="organization"
            />
          </label>
        )}

        <label>
          Usuario
          <input
            type="text"
            name="username"
            placeholder="usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            aria-invalid={Boolean(error)}
          />
        </label>

        <label htmlFor="password">
          Contraseña
          <span className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              aria-invalid={Boolean(error)}
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-pressed={showPassword}>
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </span>
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Esperá…"
            : mode === "login"
              ? "Entrar"
              : "Crear institución"}
        </button>

        {mode === "login" && isDemo && (
          <button type="button" className="link demo-login" onClick={useDemoCredentials}>
            Usar acceso de demostración
          </button>
        )}
      </form>

      <p className="switch">
        {mode === "login" ? (
          <>
            ¿Primera vez?{" "}
            <button type="button" className="link" onClick={() => setMode("register")}>
              Crear institución
            </button>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta?{" "}
            <button type="button" className="link" onClick={() => setMode("login")}>
              Entrar
            </button>
          </>
        )}
      </p>
    </main>
  );
};
