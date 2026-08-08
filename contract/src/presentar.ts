import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { sponsoredTransactionsWalletProvider } from "@sundaeswap/capacity-exchange-providers";
import { bytesAleatorios, clavesEmisor, emitir } from "./credencial.js";
import { CompiledKeepContract, ledger, pureCircuits } from "./index.js";
import { conectar, env } from "./red.js";

const CES_URL = process.env["KEEP_CES_URL"] ?? "http://localhost:3000";
const DIA = 86400n;

const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

const emisorSecret = Buffer.from(env("KEEP_EMISOR_SECRET"), "hex");
const contractAddress = env("VITE_CONTRACT_ADDRESS");
const emisorId = pureCircuits.derivarEmisorId(emisorSecret);

// El emisor emite off-chain: arma el arbol, firma la raiz. La cadena no se entera.
const holderSecret = bytesAleatorios(32);
const ahora = BigInt(Math.floor(Date.now() / 1000));
const credencial = emitir(
  clavesEmisor(emisorSecret).sk,
  pureCircuits.holderIdPublico(holderSecret),
  ahora + 90n * DIA,
  [111n, 222n, 333n],
);

// El ciudadano: su wallet no tiene DUST y no lo necesita.
const { wallet, providers, estado } = await conectar({
  seedVar: "VITE_HOLDER_SEED",
  exigirDust: false,
});

const providersPatrocinados = {
  ...providers,
  walletProvider: sponsoredTransactionsWalletProvider({
    coinPublicKey: estado.shielded.coinPublicKey.toHexString(),
    encryptionPublicKey: estado.shielded.encryptionPublicKey.toHexString(),
    capacityExchangeUrl: CES_URL,
  }),
};

const contrato = await findDeployedContract(providersPatrocinados, {
  compiledContract: CompiledKeepContract,
  contractAddress,
  privateStateId: "keep",
  initialPrivateState: { holderSecret, credencial },
});

// El verificador arma el pedido y se anota donde va a leer la respuesta.
const nonce = bytesAleatorios(32);
const fechaConsulta = ahora;
const idPresentacion = pureCircuits.presentacionId(nonce, fechaConsulta);

console.log("emisorId       :", hex(emisorId));
console.log("presentacionId :", hex(idPresentacion));
console.log("\nProbando y presentando (patrocinado por CES)…");

await contrato.callTx.presentarVigencia(emisorId, nonce, fechaConsulta);

const estadoLedger = ledger(
  (await providers.publicDataProvider.queryContractState(contractAddress))!
    .data,
);
console.log("\n¿vigente?", estadoLedger.verificaciones.lookup(idPresentacion));
console.log("verificaciones on-chain:", estadoLedger.verificaciones.size());

await wallet.stop();
