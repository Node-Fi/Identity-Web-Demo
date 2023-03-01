import {
  Badge,
  Center,
  Chip,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useAccount } from "wagmi";
import { shortenAddress } from "../../utils/shortenAddress";

const backupAddress = "0xbeef...a17z";
const phone = "+1 831 273 1234";

export function Hero() {
  const account = useAccount();
  return (
    <Stack align="center">
      <Group spacing={0} mb={0}>
        <Title mb={0}>Social</Title>
        <Title color="blue" mb={0}>
          Connect
        </Title>
      </Group>
      <Text color="dimmed" align="center" mt={"-0.5rem"}>
        The Zelle for crypto
      </Text>
      <Group>
        <Badge radius="md" bg="#320000" variant="filled" p="lg" w="40%">
          <Text color="#ff4243">
            {account?.address ? shortenAddress(account.address) : backupAddress}
          </Text>
        </Badge>
        <IconArrowRight color="grey" />
        <Badge radius="md" bg="#002219" variant="filled" p="lg" w="40%">
          <Text color="#04cf93">{phone}</Text>
        </Badge>
      </Group>
    </Stack>
  );
}
