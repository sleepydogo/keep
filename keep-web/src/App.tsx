import { useEffect, useState } from "react";
import "./App.css";
import { api, type User } from "./api.js";
import { Auth } from "./Auth.js";
import { ensureDeviceKey, type EmisorJubjub } from "./deviceKey.js";
import { EmitForm } from "./EmitForm.js";

type Status = "loading" | "auth" | "ready";

export const App = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [emisor, setEmisor] = useState<EmisorJubjub | null>(null);
  const [error, setError] = useState("");

  const bootSession = async (next: User) => {
    setError("");
    setUser(next);
    try {
      const jubjub = await ensureDeviceKey(next.id, async (e) => {
        await api.registerDevice({
          emisorId: e.emisorId,
          pk: e.pk,
          label: navigator.userAgent.slice(0, 80),
        });
      });
      setEmisor(jubjub);
      setStatus("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el dispositivo",
      );
      setStatus("auth");
      setUser(null);
      setEmisor(null);
    }
  };

  useEffect(() => {
    api
      .me()
      .then(({ user }) => bootSession(user))
      .catch(() => setStatus("auth"));
  }, []);

  const onLogout = async () => {
    await api.logout().catch(() => undefined);
    setUser(null);
    setEmisor(null);
    setStatus("auth");
  };

  if (status === "loading") {
    return (
      <main className="page">
        <h1 className="brand-title">KEEP <i /></h1>
        <p className="subtitle">Cargando…</p>
      </main>
    );
  }

  if (status === "auth" || !user || !emisor) {
    return (
      <>
        {error && <p className="banner-error">{error}</p>}
        <Auth onAuth={bootSession} />
      </>
    );
  }

  return <EmitForm user={user} emisor={emisor} onLogout={onLogout} />;
};
