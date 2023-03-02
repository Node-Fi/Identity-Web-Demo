import { Stack, Text } from "@mantine/core";
import { MapPhoneNumberButton } from "../../content/MapPhoneNumberButton";
import { LookupNumberButton } from "../../content/LookupNumberButton";

export function CallToAction() {
  return (
    <Stack mt="xl">
      <Text mt="xl" color="#7C7C7C">
        Try it yourself:
      </Text>
      <MapPhoneNumberButton />
      <LookupNumberButton />
    </Stack>
  );
}
