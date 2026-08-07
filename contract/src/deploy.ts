import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";
import { CompiledKeepContract } from "./index.js";
import { conectar } from "./red.js";

const { wallet, providers } = await conectar();

console.log("Publicando contrato…");
const desplegado = await deployContract(providers, {
  compiledContract: CompiledKeepContract,
  privateStateId: "keep",
  initialPrivateState: {},
});

console.log(
  "\nVITE_CONTRACT_ADDRESS=" + desplegado.deployTxData.public.contractAddress,
);
await wallet.stop();
