import React from "react";
import { Button, Modal, useMantineTheme } from "@mantine/core";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PhoneNumberMappingBody from "../components/Modals/PhoneNumberConfirmationModal";

export function MapPhoneNumberButton() {
  const [modalOpened, setOpenModal] = React.useState(false);
  const account = useAccount();
  const connection = useConnectModal();
  const theme = useMantineTheme();
  return account.isConnected ? (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        p="md"
        radius="md"
        h="3.5rem"
        bg={theme.colors._blue[0]}
      >
        Claim your Phone Number
      </Button>
      <Modal
        opened={modalOpened}
        onClose={() => setOpenModal(false)}
        withCloseButton={false}
      >
        <PhoneNumberMappingBody />
      </Modal>
    </>
  ) : (
    <Button
      variant="outline"
      onClick={connection.openConnectModal}
      p="md"
      radius="md"
      h="3.5rem"
      styles={{
        root: {
          borderColor: theme.colors._blue[0],
          color: theme.colors._blue[0],
        },
      }}
    >
      Connect Wallet to Map Phone Number
    </Button>
  );
}
