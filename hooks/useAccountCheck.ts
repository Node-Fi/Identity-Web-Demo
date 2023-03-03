import { useBalance } from "wagmi";

export function useAccountCheck(account?: string) {
  const { data, isLoading } = useBalance({
    address: account as `0x${string}`,
  });

  return {
    isLoading,
    hasGas: data?.value.gt(0),
  };
}
