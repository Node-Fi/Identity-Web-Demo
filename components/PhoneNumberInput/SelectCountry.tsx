import React from "react";
import {
  Button,
  Drawer,
  Modal,
  Select,
  SelectItem,
  TextInput,
  Title,
} from "@mantine/core";
import flagsData from "./flags.json";
import { useMediaQuery } from "@mantine/hooks";

interface SelectCountryProps {
  onSelect?: (country: string) => void;
  selectedCountry?: string;
}

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

export default function SelectCountry({
  onSelect,
  selectedCountry,
}: SelectCountryProps) {
  const mediaQuery = useMediaQuery("(min-width: 600px)");
  console.log(mediaQuery);
  const Parent = mediaQuery ? Modal : BottomSheetMock;
  const [opened, setOpened] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpened((o) => !o)}>
        {opened ? "Close" : "Open"}
      </Button>
      <Parent
        opened={opened}
        onClose={() => setOpened(false)}
        zIndex={1000}
        centered
      >
        Hello
      </Parent>
    </>
  );
}
