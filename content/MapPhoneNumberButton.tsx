import React from "react";
import { Button, Modal } from "@mantine/core";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PhoneInput from "../components/PhoneNumberInput/PhoneNumberInput";
import SelectCountry from "../components/PhoneNumberInput/SelectCountry";
import PhoneNumberMappingBody from "../components/Modals/PhoneNumberConfirmationModal";

export function MapPhoneNumberButton() {
  const [modalOpened, setOpenModal] = React.useState(false);
  const account = useAccount();
  const connection = useConnectModal();

  return account.isConnected ? (
    <>
      <Button variant="outline" onClick={() => setOpenModal(true)}>
        Map Phone Number
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
    <Button variant="outline" onClick={connection.openConnectModal}>
      Connect Wallet to Map Phone Number
    </Button>
  );
}
