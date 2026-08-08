import {
  type CircuitContext,
  CostModel,
  QueryContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import {
  type KeepPrivateState,
  bytesAleatorios,
  clavesEmisor,
  emitir,
  raiz,
  witnesses,
} from "./credencial.js";
import {
  Contract,
  ledger,
  pureCircuits,
} from "./managed/keep/contract/index.js";

const corto = (b: Uint8Array) =>
  [...b.slice(0, 6)].map((x) => x.toString(16).padStart(2, "0")).join("") + "…";

const DIA = 86400n;
const ahora = BigInt(Math.floor(Date.now() / 1000));

const titulo = (t: string) => console.log(`\n─── ${t} ───`);

// 1. Deploy. Un solo contrato para todos los emisores y todas las verificaciones.
const contrato = new Contract<KeepPrivateState>(witnesses);
const emisorSecret = bytesAleatorios(32);
const inicial = contrato.initialState(
  createConstructorContext({ emisorSecret }, "0".repeat(64)),
);
let ctx: CircuitContext<KeepPrivateState> = {
  currentPrivateState: inicial.currentPrivateState,
  currentZswapLocalState: inicial.currentZswapLocalState,
  costModel: CostModel.initialCostModel(),
  currentQueryContext: new QueryContext(
    inicial.currentContractState.data,
    sampleContractAddress(),
  ),
};
const estado = () => ledger(ctx.currentQueryContext.state);

titulo("1. Contrato desplegado");
console.log("emisores:", estado().emisores.size());
console.log("verificaciones:", estado().verificaciones.size());

// 2. El emisor se registra. Su ID sale de su secreto: nadie más puede ocuparlo.
titulo("2. El emisor se registra (transacción)");
const emisor = clavesEmisor(emisorSecret);
const emisorId = pureCircuits.derivarEmisorId(emisorSecret);
console.log("emisorSecret (privado):", corto(emisorSecret));
console.log("emisorId  (público)  :", corto(emisorId));
ctx = contrato.impureCircuits.registrarEmisor(ctx, emisor.pk).context;
for (const [id] of estado().emisores)
  console.log("on-chain  emisores[]  :", corto(id));

// 3. Emisión: NO toca la cadena. El emisor firma y le pasa el archivo al ciudadano.
titulo("3. El emisor emite la credencial (off-chain)");
const holderSecret = bytesAleatorios(32);
const vence = ahora + 90n * DIA;
const credencial = emitir(emisor.sk, pureCircuits.holderIdPublico(holderSecret), vence, [
  111n, // patología
  222n, // médico
  333n, // domicilio de cultivo
]);
console.log(
  "hojas del árbol :",
  credencial.hojas.map((h) => `${h.toString().slice(0, 8)}…`).join(" "),
);
console.log(
  "raíz firmada    :",
  raiz(credencial.hojas).toString().slice(0, 12) + "…",
);
console.log(
  "vence           :",
  new Date(Number(vence) * 1000).toISOString().slice(0, 10),
);
console.log(
  "verificaciones on-chain tras emitir:",
  estado().verificaciones.size(),
  "← la emisión no deja rastro",
);

// 4. El verificador arma el pedido y calcula dónde va a leer la respuesta.
titulo("4. El verificador pide una presentación");
const nonce = bytesAleatorios(32);
const fechaConsulta = ahora;
const idPresentacion = pureCircuits.presentacionId(nonce, fechaConsulta);
console.log("nonce         :", corto(nonce));
console.log(
  "fechaConsulta :",
  new Date(Number(fechaConsulta) * 1000).toISOString().slice(0, 10),
);
console.log("va a leer en  :", corto(idPresentacion));

// 5. El holder prueba en ZK y publica sólo el booleano.
titulo("5. El holder presenta (transacción)");
ctx.currentPrivateState = { holderSecret, credencial };
ctx = contrato.impureCircuits.presentarVigencia(
  ctx,
  emisorId,
  nonce,
  fechaConsulta,
).context;
for (const [id, ok] of estado().verificaciones)
  console.log("on-chain verificaciones[]:", corto(id), "=>", ok);

titulo("6. El verificador lee su resultado");
console.log("¿vigente?", estado().verificaciones.lookup(idPresentacion));

// 7. El mismo flujo con un certificado vencido.
titulo("7. Otro ciudadano, certificado vencido");
const holderSecret2 = bytesAleatorios(32);
const credencial2 = emitir(emisor.sk, pureCircuits.holderIdPublico(holderSecret2), ahora - 10n * DIA, [444n]);
const nonce2 = bytesAleatorios(32);
ctx.currentPrivateState = {
  holderSecret: holderSecret2,
  credencial: credencial2,
};
ctx = contrato.impureCircuits.presentarVigencia(
  ctx,
  emisorId,
  nonce2,
  ahora,
).context;
console.log(
  "¿vigente?",
  estado().verificaciones.lookup(pureCircuits.presentacionId(nonce2, ahora)),
);

titulo("Todo lo que quedó on-chain");
for (const [id] of estado().emisores) console.log("  emisor       ", corto(id));
for (const [id, ok] of estado().verificaciones)
  console.log("  verificación ", corto(id), "=>", ok);
console.log(
  "\nNo está: patología, médico, domicilio, fecha de vencimiento, holderSecret,\n" +
    "ni nada que ate una verificación a una persona.",
);
