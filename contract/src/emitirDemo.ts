// Emite una credencial firmada por el emisor del .env (el que está on-chain).
// Uso: npm run emitir-demo -w @keep/contract <holderSecretHex> [dias]
import { clavesEmisor, emitir, pureCircuits } from "./credencial.js";

const hexDe = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
const h = (n: bigint) => n.toString(16);

const emisorSecret = Buffer.from(process.env["KEEP_EMISOR_SECRET"]!, "hex");
const holderSecret = Buffer.from(process.argv[2]!, "hex");
const dias = BigInt(process.argv[3] ?? "90");

const vence = BigInt(Math.floor(Date.now() / 1000)) + dias * 86400n;
const c = emitir(
  clavesEmisor(emisorSecret).sk,
  pureCircuits.holderIdPublico(holderSecret),
  vence,
  [111n, 222n, 333n],
);

console.log(
  JSON.stringify({
    v: 1,
    emisorId: hexDe(pureCircuits.derivarEmisorId(emisorSecret)),
    titulo: "REPROCANN",
    vence: h(c.fechaVencimiento),
    hojas: c.hojas.map(h),
    firma: [
      h(c.firma.announcement.x),
      h(c.firma.announcement.y),
      h(c.firma.response),
    ],
  }),
);
