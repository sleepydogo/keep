# Changelog — contrato

Decisiones de diseño, no commits. Un párrafo por cambio.

## Sin publicar

**La clave de firma del emisor se deriva de su secreto.** `clavesEmisor()` generaba
una clave Schnorr al azar en cada llamada: servía para tests, pero en producción
significaba que reiniciar el servicio cambiaba la clave, y como `registrarEmisor`
rechaza re-registrar un ID, el `emisorId` quedaba inservible sin vuelta atrás. Ahora
`clavesEmisor(emisorSecret)` la deriva vía el `pure circuit` `claveFirmaEmisor`, así
que el emisor guarda un solo secreto y de ahí salen determinísticamente su `emisorId`
y su clave de firma.

**`presentacionId` expuesto como `pure circuit`.** La clave de `verificaciones` es
`hash("keep:present", nonce, fechaConsulta)` y estaba enterrada dentro del circuito, así
que el verificador no tenía forma de calcularla para ir a leer su resultado. Ahora es un
`pure circuit` exportado y lo usan tanto el circuito como TypeScript, con lo cual no hay
riesgo de que las dos implementaciones se separen.

**`emisorId` derivado de un secreto.** `registrarEmisor` ya no lo recibe como
argumento: lo deriva de `emisorSecret` por witness. Antes cualquiera podía ocupar el ID
de una institución real; ahora sólo lo registra quien conoce el secreto. Descartamos un
`contractAdmin` porque costaba un tercer campo en el ledger. `KeepPrivateState` pasa a
campos opcionales: el emisor tiene `emisorSecret`, el holder `holderSecret` + `credencial`.

## Estado inicial

Dos circuitos —`registrarEmisor(pk)` y `presentarVigencia(emisorId, nonce, fechaConsulta)`—
sobre `emisores: Map<Bytes<32>, JubjubPoint>` y `verificaciones: Map<Bytes<32>, Boolean>`.
La emisión es enteramente off-chain, así que nadie puede contar credenciales ni
correlacionar una emisión con una presentación. Sin revocación: son de vida corta. El
predicado es la vigencia, porque el tope de 40 g de REPROCANN es público y no hay nada que
ocultar ahí. El Merkle vive en el witness, con la hoja atada a su atributo por hash de
dominio. Nada de `blockTime*` sobre valores de witness: su argumento va al transcript
público. Y la firma Schnorr del emisor es estructural — sin ella el holder se inventa la
credencial en su propio witness y el circuito la acepta.
