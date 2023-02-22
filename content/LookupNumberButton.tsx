import { Button, Modal } from "@mantine/core";
import { LookupNumberModal } from "../components/Modals/LookupNumberModal";
import { useState } from "react";

export function LookupNumberButton() {
  const [modalOpened, setOpenModal] = useState(false);

  return (
    <>
      <Button variant="gradient" onClick={() => setOpenModal(true)}>
        Lookup Number
      </Button>
      <Modal
        opened={modalOpened}
        onClose={() => setOpenModal(false)}
        withCloseButton={false}
      >
        <LookupNumberModal />
      </Modal>
    </>
  );
}
