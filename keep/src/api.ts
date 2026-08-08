export type User = {
  id: string;
  username: string;
  orgId: string;
  orgName: string;
};

export type Credential = {
  id: string;
  alias: string;
  titulo: string;
  tipo: string;
  expiraEl: string | null;
  createdAt: string;
};

type ApiError = { error: string };

const request = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const data = (await res.json().catch(() => ({}))) as T & ApiError;
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
};

export const api = {
  me: () => request<{ user: User }>("/api/me"),
  register: (body: {
    orgName: string;
    username: string;
    password: string;
  }) => request<{ user: User }>("/api/register", {
    method: "POST",
    body: JSON.stringify(body),
  }),
  login: (body: { username: string; password: string }) =>
    request<{ user: User }>("/api/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () =>
    request<{ ok: boolean }>("/api/logout", { method: "POST" }),
  registerDevice: (body: {
    emisorId: string;
    pk: { x: string; y: string };
    label?: string;
  }) =>
    request<{ device: { id: string; status: string } }>("/api/devices", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  emitCredential: (body: {
    alias: string;
    destinatario: string;
    addressType: string;
    tipo: string;
    titulo: string;
    descripcion: string;
    expiraEl: string | null;
    diasValidez: number | null;
    emisorId: string;
    pk: { x: string; y: string };
  }) => request<{ credential: Credential }>("/api/credentials", {
    method: "POST",
    body: JSON.stringify(body),
  }),
};
