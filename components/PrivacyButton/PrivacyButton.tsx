import { useCallback, useState } from "react";
import { Button, Modal, Stack, Text, useMantineTheme } from "@mantine/core";
export function PrivacyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = useCallback(() => setIsOpen((_isOpen) => !_isOpen), []);
  const theme = useMantineTheme();
  return (
    <>
      <Modal title="On Privacy" onClose={toggleModal} opened={isOpen} centered>
        <Stack spacing="xl">
          <Stack spacing={0}>
            <Text color="blue">Secured using zero knowledge</Text>
            <Text>
              SocialConnect uses{" "}
              <Text
                span
                component="a"
                href="https://docs.celo.org/protocol/identity/odis"
                target="_blank"
              >
                ODIS
              </Text>
              {", "} an engine for rate limited oblivious pseudorandom function
              over obfuscated identity mappings.
            </Text>
          </Stack>
          <Stack spacing={0}>
            <Text color="orange">How to increase your privacy</Text>
            <Text>
              People who know your number will be able to lookup what address is
              mapped to it.{" "}
              <Text span italic>
                consider using burner wallets to obfuscate your activity from
                peers
              </Text>
            </Text>
          </Stack>
          <Stack spacing={0}>
            <Text color="green">Optional discoverability (coming soon)</Text>
            <Text>
              Node Finance is building a layer on top of SocialConnect to allow
              only certain contacts to be able to find them.{" "}
              <Text
                span
                component="a"
                href="https://nodefinance.org"
                target="_blank"
              >
                Contact us to learn more
              </Text>
            </Text>
          </Stack>
        </Stack>
      </Modal>
      <Button
        onClick={toggleModal}
        variant="subtle"
        style={{
          color: theme.colors._blue[0],
        }}
      >
        Privacy
      </Button>
    </>
  );
}
