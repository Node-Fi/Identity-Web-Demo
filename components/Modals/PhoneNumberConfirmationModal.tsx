import {
  Button,
  Center,
  Container,
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

const getTitle = (step: Step) => {
  switch (step) {
    case "phone":
      return "Enter your phone number";
    case "confirmation":
      return "Confirm your phone number";
    case "sending-otp":
      return "Sending OTP";
    case "enter-code":
      return "Enter OTP";
    case "success":
      return "Success";
    case "already-verified":
      return "Already verified";
    case "failure":
      return "Failure";
  }
};

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
        title: "Confirm your phone number",
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
      return { title: "Success", progress: 100, color: "green" };
    case "already-verified":
      return { title: "Already verified", progress: 100, color: "yellow" };
    case "failure":
      return { title: "Failure", progress: 100, color: "red" };
  }
};

export const PhoneNumberMappingBody = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [code, setCode] = useState<string>();
  const [step, setStep] = useState<Step>("phone");
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

        <Text size="xl" mb="xl">
          {title}
        </Text>
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
          <Text variant="text">{`I want to map ${phoneNumber} to ${account.address}.`}</Text>
          <Text size="sm">sms rates may apply</Text>
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
              width: "1.25rem",
              height: "2rem",
            }}
            separator={
              <Text ml="xs" mr="xs">
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
        <>
          <Text variant="text">Success!</Text>
          <Text variant="text">
            Your phone number has been mapped to your wallet.
          </Text>
        </>
      )}
      {step === "already-verified" && (
        <>
          <Text variant="text">Already Verified!</Text>
          <Text variant="text">
            If you continue, you will overwrite your existing mapping.
          </Text>
          <Button
            w="100%"
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
          <Text variant="text">Failure!</Text>
          <Text variant="text">Something went wrong. Please try again.</Text>

          <Button
            w="100%"
            mt="lg"
            onClick={() => setStep("phone")}
            variant="outline"
          >
            Restart
          </Button>
        </>
      )}
    </Container>
  );
};

export default PhoneNumberMappingBody;
