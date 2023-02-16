import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { MapPhoneNumberButton } from "../content/MapPhoneNumberButton";
import { Container } from "@mantine/core";

const Home: NextPage = () => {
  return (
    <Container>
      <MapPhoneNumberButton />
    </Container>
  );
};

export default Home;
