import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";
import { type KeepPrivateState, witnesses } from "./credencial.js";
import * as Managed from "./managed/keep/contract/index.js";

export * from "./managed/keep/contract/index.js";
export * from "./credencial.js";

export const CompiledKeepContract = CompiledContract.make<
  Managed.Contract<KeepPrivateState>
>("Keep", Managed.Contract<KeepPrivateState>).pipe(
  CompiledContract.withWitnesses(witnesses),
  CompiledContract.withCompiledFileAssets("./managed/keep"),
);
