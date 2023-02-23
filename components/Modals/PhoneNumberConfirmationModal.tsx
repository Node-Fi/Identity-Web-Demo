import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMemo, useState } from "react";
import PhoneInput from "../PhoneNumberInput/PhoneNumberInput";
import { useAccount, useMutation } from "wagmi";
import axios, { AxiosResponse } from "axios";
import OtpInput from "react-otp-input";
import { StatRow } from "../StatRow/StatRow";
import {
  IconAlertOctagonFilled,
  IconArrowDown,
  IconPhone,
  IconWallet,
} from "@tabler/icons-react";
import { shortenAddress } from "../../utils/shortenAddress";

type VerificationResponse = {
  verification: {
    status: "pending" | "verified" | "failed";
    unixTimestamp: number;
  };
};

type Step =
  | "phone"
  | "confirmation"
  | "sending-otp"
  | "enter-code"
  | "success"
  | "already-verified"
  | "failure";

const getTitleAndProgress = (
  step: Step,
  validPhoneNumber?: boolean,
  validOtp?: boolean
) => {
  switch (step) {
    case "phone":
      return {
        title: "Enter your phone number",
        progress: validPhoneNumber ? 10 : 2.5,
        color: "blue",
      };
    case "confirmation":
      return {
        title: "Confirm details",
        progress: 20,
        color: "blue",
      };
    case "sending-otp":
      return { title: "Sending OTP", progress: 40, color: "blue" };
    case "enter-code":
      return {
        title: "Enter OTP",
        progress: validOtp ? 80 : 60,
        color: "blue",
      };
    case "success":
      return { title: null, progress: 100, color: "green" };
    case "already-verified":
      return { title: null, progress: 100, color: "yellow" };
    case "failure":
      return { title: null, progress: 100, color: "red" };
  }
};

export const PhoneNumberMappingBody = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [code, setCode] = useState<string>();
  const [step, setStep] = useState<Step>("enter-code");
  const account = useAccount();

  const { title, progress, color } = useMemo(
    () => getTitleAndProgress(step, !!phoneNumber, !!code),
    [step, phoneNumber, code]
  );

  const init = useMutation(
    async ({
      address,
      identifier,
      force,
    }: {
      address: string;
      identifier: string;
      force?: boolean;
    }) => {
      setStep("sending-otp");
      const { data } = await axios.post<
        { address: string; identifier: string; _type: string },
        AxiosResponse<VerificationResponse>
      >(
        "/api/sms/verify/init",
        {
          _type: "phone",
          address,
          identifier,
        },
        force ? { params: { force } } : undefined
      );

      return data;
    },
    {
      onSuccess: (data) => {
        if (data.verification.status === "verified") {
          setStep("already-verified");
        } else {
          setStep("enter-code");
        }
      },
      onError: () => {
        setStep("failure");
      },
    }
  );

  const verify = useMutation(
    async ({
      address,
      identifier,
      otp,
    }: {
      address: string;
      identifier: string;
      otp: string;
    }) => {
      const { data } = await axios.post<
        { address: string; identifier: string; _type: string; code: string },
        AxiosResponse<VerificationResponse>
      >("/api/sms/verify/submit", {
        identifier,
        address,
        code: otp,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        if (data.verification.status === "verified") {
          setStep("success");
        } else {
          setStep("failure");
        }
      },
      onError: () => {
        setStep("failure");
      },
    }
  );

  return (
    <Container w="100%" p={0}>
      <Stack mb="xl">
        <Progress value={progress} color={color} />

        {title && (
          <Text size="xl" mb="xl">
            {title}
          </Text>
        )}
      </Stack>
      {step === "phone" && (
        <>
          <PhoneInput onValidPhonenumber={setPhoneNumber} />
          <Button
            w="100%"
            mt="lg"
            onClick={() => setStep("confirmation")}
            disabled={!phoneNumber}
          >
            {phoneNumber ? "Continue" : "Enter a phone number"}
          </Button>
        </>
      )}
      {step === "confirmation" && (
        <>
          <StatRow Icon={IconPhone} name="Phone" value={phoneNumber!} />
          <Center>
            <Stack justify="center" align="center" spacing={0} mt="xl" mb="xl">
              <IconArrowDown />
            </Stack>
          </Center>
          <StatRow
            Icon={IconWallet}
            name="Wallet"
            value={shortenAddress(account.address!)}
          />

          <Button
            w="100%"
            mt="lg"
            onClick={() =>
              init.mutate({
                address: account.address!,
                identifier: phoneNumber!,
                force: false,
              })
            }
          >
            Confirm
          </Button>
        </>
      )}
      {step === "sending-otp" && (
        <Center mt="xl">
          <Loader size="xl" />
        </Center>
      )}
      {step === "enter-code" && (
        <>
          <OtpInput
            value={code}
            onChange={setCode}
            numInputs={6}
            inputStyle={{
              width: "2rem",
              height: "3rem",
            }}
            separator={
              <Text ml="0.25rem" mr="0.25rem">
                -
              </Text>
            }
            isInputNum
            containerStyle={{
              width: "100%",
              display: "flex",
              flexGap: "1rem",
              justifyContent: "center",
            }}
          />
          <Button
            w="100%"
            mt="lg"
            onClick={() =>
              verify.mutate({
                address: account.address!,
                identifier: phoneNumber!,
                otp: code!,
              })
            }
            disabled={!code || code.length !== 6}
          >
            {code && code.length === 6 ? "Verify" : "Enter verification code"}
          </Button>
        </>
      )}
      {step === "success" && (
        <Alert title="Success" color="green">
          <Text variant="text">
            Your phone number has been mapped to your wallet.
          </Text>
        </Alert>
      )}
      {step === "already-verified" && (
        <>
          <Alert
            title="Already Verified!"
            color="yellow"
            icon={<IconAlertOctagonFilled />}
          >
            <Text variant="text">
              If you continue, you will overwrite your existing mapping.
            </Text>
          </Alert>
          <Button
            w="100%"
            mt="lg"
            onClick={async () => {
              init.reset();
              init.mutate({
                address: account.address!,
                identifier: phoneNumber!,
                force: true,
              });
            }}
          >
            Overwrite
          </Button>
        </>
      )}
      {step === "failure" && (
        <>
          <Alert title="Failure" color="red" icon={<IconAlertOctagonFilled />}>
            <Text variant="text">Something went wrong.</Text>
            <Text>Please try again later.</Text>
          </Alert>
          <Button
            w="100%"
            mt="lg"
            onClick={() => setStep("phone")}
            variant="outline"
            color="red"
          >
            Restart
          </Button>
        </>
      )}
    </Container>
  );
};

export default PhoneNumberMappingBody;
