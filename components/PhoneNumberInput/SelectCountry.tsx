import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Drawer,
  Group,
  Modal,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import _flagsData from "./flags.json";
import { useMediaQuery } from "@mantine/hooks";
import Fuse from "fuse.js";

const flagsData = _flagsData as FlagInfo[];

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
  onSelect?: (countryInfo: FlagInfo) => void;
  selectedCountry?: FlagInfo;
  style?: React.CSSProperties;
}

const countryToFlagInfo = flagsData.reduce((acc, flag) => {
  acc[flag.name] = flag;
  return acc;
}, {} as Record<string, FlagInfo>);

const fuse = new Fuse(flagsData, {
  keys: ["name", "code", "dial_code", "flag"],
});

export default function SelectCountry({
  onSelect,
  selectedCountry,
  style,
}: SelectCountryProps) {
  const mediaQuery = useMediaQuery("(min-width: 600px)");
  const [opened, setOpened] = React.useState(false);

  const [filter, setFiler] = useState<string>();
  const timerRef = React.useRef<NodeJS.Timeout>();

  const flags = useMemo(
    () => (filter ? fuse.search(filter).map((f) => f.item) : flagsData),
    [filter]
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
    <Popover opened={opened} withArrow>
      <Popover.Target>
        <Button
          onClick={() => setOpened((o) => !o)}
          variant="subtle"
          p={0}
          style={style}
        >
          {!selectedCountry ? (
            "+?"
          ) : (
            <Group spacing="xs" p={0}>
              <Title>{selectedCountry.flag}</Title>
              <Text>{selectedCountry.dial_code}</Text>
            </Group>
          )}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <TextInput
          onChange={(e) => setFiler(e.currentTarget.value)}
          placeholder="🔎 Search..."
          w={"90%"}
          ml="auto"
          mr="auto"
          mt="lg"
        />

        <ScrollArea h="50vh">
          <Stack>
            {flags.map((c) => (
              <Button
                key={c.name}
                onClick={() => {
                  onSelect?.(c);
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
                <Title style={{ marginRight: 10 }}>{c.flag}</Title>
                {c.name}
              </Button>
            ))}
          </Stack>
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  ) : (
    <>
      <Button
        onClick={() => setOpened((o) => !o)}
        variant="subtle"
        style={style}
        p={0}
      >
        {!selectedCountry ? (
          "+?"
        ) : (
          <Group spacing="xs" p={0}>
            <Title>{selectedCountry.flag}</Title>
            <Text>{selectedCountry.dial_code}</Text>
          </Group>
        )}
      </Button>
      <BottomSheetMock opened={opened} onClose={() => setOpened(false)}>
        <TextInput
          onChange={(e) => setFiler(e.currentTarget.value)}
          placeholder="🔎 Search..."
          w={"90%"}
          ml="auto"
          mr="auto"
          mt="lg"
          mb="md"
        />
        <Divider mb="sm" />

        <ScrollArea h="50vh">
          <Stack w="90vw">
            {flags.map((c) => (
              <Button
                key={c.name}
                onClick={() => {
                  onSelect?.(c);
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
                <Title style={{ marginRight: 10 }}>{c.flag}</Title>
                {c.name}
              </Button>
            ))}
          </Stack>
        </ScrollArea>
      </BottomSheetMock>
    </>
  );
}
