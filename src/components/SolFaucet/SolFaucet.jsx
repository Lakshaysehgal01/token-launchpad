import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction as SolTransaction,
} from "@solana/web3.js";
import { toast, Toaster } from "sonner";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import GradientText from "../GradientText/GradientText";
import StarBorder from "../StarBorder/StarBorder";
import { Signature } from "lucide-react";
import Particles from "../Particles/Particles";

export default function SolFaucet() {
  const [amount, setAmount] = useState(1);
  const [sol, setSol] = useState(0);
  const [msg, setMsg] = useState("");
  const wallet = useWallet();
  const [to, setTo] = useState("");
  const [sendMoney, setSendMoney] = useState(0);
  const { connection } = useConnection();

  const requestAirdrop = async () => {
    if (!wallet.publicKey) {
      toast.error("Connect your wallet");
      return;
    }
    try {
      await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      toast.success(
        `${amount} SOL has been added to ${wallet.publicKey.toBase58()}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Error occurred");
    }
  };

  async function showBalance() {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    let balance = await connection.getBalance(wallet.publicKey);
    setSol(balance / LAMPORTS_PER_SOL);
    toast.success("Balance updated");
  }

  useEffect(() => {
    if (wallet.publicKey) {
      showBalance();
    }
  }, [wallet.publicKey]);

  const signing = async () => {
    if (!wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    if (!wallet.signMessage) {
      toast.error("Wallet doesn't support signing");
      return;
    }

    const encodeMsg = new TextEncoder().encode(msg);
    const signature = await wallet.signMessage(encodeMsg);
    toast.success("Message successfully signed");
    toast.info(`Sign: ${Buffer.from(signature).toString("base64")}`);
  };

  const sendSol = async () => {
    if (!wallet.publicKey) {
      toast.error("Connect your wallet");
      return;
    }
    const transaction = new SolTransaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(to),
        lamports: sendMoney * LAMPORTS_PER_SOL,
      })
    );

    await wallet.sendTransaction(transaction, connection);
    toast.success("Money successfully sent");
  };

  return (
    <>
      <Toaster />
      <div className="relative h-[90vh] w-full flex items-center justify-center bg-black overflow-hidden">
        {/* Particles as Background */}
        <div className="absolute inset-0 z-0">
          <Particles
            particleColors={["#ffffff", "#ffffff"]}
            particleCount={800}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={false}
            alphaParticles={true}
            disableRotation={false}
          />
        </div>

        {/* Spotlight Card in the Foreground */}
        <div className="relative z-10">
          <SpotlightCard className="w-full max-w-2xl border rounded-xl opacity-90 p-6">
            <div className="mb-5 text-center">
              <GradientText className="text-3xl font-bold" animationSpeed={5}>
                Wallet
              </GradientText>
              <p className="text-red-500 text-sm opacity-75">
                (Connected to devnet)
              </p>
            </div>

            <div className="space-y-6">
              {/* Airdrop */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Request Airdrop
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="number"
                    placeholder="Enter SOL amount"
                    className="flex-grow bg-[#0D0D0D] border border-gray-600 rounded p-4 text-white focus:ring-2 focus:ring-gray-600"
                    min={0.1}
                    step={0.1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <StarBorder as="button" color="red" onClick={requestAirdrop}>
                    Drop
                  </StarBorder>
                </div>
              </div>

              {/* Balance */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Balance
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-grow bg-[#0D0D0D] border border-gray-600 rounded p-4 text-white focus:ring-2 focus:ring-gray-600"
                    readOnly
                    value={sol}
                  />
                  <StarBorder as="button" color="red" onClick={showBalance}>
                    Update
                  </StarBorder>
                </div>
              </div>

              {/* Sign a Message */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Sign a Message
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    placeholder="Enter message"
                    className="flex-grow bg-[#0D0D0D] border border-gray-600 rounded p-4 text-white focus:ring-2 focus:ring-gray-600"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <StarBorder as="button" color="red" onClick={signing}>
                    <Signature className="inline-block" /> Sign
                  </StarBorder>
                </div>
              </div>

              {/* Send Sol */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Send SOL
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    className="flex-grow bg-[#0D0D0D] border border-gray-600 rounded p-4 text-white focus:ring-2 focus:ring-gray-600"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-1/4 bg-[#0D0D0D] border border-gray-600 rounded p-4 text-white focus:ring-2 focus:ring-gray-600"
                    value={sendMoney}
                    onChange={(e) => setSendMoney(e.target.value)}
                  />
                  <StarBorder as="button" color="red" onClick={sendSol}>
                    Send
                  </StarBorder>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </>
  );
}
