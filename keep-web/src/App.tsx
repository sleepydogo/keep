import { useEffect, useState } from "react";
import "./App.css";
import { api, type User } from "./api.js";
import { Auth } from "./Auth.js";
import { ensureDeviceKey } from "./deviceKey.js";
import { EmitForm } from "./EmitForm.js";

type Status = "loading" | "auth" | "ready";

export const App = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [devicePublicKey, setDevicePublicKey] = useState("");
  const [error, setError] = useState("");

  const bootSession = async (next: User) => {
    setError("");
    setUser(next);
    try {
      const publicKey = await ensureDeviceKey(next.id, async (pk) => {
        await api.registerDevice({
          publicKey: pk,
          label: navigator.userAgent.slice(0, 80),
        });
      });
      setDevicePublicKey(publicKey);
      setStatus("ready");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el dispositivo",
      );
      setStatus("auth");
      setUser(null);
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
    setDevicePublicKey("");
    setStatus("auth");
  };

  if (status === "loading") {
    return (
      <main className="page">
        <h1>KEEP</h1>
        <p className="subtitle">Cargando…</p>
      </main>
    );
  }

  if (status === "auth" || !user) {
    return (
      <>
        {error && (
          <p className="banner-error">{error}</p>
        )}
        <Auth onAuth={bootSession} />
      </>
    );
  }

  return (
    <EmitForm
      user={user}
      devicePublicKey={devicePublicKey}
      onLogout={onLogout}
    />
  );
};
