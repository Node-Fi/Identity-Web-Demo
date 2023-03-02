import {
  Badge,
  Center,
  Chip,
  Container,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useAccount } from "wagmi";
import { shortenAddress } from "../../utils/shortenAddress";

const backupAddress = "0xbeef...a17z";
const phone = "+1 831 273 1234";

export function Hero() {
  const account = useAccount();
  const theme = useMantineTheme();
  return (
    <Stack align="center">
      <Group spacing={0} mb={0}>
        <Title color="white" mb={0}>
          Social
        </Title>
        <Title
          style={{
            color: theme.colors._blue[0],
          }}
          mb={0}
        >
          Connect
        </Title>
      </Group>
      <Text color="#7C7C7C" align="center" mt={"-0.5rem"}>
        The Zelle for crypto
      </Text>
      <Group position="apart" noWrap p={0}>
        <Badge
          radius="md"
          bg="#320000"
          variant="filled"
          p="lg"
          pl="xs"
          pr="xs"
          w="42.5%"
        >
          <Text color="#ff4243">
            {account?.address ? shortenAddress(account.address) : backupAddress}
          </Text>
        </Badge>
        <IconArrowRight width="5%" color={theme.colors._grey[0]} />
        <Badge
          radius="md"
          bg="#002219"
          variant="filled"
          p="lg"
          pl="xs"
          pr="xs"
          w="42.5%"
        >
          <Text color="#04cf93">{phone}</Text>
        </Badge>
      </Group>
    </Stack>
  );
}
