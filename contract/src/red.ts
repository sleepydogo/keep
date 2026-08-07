import * as ledger from "@midnight-ntwrk/ledger-v8";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import type {
  MidnightProvider,
  WalletProvider,
} from "@midnight-ntwrk/midnight-js-types";
import {
  DustWallet,
  HDWallet,
  InMemoryTransactionHistoryStorage,
  PublicKey,
  Roles,
  ShieldedWallet,
  UnshieldedWallet,
  WalletEntrySchema,
  WalletFacade,
  createKeystore,
  mergeWalletEntries,
} from "@midnight-ntwrk/wallet-sdk";
import path from "node:path";
import { WebSocket } from "ws";

// El indexer usa suscripciones GraphQL sobre WebSocket, que Node no expone global.
globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket;

export const RED = {
  networkId: "preview",
  indexerHttpUrl: "https://indexer.preview.midnight.network/api/v4/graphql",
  indexerWsUrl: "wss://indexer.preview.midnight.network/api/v4/graphql/ws",
  relayUrl: "wss://rpc.preview.midnight.network",
  proofServer: "http://localhost:6300",
} as const;

export type CircuitoId = "registrarEmisor" | "presentarVigencia";

const TTL = () => new Date(Date.now() + 30 * 60 * 1000);

export const env = (nombre: string): string => {
  const v = process.env[nombre];
  if (!v) throw new Error(`Falta ${nombre} en .env`);
  return v;
};

export const conectar = async (
  opts: { seedVar?: string; exigirDust?: boolean } = {},
) => {
  const { seedVar = "KEEP_DEPLOY_SEED", exigirDust = true } = opts;
  setNetworkId(RED.networkId);

  const hd = HDWallet.fromSeed(Buffer.from(env(seedVar), "hex"));
  if (hd.type !== "seedOk")
    throw new Error(
      "Seed invalida. Si viene de una frase BIP39, derivala con PBKDF2 (ver README), no la pases como texto.",
    );

  const derivadas = hd.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);
  if (derivadas.type !== "keysDerived")
    throw new Error("No se pudieron derivar las claves");
  hd.hdWallet.clear();

  const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(
    derivadas.keys[Roles.Zswap],
  );
  const dustSecretKey = ledger.DustSecretKey.fromSeed(
    derivadas.keys[Roles.Dust],
  );
  const keystore = createKeystore(
    derivadas.keys[Roles.NightExternal],
    RED.networkId,
  );

  const wallet = await WalletFacade.init({
    configuration: {
      networkId: RED.networkId,
      costParameters: { feeBlocksMargin: 5 },
      relayURL: new URL(RED.relayUrl),
      provingServerUrl: new URL(RED.proofServer),
      indexerClientConnection: {
        indexerHttpUrl: RED.indexerHttpUrl,
        indexerWsUrl: RED.indexerWsUrl,
      },
      txHistoryStorage: new InMemoryTransactionHistoryStorage(
        WalletEntrySchema,
        mergeWalletEntries,
      ),
    },
    shielded: (c) => ShieldedWallet(c).startWithSecretKeys(shieldedSecretKeys),
    unshielded: (c) =>
      UnshieldedWallet(c).startWithPublicKey(PublicKey.fromKeyStore(keystore)),
    dust: (c) =>
      DustWallet(c).startWithSecretKey(
        dustSecretKey,
        ledger.LedgerParameters.initialParameters().dust,
      ),
  });
  await wallet.start(shieldedSecretKeys, dustSecretKey);

  console.log("Sincronizando wallet…");
  const estado = await wallet.waitForSyncedState();
  const dust = estado.dust.balance(new Date());
  console.log("DUST disponible:", dust);
  if (exigirDust && dust === 0n) {
    await wallet.stop();
    throw new Error("La wallet no tiene DUST.");
  }

  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => estado.shielded.coinPublicKey.toHexString(),
    getEncryptionPublicKey: () =>
      estado.shielded.encryptionPublicKey.toHexString(),
    balanceTx: (tx, ttl) =>
      wallet
        .balanceUnboundTransaction(
          tx,
          { shieldedSecretKeys, dustSecretKey },
          { ttl: ttl ?? TTL() },
        )
        .then((r) => wallet.signRecipe(r, (p) => keystore.signData(p)))
        .then((r) => wallet.finalizeRecipe(r)),
  };

  const midnightProvider: MidnightProvider = {
    submitTx: (tx) => wallet.submitTransaction(tx),
  };

  const zkConfigProvider = new NodeZkConfigProvider<CircuitoId>(
    path.resolve(import.meta.dirname, "managed", "keep"),
  );

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: "keep-private-state",
      privateStoragePasswordProvider: () =>
        process.env["KEEP_PRIVATE_STATE_PASSWORD"] ??
        "Keep-Local-Dev-Store-2026",
      accountId: keystore.getBech32Address().toString(),
    }),
    publicDataProvider: indexerPublicDataProvider(
      RED.indexerHttpUrl,
      RED.indexerWsUrl,
    ),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(RED.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider,
  };

  return { wallet, providers, estado };
};
