import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { store } from "../stores/rootStore";
import { Provider } from "react-redux";
import useIsMounted from "../hooks/useIsMounted";
import Script from "next/script";
import { GID } from "../constants";
import { useRouter } from "next/router";


/******** Rainbow Kit  **********/

import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  argentWallet,
  ledgerWallet,
  braveWallet,
} from "@rainbow-me/rainbowkit/wallets";

/********* Wagmi ************/

import { WagmiConfig, configureChains, createClient } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "../components/Layout";
import Head from "next/head";

const { chains, provider } = configureChains([polygon], [publicProvider()]);
const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ chains, appName: "Block'd" }),
      rainbowWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const mounted = useIsMounted();
  console.log(process.env.NEXT_PUBLIC_ENV,'hussein');

  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_ENV !== 'staging') console.log = function () {};



  const [queryClient] = React.useState(() => new QueryClient());
  if (!mounted) {
    console.log(GID);
   
    return null;
  }

  return (
    <html className="h-screen">
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon.ico"
        ></link>
        <title>Blockd</title>
        <meta
          name="description"
          content="The Ultimate Hub for Crypto and Blockchain enthusiasts"
        />
        
      </Head>
      <Script
        async
        defer
        src="https://tools.luckyorange.com/core/lo.js?site-id=6dbbf30b"
      ></Script>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-QW4Q5G8G4K"
      />
      <Script>
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-QW4Q5G8G4K');
        `}
      </Script>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            theme={lightTheme({
              accentColor: "#FD7F20",
              accentColorForeground: "white",
              borderRadius: "small",
              fontStack: "system",
              overlayBlur: "small",
            })}
            chains={[polygon]}
            initialChain={polygon}
            modalSize="compact"
            id="rainbow"
          >
            <div className="h-screen">
              <Provider store={store}>
                <ThemeProvider enableSystem={true} attribute="class">
                  {router.pathname === "/auth/signin" ||
                  router.pathname === "/auth/signup" ||
                  router.pathname === "/auth/infographic" ||
                  router.pathname === "/dashboard/myChatrooms" ? (
                    <Component {...pageProps} />
                  ) : (
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  )}
                </ThemeProvider>
              </Provider>
            </div>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </html>
  );
}

export default MyApp;
