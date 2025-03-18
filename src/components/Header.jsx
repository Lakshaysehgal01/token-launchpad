import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import { useWallet } from "@solana/wallet-adapter-react";

import { WalletIcon } from "lucide-react";
import { Link } from "react-router-dom";
import GradientText from "./GradientText/GradientText";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected } = useWallet();
  return (
    <header className="sticky top-0 w-full z-50 rounded-bottom-4">
      <SpotlightCard className="bg-black flex flex-col sm:flex-row sm:justify-between sm:items-center w-full border-r-8 rounded-sm rounded-b-3xl boii">
        {/* Mobile Header Row */}
        <div className="flex justify-between items-center p-2 sm:hidden">
          <Link to={"/"}>
            <GradientText className="text-3xl" animationSpeed={5}>
              Token Smith
            </GradientText>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 focus:outline-none"
          >
            {isMenuOpen ? (
              // X icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden sm:block sm:ml-4">
          <Link to={"/"}>
            <GradientText className="text-3xl" animationSpeed={5}>
              Token Smith
            </GradientText>
          </Link>
        </div>

        {/* Navigation Links (Mobile + Desktop) */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row sm:items-center sm:gap-8 p-2 sm:p-0`}
        >
          <Link
            to={"/swap"}
            className="sm:ml-8 flex items-center text-3xl p-2 sm:p-0"
          >
            <GradientText animationSpeed={5} className="text-3xl">
              Swap
            </GradientText>
          </Link>
          <Link
            to={"/solConnect"}
            className="sm:ml-8 flex items-center text-3xl p-2 sm:p-0"
          >
            <GradientText animationSpeed={5} className="text-3xl">
              solConnect
            </GradientText>
          </Link>
          <a
            className="sm:ml-8 flex items-center text-3xl p-2 sm:p-0"
            href="https://kohrts-solana-wallet.netlify.app/"
          >
            <GradientText animationSpeed={5} className="text-3xl">
              Wallet
            </GradientText>
          </a>

          {/* Wallet Button (Always Visible) */}
          <div className="flex items-center justify-end gap-2 p-2 sm:p-0 sm:ml-auto">
            <div className="flex flex-col">
              {connected ? (
                <WalletDisconnectButton />
              ) : (
                <WalletMultiButton>
                  <WalletIcon className="mr-2 mb-0.5 h-4 w-4" /> Select Wallet
                </WalletMultiButton>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </header>
  );
}
