import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppContext, AppProps } from "next/app";
import {
  ConnectButton,
  RainbowKitProvider,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  celo,
  celoAlfajores,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  AppShell,
  Aside,
  ColorScheme,
  ColorSchemeProvider,
  Container,
  Footer,
  Group,
  Image,
  MantineProvider,
  MediaQuery,
  Text,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import Head from "next/head";
import NextApp from "next/app";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle/CollorSchemeToggle";
import { HorizontalSection } from "@mantine/core/lib/AppShell/HorizontalSection/HorizontalSection";
import { Header } from "../components/Header/Header";

const { chains, provider, webSocketProvider } = configureChains(
  [celo, celoAlfajores, mainnet, polygon, optimism, arbitrum],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Node Finance Identity Demo",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({
  Component,
  pageProps,
  colorScheme: _colorScheme,
}: AppProps & { colorScheme: ColorScheme }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(_colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };
  return (
    <>
      <Head>
        <title>Node Finance Identity</title>
        <meta
          property="og:image"
          content="https://lh3.googleusercontent.com/gJtGvddxJN04PFRQO5X3ZwL3Pt9kg0gOBkHsVDhabyOOAFIIxQ_aSuX28rhPyC9P9XFcDE4fMHvmh8obyDnBzo8D4w3fki8=s1200"
        />
        <meta
          name="thumbnail"
          content="https://lh3.googleusercontent.com/gJtGvddxJN04PFRQO5X3ZwL3Pt9kg0gOBkHsVDhabyOOAFIIxQ_aSuX28rhPyC9P9XFcDE4fMHvmh8obyDnBzo8D4w3fki8=s1200"
        />
        <meta
          name="keywords"
          content="node finance, node finance celo, nodefinance, celo developer tools, celo tools, celo developer, node finance startup, node incubator, node finance incubator, celo, node, node inc, node celo, celo node, node berkeley"
        />

        <meta
          name="description"
          content="Interact with the Node Finance Identity service"
        />
        <link rel="icon" href="/node-logo.png" />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
          }}
        >
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ModalsProvider>
                <AppShell
                  header={
                    <Header />
                    // <Header height={60} withBorder={false} p="md">
                    //   <Container
                    //     size="md"
                    //     style={{
                    //       display: "flex",
                    //       alignItems: "center",
                    //       alignContent: "center",
                    //       height: "100%",
                    //       justifyContent: "space-between",
                    //     }}
                    //   >
                    //     <Image
                    //       style={{
                    //         width: 200,
                    //         display: "flex",
                    //         alignItems: "center",
                    //       }}
                    //       src={
                    //         colorScheme === "dark"
                    //           ? "/images/profile/node-finance-nobg.png"
                    //           : "/images/node_logo_dark.png"
                    //       }
                    //       alt="Node Finance"
                    //     />
                    //     <Group align="center" spacing={20}>
                    //       <MediaQuery
                    //         smallerThan="sm"
                    //         styles={{ display: "none" }}
                    //       >
                    //         <div>
                    //           <ConnectButton />
                    //         </div>
                    //       </MediaQuery>
                    //       <ColorSchemeToggle />
                    //     </Group>
                    //   </Container>
                    // </Header>
                  }
                  footer={
                    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                      <Footer height={80} withBorder>
                        <Container
                          size="md"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            alignContent: "center",
                            height: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <ConnectButton />
                        </Container>
                      </Footer>
                    </MediaQuery>
                  }
                >
                  <Component {...pageProps} />
                </AppShell>
              </ModalsProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

export const getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};

export default MyApp;
