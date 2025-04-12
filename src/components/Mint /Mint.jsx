import {
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import Header from "../Header";
import Particles from "../Particles/Particles";
import SpotlightCard from "../SpotlightCard/SpotlightCard";
import GradientText from "../GradientText/GradientText";
import StarBorder from "../StarBorder/StarBorder";
import Loader from "../Loader/Loader";
import {motion} from "framer-motion";
export default function Mint() {
  const [add, setAdd] = useState("");
  const [totalSupply, setToatalSupply] = useState(1000000);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const handleClick = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!add || !totalSupply) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const mintPublicKey = new PublicKey(add);
      const mintInfo = await getMint(
        connection,
        mintPublicKey,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      const associateToken = getAssociatedTokenAddressSync(
        mintPublicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      const instruction = [];
      try {
        await getAccount(
          connection,
          associateToken,
          undefined,
          TOKEN_2022_PROGRAM_ID
        );
      } catch (e) {
        instruction.push(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associateToken,
            wallet.publicKey,
            mintPublicKey,
            TOKEN_2022_PROGRAM_ID
          )
        );
      }
      instruction.push(
        createMintToInstruction(
          mintPublicKey,
          associateToken,
          wallet.publicKey,
          totalSupply * Math.pow(10, mintInfo.decimals),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      const trx1 = new Transaction().add(...instruction);
      await wallet.sendTransaction(trx1, connection);
      toast.success("Token minted successfully");
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error(e.message || "Something went wrong");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.7 }}
    >
      <Toaster />
      <Header />
      <div className="relative h-[86vh] w-full flex items-center justify-center bg-black overflow-hidden px-4">
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
                  Mint more Tokens
                </GradientText>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid gap-4">
              {/* Address Input */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Token Address
                </label>
                <input
                  type="text"
                  placeholder="Enter Token Address"
                  className="w-full text-white bg-[#0D0D0D] border border-gray-600 rounded p-3 md:p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  value={add}
                  onChange={(e) => {
                    setAdd(e.target.value);
                  }}
                />
              </div>

              {/* Amount to mint */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="No of tokens you want to mint"
                  className="w-full bg-[#0D0D0D] border border-gray-600 rounded p-3 md:p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  value={totalSupply}
                  onChange={(e) => {
                    setToatalSupply(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mt-6">
              <StarBorder
                color="blue"
                onClick={handleClick}
                className="bg-[#333333] w-full text-black px-4 md:px-6 py-3 md:py-4 rounded hover:bg-blue-700 hover:text-white transition-colors duration-300"
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <span>Minting token</span>
                    <Loader w={4} h={4} />
                  </div>
                ) : (
                  "Mint"
                )}
              </StarBorder>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </motion.div>
  );
}
