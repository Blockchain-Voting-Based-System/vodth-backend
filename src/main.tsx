import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { UserProvider } from "./auth/UserContext";
import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
          <WalletProvider autoConnect>
            <UserProvider>
              <App />
            </UserProvider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
