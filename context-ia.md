**Idea:** Plataforma de credenciales verificables donde la entidad que emite una certificación no es la que la valida, y donde el ciudadano revela solo el dato mínimo necesario en cada verificación.

**Nomenclatura:** **KEEP Protocol** (_Keyed Evidence Exchange Platform_) es la plataforma completa: el estándar de credenciales, el flujo de emisión y el protocolo de presentación entre las tres partes. **WARD** (_Wallet for Access Rights and Data_) es la app del ciudadano, donde viven las credenciales. La metáfora es de arquitectura defensiva: el _keep_ es la torre central de un castillo y el _ward_ es el patio amurallado que protege — la wallet vive dentro del protocolo.

#### Roles

- **Emisor** — Universidad, ministerio, institución médica, colegio profesional. Ya es la fuente de verdad del dato. Firma credenciales con su clave privada y publica su clave pública.
- **Holder (ciudadano)** — Recibe la credencial en WARD y la guarda **localmente**. Decide qué revelar en cada presentación.
- **Verificador** — Policía, empleador, comercio. Valida la firma contra la clave pública del emisor. No necesita conexión con el emisor ni base de datos propia.

#### Flujo de emisión

El dato **no** viaja del ciudadano al emisor. El emisor ya lo tiene.

1. El ciudadano tramita el permiso por el canal que ya existe, fuera de la app.
2. El organismo aprueba y **emite** una credencial firmada.
3. El ciudadano la descarga a WARD. Desde ese momento el emisor puede desaparecer: la credencial se verifica offline contra su clave pública.

La credencial es una **afirmación del emisor sobre el ciudadano**, no data del ciudadano enviada para que se la firmen.

#### Problema técnico central: la firma no da divulgación selectiva

Si el emisor firma el payload completo `{nombre, DNI, gramos_permitidos, domicilio_cultivo, cultiva}`, el verificador necesita el payload **entero** para validar la firma. Tachar campos la rompe. Ahí es donde se cae la privacidad.

**Solución (MVP): Merkle tree de atributos.** Se hashea cada campo por separado, el emisor firma únicamente la raíz. El holder revela el campo puntual más su Merkle path, y el verificador reconstruye la raíz y valida la firma sin haber visto los demás campos.

**Extensión (stretch): predicados ZK.** En vez de responder "¿cuántos gramos tenés permitidos?", se responde "¿el límite es ≥ a lo que estoy viendo?". El verificador ingresa la cantidad observada y el holder genera una prueba de `límite ≥ cantidad` sin revelar el límite.

#### Seguridad — los tres agujeros que hay que cubrir

- **Holder binding.** La credencial se ata a una clave del Secure Enclave del dispositivo, con biometría para usarla. Incluye foto u otro dato contrastable con la persona presente. Sin esto, copiar la credencial de un amigo rompe todo el sistema.
- **Frescura / anti-replay.** El verificador envía un **nonce** en cada pedido y el holder lo firma junto con la respuesta. Sin esto, una captura de pantalla alcanza.
- **Revocación.** MVP: **credenciales de vida corta**, re-emitidas automáticamente cada 24–48hs cuando hay conexión. Evita chequear revocación en el momento de la verificación, que es cuando puede no haber señal. En producción: status lists o acumuladores criptográficos — documentar que ambos filtran información y por qué.

#### Stack y alcance

- **Emisor (KEEP Issuer):** página web mínima. Carga/importa registros, firma, entrega la credencial. Lace wallet para la gestión de claves.
- **Holder + Verificador:** **una sola app mobile con toggle de rol**. En modo holder es WARD; en modo verificador, el lector KEEP. Tres piezas separadas es demasiado para el tiempo disponible.

#### Flujo de presentación (doble QR, offline)

1. El verificador elige el atributo a solicitar; la app genera un QR con `{campo_solicitado, nonce}`.
2. El holder lo escanea en WARD y ve exactamente qué se le está pidiendo.
3. Aprueba con biometría. WARD arma la respuesta: valor + Merkle path + firma del emisor + nonce firmado.
4. El holder muestra un QR de vuelta; el verificador lo escanea y valida.

Doble QR en lugar de NFC: el P2P entre iOS y Android es inviable en la práctica, y QR funciona sin conexión — que es justo el escenario que hace atractivo el caso de uso. Referencia de diseño: **ISO 18013-5** (mobile driver's license), que resuelve el mismo problema con engagement por QR.

#### Casos de uso y orden de presentación

1. **Mayoría de edad** — universal, sin ruido político. Abre el pitch.
2. **Título universitario** — muestra el desacople emisor/verificador con claridad.
3. **REPROCANN (Argentina)** — el caso profundo. Emisor: Estado. Verificador: fuerza policial. Holder: ciudadano. El ciudadano prueba que porta dentro de su permiso sin revelar el límite exacto, si cultiva, ni su domicilio de cultivo. Asimetría de poder real y local.

**Límites conocidos:** el sistema protege contra la _recolección_ de datos, no contra la _coerción_. Un policía puede pedir el DNI igual. KEEP elimina la excusa técnica para pedir de más, no la posibilidad de hacerlo.
