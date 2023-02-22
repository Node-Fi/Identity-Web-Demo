import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { MapPhoneNumberButton } from "../content/MapPhoneNumberButton";
import { Center, Container, Stack } from "@mantine/core";
import { LookupNumberButton } from "../content/LookupNumberButton";

const Home: NextPage = () => {
  return (
    <Center h="60vh">
      <Stack>
        <MapPhoneNumberButton />
        <LookupNumberButton />
      </Stack>
    </Center>
  );
};

export default Home;
