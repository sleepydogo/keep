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

Cargar en `.env` dos seeds (hex de 64 chars) fondeadas desde el
[faucet de Preview](https://midnight-tmnight-preview.nethermind.dev/): una para el
emisor y otra para el holder.

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

`contract/src/managed/` es output del compilador y no está versionado: después de
clonar hay que correr `npm run compact` al menos una vez.

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
