import { findDeployedContract } from "@midnight-ntwrk/midnight-js-contracts";
import { clavesEmisor } from "./credencial.js";
import { CompiledKeepContract, ledger, pureCircuits } from "./index.js";
import { conectar, env } from "./red.js";

const emisorSecret = Buffer.from(env("KEEP_EMISOR_SECRET"), "hex");
const contractAddress = env("VITE_CONTRACT_ADDRESS");

const emisorId = pureCircuits.derivarEmisorId(emisorSecret);
const { pk } = clavesEmisor(emisorSecret);
const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

console.log("emisorId:", hex(emisorId));

const { wallet, providers } = await conectar();

const contrato = await findDeployedContract(providers, {
  compiledContract: CompiledKeepContract,
  contractAddress,
  privateStateId: "keep",
  initialPrivateState: { emisorSecret },
});

const yaEsta = ledger(
  (await providers.publicDataProvider.queryContractState(contractAddress))!
    .data,
).emisores.member(emisorId);

if (yaEsta) {
  console.log("Ya estaba registrado. Nada que hacer.");
} else {
  console.log("Registrando emisor (esto genera una prueba ZK, tarda)…");
  await contrato.callTx.registrarEmisor(pk);
  console.log("Registrado.");
}

const estado = ledger(
  (await providers.publicDataProvider.queryContractState(contractAddress))!
    .data,
);
console.log("\nEmisores on-chain:");
for (const [id] of estado.emisores) console.log("  ", hex(id));

await wallet.stop();
