import { useState } from "react";

type Rol = "holder" | "verificador";

export const App = () => {
  const [rol, setRol] = useState<Rol>("holder");

  return (
    <main>
      <h1>WARD</h1>
      <nav>
        {(["holder", "verificador"] as const).map((r) => (
          <button key={r} disabled={r === rol} onClick={() => setRol(r)}>
            {r}
          </button>
        ))}
      </nav>
      <p>{rol}</p>
    </main>
  );
};
