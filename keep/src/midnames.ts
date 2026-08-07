import {
  NETWORK_REGISTRY,
  createDefaultProvider,
  resolveDomain,
  type DomainTarget,
} from "@midnames/sdk";

const NETWORK = "preview" as const;

const provider = createDefaultProvider({ networkId: NETWORK });
const { contractAddress } = NETWORK_REGISTRY[NETWORK];

export const normalizarAlias = (raw: string): string => {
  let d = raw.trim().toLowerCase();
  if (d.startsWith("@")) d = d.slice(1);
  if (!d.endsWith(".night")) d = `${d}.night`;
  return d;
};

export type DestinoResuelto = {
  alias: string;
  address: string;
  addressType: DomainTarget["type"];
};

export const resolverDestinatario = async (
  raw: string,
): Promise<DestinoResuelto> => {
  const alias = normalizarAlias(raw);
  const result = await resolveDomain(alias, { provider, contractAddress });
  if (!result.success) {
    throw new Error(result.error.message || `No se pudo resolver ${alias}`);
  }
  return {
    alias,
    address: result.data.address,
    addressType: result.data.type,
  };
};
