import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { MapPhoneNumberButton } from "../content/MapPhoneNumberButton";
import { Center, Container } from "@mantine/core";

const Home: NextPage = () => {
  return (
    <Center h="60vh">
      <MapPhoneNumberButton />
    </Center>
  );
};

export default Home;
