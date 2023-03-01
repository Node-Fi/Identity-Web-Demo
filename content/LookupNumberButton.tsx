import { Button, Modal } from "@mantine/core";
import { LookupNumberModal } from "../components/Modals/LookupNumberModal";
import { useState } from "react";

export function LookupNumberButton() {
  const [modalOpened, setOpenModal] = useState(false);

  return (
    <>
      <Button
        variant="filled"
        color="dark"
        bg="#1c1b29"
        onClick={() => setOpenModal(true)}
        p="md"
        radius="md"
        h="3.5rem"
      >
        Lookup a Number
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
