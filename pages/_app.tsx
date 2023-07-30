import { GuardProvider } from "client/react/guard/GuardContext";
import WalletProvider from "client/react/wallet/WalletProvider";
import Navigation from "components/Navigation";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import "tailwindcss/tailwind.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="w-screen h-screen text-white bg-black">
      <WalletProvider>
        <GuardProvider>
          <>
            <Toaster position="bottom-center" />
            <Navigation />
            <Component {...pageProps} />
          </>
        </GuardProvider>
      </WalletProvider>
    </main>
  );
}
