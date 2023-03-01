import type { NextPage } from "next";
import { Stack } from "@mantine/core";
import { Hero } from "../components/Hero/Hero";
import { CallToAction } from "../components/CallToAction/CallToAction";

const Home: NextPage = () => {
  return (
    <Stack pt="2rem">
      <Hero />
      <CallToAction />
    </Stack>
  );
};

export default Home;
