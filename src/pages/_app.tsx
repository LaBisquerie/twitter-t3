import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps} >
      <Head>
        <title>Twitter T3 Clone</title>
        <meta name="description" content="A clone of Twitter with the T3 Stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </ClerkProvider>
  ); 
};

export default api.withTRPC(MyApp);
