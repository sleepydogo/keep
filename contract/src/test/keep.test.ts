import {
  type CircuitContext,
  CostModel,
  QueryContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import { describe, expect, it } from "vitest";
import {
  type KeepPrivateState,
  bytesAleatorios,
  clavesEmisor,
  emitir,
  witnesses,
} from "../credencial.js";
import { Contract, ledger } from "../managed/keep/contract/index.js";

const DIA = 86400n;
const AHORA = 1786000000n;
const EMISOR_ID = new Uint8Array(32).fill(7);

const escenario = (fechaVencimiento: bigint) => {
  const { sk, pk } = clavesEmisor();
  const holderSecret = bytesAleatorios(32);
  const credencial = emitir(sk, holderSecret, fechaVencimiento, [1n, 2n, 3n]);

  const contrato = new Contract<KeepPrivateState>(witnesses);
  const inicial = contrato.initialState(
    createConstructorContext({ holderSecret, credencial }, "0".repeat(64)),
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
  ctx = contrato.impureCircuits.registrarEmisor(ctx, EMISOR_ID, pk).context;

  const presentar = (nonce: Uint8Array, fechaConsulta: bigint) => {
    ctx = contrato.impureCircuits.presentarVigencia(
      ctx,
      EMISOR_ID,
      nonce,
      fechaConsulta,
    ).context;
    return [...ledger(ctx.currentQueryContext.state).verificaciones];
  };

  return { contrato, presentar, pk };
};

describe("presentarVigencia", () => {
  it("da true con un certificado vigente", () => {
    const { presentar } = escenario(AHORA + 30n * DIA);
    const resultados = presentar(bytesAleatorios(32), AHORA);
    expect(resultados).toHaveLength(1);
    expect(resultados[0][1]).toBe(true);
  });

  it("da false con un certificado vencido", () => {
    const { presentar } = escenario(AHORA - 30n * DIA);
    expect(presentar(bytesAleatorios(32), AHORA)[0][1]).toBe(false);
  });

  it("rechaza la misma presentacion dos veces", () => {
    const { presentar } = escenario(AHORA + 30n * DIA);
    const nonce = bytesAleatorios(32);
    presentar(nonce, AHORA);
    expect(() => presentar(nonce, AHORA)).toThrow("Presentacion ya usada");
  });

  it("rechaza una firma de otro emisor", () => {
    const otro = clavesEmisor();
    const holderSecret = bytesAleatorios(32);
    const credencial = emitir(otro.sk, holderSecret, AHORA + 30n * DIA, [
      1n,
      2n,
      3n,
    ]);
    const contrato = new Contract<KeepPrivateState>(witnesses);
    const inicial = contrato.initialState(
      createConstructorContext({ holderSecret, credencial }, "0".repeat(64)),
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
    ctx = contrato.impureCircuits.registrarEmisor(
      ctx,
      EMISOR_ID,
      clavesEmisor().pk,
    ).context;
    expect(() =>
      contrato.impureCircuits.presentarVigencia(
        ctx,
        EMISOR_ID,
        bytesAleatorios(32),
        AHORA,
      ),
    ).toThrow("Firma del emisor invalida");
  });
});
