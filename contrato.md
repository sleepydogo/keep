Contrato keep.compact: \* Mantiene todos los emisores y todas las verificaciones.

EMISOR ----------------------------------------------------
Se registra con registrarEmisor(pk), escribe su pk en el map emisores. El emisorId sale de hashear el secreto del emisor, los cuales son 32 bytes aleatorios

Secretos:
_ emisorSecret: su identidad (hasheado da el emisorId, la clave del map emisores)
_ sk de Jubjub: su clave de firma, con la que firma credenciales y cuya pública va on-chain. Si pierde el emisorSecret no puede volver a probar que ese emisorId es suyo; si le roban el sk, el ladrón puede emitir credenciales falsas a su nombre.
En producción ese secreto viviría en un HSM o un KMS (investigar que son) del organismo; para la demo alcanza con generarlo y ponerlo en el .env.

HOLDER ----------------------------------------------------
Secretos: 1. WARD genera tu holderSecret — 32 bytes aleatorios, guardados en el dispositivo (Keychain/Keystore, con biometría). De ahí deriva tu holderId = hash("keep:holder", holderSecret). Ese holderId es tu identificador ante los emisores, y es lo único tuyo que sale de la app. 2. Tu wallet es otra cosa. Igual que el emisor, vos manejás dos secretos: la seed de la wallet, que paga la fee de la transacción cuando presentás, y el holderSecret, que es tu identidad en las credenciales. No están relacionados.

VERIFIER -------------------------------------------------
no tiene ningún secreto, ni wallet, ni siquiera necesita pagar nada. Solo lee.
Lo único que maneja es un nonce: 32 bytes aleatorios que genera en el momento y descarta después. No es un secreto —se lo entrega al holder— sino un valor impredecible de un solo uso, que existe para que una captura de pantalla de una presentación vieja no sirva.

FLUJOS DE DATOS -------------------------------------------

Cómo recibís la certificación: 1. Hacés el trámite REPROCANN por el canal que ya existe 2. Cuando te aprueban, le das tu holderId al organismo. En la demo: WARD lo muestra como QR y keep-web lo escanea. 3. El emisor arma el árbol con tus atributos, y firma [holderId, raíz] con su clave Jubjub. Tu holderId va adentro del mensaje firmado 4. keep-web te devuelve la credencial firmada, también por QR. 5. WARD la guarda local. Fin. La cadena no se enteró de nada.

Como valido una certificacion: 1. En WARD, en modo verificador, se genera nonce + fechaConsulta (ahora) y calcula presentacionId = hash("keep:present", nonce, fechaConsulta).
Se anota esa clave: es dónde va a ir a buscar la respuesta. 2. Muestra un QR con {emisorId, nonce, fechaConsulta}. El emisorId es el del organismo en el que él decide confiar. 3. El holder lo escanea. Su WARD arma la prueba ZK contra el proof server local y manda la transacción. 4. La transacción escribe verificaciones[presentacionId] = true|false y nada más. 5. El verificador consulta el indexer por su presentacionId y lee el booleano. Si no aparece en unos segundos, es que no.

Setup, una sola vez por institución: 1. El emisor genera su emisorSecret y corre registrarEmisor(pk) desde keep-web. 2. keep-web muestra el emisorId resultante (derivarEmisorId(emisorSecret)). 3. Ese ID entra al catálogo de WARD como una constante, junto al nombre legible: { nombre: "REPROCANN — Ministerio de Salud", id: "04950d…" }. 4. Se compila y distribuye WARD con ese catálogo adentro.

En el momento de verificar, el policía: 1. Abre WARD y pone el toggle en verificador. 2. Ve un desplegable con nombres, no con IDs: "REPROCANN — Ministerio de Salud". 3. Elige la institución. La app toma el emisorId del catálogo. 4. La app hace emisores.lookup(emisorId) contra el indexer y muestra registrado ✓ con la clave pública que trajo. Si no está, avisa y no deja seguir. 5. Genera nonce (32 bytes) y fechaConsulta (ahora), y calcula presentacionId = hash("keep:present", nonce, fechaConsulta). 6. Muestra el QR con {emisorId, nonce, fechaConsulta}. 7. El ciudadano escanea, prueba y manda la transacción. 8. La app consulta el indexer por presentacionId hasta que aparezca, y muestra vigente / no vigente. Timeout es no.
