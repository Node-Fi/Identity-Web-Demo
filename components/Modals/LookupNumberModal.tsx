import {
  Accordion,
  Alert,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useAccount, useQuery } from "wagmi";
import PhoneInput from "../PhoneNumberInput/PhoneNumberInput";
import { StatRow } from "../StatRow/StatRow";
import { shortenAddress } from "../../utils/shortenAddress";
import { IconCalendar, IconKey, IconWallet } from "@tabler/icons-react";
import { SendTokensButton } from "../../content/SendTokensButton";

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
          <StatRow
            Icon={IconWallet}
            name="Address"
            value={shortenAddress(data.address)}
          />
          <Divider mt={0} />
          <StatRow
            Icon={IconKey}
            name="Attestor"
            value={shortenAddress(data.attestor)}
          />
          <Divider mt={0} />
          <StatRow
            Icon={IconCalendar}
            name="Issued On"
            value={new Date(data.issuedOn * 1000).toLocaleDateString()}
          />
          <SendTokensButton recipient={data.address} />
          {data && data.attestations.length > 1 && (
            <Alert title="Multiple attestations found" color="yellow" mt="xl">
              <Text>
                This phonenumber has been mapped to multiple addresses. The most
                recent mapping is shown above.
              </Text>
              <Accordion defaultValue={null} w="100%">
                <Accordion.Item value="View all attestations" w="100%">
                  <Accordion.Control w="100%">
                    View all attestations
                  </Accordion.Control>
                  <Accordion.Panel w="100%">
                    <Table
                      fontSize="xs"
                      highlightOnHover
                      withColumnBorders={false}
                      w="100%"
                      horizontalSpacing="xs"
                    >
                      <thead>
                        <tr>
                          <th>Address</th>
                          <th>Attestor</th>
                          <th>Issued</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.attestations.map((attestation, i) => (
                          <tr key={`attestation-${i}`}>
                            <td>{shortenAddress(attestation.address, 5, 2)}</td>
                            <td>
                              {shortenAddress(attestation.attestor, 5, 2)}
                            </td>
                            <td>
                              {new Date(
                                attestation.issuedOn * 1000
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Alert>
          )}
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
