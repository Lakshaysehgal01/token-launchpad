//start from sign tommorow dependency installed
//uninstall bs58
import bs58 from "bs58";
import Hyperspeed from "../Hyperspeed/Hyperspeed";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import GradientText from "../GradientText/GradientText";
import { Signature } from "lucide-react";
import StarBorder from "../StarBorder/StarBorder";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { Transaction as SolTransaction } from "@solana/web3.js";
import { toast, Toaster } from "sonner";
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
      toast.error("Connect your wallet ");
    }
    try {
      await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      toast.success(
        `${amount} sol has been added to ${wallet.publicKey.toBase58()}`
      );
    } catch (err) {
      console.log(err);
      toast.error("error occured");
    }
  };

  async function showBalance() {
    if (!wallet.publicKey) {
      toast.error(`Please connect your wallet`);
    }
    let balance = await connection.getBalance(wallet.publicKey);
    setSol(balance / LAMPORTS_PER_SOL);
    toast.success("Updated");
  }
  useEffect(() => {
    if (wallet.publicKey) {
      showBalance();
    }
  }, [wallet.publicKey]);

  const signing = async () => {
    if (!wallet.publicKey) {
      toast.error(`Walllet not connected `);
      return;
    }
    if (!wallet.signMessage) {
      toast.error(`Wallet doesnt support signing`);
      return;
    }

    const encodeMSg = new TextEncoder().encode(msg);
    const signature = await wallet.signMessage(encodeMSg);
    toast.success(`Message succesfully signed`);
    toast.info(`sign: ${bs58.encode(signature)}`);
  };

  const sendSol = async () => {
    if (!wallet.publicKey) {
      toast.error("Connect your wallet ");
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
    toast.success("Money succesfully sent ");
  };

  return (
    <>
      <div className="flex items-center h-[90vh] overflow-hidden justify-center relative bg-black">
        <Hyperspeed />
        <Toaster />
        <SpotlightCard className="border rounded-xl opacity-90">
          <div className="mb-5">
            <GradientText
              animationSpeed={5}
              className="text-3xl font-bold mb-2 "
            >
              Wallet
            </GradientText>
            <p className="text-red-500 text-sm opacity-75 text-center">
              (Connected to devnet)
            </p>
          </div>

          <div className="flex flex-wrap w-[50vw] -mx-2">
            {/* Airdrop */}
            <div className="w-full px-2 mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Request Airdrop
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Enter Solana amount"
                  className="flex-grow text-white bg-[#0D0D0D] border border-gray-600 rounded p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
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
            <div className="w-full px-2 mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Balance
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Solan in your Account"
                  className="flex-grow bg-[#0D0D0D] border border-gray-600 rounded p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  readOnly={true}
                  value={sol}
                />
                <StarBorder as="button" color="red" onClick={showBalance}>
                  Update Balance
                </StarBorder>
              </div>
            </div>

            {/* Sign a Message */}
            <div className="w-full px-2 mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Sign a Message
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Sign a Message "
                  className="flex-grow bg-[#0D0D0D] border border-gray-600 rounded p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <StarBorder
                  as="button"
                  color="red"
                  className="flex items-center justify-center space-x-2"
                  onClick={signing}
                >
                  <Signature className="inline-block" />
                  <span className="inline-block">Sign</span>
                </StarBorder>
              </div>
            </div>

            {/* Send Sol */}
            <div className="w-full px-2 mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Send Sol
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Recipient (public address)"
                  className="flex-grow bg-[#0D0D0D] border border-gray-600 rounded p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-1/4 bg-[#0D0D0D] border border-gray-600 rounded p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
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
    </>
  );
}
