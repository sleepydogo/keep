# KEEP Protocol

Credenciales verificables con divulgación selectiva sobre Midnight. El emisor firma,
el ciudadano guarda, el verificador valida — y en cada verificación se revela sólo un booleano.

Caso de uso: certificado REPROCANN. El holder prueba que su certificado está vigente
sin revelar patología, médico, domicilio de cultivo, nombre ni DNI.

## Requisitos

- Node.js >= 24.11.1
- Un proof server escuchando en `localhost:6300`. Si no lo tenés:

  ```bash
  docker run -d -p 6300:6300 midnightntwrk/proof-server midnight-proof-server -v
  ```

  Chequear con `curl http://localhost:6300/version` (tarda ~10s en arrancar).
- Toolchain de Compact:

  ```bash
  compact --version          # 0.5.1
  compact compile --version  # 0.31.1
  ```

  Si no coinciden, ver <https://docs.midnight.network/getting-started/installation>.

## Setup

```bash
npm install
cp .env.example .env
```

## Publicar el contrato

Hace falta una wallet con DUST. Conseguirla con el generador oficial, que crea la
seed, te muestra la dirección para el faucet, espera los fondos y registra el NIGHT
para que genere DUST:

```bash
git clone https://github.com/midnightntwrk/midnight-dust-generator
cd midnight-dust-generator && npm install && npm start
```

Si en cambio ya tenés una wallet con tDUST y querés usar su frase de recuperación,
derivá la seed con PBKDF2 como manda BIP39 — hexear la frase como texto deriva otra
wallet, vacía, y sin dar error:

```bash
node -e "console.log(require('crypto').pbkdf2Sync(process.argv[1].normalize('NFKD'),'mnemonic',2048,64,'sha512').toString('hex'))" "palabra1 ... palabra24"
```

Usá la frase de recuperación en un `.env` sólo si esa wallet es exclusivamente de
testnet.

Después, con esa seed en `.env` como `KEEP_DEPLOY_SEED`:

```bash
npm run deploy
```

Devuelve la `KEEP_CONTRACT_ADDRESS`, que va al `.env`. Se hace una sola vez: el
contrato queda publicado y todo el equipo comparte esa dirección.

## Correr

```bash
npm run dev   # ward en :5173 y keep-web en :5174
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta las dos apps en paralelo |
| `npm run compact` | Compila el contrato y regenera `contract/src/managed/` |
| `npm test` | CI del contrato: compact, typecheck, lint, build, tests |

`contract/src/managed/` es output del compilador pero está versionado, así que el
front no necesita el toolchain de Compact. Si tocás un `.compact`, recompilá y
commiteá los artefactos.

## Estructura

```
contract/src/
├── keep.compact       # ledger, registrarEmisor, presentarVigencia
├── schnorr.compact    # verificación de firma Schnorr sobre Jubjub, en circuito
└── credencial.ts      # emisor (claves, árbol, firma) + witnesses
ward/                  # app del ciudadano y del verificador (5173)
keep-web/              # plataforma de la institución que emite (5174)
```

## Red

Todo corre contra **Preview**. Nodo e indexer son públicos; el proof server es local
y obligatorio — no existe uno público, y además recibe los datos privados en claro,
así que nunca hay que apuntar a uno ajeno.

| Servicio | Dónde |
| --- | --- |
| Node RPC | `https://rpc.preview.midnight.network` |
| Indexer | `https://indexer.preview.midnight.network/api/v4/graphql` |
| Proof server | `http://localhost:6300` |
| Faucet | <https://midnight-tmnight-preview.nethermind.dev/> |

Si algo falla de forma rara al firmar o deserializar, mirar la
[matriz de compatibilidad](https://docs.midnight.network/relnotes/support-matrix):
suele ser desajuste entre compilador, runtime y proof server.
