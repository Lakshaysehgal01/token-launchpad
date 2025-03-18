import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import TokenLaunch from "./components/TokenLaunch";
import Header from "./components/Header";
import Swap from "./components/Swap/Swap";
import { Route, Routes } from "react-router-dom";
import SolFaucet from "./components/SolFaucet/SolFaucet";

function App() {
  return (
    <>
      <ConnectionProvider endpoint={import.meta.env.VITE_RPC_DEVNET_URL}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <Header />
            <Routes>
              <Route path="/" element={<TokenLaunch />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/solConnect" element={<SolFaucet />} />
            </Routes>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
