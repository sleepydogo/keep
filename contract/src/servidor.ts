import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { constructJubjubPoint } from "@midnight-ntwrk/compact-runtime";
import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { sponsoredTransactionsWalletProvider } from "@sundaeswap/capacity-exchange-providers";
import { bytesAleatorios, type Credencial } from "./credencial.js";
import { CompiledKeepContract, ledger, pureCircuits } from "./index.js";
import { conectar, env } from "./red.js";

// El puente que el teléfono no puede ser: WARD no bundlea el WASM de Midnight,
// así que la parte de cadena — probar, firmar, leer el ledger — vive acá.
// Las suscripciones WebSocket de la wallet se caen solas; sin esto una promesa
// rechazada afuera de un handler mata el proceso en medio de la demo.
process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));
process.on("uncaughtException", (e) => console.error("uncaughtException", e));

const PUERTO = Number(process.env["KEEP_NODO_PUERTO"] ?? 5176);
// Vacío = la wallet del nodo paga el DUST. Con URL = lo patrocina el CES.
const CES_URL = process.env["KEEP_CES_URL"] ?? "";
const contractAddress = env("VITE_CONTRACT_ADDRESS");

const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
const deHex = (s: string) =>
  Uint8Array.from(s.match(/../g)!.map((h) => parseInt(h, 16)));
const aBig = (s: string) => BigInt("0x" + s);

type PaqueteQr = {
  emisorId: string;
  vence: string;
  hojas: string[];
  firma: [string, string, string];
};

const aCredencial = (p: PaqueteQr): Credencial => ({
  fechaVencimiento: aBig(p.vence),
  hojas: p.hojas.map(aBig),
  firma: {
    announcement: constructJubjubPoint(aBig(p.firma[0]), aBig(p.firma[1])),
    response: aBig(p.firma[2]),
  },
});

// El puerto abre YA. Sincronizar la wallet tarda, y si esperáramos acá el
// puerto no existiría mientras tanto: desde afuera se ve igual que un proceso
// muerto. Las rutas que la necesitan esperan a esta promesa.
let listo = false;
const conexion = conectar({ seedVar: "VITE_HOLDER_SEED", exigirDust: false });
conexion.then(() => {
  listo = true;
  console.log("Wallet sincronizada. Nodo operativo.");
});

const patrocinados = async () => {
  const { providers, estado } = await conexion;
  if (!CES_URL) return providers;
  return {
    ...providers,
    walletProvider: sponsoredTransactionsWalletProvider({
      coinPublicKey: estado.shielded.coinPublicKey.toHexString(),
      encryptionPublicKey: estado.shielded.encryptionPublicKey.toHexString(),
      capacityExchangeUrl: CES_URL,
    }),
  };
};

const estadoLedger = async () => {
  const { providers } = await conexion;
  return ledger(
    (await providers.publicDataProvider.queryContractState(contractAddress))!
      .data,
  );
};

const cuerpo = (req: IncomingMessage) =>
  new Promise<any>((res, rej) => {
    let s = "";
    req.on("data", (c) => (s += c));
    req.on("end", () => {
      try {
        res(JSON.parse(s || "{}"));
      } catch (e) {
        rej(e);
      }
    });
  });

const rutas: Record<string, (req: IncomingMessage, m: string[]) => Promise<unknown>> = {
  "GET /estado": async () => ({ listo, ces: CES_URL || null, contractAddress }),

  // El verificador arma el pedido y se lleva la clave donde va a leer la respuesta.
  "POST /pedido": async (req) => {
    const { emisorId } = await cuerpo(req);
    const nonce = hex(bytesAleatorios(32));
    const fechaConsulta = BigInt(Math.floor(Date.now() / 1000));
    return {
      emisorId,
      nonce,
      fechaConsulta: fechaConsulta.toString(),
      presentacionId: hex(
        pureCircuits.presentacionId(deHex(nonce), fechaConsulta),
      ),
    };
  },

  "GET /emisor/(.+)": async (_req, [id]) => {
    const l = await estadoLedger();
    const registrado = l.emisores.member(deHex(id));
    if (!registrado) return { registrado: false };
    const pk = l.emisores.lookup(deHex(id));
    return { registrado: true, pk: { x: pk.x.toString(), y: pk.y.toString() } };
  },

  // El holder delega la prueba y la transacción. Su holderSecret llega acá:
  // en el diseño real esto pasa en el teléfono.
  "POST /presentar": async (req) => {
    const b = await cuerpo(req);
    const contrato = await findDeployedContract(await patrocinados(), {
      compiledContract: CompiledKeepContract,
      contractAddress,
      privateStateId: `keep-${b.nonce}`,
      initialPrivateState: {
        holderSecret: deHex(b.holderSecret),
        credencial: aCredencial(b.credencial),
      },
    });
    await contrato.callTx.presentarVigencia(
      deHex(b.emisorId),
      deHex(b.nonce),
      BigInt(b.fechaConsulta),
    );
    return { ok: true };
  },

  "GET /verificacion/(.+)": async (_req, [id]) => {
    const l = await estadoLedger();
    const clave = deHex(id);
    if (!l.verificaciones.member(clave)) return { estado: "pendiente" };
    return { estado: l.verificaciones.lookup(clave) ? "vigente" : "no-vigente" };
  },
};

const responder = (res: ServerResponse, codigo: number, datos: unknown) => {
  res.writeHead(codigo, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
  });
  res.end(JSON.stringify(datos));
};

createServer(async (req, res) => {
  if (req.method === "OPTIONS") return responder(res, 204, {});
  const ruta = `${req.method} ${req.url?.split("?")[0]}`;

  for (const [patron, fn] of Object.entries(rutas)) {
    const m = ruta.match(new RegExp(`^${patron}$`));
    if (!m) continue;
    try {
      return responder(res, 200, await fn(req, m.slice(1)));
    } catch (e) {
      console.error(ruta, e);
      return responder(res, 500, {
        error: e instanceof Error ? e.message : "error",
      });
    }
  }
  responder(res, 404, { error: "no existe" });
}).listen(PUERTO, () => {
  console.log(`Nodo KEEP  http://localhost:${PUERTO}  (escuchando ya)`);
  console.log(`Contrato   ${contractAddress}`);
  console.log(`Paga       ${CES_URL || "la wallet del nodo (sin CES)"}`);
  console.log("Sincronizando wallet… GET /estado dice cuándo está lista.");
});

process.on("SIGINT", () => {
  void conexion.then((c) => c.wallet.stop()).finally(() => process.exit(0));
});
