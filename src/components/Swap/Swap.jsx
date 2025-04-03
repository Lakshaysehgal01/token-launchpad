import { useEffect, useState } from "react";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import StarBorder from "../StarBorder/StarBorder";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "axios";
import GradientText from "../GradientText/GradientText";
import { toast, Toaster } from "sonner";
import Particles from "../Particles/Particles";

export default function Swap() {
  const [sol, setSol] = useState(0);
  const [usdc, setUsdc] = useState(0);
  const [quote, setQuote] = useState({});
  const [balance, setBalance] = useState(0);
  const wallet = useWallet();
  const connection = new Connection(import.meta.env.VITE_RPC_MAINET_URL);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!wallet || !wallet.publicKey) {
          return;
        }
        const balanceInLamports = await connection.getBalance(wallet.publicKey);
        const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

        setBalance(balanceInSOL);
      } catch (error) {
        throw new Error({
          status: "402",
          message: error,
        });
      }
    };

    fetchBalance();
  }, [wallet?.publicKey]);

  useEffect(() => {
    if (sol == 0) return;

    if (!sol || sol < 0) {
      toast.warning(`Invalid sol value: ${sol}`);
      return;
    }
    let isFetching = false;
    async function getQuote() {
      if (isFetching) return;
      isFetching = true;
      const api_url = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=${
        sol * LAMPORTS_PER_SOL
      }&swapMode=ExactIn&slippageBps=50`;
      try {
        const response = await axios.get(api_url);
        const swappedamount = response.data.outAmount / 1000000;
        setQuote(response.data);
        setUsdc(swappedamount);
      } catch (err) {
        console.log(err);
      } finally {
        isFetching = false;
      }
    }
    getQuote();
    const interval = setInterval(() => getQuote(), 30000);
    return () => clearInterval(interval);
  }, [sol]);

  const convert = async () => {
    if (!wallet.publicKey) {
      toast.error("Connect your wallet");
      throw new Error({
        status: "402",
        message: "Please connect your wallet",
      });
    }

    if (!quote) {
      toast.error("Please enter a amount");
      throw new Error({ status: "402", message: "Please enter a amount" });
    }

    if (sol == 0) {
      toast.error("Enter value greater than 0");
      throw new Error({
        status: "402",
        message: "Please enter a amount greater than zero",
      });
    }
    try {
      const {
        data: { swapTransaction },
      } = await axios.post("https://quote-api.jup.ag/v6/swap", {
        quote,
        userPublicKey: wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
      });
      const swaptranscationBuff = Buffer.from(swapTransaction, "base64");
      let transaction = VersionedTransaction.deserialize(swaptranscationBuff);
      const signedTransaction = await wallet.signTransaction(transaction);
      const rawTransaction = signedTransaction.serialize();

      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });
      toast.success("transaction completed");
    } catch (err) {
      toast.error("Error occured");
    }
  };

  const handleCLick = () => {
    toast.error("Insufficent Balance");
  };
  return (
    <>
      <Toaster />
      <div className="relative h-[90vh] w-full flex items-center justify-center bg-black overflow-hidden px-4">
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
        <div className="relative z-10 w-full max-w-[500px] md:max-w-[50vw]">
          <SpotlightCard className="border rounded-xl opacity-90 p-6 w-full">
            <div className="mb-5">
              <div className="flex justify-between items-center mb-5">
                {/* Heading */}
                <GradientText
                  className="text-2xl md:text-3xl font-bold"
                  animationSpeed={5}
                >
                  Swap your Solana with USDC
                </GradientText>
              </div>
              <p className="text-red-500 text-sm opacity-75">Slippage - 0.5%</p>
            </div>

            {/* Input Fields */}
            <div className="grid gap-4">
              {/* Solana Input */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Solana Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter Solana amount"
                  className="w-full text-white bg-[#0D0D0D] border border-gray-600 rounded p-3 md:p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  value={sol}
                  onChange={(e) => {
                    setSol(e.target.value);
                  }}
                />
              </div>

              {/* USDC Input */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Converted Amount (USDC)
                </label>
                <input
                  type="number"
                  placeholder="Converted amount in USDC"
                  className="w-full bg-[#0D0D0D] border border-gray-600 rounded p-3 md:p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  readOnly={true}
                  value={usdc}
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mt-6">
              {sol > balance ? (
                <StarBorder
                  color="red"
                  as="button"
                  className="bg-[#333333] w-full text-black px-4 md:px-6 py-3 md:py-4 rounded hover:bg-red-700 hover:text-white transition-colors duration-300"
                  onClick={handleCLick}
                >
                  Insufficient Balance
                </StarBorder>
              ) : (
                <StarBorder
                  color="red"
                  onClick={convert}
                  className="bg-[#333333] w-full text-black px-4 md:px-6 py-3 md:py-4 rounded hover:bg-red-700 hover:text-white transition-colors duration-300"
                >
                  Swap
                </StarBorder>
              )}
            </div>
          </SpotlightCard>
        </div>
      </div>
    </>
  );
}
