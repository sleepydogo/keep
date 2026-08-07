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
import {
  Contract,
  ledger,
  pureCircuits,
} from "../managed/keep/contract/index.js";

const DIA = 86400n;
const AHORA = 1786000000n;

const escenario = (fechaVencimiento: bigint, skDeLaFirma?: bigint) => {
  const emisorSecret = bytesAleatorios(32);
  const emisor = clavesEmisor(emisorSecret);
  const emisorId = pureCircuits.derivarEmisorId(emisorSecret);
  const holderSecret = bytesAleatorios(32);
  const credencial = emitir(
    skDeLaFirma ?? emisor.sk,
    holderSecret,
    fechaVencimiento,
    [1n, 2n, 3n],
  );

  const contrato = new Contract<KeepPrivateState>(witnesses);
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

  const registrar = () => {
    ctx = contrato.impureCircuits.registrarEmisor(ctx, emisor.pk).context;
  };
  registrar();

  ctx.currentPrivateState = { holderSecret, credencial };

  const presentar = (
    nonce: Uint8Array,
    fechaConsulta: bigint,
    id: Uint8Array = emisorId,
  ) => {
    ctx = contrato.impureCircuits.presentarVigencia(
      ctx,
      id,
      nonce,
      fechaConsulta,
    ).context;
    return [...ledger(ctx.currentQueryContext.state).verificaciones];
  };

  const volverAEmisor = () => {
    ctx.currentPrivateState = { emisorSecret };
  };

  return { presentar, registrar, volverAEmisor, emisorId };
};

describe("registrarEmisor", () => {
  it("deriva el emisorId del secreto del emisor", () => {
    const secreto = bytesAleatorios(32);
    expect(pureCircuits.derivarEmisorId(secreto)).toEqual(
      pureCircuits.derivarEmisorId(secreto),
    );
    expect(pureCircuits.derivarEmisorId(secreto)).not.toEqual(
      pureCircuits.derivarEmisorId(bytesAleatorios(32)),
    );
  });

  it("rechaza registrar dos veces el mismo secreto", () => {
    const { registrar, volverAEmisor } = escenario(AHORA + 30n * DIA);
    volverAEmisor();
    expect(() => registrar()).toThrow("Emisor ya registrado");
  });
});

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

  it("rechaza un emisor no registrado", () => {
    const { presentar } = escenario(AHORA + 30n * DIA);
    expect(() =>
      presentar(bytesAleatorios(32), AHORA, bytesAleatorios(32)),
    ).toThrow("Emisor no registrado");
  });

  it("rechaza una firma de otro emisor", () => {
    const { presentar } = escenario(
      AHORA + 30n * DIA,
      clavesEmisor(bytesAleatorios(32)).sk,
    );
    expect(() => presentar(bytesAleatorios(32), AHORA)).toThrow(
      "Firma del emisor invalida",
    );
  });
});
