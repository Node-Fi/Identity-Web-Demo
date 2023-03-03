import { useChainId, useQuery } from "wagmi";
import { Token } from "@node-fi/token-utils";

const persistedTokens = new Map<number, Token[]>();

export function useTokenList() {
  const chain = useChainId();

  const { data, ...fetchDetails } = useQuery(["tokens", chain], async () => {
    if (persistedTokens.has(chain)) {
      return persistedTokens.get(chain);
    }

    const response = await fetch(
      `https://raw.githubusercontent.com/Node-Fi/node-finance-token-list/main/build/${chain}-tokens.json`
    );
    const _tokens = (await response.json()) as {
      address: string;
      chainId: number;
      name: string;
      symbol: string;
      decimals: number;
      logoURI: string;
    }[];

    const tokens = _tokens.map((token) => {
      return new Token(token);
    });

    persistedTokens.set(chain, tokens);

    return tokens;
  });

  return {
    tokens: data,
    fetchDetails,
  };
}
