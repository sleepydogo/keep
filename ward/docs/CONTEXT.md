# KEEP Protocol & WARD Wallet — Contexto para agentes de IA

> Documento de contexto para asistentes de IA que trabajen en este proyecto.
> Contrastado contra la documentación oficial de Midnight (vía MCP) el **2026-08-07**.
> Cada afirmación técnica está marcada como **[VERIFICADO]**, **[NO VERIFICADO]** o **[DECISIÓN PENDIENTE]**.
> Si vas a contradecir algo marcado [VERIFICADO], volvé a chequearlo contra la fuente citada antes.

---

## 0. Situación

- **Evento:** Hack Buenos Aires — 7 y 8 de agosto de 2026, presencial, Palermo, 48 horas, pool de USD 10K. Temas: _DApps_ y _Privacy_. **[VERIFICADO]** (midnight.network/hackathon)
- El tiempo real de construcción es de ~48 horas. **Todo el alcance de este documento debe leerse con ese presupuesto.**
- El proyecto arranca **desde cero**. El scaffold recomendado es `create-mn-app` (genera workspaces `contract/` + `ui/` ya cableados) o, si se elige el camino de §3, clonar `midnightntwrk/example-zkloan` como referencia y quedarse con el módulo Schnorr.

### Versiones fijadas del equipo

Estas son las versiones sobre las que está escrito este documento. **Todos los integrantes tienen que estar en las mismas**: un desajuste entre compilador Compact, `ledger-v*` y proof server produce fallos silenciosos o errores de deserialización que cuestan horas de debug.

| Componente                           | Versión                            |
| ------------------------------------ | ---------------------------------- |
| Node.js                              | 22.x o superior                    |
| `compact` CLI                        | 0.5.1                              |
| compilador Compact                   | 0.31.1                             |
| `pragma language_version`            | `0.23`                             |
| `@midnight-ntwrk/midnight-js-*`      | 4.1.1                              |
| `@midnight-ntwrk/dapp-connector-api` | 4.0.1                              |
| `@midnight-ntwrk/ledger-v8`          | 8.1.0                              |
| `@midnight-ntwrk/compact-js`         | 2.5.1                              |
| imagen `midnightntwrk/proof-server`  | fijar una sola para todo el equipo |

Antes de fijar la versión del proof server, **cotejar contra la matriz de compatibilidad oficial**: `docs.midnight.network/relnotes/support-matrix`. Es la fuente de verdad de qué versión de proof server va con qué SDK. Existe también `midnight-doctor` (npm), un CLI que cruza SDK + Docker + config contra esa matriz y detecta desajustes antes de que fallen.

### Setup, igual para todos

1. **Node 22+** (`nvm install 22`).
2. **Toolchain de Compact** — `docs.midnight.network/getting-started/installation`. Verificar con `compact --version` (CLI) y `compact compile --version` (compilador); ambos números tienen que coincidir con la tabla.
3. **Docker** corriendo, para el proof server.
4. **Proof server** en el puerto `6300` — **no cambiar el puerto**, la doc lo indica explícitamente:
   Chequeo rápido: `curl <http://localhost:6300/version`>. **No** agregar un `healthcheck` con curl en un compose: la imagen no trae `curl` y el healthcheck falla aunque el server esté sano.

   ```
   docker run --rm -p 6300:6300 midnightntwrk/proof-server:<VERSION_FIJADA> midnight-proof-server -v
   ```

5. **Wallet en red Preprod**, fondeada desde el faucet de Preprod. Lace requiere apuntar el proof server a `http://localhost:6300` en su configuración. En Brave hay que desactivar Shields para que la DApp alcance el proof server local.
6. Alternativa para desarrollo sin faucet ni extensión: **red local standalone** (nodo + indexer + proof server por Docker compose), patrón `standalone.yml` del ejemplo zk-loan.

Cada integrante corre **su propio proof server local**. Nunca apuntar a uno compartido o remoto: el proof server recibe los datos privados en claro (ver §2.8), y en un proyecto de credenciales eso contradice la premisa del producto.

---

## 1. Qué es el proyecto

Plataforma de credenciales verificables con divulgación selectiva, donde **quien emite la certificación no es quien la valida**, y el ciudadano revela solo el dato mínimo necesario en cada verificación.

- **KEEP Protocol** (_Keyed Evidence Exchange Platform_) — la plataforma completa: estándar de credenciales, flujo de emisión, protocolo de presentación entre las tres partes.
- **WARD** (_Wallet for Access Rights and Data_) — la app del ciudadano donde viven las credenciales.
- Metáfora de arquitectura defensiva: el _keep_ es la torre central del castillo, el _ward_ el patio amurallado que la protege. La wallet vive dentro del protocolo.

### Los tres roles

| Rol             | Quién                                                            | Qué hace                                                                                               |
| --------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Emisor**      | Universidad, ministerio, institución médica, colegio profesional | Ya es la fuente de verdad del dato. Firma credenciales con su clave privada, publica su clave pública. |
| **Holder**      | El ciudadano                                                     | Recibe la credencial en WARD, la guarda **localmente**. Decide qué revelar en cada presentación.       |
| **Verificador** | Policía, empleador, comercio                                     | Valida la firma contra la clave pública del emisor.                                                    |

### Principio de emisión (no negociable)

**El dato no viaja del ciudadano al emisor.** El emisor ya lo tiene.

1. El ciudadano tramita el permiso por el canal que ya existe, fuera de la app.
2. El organismo aprueba y **emite** una credencial firmada.
3. El ciudadano la descarga a WARD.

La credencial es una **afirmación del emisor sobre el ciudadano**, no data del ciudadano enviada para que se la firmen. Cualquier diseño que invierta esto está mal.

### Límite conocido, asumido a propósito

El sistema protege contra la **recolección** de datos, no contra la **coerción**. Un policía puede pedir el DNI igual. KEEP elimina la excusa técnica para pedir de más, no la posibilidad de hacerlo. **Decilo en el pitch**; es más fuerte reconocerlo que dejar que un juez lo encuentre.

---

## 2. Correcciones al diseño original — leer antes de escribir código

Estas son cosas que estaban en el planteo inicial y que **no se sostienen** contra la documentación. Están ordenadas por cuánto rompen si se ignoran.

### 2.1 Compact NO puede verificar ECDSA ni Ed25519 dentro de un circuito **[VERIFICADO]**

La librería estándar de Compact expone solamente operaciones sobre **Jubjub**, la curva interna de Midnight: `ecAdd`, `ecMul`, `ecMulGenerator`, `hashToCurve`, `JubjubPoint`, `jubjubPointX/Y`. No hay primitiva de verificación de firma ECDSA/EdDSA.

- **Consecuencia:** el emisor **debe firmar con Schnorr sobre Jubjub**, no con ECDSA ni Ed25519.
- El patrón exacto está implementado en el tutorial ZK Loan: módulo `schnorr.compact` con `schnorrVerify<#n>(msg, signature, pk)` y una API REST de atestación que firma off-chain con `pureCircuits.schnorrChallenge()` — el mismo hash que usa el circuito, condición necesaria para que la firma verifique adentro.
  Fuente: `docs.midnight.network/tutorials/zk-loan/smart-contract`, `docs.midnight.network/examples/dapps/zkloan`, repo `midnightntwrk/example-zkloan`.
- La doc marca ese módulo como **polyfill temporal**: Midnight está construyendo `jubjubSchnorrVerify` en la stdlib, **pero todavía no shipeó**. **[VERIFICADO]** No lo asumas disponible; copiá el polyfill.
- Existe `verifySignature(vk, data, signature)` en `@midnight-ntwrk/compact-runtime`, pero es una función **TypeScript fuera del circuito**. No sirve para probar nada en ZK.
- El repo `midnight-zk` (Rust/halo2) sí tiene chips de secp256k1, P-256 y Ed25519, e incluso ejemplos de credenciales JWT firmadas con ECDSA (`zk_stdlib/examples/identity/jwt/`). **No es alcanzable desde Compact.** Sirve como referencia conceptual y como cita en el pitch de que "esto escala a JWT/W3C VC reales", no como dependencia.

**Acción:** el emisor KEEP genera y guarda su propio par de claves Jubjub. Se registra su pubkey on-chain. Se copia `schnorr.compact` del ejemplo zk-loan.

### 2.2 Lace no puede firmar las credenciales **[VERIFICADO]**

El plan original decía "Lace wallet para la gestión de claves del emisor". No funciona:

- Lace **no implementa `signData()`** ni `getProvingProvider()`. Su `ConnectedAPI` es parcial.
- Lace para Midnight es una extensión de **Chrome/Edge**, no la app mobile de Lace.
- Lace **no prueba en el navegador**: requiere un proof server local en `localhost:6300`.

Fuente: `docs.midnight.network/sdks/community/wallets/community-wallets-overview`, foro de Midnight.

**Acción:** Lace se usa para _pagar fees y firmar transacciones_ del emisor, nada más. Las claves de firma de credenciales son un par Jubjub propio del servicio emisor (como el `PROVIDER_SECRET_KEY` del ejemplo zk-loan). Si el hackathon exige integración con Lace (el ZK Identity Challenge la exigía explícitamente), usala para conectar wallet + submitir la transacción, que es donde sí sirve.

### 2.3 El Secure Enclave no es la clave que ve el circuito **[VERIFICADO / razonamiento]**

- El Secure Enclave de iOS genera claves **P-256 no exportables**. Compact no puede verificar P-256 en circuito (ver 2.1), y aunque pudiera, la clave no sale del enclave para entrar como witness.
- **Modelo correcto de holder binding:**
  - La credencial incluye un campo `holderId = persistentHash([dom_sep, holderSecret])`, donde `holderSecret` son 32 bytes generados en el dispositivo.
  - `holderSecret` vive en **Keychain (iOS) / Keystore (Android)**, con acceso gateado por biometría.
  - En el circuito, el holder prueba conocimiento de `holderSecret` re-derivando el hash y comparándolo con el `holderId` de la credencial. Es el patrón **"authenticating with hashes"** de la doc: `docs.midnight.network/concepts/how-midnight-works/keeping-data-private#authenticating-with-hashes`.
  - El Secure Enclave/biometría protege el **desbloqueo y el almacenamiento**, y es un requisito de UX y seguridad real — pero **no es la primitiva criptográfica que valida el circuito**. No lo describas como si lo fuera.
- Sumá un dato contrastable con la persona presente (foto). Sin eso, prestar la credencial a un amigo rompe todo el sistema, y ninguna cripto lo arregla.

### 2.4 El "doble QR" no es lo que hace ISO 18013-5 **[VERIFICADO]**

- ISO/IEC 18013-5 (mDL) usa QR o NFC para el **device engagement**, pero la **transferencia de datos va por BLE, NFC o Wi-Fi Aware** — no por un segundo QR.
- La presentación por internet es **ISO/IEC TS 18013-7:2025**, un estándar distinto.
- 18013-5 hace divulgación selectiva con **salted hashed claims** (una lista plana de digests dentro del MSO, firmada con COSE, datos en CBOR), **no con Merkle trees**.

**Acción:** el doble QR sigue siendo la decisión correcta para 48 horas y para offline — el P2P entre iOS y Android es inviable en la práctica. Pero presentalo como _"inspirado en el engagement por QR de ISO 18013-5, simplificado a dos QR porque BLE cross-platform no entra en el alcance"_, no como _"así lo resuelve 18013-5"_. Un juez que conozca el estándar detecta la diferencia y te cuesta credibilidad.

### 2.5 Merkle tree vs. lista plana de hashes salteados **[VERIFICADO / matiz importante]**

El planteo original presenta el Merkle tree como _la_ solución a la divulgación selectiva. Es una buena elección **acá**, pero por una razón distinta a la que dice el planteo:

- El problema real está bien identificado: si el emisor firma el payload completo, tachar campos rompe la firma.
- La solución de la industria (mdoc, SD-JWT) es una **lista plana de digests salteados** firmada. Es más simple y resuelve el mismo problema.
- **El Merkle tree gana acá por un motivo específico:** dentro de un circuito ZK, verificar un Merkle path cuesta **O(log n)** hashes, mientras que re-hashear una lista plana cuesta **O(n)**. Y Compact ya trae `merkleTreePathRoot<#n, T>()` y el tipo `MerkleTreePath<n, T>` en la stdlib.
- Decilo así en el pitch. "Elegimos Merkle porque el path se verifica en log n dentro del circuito" es una respuesta de ingeniero. "Elegimos Merkle porque la firma se rompe" es una respuesta que invita a preguntar por qué no hiciste lo que hace todo el mundo.

**Detalle de implementación crítico:** si construís el árbol de atributos en TypeScript, tenés que replicar **exactamente** el esquema de hashing de Midnight, o `merkleTreePathRoot` va a dar otra raíz:

- hoja: `persistentHash({domain_sep: "mdn:lh", data: leaf})` → `degradeToTransient(...)`
- nodo interno: `transientHash([left, right])`

Existe `merkleTreePathRootNoLeafHash()` si preferís hashear la hoja vos mismo. **[VERIFICADO]** (`midnight-node/static/contracts/simple-merkle-tree`, stdlib exports)

### 2.6 REPROCANN: el límite de gramos es público y fijo **[VERIFICADO]**

Esto rompe el caso de uso estrella tal como estaba planteado.

Datos reales de REPROCANN a 2026:

- Hasta **9 plantas en floración** por paciente.
- Superficie de cultivo autorizada: hasta **6 m² indoor** o **15 m² outdoor**.
- Transporte: hasta **40 g de flores secas** y hasta **6 goteros de 30 ml** de aceite.
- Vigencia del certificado: **3 años**, sin renovación automática.

**Es decir: el límite de porte es un tope nacional uniforme y público, no un cupo personal variable.** El predicado _"probá que tu límite es ≥ a lo que estoy viendo, sin revelar tu límite"_ pierde sentido: el policía ya sabe que el límite es 40 g. No hay nada que ocultar ahí.

**Lo que sí es privado y sí vale la pena proteger en REPROCANN:**

- La **patología** por la que se recetó.
- El **médico** que firmó.
- Si la persona **cultiva** o solo porta.
- El **domicilio de cultivo**.
- Nombre y DNI.

**Reformulación correcta del caso:** el ciudadano prueba _"tengo una autorización REPROCANN vigente emitida por el Estado, y esta credencial está atada a mí"_ — sin revelar patología, médico, si cultiva, domicilio de cultivo, nombre ni DNI. La asimetría de poder sigue siendo real y local, que es lo que hace potente al caso. Solo que el dato a proteger es otro.

Si querés conservar un predicado numérico genuino, la vigencia sirve: _"mi certificado está vigente"_ sin revelar la fecha de emisión ni la de vencimiento.

### 2.7 La tensión central: verificación offline vs. Midnight **[DECISIÓN PENDIENTE — la más importante]**

El planteo original describe un sistema **100% offline**: dos QRs, sin conexión, el verificador valida una firma localmente. **Ese diseño casi no usa Midnight.** En un hackathon de Midnight, eso es un problema de puntaje, no solo estético.

El conflicto es real y concreto:

- Una prueba ZK de Midnight es parte de una **transacción** que se valida contra el **estado del ledger** (raíces de Merkle, sets de nullifiers, claves públicas registradas), consultado vía el **indexer** por GraphQL.
- Generarla requiere un **proof server** (Docker, puerto 6300, compute-intensivo). **[VERIFICADO]**
- Un verificador sin conexión **no puede** consultar el indexer ni correr un proof server ajeno.

**No hay forma de tener las dos cosas completas.** Hay que elegir el corte y ser honesto sobre él. La recomendación abajo (§3) propone un corte concreto de dos modos.

### 2.8 Generación de pruebas en mobile: el punto más frágil del stack **[VERIFICADO]**

| Wallet    | Proving                                                               | Plataforma                                      |
| --------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| **Lace**  | ❌ Requiere proof server local en `:6300`                             | Chrome/Edge                                     |
| **1AM**   | ✅ In-browser WASM (Halo2/BLS12-381), implementa `getProvingProvider` | Chrome/Firefox; iOS+Android en beta             |
| **Kuira** | ✅ On-device, "en segundos"                                           | **Android solamente**, alpha (`v0.1.0-alpha02`) |

- **No hay un camino oficial para generar pruebas ZK de Midnight on-device en iOS.**

#### `mzf11125/midnight-mobile-sdk` — evaluado y **DESCARTADO** **[VERIFICADO — código leído 2026-08-07]**

Aparece en `awesome-dapps` como "React Native SDK con proving mobile". **No sirve.** El README promete iOS+Android con todo tildado; el código dice otra cosa:

- **No genera pruebas on-device.** `src/contracts/ProofProvider.ts` es un cliente HTTP: `generateProof()` hace `POST /prove` a un endpoint remoto. Sin WASM, sin bindings Rust, sin Halo2. El único código nativo (`ios/MidnightMobileSDK.m`, módulo Android) es Keychain/Keystore, biometría y QR.
- **El endpoint que implementa no existe.** Manda JSON `{contractAddress, publicInputs, privateInputs, method}` → espera `{proof, outputs, proofId}`. El proof server real expone `POST /prove-tx` y `POST /prove` con **blobs binarios** (Borsh / `tagged_serialize` de `UnprovenTransaction` / `ProofPreimageVersioned`). No puede hablar con un `midnightntwrk/proof-server` real.
- **`ContractClient.ts` está mockeado:** contiene literalmente `// For now, return a placeholder signature` y `// Generate mock transaction hash`.
- **Peer deps rotos:** `@midnight-ntwrk/http-client-proof-provider` y `@midnight-ntwrk/indexer-public-data-provider` (los reales llevan prefijo `midnight-js-`), `@midnight-ntwrk/zkp` (no existe en la doc), y pide `ledger-v7` cuando este proyecto usa `ledger-v8` 8.1.0.
- **Rompe la premisa de privacidad de KEEP:** delega proving a un servidor remoto mandándole `privateInputs` por HTTP. La doc de Midnight advierte que el proof server recibe datos privados y que solo debe usarse uno local o uno propio sobre canal cifrado. En una wallet de credenciales, ese servidor vería patología, DNI y domicilio de cultivo en claro — exactamente lo que KEEP promete evitar.
- **Estado:** creado 2026-03-29, último push 2026-04-01, 8 commits en 3 días, 2 estrellas, 0 forks, 73 KB, sin licencia en la API de GitHub. El paquete npm se renombró a `@mzf11125/midnight-mobile-sdk`; el `@dedanzi/...` de `awesome-dapps` está desactualizado. Patrón típico de código generado por IA: README exhaustivo, implementación hueca.

Lo único aprovechable son **ideas de UX mobile** (Keychain/Keystore + biometría, deep links, cola offline). Reimplementarlas cuesta menos que pelear con sus dependencias.

- El WASM proving es **significativamente más lento** que un proof server nativo. La doc de Midnight lo dice explícitamente.

**Implicancia para 48 horas:** una app mobile nativa que genere pruebas ZK de Midnight es un riesgo alto. Ver §3 para la alternativa.

### 2.9 Revocación: lo que la doc realmente ofrece

- **MVP propuesto (credenciales de vida corta, re-emitidas cada 24–48h):** es una decisión de diseño válida y defendible. Evita chequear revocación en el momento de la verificación, que es justo cuando puede no haber señal. Mantenerla.
- Ojo con la fricción real: REPROCANN tiene vigencia de 3 años. Re-emitir cada 24–48h es una capa de KEEP encima del certificado estatal, no algo que el Estado haga hoy. Decilo así.
- **On-chain, Midnight da la primitiva exacta:** el patrón **commitment/nullifier**. Commitments en un `HistoricMerkleTree`, nullifiers en un `Set`. `HistoricMerkleTree.checkRoot()` acepta raíces pasadas, lo que evita invalidar pruebas viejas ante cada inserción. **[VERIFICADO]**
- Los separadores de dominio entre commitment y nullifier **deben ser distintos**, o un observador puede linkearlos. **[VERIFICADO]**
- Sobre status lists y acumuladores criptográficos: el planteo pide documentar que ambos filtran información. Es correcto y vale mencionarlo — una status list revela el tamaño de la población y permite correlacionar por índice; un acumulador requiere que el holder obtenga testigos de no-pertenencia actualizados, lo que reintroduce comunicación con el emisor. **[NO VERIFICADO en docs de Midnight]** — es conocimiento general del área, verificalo si lo vas a afirmar con fuerza en el pitch.

### 2.10 Expiración y frescura: qué herramienta para qué

- Compact tiene predicados de block time: `blockTimeLt/Lte/Gt/Gte(time: Uint<64>)`, en segundos desde epoch. **No hay accesor crudo del block time.** **[VERIFICADO]**
- La doc advierte: tratá el gate temporal como preciso **a escala de bloques, no de segundos**, y nunca lo uses como fuente de aleatoriedad. **[VERIFICADO]**
- **Sirve para:** expiración de credenciales validada on-chain.
- **NO sirve para:** el nonce anti-replay del flujo offline entre verificador y holder. Ese nonce es un protocolo de aplicación entre dos dispositivos, sin blockchain de por medio. Sin él, una captura de pantalla alcanza — mantenelo.

---

## 3. Arquitectura recomendada

Propuesta concreta para resolver §2.7 en 48 horas. **[DECISIÓN PENDIENTE — validar con el equipo antes de codear]**

### Dos modos de verificación, explícitos en la UI

**Modo A — Verificación on-chain (el que demostrás en el pitch).**
El verificador tiene conexión. La presentación genera una transacción Midnight cuyo circuito prueba todo en ZK y escribe al ledger únicamente un booleano de resultado + el nonce. Este es el modo que usa Midnight de verdad y el que se lucen en la demo.

**Modo B — Verificación offline degradada (el que justifica el caso de uso).**
Sin conexión, el verificador valida localmente la firma Schnorr del emisor contra una pubkey cacheada y el Merkle path del atributo revelado. **No** valida revocación ni frescura de la raíz. Es estrictamente más débil, y la UI **tiene que decirlo**: "verificado offline — sin chequeo de revocación".

Mostrar los dos modos y ser explícito sobre qué garantiza cada uno es más fuerte que fingir que uno solo hace todo.

### Qué vive on-chain (Compact)

```
// Bosquejo conceptual — NO compilado. Verificar sintaxis contra el compilador 0.31.1.
pragma language_version 0.23;
import CompactStandardLibrary;

// Registro de emisores: quién puede emitir credenciales KEEP.
export ledger emisores: Map<Bytes<32>, JubjubPoint>;   // issuerId -> pubkey Schnorr

// Credenciales emitidas (commitments) y revocadas (nullifiers).
export ledger credenciales: HistoricMerkleTree<10, Bytes<32>>;
export ledger revocadas: Set<Bytes<32>>;

// Resultado público de cada verificación: solo el booleano y el nonce.
export ledger verificaciones: Map<Bytes<32>, Boolean>;  // nonce -> resultado
```

### Qué vive off-chain (witness, nunca sale del dispositivo)

- Los atributos de la credencial en claro.
- El `MerkleTreePath` del atributo consultado.
- La firma Schnorr del emisor sobre la raíz de la credencial.
- El `holderSecret` de 32 bytes.

### El circuito de presentación, en orden

1. Traer del witness: atributos + Merkle path + firma del emisor + `holderSecret`.
2. Reconstruir la raíz de la credencial con `merkleTreePathRoot<#n, T>(path)`.
3. Buscar la pubkey del emisor en `emisores` (estado público del ledger).
4. `schnorrVerify(raiz, firma, pubkeyEmisor)` — prueba que el emisor firmó esta credencial.
5. Holder binding: `assert(persistentHash([dom, holderSecret]) == holderIdEnCredencial)`.
6. Anti-replay: derivar nullifier del nonce del verificador, `assert(!revocadas.member(nul))`.
7. Evaluar el predicado (edad ≥ 18 / título == X / REPROCANN vigente).
8. `disclose()` **únicamente** el booleano de resultado y el nonce. Nada más cruza la frontera.

**Regla de oro de Compact:** `disclose()` no publica nada por sí mismo. Es una anotación de compilación. Un valor se vuelve público solo cuando cruza una frontera de visibilidad: escritura al ledger, retorno de un circuito exportado, o llamada a otro contrato. El compilador rechaza cualquier valor derivado de witness que cruce sin `disclose()`. **[VERIFICADO]**

### El punto de ataque que el compilador NO cubre

> "Las implementaciones de witness corren fuera de los circuitos ZK y **no están verificadas criptográficamente**. Cada usuario provee su propia implementación de witness, así que la lógica del contrato nunca debe confiar en valores de witness sin validarlos." **[VERIFICADO — doc de smart contract security]**

Por eso la firma Schnorr del emisor es **estructuralmente indispensable**, no un extra de seguridad. Sin ella, el holder inventa cualquier credencial en su propio witness y el circuito la acepta. Es el mismo argumento que hace el tutorial zk-loan con el credit score.

Corolario relacionado: **nunca uses `ownPublicKey()` para verificar quién llama a un circuito.** Técnicamente es una witness function y cualquier frontend puede devolver lo que quiera. **[VERIFICADO]**

### Sobre el alcance mobile

Dado §2.8, para 48 horas la opción de menor riesgo es **una sola app web responsive con toggle de rol** (holder / verificador), servida a los dos teléfonos, con el doble QR entre pestañas o dispositivos. Se ve igual de bien en la demo, elimina el riesgo de proving en iOS, y te deja usar 1AM (proving in-browser) o Lace + proof server local.

Si el equipo insiste en nativo, **Android + Kuira** es el único camino con proving on-device documentado, y está en alpha.

---

## 4. Orden de casos de uso para el pitch

1. **Mayoría de edad** — universal, sin ruido político. Abre el pitch. Es además el caso canónico en la doc de Midnight ("probar que un atributo está en un rango sin revelar su valor exacto"), lo que juega a favor.
2. **Título universitario** — muestra el desacople emisor/verificador con claridad total.
3. **REPROCANN** — el caso profundo, con la reformulación de §2.6. Emisor: Estado. Verificador: fuerza policial. Holder: ciudadano. Asimetría de poder real y local.

Cerrá con el límite conocido de §1 (coerción ≠ recolección). Es un cierre honesto y fuerte.

---

## 5. Referencias verificadas

**Núcleo Midnight**

- `docs.midnight.network/what-is-midnight` — estado público/privado, flujo de transacción
- `docs.midnight.network/concepts/how-midnight-works/keeping-data-private` — hashes, commitments, Merkle trees, patrón commitment/nullifier
- `docs.midnight.network/compact/reference/explicit-disclosure` — semántica de `disclose()`
- `docs.midnight.network/compact/smart-contract-security` — witnesses no verificados, `ownPublicKey()`, campos `sealed`
- `docs.midnight.network/guides/security-best-practices` — anti-replay con nullifiers, deadlines con block time
- `docs.midnight.network/compact/standard-library/exports` — `merkleTreePathRoot`, `MerkleTreePath`, hashes, EC, block time
- `docs.midnight.network/compact/reference/ledger-adt` — `MerkleTree`, `HistoricMerkleTree`, `Map`, `Set`, `Counter`

**El ejemplo más cercano a KEEP — leerlo entero**

- `docs.midnight.network/tutorials/zk-loan/smart-contract` — módulo `schnorr.compact`
- `docs.midnight.network/tutorials/zk-loan/attestation-api` — API que firma off-chain, flujo end-to-end
- `docs.midnight.network/examples/dapps/zkloan` — repo `midnightntwrk/example-zkloan`

**Wallets y proving**

- `docs.midnight.network/sdks/community/wallets/community-wallets-overview` — matriz de wallets, proving, limitaciones de Lace
- `docs.midnight.network/guides/run-proof-server` — proof server en Docker, puerto 6300

**Prior art del ecosistema (mirar antes de reinventar)**

- `github.com/midnightntwrk/midnight-awesome-dapps` — sección _Identity & Privacy_
- **Credence** — atestaciones vía Merkle-tree commitments + nullifiers. Es lo más parecido a KEEP que ya existe.
- **Proof-of-Age Gate** (`tomiin/midnight-proof-of-age`) — divulgación selectiva de edad en Compact + React + 1AM
- `midnight-zk/zk_stdlib/examples/identity/jwt/` — credenciales JWT/W3C VC con ECDSA en circuito (Rust, no Compact)

**Externas**

- ISO/IEC 18013-5 (mDL) y TS 18013-7:2025 — engagement, mdoc/CBOR/COSE, salted hashed claims
- REPROCANN: `argentina.gob.ar/salud/cannabis-medicinal/reprocann`

---

## 6. Reglas para el agente

1. **No inventes APIs de Compact.** Si no está en `docs.midnight.network/compact/standard-library/exports` o en el ADT de ledger, no existe. Verificá con el MCP de Midnight antes de usar una función.
2. **Compilá seguido.** `cd contract && npm run compact`. El compilador de Compact es estricto (tipado fuerte, sin recursión, tamaños fijos en compilación, bucles acotados) y falla temprano. Los errores de `disclose()` son informativos: leelos enteros.
3. **Empezá desde un scaffold que ya compile**, no desde un `package.json` vacío. Poné a andar el pipeline completo (witness → circuito → prueba → ledger → indexer → UI) con un circuito trivial **antes** de escribir la lógica de KEEP. Descubrir a las 12 horas que el proof server no responde es cómo se pierde el hackathon.
4. **Distinguí siempre** lo que corre en circuito (Compact, probado en ZK) de lo que corre en el host (TypeScript, sin garantías). El error de diseño más caro es confiar en un witness.
5. **No afirmes garantías de privacidad que el código no da.** Si el modo offline no chequea revocación, la UI lo dice y el pitch lo dice.
6. Todo texto de UI y de pitch va en **español rioplatense**. Para código e identificadores, elegir **un** idioma al inicio y no mezclarlo; los nombres de dominio del protocolo (`emisor`, `holder`, `verificador`, `credencial`, `presentacion`) conviene mantenerlos consistentes con el pitch.
7. Cuando dudes entre alcance y solidez con el reloj corriendo: **una cosa que funciona end-to-end supera a tres a medio hacer.** El flujo de mayoría de edad completo (emitir → guardar → pedir → aprobar con biometría → verificar) vale más que tres casos de uso mockeados.
