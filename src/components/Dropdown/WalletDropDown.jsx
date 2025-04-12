import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useRef, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const WalletDropDown = () => {
  const { publicKey, disconnect } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);
  const { connection } = useConnection();

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      }
    };
    fetchBalance();
  }, [publicKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shortAddress = (key) =>
    key.toBase58().slice(0, 4) + "..." + key.toBase58().slice(-4);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!publicKey) return null;

  return (
    <div className="relative z-6" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="bg-gray-800 text-white px-3 py-2 rounded-xl hover:bg-gray-700"
      >
        {shortAddress(publicKey)}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-[5] text-white">
          <div className="px-4 py-3">
            <div className="text-sm font-semibold">Connected Wallet</div>
            <div className="mt-2 text-sm z-30">
              💰 {balance?.toFixed(4)} SOL
            </div>

            <button
              onClick={handleCopy}
              className="mt-3 text-xs text-blue-400 hover:underline"
            >
              {copied ? "Copied!" : "Copy Address"}
            </button>

            <button
              onClick={disconnect}
              className="mt-3 text-xs text-red-400 hover:underline block"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropDown;
