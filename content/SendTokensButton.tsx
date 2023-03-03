import { Button, Modal } from "@mantine/core";
import { useState } from "react";
import { useAccount } from "wagmi";
import { SendTokensModal } from "../components/Modals/SendTokensModal";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function SendTokensButton({ recipient }: { recipient: string }) {
  const account = useAccount();
  const connect = useConnectModal();
  const [showModal, setShowModal] = useState(false);
  return !recipient ? null : (
    <>
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Send Tokens"
      >
        <SendTokensModal recipient={recipient} />
      </Modal>
      <Button
        variant="gradient"
        mt="xl"
        w="100%"
        onClick={() => {
          if (account.isConnected) {
            setShowModal(true);
          } else if (connect?.openConnectModal) {
            connect.openConnectModal();
          }
        }}
      >
        {account.isConnected
          ? "Send Tokens to This Address"
          : "Connect Wallet to Send Tokens"}
      </Button>
    </>
  );
}
