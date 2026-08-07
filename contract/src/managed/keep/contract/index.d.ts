import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Schnorr_SchnorrSignature = { announcement: __compactRuntime.JubjubPoint;
                                         response: bigint
                                       };

export type Witnesses<PS> = {
  getSchnorrReduction(context: __compactRuntime.WitnessContext<Ledger, PS>,
                      challengeHash_0: bigint): [PS, [bigint, bigint]];
  credencial(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, [bigint,
                                                                          { leaf: bigint,
                                                                            path: { sibling: { field: bigint
                                                                                             },
                                                                                    goes_left: boolean
                                                                                  }[]
                                                                          },
                                                                          Schnorr_SchnorrSignature,
                                                                          Uint8Array]];
  emisorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  registrarEmisor(context: __compactRuntime.CircuitContext<PS>,
                  pk_0: __compactRuntime.JubjubPoint): __compactRuntime.CircuitResults<PS, []>;
  presentarVigencia(context: __compactRuntime.CircuitContext<PS>,
                    emisorId_0: Uint8Array,
                    nonce_0: Uint8Array,
                    fechaConsulta_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  registrarEmisor(context: __compactRuntime.CircuitContext<PS>,
                  pk_0: __compactRuntime.JubjubPoint): __compactRuntime.CircuitResults<PS, []>;
  presentarVigencia(context: __compactRuntime.CircuitContext<PS>,
                    emisorId_0: Uint8Array,
                    nonce_0: Uint8Array,
                    fechaConsulta_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  presentacionId(nonce_0: Uint8Array, fechaConsulta_0: bigint): Uint8Array;
  claveFirmaEmisor(secreto_0: Uint8Array): Uint8Array;
  derivarEmisorId(secreto_0: Uint8Array): Uint8Array;
  hojaVencimiento(fechaVencimiento_0: bigint): bigint;
  holderId(holderSecret_0: Uint8Array): bigint;
  schnorrChallenge(ann_x_0: bigint,
                   ann_y_0: bigint,
                   pk_x_0: bigint,
                   pk_y_0: bigint,
                   msg_0: bigint[]): bigint;
}

export type Circuits<PS> = {
  registrarEmisor(context: __compactRuntime.CircuitContext<PS>,
                  pk_0: __compactRuntime.JubjubPoint): __compactRuntime.CircuitResults<PS, []>;
  presentarVigencia(context: __compactRuntime.CircuitContext<PS>,
                    emisorId_0: Uint8Array,
                    nonce_0: Uint8Array,
                    fechaConsulta_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  presentacionId(context: __compactRuntime.CircuitContext<PS>,
                 nonce_0: Uint8Array,
                 fechaConsulta_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  claveFirmaEmisor(context: __compactRuntime.CircuitContext<PS>,
                   secreto_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  derivarEmisorId(context: __compactRuntime.CircuitContext<PS>,
                  secreto_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  hojaVencimiento(context: __compactRuntime.CircuitContext<PS>,
                  fechaVencimiento_0: bigint): __compactRuntime.CircuitResults<PS, bigint>;
  holderId(context: __compactRuntime.CircuitContext<PS>,
           holderSecret_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  schnorrChallenge(context: __compactRuntime.CircuitContext<PS>,
                   ann_x_0: bigint,
                   ann_y_0: bigint,
                   pk_x_0: bigint,
                   pk_y_0: bigint,
                   msg_0: bigint[]): __compactRuntime.CircuitResults<PS, bigint>;
}

export type Ledger = {
  emisores: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): __compactRuntime.JubjubPoint;
    [Symbol.iterator](): Iterator<[Uint8Array, __compactRuntime.JubjubPoint]>
  };
  verificaciones: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
