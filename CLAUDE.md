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
