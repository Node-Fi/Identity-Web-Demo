import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Image,
  Modal,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Fuse from "fuse.js";
import { useTokenList } from "../../hooks/useTokenList";
import { Token } from "@node-fi/token-utils";
import { useBalance } from "wagmi";
import { IconCaretDown } from "@tabler/icons-react";

function BottomSheetMock({
  opened,
  children,
  onClose,
}: {
  opened: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      size={"70%"}
      styles={{
        drawer: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
      zIndex={1000}
    >
      {children}
    </Drawer>
  );
}

export interface FlagInfo {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
  num_digits?: number;
}

interface SelectCountryProps {
  onSelect?: (token: Token) => void;
  selectedToken?: Token;
  style?: React.CSSProperties;
}

function TokenDisplay({ token }: { token: Token }) {
  return (
    <Group position="apart" align="center" noWrap>
      <Image
        src={token.logoURI}
        alt={token.symbol}
        h={"1rem"}
        w="1rem"
        radius={"xl"}
        style={{
          height: "1rem",
          width: "1rem",
        }}
      />
      <Text size="sm">{token.name}</Text>
    </Group>
  );
}

function ToggleButton({
  selectedToken,
  setOpened,
  style,
}: {
  selectedToken?: Token;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  style?: React.CSSProperties;
}) {
  return (
    <Button
      onClick={() => setOpened((b) => !b)}
      variant="subtle"
      p={0}
      style={style}
      w="35%"
    >
      {!selectedToken ? (
        "Select Token"
      ) : (
        <Group spacing="md" p={0}>
          <Group spacing="xs">
            <Image
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
              h={"1rem"}
              w="1rem"
              radius={"xl"}
              style={{
                height: "1rem",
                width: "1rem",
              }}
            />
            <Text size="xs">{selectedToken.symbol}</Text>
          </Group>
          <IconCaretDown />
        </Group>
      )}
    </Button>
  );
}

export default function TokenSelector({
  onSelect,
  selectedToken,
  style,
}: SelectCountryProps) {
  const mediaQuery = useMediaQuery("(min-width: 600px)");
  const [opened, setOpened] = React.useState(false);
  const { tokens = [], fetchDetails } = useTokenList();

  const fuse = useMemo(
    () =>
      new Fuse(tokens, {
        keys: ["name", "symbol", "address"],
        threshold: 0.3,
      }),
    [tokens]
  );

  const [filter, setFiler] = useState<string>();
  const timerRef = React.useRef<NodeJS.Timeout>();

  const tokenList = useMemo(
    () => (filter ? fuse.search(filter).map((f) => f.item) : tokens),
    [filter, tokens, fuse]
  );

  const onInput = useCallback(
    (s: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setFiler(s);
      }, 150);
    },
    [timerRef, setFiler]
  );

  return mediaQuery ? (
    <Popover opened={opened} withArrow closeOnClickOutside>
      <Popover.Target key={"token-select"}>
        <ToggleButton
          selectedToken={selectedToken}
          setOpened={setOpened}
          style={style}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <TextInput
          onChange={(e) => onInput(e.currentTarget.value)}
          placeholder="🔎 Search..."
          w={"90%"}
          ml="auto"
          mr="auto"
          mt="lg"
        />

        <ScrollArea h="50vh">
          <Stack>
            {tokenList.map((t) => (
              <Button
                key={t.address}
                onClick={() => {
                  onSelect?.(t);
                  setOpened(false);
                }}
                variant="subtle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 30,
                }}
              >
                <TokenDisplay token={t} />
              </Button>
            ))}
          </Stack>
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  ) : (
    <>
      <ToggleButton
        selectedToken={selectedToken}
        setOpened={setOpened}
        style={style}
      />
      <BottomSheetMock opened={opened} onClose={() => setOpened(false)}>
        <Container pl="sm" pr="sm">
          <TextInput
            onChange={(e) => onInput(e.currentTarget.value)}
            placeholder="🔎 0xbeef...a17z"
            w={"100%"}
            ml="auto"
            mr="auto"
            mt="lg"
            mb="md"
          />
        </Container>
        <Divider mb="sm" />

        <ScrollArea h="60vh" w="100%">
          <Stack
            w="60vw"
            style={{
              overflowX: "hidden",
            }}
          >
            {tokenList.map((t) => (
              <Button
                key={t.address}
                onClick={() => {
                  onSelect?.(t);
                  setOpened(false);
                }}
                variant="subtle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 30,
                }}
              >
                <TokenDisplay token={t} />
              </Button>
            ))}
          </Stack>
        </ScrollArea>
      </BottomSheetMock>
    </>
  );
}
