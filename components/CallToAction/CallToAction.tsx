import { Stack, Text } from "@mantine/core";
import { MapPhoneNumberButton } from "../../content/MapPhoneNumberButton";
import { LookupNumberButton } from "../../content/LookupNumberButton";

export function CallToAction() {
  return (
    <Stack>
      <Text mt="xl" color="dimmed">
        Try it yourself:
      </Text>
      <MapPhoneNumberButton />
      <LookupNumberButton />
    </Stack>
  );
}
