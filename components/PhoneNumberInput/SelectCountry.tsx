import React from "react";
import {
  Button,
  Drawer,
  Group,
  Modal,
  Popover,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import flagsData from "./flags.json";
import { useMediaQuery } from "@mantine/hooks";

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
      size={"60%"}
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

export default function SelectCountry({
  onSelect,
  selectedCountry,
  style,
}: SelectCountryProps) {
  const mediaQuery = useMediaQuery("(min-width: 600px)");
  const [opened, setOpened] = React.useState(false);

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
        <ScrollArea h="50vh">
          <Stack w="30rem">
            {flagsData.map((c) => (
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
        <ScrollArea h="50vh">
          <Stack w="90vw">
            {flagsData.map((c) => (
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
