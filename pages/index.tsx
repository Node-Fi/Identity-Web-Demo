import type { NextPage } from "next";
import { Container, Stack } from "@mantine/core";
import { Hero } from "../components/Hero/Hero";
import { CallToAction } from "../components/CallToAction/CallToAction";

const Home: NextPage = () => {
  return (
    <Container pt="2rem" size="xs">
      <Hero />
      <CallToAction />
    </Container>
  );
};

export default Home;
