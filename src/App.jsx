import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import TokenLaunch from "./components/TokenLaunch";
import Swap from "./components/Swap/Swap";
import { Route, Routes } from "react-router-dom";
import SolFaucet from "./components/SolFaucet/SolFaucet";
import AuthProvider from "./AuthProvider";
import HomePage from "./components/Home/Home";
import Mint from "./components/Mint /Mint";
import Sent from "./components/Send/Send";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <ConnectionProvider endpoint={import.meta.env.VITE_RPC_DEVNET_URL}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/send" element={<Sent />} />
                <Route
                  path="/token"
                  element={
                    <AuthProvider>
                      <TokenLaunch />
                    </AuthProvider>
                  }
                />
                <Route path="/swap" element={<Swap />} />
                <Route path="/solConnect" element={<SolFaucet />} />
              </Routes>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </AnimatePresence>
    </>
  );
}

export default App;
