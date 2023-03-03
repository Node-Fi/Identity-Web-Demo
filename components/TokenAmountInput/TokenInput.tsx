import { Group, NumberInput, Slider, Stack } from "@mantine/core";
import { Token } from "@node-fi/token-utils";
import TokenSelector from "./TokenSelector";
import { useAccount, useBalance } from "wagmi";

interface TokenInputProps {
  token?: Token;
  onTokenChange?: (token: Token) => void;
  value?: number;
  onChange?: (value: number) => void;
}

// Token Input should look like CashApp number input
// It should primarily use mantine components
export function TokenInput({
  token,
  onTokenChange,
  value,
  onChange,
}: {
  token?: Token;
  onTokenChange?: (token: Token) => void;
  value?: number;
  onChange?: (value: number) => void;
}) {
  const account = useAccount();
  const { data } = useBalance({
    address: account?.address,
    token: token?.address as `0x${string}`,
  });
  return (
    <Stack spacing="lg">
      <Group position="apart">
        <NumberInput
          placeholder="0.00"
          onChange={onChange}
          value={value}
          max={parseFloat(data?.formatted ?? "0")}
          min={0}
          w="50%"
          precision={4}
          removeTrailingZeros
        />
        <TokenSelector selectedToken={token} onSelect={onTokenChange} />
      </Group>
      {data?.value.gt(0) && token && (
        <Slider
          value={value}
          onChange={(value) => onChange?.(value)}
          min={0}
          max={parseFloat(data?.formatted ?? "0")}
          step={0.001}
          marks={[
            { value: 0, label: "0" },
            {
              value: parseFloat(data?.formatted ?? "0"),
              label: parseFloat(data?.formatted ?? "0").toPrecision(4),
            },
          ]}
          mb="xl"
        />
      )}
    </Stack>
  );
}
