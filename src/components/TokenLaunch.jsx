import { useState } from "react";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMint,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { PinataSDK } from "pinata-web3";
import StarBorder from "./StarBorder/StarBorder";
import SpotlightCard from "./SpotlightCard/SpotlightCard";
import GradientText from "./GradientText/GradientText";
import { toast, Toaster } from "sonner";
import Particles from "./Particles/Particles";
import Loader from "./Loader/Loader";
import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
export default function TokenLaunch() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [tokenAddress, setTokenAddress] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [newToken, setNewToken] = useState({
    name: "",
    symbol: "",
    image: "",
    totalSupply: 1000000,
    description: "",
    decimal: 9,
  });
  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_API_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
  });

  const createUploadMetaData = async (name, symbol, description, image) => {
    const metadata = JSON.stringify({
      name,
      symbol,
      image,
      description,
    });
    const metadataFile = new File([metadata], "metadata.json", {
      type: "application/json",
    });
    try {
      const result = await pinata.upload.file(metadataFile);
      return result.IpfsHash;
    } catch (err) {
      toast.error("Problem occured ");
    }
  };
  const handleClick = async (e) => {
    // createMint();
    if (!wallet.publicKey) {
      toast.error("Connect your wallet");
      return;
    }
    if (
      !newToken.name ||
      !newToken.symbol ||
      !newToken.image ||
      !newToken.decimal ||
      !newToken.totalSupply ||
      !newToken.description
    ) {
      toast.error("Please fill out all the required fields.");
      return;
    }
    try {
      setIsLoader(true);
      const keypair = Keypair.generate();

      let metadataUri = await createUploadMetaData(
        newToken.name,
        newToken.symbol,
        newToken.description,
        newToken.image
      );

      metadataUri = `https://${
        import.meta.env.VITE_PINATA_GATEWAY
      }/ipfs/${metadataUri}`;
      const metadata = {
        mint: keypair.publicKey,
        name: newToken.name,
        symbol: newToken.symbol,
        uri: metadataUri,
        additionalMetadata: [],
      };
      const minLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      const lamport = await connection.getMinimumBalanceForRentExemption(
        metadataLen + minLen
      );

      const transcation = new Transaction();
      transcation.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: keypair.publicKey,
          space: minLen,
          lamports: lamport,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          keypair.publicKey,
          wallet.publicKey,
          keypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          keypair.publicKey,
          9,
          wallet.publicKey,
          wallet.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: keypair.publicKey,
          updateAuthority: wallet.publicKey,
          mint: keypair.publicKey,
          mintAuthority: wallet.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
        })
      );
      transcation.feePayer = wallet.publicKey;
      transcation.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transcation.partialSign(keypair);
      const sign = await wallet.sendTransaction(transcation, connection);

      setTokenAddress(keypair.publicKey.toBase58());
      toast.success("Token created");
      toast.success(`Token Address :- ${keypair.publicKey.toBase58()}`);
      const associatedToken = getAssociatedTokenAddressSync(
        keypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      const transcation2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          keypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createMintToInstruction(
          keypair.publicKey,
          associatedToken,
          wallet.publicKey,
          newToken.totalSupply * Math.pow(10, newToken.decimal),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      await wallet.sendTransaction(transcation2, connection);
      toast.success("Token minted successfully");
      setIsLoader(false);
    } catch (e) {
      setIsLoader(false);
      toast.error(` ${e}`);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.7 }}
    >
      <div className="relative w-full min-h-screen overflow-hidden bg-black">
        <Header />
        <Toaster />

        {/* Particles background */}
        <div className="static inset-0">
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

        {/* Centered card */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <SpotlightCard className="w-full max-w-4xl bg-opacity-90 border rounded-xl p-4 sm:p-8">
            <div className="mb-5 text-center">
              <GradientText
                animationSpeed={5}
                className="text-2xl sm:text-3xl font-bold mb-2"
              >
                Create Your Own Token
              </GradientText>
              <p className="text-sm opacity-75">(Connected to devnet)</p>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newToken.name}
                onChange={(e) =>
                  setNewToken({ ...newToken, name: e.target.value })
                }
                className="w-full text-white bg-[#0D0D0D] border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />

              <input
                type="text"
                placeholder="Symbol"
                value={newToken.symbol}
                onChange={(e) =>
                  setNewToken({ ...newToken, symbol: e.target.value })
                }
                className="w-full bg-[#0D0D0D] border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={newToken.image}
                onChange={(e) =>
                  setNewToken({ ...newToken, image: e.target.value })
                }
                className="w-full bg-[#0D0D0D] border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />

              <input
                type="number"
                placeholder="Initial Supply"
                value={newToken.totalSupply}
                onChange={(e) =>
                  setNewToken({
                    ...newToken,
                    totalSupply: Number(e.target.value),
                  })
                }
                className="w-full bg-[#0D0D0D] border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />

              <input
                type="text"
                placeholder="Description"
                value={newToken.description}
                onChange={(e) =>
                  setNewToken({ ...newToken, description: e.target.value })
                }
                className="w-full bg-[#0D0D0D] border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />

              <input
                type="number"
                min={1}
                max={9}
                placeholder="Decimal"
                value={newToken.decimal}
                onChange={(e) =>
                  setNewToken({ ...newToken, decimal: e.target.value })
                }
                className="w-full bg-[#0D0D0D] border border-gray-600 rounded p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>

            {/* Create Button */}
            <div className="flex justify-center mt-6">
              <StarBorder
                color="blue"
                onClick={handleClick}
                className="bg-[#333333] w-full sm:w-auto text-black px-6 py-3 sm:py-4 rounded hover:bg-[#0f3d8dfd] hover:text-white transition-colors duration-300"
              >
                {isLoader ? (
                  <div className="flex items-center gap-2">
                    <span>Creating token</span>
                    <Loader w={4} h={4} />
                  </div>
                ) : (
                  "Create"
                )}
              </StarBorder>
            </div>

            {/* Token Address Display */}
            {tokenAddress && (
              <div className="mt-4 text-white text-center">
                <h3>Public address of the created token:</h3>
                <GradientText
                  animationSpeed={5}
                  className="text-sm font-bold break-all"
                >
                  {tokenAddress}
                </GradientText>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </motion.div>
  );
}
