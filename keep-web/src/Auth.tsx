import { useState, type FormEvent } from "react";
import { api, type User } from "./api.js";

type Mode = "login" | "register";

type Props = {
  onAuth: (user: User) => void;
};

export const Auth = ({ onAuth }: Props) => {
  const [mode, setMode] = useState<Mode>("login");
  const [orgName, setOrgName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <h1>KEEP</h1>
      <p className="subtitle">
        {mode === "login" ? "Entrar a tu institución" : "Crear institución"}
      </p>

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
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Esperá…"
            : mode === "login"
              ? "Entrar"
              : "Crear institución"}
        </button>
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
