# Token Launchpad

Token Launchpad is a web application built on the Solana blockchain that allows users to create, manage, and interact with tokens. It includes features such as token creation, swapping SOL for USDC, and requesting airdrops on the Solana Devnet.

## Features

- **Token Creation**: Easily create your own tokens with metadata such as name, symbol, description, and image.
- **Token Swap**: Swap SOL for USDC using the Jupiter Aggregator API.
- **Airdrop Request**: Request SOL airdrops on the Solana Devnet.
- **Wallet Integration**:
 - Connect your Solana wallet to interact with the application.
  - Authenticate users via wallet signature.
- **Interactive UI**: Includes visually appealing components like animated gradients, spotlight effects, and hyperspeed animations.

## Tech Stack

- **Frontend**: React, TailwindCSS, Three.js
- **Blockchain**: Solana, @solana/web3.js, @solana/spl-token
- **Wallet Integration**: @solana/wallet-adapter
- **API**: Jupiter Aggregator API for token swaps
- **File Storage**: Pinata for storing token metadata
- **Build Tool**: Vite

