import React from "react";
import { Button, Input, Text } from "@mantine/core";
import { useAccount } from "wagmi";
import { openModal } from "@mantine/modals";

export function MapPhoneNumberButton() {
  const account = useAccount();

  return account.isConnected ? (
    <Button
      onClick={() => {
        openModal({
          modalId: "phone-number-mapping",
          title: "Map Phone Number",
          children: <Input placeholder="(000) 000 0000" />,
        });
      }}
    >
      Map Phone Number
    </Button>
  ) : (
    <Text>Connect Wallet to Continue</Text>
  );
}
