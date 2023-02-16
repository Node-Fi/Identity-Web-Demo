import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
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
  Container,
  Header,
  MantineProvider,
  Text,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import Head from "next/head";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Node Finance Identity</title>
        <meta
          name="description"
          content="Interact with the Node Finance Identity service"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <AppShell
                header={
                  <Header height={50}>
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
                      <Text size="lg">Node Finance Identity Demo</Text>
                      <ConnectButton />
                    </Container>
                  </Header>
                }
              >
                <Component {...pageProps} />
              </AppShell>
            </RainbowKitProvider>
          </WagmiConfig>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
