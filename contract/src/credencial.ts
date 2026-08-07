import {
  CompactTypeField,
  CompactTypeMerkleTreePath,
  StateBoundedMerkleTree,
  ecMulGenerator,
  jubjubPointX,
  jubjubPointY,
  type JubjubPoint,
  type MerkleTreePath,
  type WitnessContext,
} from "@midnight-ntwrk/compact-runtime";
import {
  type Ledger,
  type Schnorr_SchnorrSignature,
  pureCircuits,
} from "./managed/keep/contract/index.js";

const ORDEN =
  6554484396890773809930967563523245729705921265872317281365359162392183254199n;
const TWO_248 =
  452312848583266388373324160190187140051835877600158453279131187530910662656n;
const PROFUNDIDAD = 4;

export type Credencial = {
  fechaVencimiento: bigint;
  hojas: bigint[];
  firma: Schnorr_SchnorrSignature;
};

export type KeepPrivateState = {
  emisorSecret?: Uint8Array;
  holderSecret?: Uint8Array;
  credencial?: Credencial;
};

const requerido = <T>(valor: T | undefined, nombre: string): T => {
  if (valor === undefined)
    throw new Error(`Falta ${nombre} en el estado privado`);
  return valor;
};

const alineado = (x: bigint) => ({
  value: CompactTypeField.toValue(x),
  alignment: CompactTypeField.alignment(),
});

const arbol = (hojas: bigint[]) =>
  hojas
    .reduce(
      (t, h, i) => t.update(BigInt(i), alineado(h)),
      new StateBoundedMerkleTree(PROFUNDIDAD),
    )
    .rehash();

export const raiz = (hojas: bigint[]): bigint =>
  CompactTypeField.fromValue(arbol(hojas).root()!.value);

export const camino = (hojas: bigint[], i: number): MerkleTreePath<bigint> =>
  new CompactTypeMerkleTreePath(PROFUNDIDAD, CompactTypeField).fromValue(
    arbol(hojas).pathForLeaf(BigInt(i), alineado(hojas[i])).value,
  );

export const bytesAleatorios = (n: number): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(n));

const aBigInt = (b: Uint8Array): bigint =>
  BigInt("0x" + [...b].map((x) => x.toString(16).padStart(2, "0")).join(""));

const escalarAleatorio = () => aBigInt(bytesAleatorios(32)) % ORDEN;

// La clave de firma sale del mismo secreto que el emisorId: el emisor guarda un
// solo valor y reiniciar el servicio no le cambia la clave.
export const clavesEmisor = (
  emisorSecret: Uint8Array,
): { sk: bigint; pk: JubjubPoint } => {
  const sk = aBigInt(pureCircuits.claveFirmaEmisor(emisorSecret)) % ORDEN;
  return { sk, pk: ecMulGenerator(sk) };
};

const firmar = (sk: bigint, msg: bigint[]): Schnorr_SchnorrSignature => {
  const pk = ecMulGenerator(sk);
  const k = escalarAleatorio();
  const R = ecMulGenerator(k);
  const c =
    pureCircuits.schnorrChallenge(
      jubjubPointX(R),
      jubjubPointY(R),
      jubjubPointX(pk),
      jubjubPointY(pk),
      msg,
    ) % TWO_248;
  return { announcement: R, response: (k + c * sk) % ORDEN };
};

export const emitir = (
  sk: bigint,
  holderSecret: Uint8Array,
  fechaVencimiento: bigint,
  otras: bigint[],
): Credencial => {
  const hojas = [pureCircuits.hojaVencimiento(fechaVencimiento), ...otras];
  return {
    fechaVencimiento,
    hojas,
    firma: firmar(sk, [pureCircuits.holderId(holderSecret), raiz(hojas)]),
  };
};

export const witnesses = {
  getSchnorrReduction: (
    { privateState }: WitnessContext<Ledger, KeepPrivateState>,
    cFull: bigint,
  ): [KeepPrivateState, [bigint, bigint]] => [
    privateState,
    [cFull / TWO_248, cFull % TWO_248],
  ],
  credencial: ({
    privateState,
  }: WitnessContext<Ledger, KeepPrivateState>): [
    KeepPrivateState,
    [bigint, MerkleTreePath<bigint>, Schnorr_SchnorrSignature, Uint8Array],
  ] => {
    const cred = requerido(privateState.credencial, "credencial");
    return [
      privateState,
      [
        cred.fechaVencimiento,
        camino(cred.hojas, 0),
        cred.firma,
        requerido(privateState.holderSecret, "holderSecret"),
      ],
    ];
  },
  emisorSecret: ({
    privateState,
  }: WitnessContext<Ledger, KeepPrivateState>): [
    KeepPrivateState,
    Uint8Array,
  ] => [privateState, requerido(privateState.emisorSecret, "emisorSecret")],
};
