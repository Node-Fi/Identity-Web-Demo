import {
  Alert,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useAccount, useQuery } from "wagmi";
import PhoneInput from "../PhoneNumberInput/PhoneNumberInput";

interface Attestation {
  address: string;
  attestor: string;
  issuedOn: number;
}

export const useQueryPhoneNumberMapping = (phoneNumber?: string) => {
  const { data, ...fetchDetails } = useQuery(
    ["phoneNumberMapping", phoneNumber],
    async () => {
      const { data } = await axios.get<Attestation[]>(
        `/api/sms/${phoneNumber}`
      );
      const attestations = data.sort((a, b) => b.issuedOn - a.issuedOn);

      const [current] = attestations;

      return {
        address: current?.address,
        attestor: current?.attestor,
        issuedOn: current?.issuedOn,
        attestations,
      };
    },
    {
      enabled: !!phoneNumber,
    }
  );

  return {
    data,
    fetchDetails,
  };
};

export const LookupNumberModal = () => {
  const [phoneNumber, setPhonenumber] = useState<string>();
  const account = useAccount();

  const { data, fetchDetails } = useQueryPhoneNumberMapping(
    phoneNumber?.trim()
  );
  return (
    <Container w="100%" p={0}>
      <Text size="xl" mb="xl">
        Lookup Phonenumber
      </Text>
      <PhoneInput onValidPhonenumber={setPhonenumber} />
      {fetchDetails.isLoading && <Loader size="xs" ml="auto" mr="auto" />}
      {fetchDetails.isSuccess && data && data.address && (
        <Stack>
          <Divider mt="xl" />

          <Group w="100%">
            <Text>Phonenumber</Text>
            <Text>{phoneNumber}</Text>
          </Group>

          <Divider mt="xl" />

          <Group w="100%">
            <Text>Address</Text>
            <Text>{data.address}</Text>
          </Group>
          <Divider />

          <Group w="100%">
            <Text>Attestor</Text>
            <Text>{data.attestor}</Text>
          </Group>
          <Divider />

          <Group w="100%">
            <Text>Issued On</Text>
            <Text>
              {data.issuedOn
                ? new Date(data.issuedOn * 1000).toLocaleDateString()
                : "-"}
            </Text>
          </Group>
          <Button
            variant="gradient"
            mt="xl"
            w="100%"
            onClick={() => alert("Coming soon!")}
          >
            {account.isConnected
              ? "Send Tokens to This Address"
              : "Connect Wallet to Send Tokens"}
          </Button>
        </Stack>
      )}
      {fetchDetails.isError ||
      (fetchDetails.isSuccess && data && !data.address) ? (
        <Text color="red" mt="xl" align="center">
          Mapping not found
        </Text>
      ) : null}
    </Container>
  );
};
