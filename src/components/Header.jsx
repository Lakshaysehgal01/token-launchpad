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
import WalletDropDown from "./Dropdown/WalletDropDown";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected } = useWallet();
  return (
    <header className="md:sticky top-0 w-full z-50 ">
      <SpotlightCard className=" flex flex-col sm:flex-row sm:justify-between sm:items-center w-full border-r-8 rounded-b-3xl px-4 py-2 overflow-visible bg-black">
        {/* Mobile Header Row */}
        <div className="flex justify-between items-center sm:hidden">
          <Link to={"/"}>
            <GradientText className="text-2xl font-bold" animationSpeed={5}>
              Home
            </GradientText>
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 focus:outline-none"
          >
            {isMenuOpen ? (
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
        <div className="hidden sm:block">
          <Link to={"/"}>
            <GradientText className="text-3xl font-bold" animationSpeed={5}>
              Home
            </GradientText>
          </Link>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row sm:items-center sm:gap-6 sm:justify-center mt-2 sm:mt-0`}
        >
          <Link to={"/token"} className="text-2xl p-2 sm:p-0">
            <GradientText animationSpeed={5} className="text-2xl">
              Token
            </GradientText>
          </Link>
          <Link to={"/swap"} className="text-2xl p-2 sm:p-0">
            <GradientText animationSpeed={5} className="text-2xl">
              Swap
            </GradientText>
          </Link>
          <Link to={"/solConnect"} className="text-2xl p-2 sm:p-0">
            <GradientText animationSpeed={5} className="text-2xl">
              SolConnect
            </GradientText>
          </Link>
          <Link to={"/mint"} className="text-2xl p-2 sm:p-0">
            <GradientText animationSpeed={5} className="text-2xl">
              Mint
            </GradientText>
          </Link>
          <Link to={"/send"} className="text-2xl p-2 sm:p-0">
            <GradientText animationSpeed={5} className="text-2xl">
              Send
            </GradientText>
          </Link>
          <a
            href="https://stalwart-empanada-9e4535.netlify.app/"
            className="text-2xl p-2 sm:p-0"
          >
            <GradientText animationSpeed={5} className="text-2xl">
              Wallet
            </GradientText>
          </a>

          {/* Wallet Button - Mobile */}
          <div className="block sm:hidden mt-2">
            {connected ? (
              <WalletDropDown />
            ) : (
              <WalletMultiButton>
                <WalletIcon className="mr-2 mb-0.5 h-4 w-4" /> Select Wallet
              </WalletMultiButton>
            )}
          </div>
        </div>

        {/* Wallet Button - Desktop (Right side) */}
        <div className="hidden sm:block sm:ml-4">
          {connected ? (
            <WalletDropDown />
          ) : (
            <WalletMultiButton>
              <WalletIcon className="mr-2 mb-0.5 h-4 w-4" /> Select Wallet
            </WalletMultiButton>
          )}
        </div>
      </SpotlightCard>
    </header>
  );
}
