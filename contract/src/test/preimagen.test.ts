import { degradeToTransient } from "@midnight-ntwrk/compact-runtime";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import { bytesAleatorios } from "../credencial.js";
import { pureCircuits } from "../managed/keep/contract/index.js";

const sha256 = (b: Uint8Array) =>
  new Uint8Array(createHash("sha256").update(b).digest());

const concat = (...xs: Uint8Array[]) =>
  Uint8Array.from(xs.flatMap((x) => [...x]));

const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

// Que la codificacion que hashea persistentHash sea la concatenacion cruda.
// Si esto falla, WARD no puede reproducir el holderId con expo-crypto.
it("holderIdPublico es sha256(\"keep:holder\" || secreto)", () => {
  const secreto = bytesAleatorios(32);
  const dominio = new TextEncoder().encode("keep:holder");
  const esperado = sha256(concat(dominio, secreto));
  const real = pureCircuits.holderIdPublico(secreto);

  console.log("circuito:", hex(real));
  console.log("sha256  :", hex(esperado));
  expect(hex(real)).toBe(hex(esperado));
});

// El emisor sólo recibe el holderIdPublico por QR: tiene que poder llegar al
// mismo Field que el circuito calcula desde el holderSecret.
it("degradeToTransient(holderIdPublico) == holderId", () => {
  const secreto = bytesAleatorios(32);
  expect(degradeToTransient(pureCircuits.holderIdPublico(secreto))).toBe(
    pureCircuits.holderId(secreto),
  );
});
