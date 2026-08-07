# Contrato KEEP

Contrato Compact + emisión de credenciales off-chain.

## Qué hay

```
src/
├── keep.compact       # ledger y circuitos
├── schnorr.compact    # verificación Schnorr sobre Jubjub, en circuito
├── credencial.ts      # emisor: claves, árbol de atributos, firma + witnesses
├── red.ts             # wallet y providers de Preview (deploy y registrar)
├── deploy.ts          # publica el contrato
├── registrar.ts       # registra el emisor on-chain
├── demo.ts            # el flujo completo en simulador, imprime los datos
└── test/keep.test.ts
```

**Ledger** — todo lo público cabe en dos maps:

```
emisores:       Map<Bytes<32>, JubjubPoint>   emisorId -> clave pública del emisor
verificaciones: Map<Bytes<32>, Boolean>       presentacionId -> resultado
```

**Circuitos** (los dos generan prueba ZK):

| Circuito | Quién lo llama | Qué hace |
| --- | --- | --- |
| `registrarEmisor(pk)` | Emisor, una vez | Publica su clave Schnorr bajo un `emisorId` derivado de su secreto |
| `presentarVigencia(emisorId, nonce, fechaConsulta)` | Holder, en cada verificación | Prueba que tiene credencial vigente de ese emisor y escribe sólo un booleano |

**Pure circuits** — cálculo local, sin transacción. Son la fuente de verdad de todo
el hashing: TypeScript los llama vía `pureCircuits` en vez de replicar el encoding.

| Pure circuit | Para qué |
| --- | --- |
| `derivarEmisorId(secreto)` | Identidad del emisor |
| `claveFirmaEmisor(secreto)` | Su clave de firma Schnorr |
| `presentacionId(nonce, fechaConsulta)` | Clave donde el verificador lee su resultado |
| `hojaVencimiento(fecha)` | Hoja del árbol, atada a su atributo |
| `holderId(holderSecret)` | Identidad del ciudadano |
| `schnorrChallenge(...)` | Mismo hash que usa el circuito al verificar la firma |

## Requisitos

- Node >= 24.11.1
- `compact` 0.5.1 y compilador 0.31.1 (`compact --version`, `compact compile --version`)
- Proof server en `localhost:6300` — sólo para los scripts contra la red

## Ciclo de desarrollo

```bash
npm run compact    # compila; regenera src/managed/keep/
npx vitest         # tests en watch, en otra terminal
```

**Después de tocar un `.compact`, recompilá.** Los tests importan de
`src/managed/keep/contract/index.js`, que es output del compilador: si no recompilás
estás testeando el contrato viejo y nada te avisa. `src/managed/` está versionado
—para que el front no necesite el toolchain—, así que esos artefactos van al commit.

El compilador es callado — silencio es éxito. Mirá el exit code, y **sin pipe**:
`cmd | tail` te devuelve el status del `tail`, no del comando.

Antes de pushear:

```bash
npm run ci   # compact -> typecheck -> lint -> build -> test
```

## Tests

`npm test` corre el simulador: ejecuta la lógica del circuito y valida asserts y
operaciones de ledger, en milisegundos y sin red, proof server ni wallet. Es donde
va el 95% del trabajo.

**No** genera una prueba ZK real ni la manda a ningún lado. Tests verdes no
garantizan que funcione on-chain.

Patrón, en `test/keep.test.ts`: cada llamada devuelve un contexto nuevo que vas
encadenando, y `ledger()` te da el estado público para los asserts. Se cambia
`ctx.currentPrivateState` entre llamadas para modelar los distintos actores. Los
asserts del circuito llegan como excepción con tu mensaje textual:

```ts
expect(() => presentar(nonce, AHORA)).toThrow("Presentacion ya usada");
```

Para ver el flujo entero con los datos impresos:

```bash
npm run demo
```

## Contra la red (Preview)

Las variables salen de `.env` en la raíz del repo.

| Variable | Para qué |
| --- | --- |
| `KEEP_DEPLOY_SEED` | Wallet que paga el deploy y el registro. Con DUST. Si viene de frase BIP39, derivar con PBKDF2 |
| `KEEP_EMISOR_SECRET` | 32 bytes hex. Identidad del emisor, sin fondos |
| `VITE_CONTRACT_ADDRESS` | La devuelve `deploy` |
| `VITE_HOLDER_SEED` | Wallet del ciudadano. **Sin fondos** — de eso se trata |
| `KEEP_CES_URL` | Server de Capacity Exchange. Default `http://localhost:3000` |

```bash
npm run deploy      # publica el contrato, imprime la dirección
npm run registrar   # registra el emisor on-chain
npm run presentar   # emite una credencial y la presenta, patrocinada por CES
```

`registrar` es idempotente: si el `emisorId` ya está, avisa y no manda nada.

`presentar` es el test end-to-end del circuito principal contra la red: emite off-chain,
prueba en ZK contra el proof server local, manda la transacción al Capacity Exchange
para que le ponga el DUST, y lee el resultado del indexer. Necesita el server de CES
levantado. Para que el test valga, `VITE_HOLDER_SEED` tiene que ser una seed **sin
fondear**: si tiene DUST propio no estás probando nada del gasless.

## Trampas conocidas

Todas nos costaron tiempo al menos una vez.

- **`blockTime*` con valores de witness los publica.** Son circuitos impuros y su
  argumento va al transcript público. Por eso la fecha la manda el verificador y
  queda atada a la clave del map vía `presentacionId`.
- **Los witness no están verificados.** Corren en la máquina del usuario y pueden
  devolver cualquier cosa. Todo valor nuevo por witness necesita verificación dentro
  del circuito; hoy eso lo hace la firma Schnorr del emisor.
- **Los hashes de Merkle ya vienen aplicados.** `merkleTreePathRoot` hashea la hoja,
  y `StateBoundedMerkleTree.update` también. Llamar a `leafHash` a mano hashea dos
  veces y el error que ves es *"Firma del emisor invalida"* — apunta al lugar
  equivocado.
- **`schnorrChallenge` está fijo en `Vector<2, Field>`.** Si cambia el largo del
  mensaje firmado, hay que cambiarlo en los dos lados o ninguna firma verifica.
- **`registrarEmisor` no se puede deshacer.** Rechaza re-registrar un `emisorId`, así
  que cambiar el `KEEP_EMISOR_SECRET` después quema ese ID. Registrá con el secreto
  definitivo.
- **No inventar APIs de Compact.** Si no está en
  `docs.midnight.network/compact/standard-library/exports` ni en el ADT de ledger, no
  existe. Hay MCP de Midnight para chequear.
