# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# KEEP / WARD

## Menos es más

Menos código, menos comentarios, menos abstracción, menos archivos.
Ante dos soluciones que funcionan, va la más corta.
No se agrega nada "por las dudas".

## Alcance

Tres workspaces: `contract/` (Compact), `ward/` (app Expo del holder + verificador,
con toggle de rol) y `keep/` (plataforma de la institución que emite y firma).
Un caso de uso: reprocann, certificacion de portacion de marihuana en argentina regulado por el estado nacional, end-to-end.
Una ruta de verificación: on-chain.
El predicado es la vigencia: el límite de 40 g es tope nacional público, no hay
nada que ocultar ahí.

Ledger completo:

    export ledger emisores: Map<Bytes<32>, JubjubPoint>;
    export ledger verificaciones: Map<Bytes<32>, Boolean>;

Sin revocación: las credenciales son de vida corta.
El Merkle tree de atributos vive en el witness, no en el ledger.

## Comandos

    npm run dev        # ward :5173, keep :5174, su api :5175
    npm test           # CI del contrato: compact + typecheck + lint + build + vitest
    npm run compact    # recompila el .compact y regenera contract/src/managed/

Tests solos, sin el resto del CI: `npm run test -w @keep/contract`, y uno puntual con
`npm run test -w @keep/contract -- -t "vigente"`.
`npm run deploy | registrar | presentar` corren contra Preview y necesitan `.env` +
proof server en `localhost:6300`. `deploy` se hace una sola vez y su salida va al `.env`.

`contract/src/managed/` es output del compilador **pero está versionado**: si tocás un
`.compact`, recompilá y commiteá los artefactos, o el front queda desincronizado.

## Arquitectura

**El único código on-chain son dos circuitos.** La emisión es enteramente off-chain
(nadie puede contar credenciales ni correlacionar emisión con presentación), y la
verificación es una lectura del indexer:

- `registrarEmisor(pk)` — una vez por institución. El `emisorId` se deriva por witness
  de `emisorSecret`, no se pasa como argumento: sólo lo registra quien conoce el secreto.
- `presentarVigencia(emisorId, nonce, fechaConsulta)` — el holder prueba en su proof
  server local y escribe `verificaciones[presentacionId] = vigente`. El verificador
  calculó ese mismo `presentacionId` de antemano y lo lee del indexer. Nada más sale.

**`contract/src/credencial.ts` es la bisagra.** Emisor (claves Schnorr, árbol Merkle,
firma) + los witnesses, todo apoyado en `pureCircuits` del `managed/`. Regla dura:
cualquier hash o derivación que también exista en el circuito se llama desde
`pureCircuits`, nunca se reimplementa en TS — es la razón por la que `presentacionId`,
`claveFirmaEmisor`, `derivarEmisorId`, `hojaVencimiento` y `holderId` son `pure circuit`
exportados.

**`contract/src/red.ts`** arma los providers (Preview, indexer público, proof server
local obligatorio) y `conectar()` deriva la wallet de la seed. `presentar.ts` le pisa el
`walletProvider` con `sponsoredTransactionsWalletProvider` del Capacity Exchange: el
ciudadano no tiene ni necesita DUST, y como todas las presentaciones salen de la misma
dirección patrocinada, no quedan correlacionadas entre sí.

**`keep/`** — Vite + React (`:5174`) sobre un Express con SQLite (`:5175`, proxy
`/api`). Sesión por cookie httpOnly. La identidad Jubjub del emisor vive en IndexedDB
del navegador (`src/deviceKey.ts`) y el server sólo guarda `emisorId` + pk pública.
`midnames.ts` resuelve alias `.night` para elegir destinatario.

**`ward/`** — Expo Router 57. Hoy la UI corre sobre `src/constants/mock-data.ts`, sin
cablear al contrato. Ver `ward/AGENTS.md`: **leer los docs versionados de Expo 57 antes
de escribir código ahí**, la API cambió.

## Cosas que muerden

- `.env` está en la raíz y `keep/vite.config.ts` usa `envDir: ".."`. Todo lo `VITE_*`
  termina en el bundle: sólo valores de testnet y de demo.
- `KEEP_DEPLOY_SEED` es la seed en hex. Si viene de una frase BIP39 hay que derivarla con
  PBKDF2 (ver README) — hexear la frase como texto deriva otra wallet, vacía y sin error.
- Nunca apuntar a un proof server ajeno: recibe los datos privados en claro.
- Nada de `blockTime*` sobre valores de witness: su argumento va al transcript público.
- La firma Schnorr del emisor es estructural. Sin ella el holder se inventa la credencial
  en su propio witness y el circuito la acepta.
- Errores raros al firmar o deserializar suelen ser desajuste compilador / runtime /
  proof server: <https://docs.midnight.network/relnotes/support-matrix>.

## Contexto largo

`context-ia.md` (diseño del protocolo y decisiones), `contrato.md` (secretos y flujos de
datos por rol), `contract/README.md` (changelog con el porqué de cada cambio del
circuito), `ward/docs/CONTEXT.md` (versiones fijadas del toolchain).
