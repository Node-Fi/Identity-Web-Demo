import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Image,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useAccountCheck } from "../../hooks/useAccountCheck";
import {
  erc20ABI,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { Token, TokenAmount } from "@node-fi/token-utils";
import { TokenInput } from "../TokenAmountInput/TokenInput";
import { tokenInterface } from "@node-fi/multicall";
import {
  IconAlertCircle,
  IconCheck,
  IconDiscountCheckFilled,
  IconMoneybag,
  IconStatusChange,
  IconUser,
} from "@tabler/icons-react";
import { shortenAddress } from "../../utils/shortenAddress";
import { BigNumber } from "ethers";
import { StatRow } from "../StatRow/StatRow";

export function SendTokensModal({ recipient }: { recipient?: string }) {
  const { hasGas, isLoading } = useAccountCheck(recipient);
  const chainInfo = useNetwork();

  const [token, setToken] = useState<Token>();
  const [amount, setAmount] = useState<number>();
  const [success, setSuccess] = useState(false);
  const [hideAlert, setHideAlert] = useState(false);

  const tokenAmount = useMemo(
    () =>
      token && amount
        ? TokenAmount.parseAmount(token, amount.toString())
        : undefined,
    [token, amount]
  );
  const { config } = usePrepareContractWrite({
    address: token?.address as `0x${string}`,
    abi: erc20ABI,
    functionName: "transfer",
    args: tokenAmount
      ? [
          recipient as `0x${string}`,
          tokenAmount?.raw.toString() as unknown as BigNumber,
        ]
      : undefined,
  });

  const {
    write,
    isLoading: txnLoading,
    isSuccess,
    data,
  } = useContractWrite(config);

  useEffect(() => {
    if (data) {
      data.wait().then(() => {
        setSuccess(true);
      });
    }
  }, [data]);

  return txnLoading || isSuccess ? (
    <Stack align="center">
      {isSuccess ? (
        <>
          <Loader size="xl" />
          <Text>Processing Transaction...</Text>{" "}
        </>
      ) : (
        <Text>Confirm in your wallet</Text>
      )}

      <StatRow
        Icon={IconUser}
        name="Recipient"
        value={shortenAddress(recipient as string)}
      />
      <StatRow
        Icon={() => (
          <Image
            alt=""
            src={
              token?.logoURI ??
              "https://raw.githubusercontent.com/sushiswap/icons/master/token/1inch.jpg"
            }
            style={{ height: "1.65rem", width: "1.65rem" }}
            radius="xl"
          />
        )}
        name="Token"
        value={token?.symbol ?? ""}
      />
      <StatRow
        Icon={IconMoneybag}
        name="Amount"
        value={amount?.toString() ?? ""}
      />
      <StatRow
        Icon={IconStatusChange}
        name="Status"
        value={isSuccess ? "Pending" : "Awaiting Approval"}
      />
    </Stack>
  ) : success ? (
    <Stack align="center">
      <IconCheck size={64} color="green" />
      <Text>Transaction Successful</Text>
      <StatRow
        Icon={IconUser}
        name="Recipient"
        value={shortenAddress(recipient as string)}
      />
      <StatRow
        Icon={() => (
          <Image
            alt=""
            src={
              token?.logoURI ??
              "https://raw.githubusercontent.com/sushiswap/icons/master/token/1inch.jpg"
            }
            style={{
              height: "1.65rem",
              width: "1.65rem",
              borderRadius: "1rem",
            }}
            radius="xl"
          />
        )}
        name="Token"
        value={token?.symbol ?? ""}
      />
      <StatRow
        Icon={IconMoneybag}
        name="Amount"
        value={amount?.toString() ?? ""}
      />
      <StatRow Icon={IconStatusChange} name="Status" value="Success" />
      <Button
        mt="xl"
        onClick={() =>
          open(
            `${chainInfo?.chain?.blockExplorers?.default.url}/tx/${data?.hash}`,
            "_blank"
          )
        }
      >
        View on Explorer
      </Button>
    </Stack>
  ) : (
    <Stack>
      {isLoading && (
        <Alert
          icon={<Loader />}
          title="Checking account..."
          color="gray"
          closeButtonLabel="hide"
        >
          <Text>
            We are checking if the recipient has any activity on the chain you
            currently have selected.
          </Text>
        </Alert>
      )}
      {!isLoading && !hasGas && (
        <Alert
          icon={<IconAlertCircle color="red" />}
          title="Recipient has no activity"
          color="red"
          closeButtonLabel="hide"
        >
          <Text>
            The recipient has no activity on the chain you currently have
            selected.
          </Text>
        </Alert>
      )}
      {!isLoading && hasGas && (
        <Alert
          icon={<IconDiscountCheckFilled color="blue" />}
          title="Recipient has gas"
          color="green"
          closeButtonLabel="hide"
          onClose={() => setHideAlert(true)}
          hidden={hideAlert}
          withCloseButton
        >
          <Text>
            The recipient has sufficient gas on the chain you currently have
            selected.
          </Text>
        </Alert>
      )}
      <TokenInput
        token={token}
        onTokenChange={setToken}
        value={amount}
        onChange={setAmount}
      />

      <Button
        disabled={!tokenAmount}
        onClick={write}
        w="90%"
        ml="auto"
        mr="auto"
        mt="xl"
      >
        {tokenAmount ? `Send` : !token ? "Select a token" : "Input an amount"}
      </Button>
    </Stack>
  );
}
