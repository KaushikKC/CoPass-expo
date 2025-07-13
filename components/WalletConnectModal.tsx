import {
  WalletConnectModal,
  createWeb3Modal,
  defaultWagmiConfig,
} from "@walletconnect/modal-react-native";
import React from "react";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

// Configure chains & providers
const projectId = "eb447922bf799117d4a4fcb3c11efb9b"; // Get from https://cloud.walletconnect.com/

const metadata = {
  name: "CoPass",
  description: "Connect with purpose-driven travelers",
  url: "https://copass.app",
  icons: ["https://copass.app/icon.png"],
};

const chains = [mainnet, polygon, arbitrum];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  metadata,
});

export default function WalletConnectModalComponent() {
  return <WalletConnectModal />;
}
