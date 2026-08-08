import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

type Props = {
  value: string;
  onChange: (holderId: string) => void;
  valido: boolean;
};

const limpiar = (raw: string) =>
  raw.trim().toLowerCase().replace(/^ward:holder:/, "");

export const HolderIdField = ({ value, onChange, valido }: Props) => {
  const [modo, setModo] = useState<"pegar" | "camara">("pegar");
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (modo !== "camara" || !video.current) return;
    setError("");
    const scanner = new QrScanner(
      video.current,
      (r) => {
        onChange(limpiar(r.data));
        setModo("pegar");
      },
      { highlightScanRegion: true, maxScansPerSecond: 5 },
    );
    scanner.start().catch(() => setError("No se pudo abrir la cámara."));
    return () => scanner.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange es estable
  }, [modo]);

  return (
    <label>
      Código del destinatario
      <div className="toggle">
        <button
          type="button"
          className={modo === "pegar" ? "on" : ""}
          onClick={() => setModo("pegar")}
        >
          Pegar código
        </button>
        <button
          type="button"
          className={modo === "camara" ? "on" : ""}
          onClick={() => setModo("camara")}
        >
          Escanear QR
        </button>
      </div>

      {modo === "pegar" ? (
        <input
          type="text"
          name="holderId"
          placeholder="64 caracteres hex, del QR de WARD"
          value={value}
          onChange={(e) => onChange(limpiar(e.target.value))}
          required
          autoComplete="off"
          spellCheck={false}
        />
      ) : (
        <video ref={video} className="camara" muted playsInline />
      )}

      <span className={valido ? "hint ok" : "hint"}>
        {error ||
          (value === ""
            ? "Pegá el código de WARD o escaneá su QR."
            : valido
              ? "Código válido."
              : "Tiene que ser hexadecimal de 64 caracteres.")}
      </span>
    </label>
  );
};
