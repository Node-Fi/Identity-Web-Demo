import React from "react";
import { Button, Center, Group, Input, Stack, Text } from "@mantine/core";
import { useAccount } from "wagmi";
import { openModal } from "@mantine/modals";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PhoneInputGpt from "../components/PhoneNumberInput/PhoneNumberGpt";
import SelectCountry from "../components/PhoneNumberInput/SelectCountry";

export function MapPhoneNumberButton() {
  const account = useAccount();
  const connection = useConnectModal();

  return account.isConnected ? (
    <Button
      onClick={() => {
        openModal({
          modalId: "phone-number-mapping",
          title: "Map Phone Number",
          children: <SelectCountry />,
        });
      }}
    >
      Map Phone Number
    </Button>
  ) : (
    <Center h="40vh">
      <Stack>
        <Button variant="outline" onClick={connection.openConnectModal}>
          Connect Wallet to Map Phone Number
        </Button>
        <Button variant="gradient" onClick={connection.openConnectModal}>
          Lookup Phone Number
        </Button>
      </Stack>
    </Center>
  );
}
