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
- **Blockchain**: Solana, @solana/web3.js, @solana/spl-token# Token Launchpad

Token Launchpad is a decentralized application built on the Solana blockchain. It allows users to create, mint, transfer tokens, swap SOL for USDC, and request SOL airdrops. The application integrates wallet authentication and provides an interactive and visually appealing user interface.

## Features

1. **Token Creation**:
   - Create custom tokens with metadata (name, symbol, image, description).
   - Mint tokens with a specified total supply and decimals.
   - Store metadata on IPFS using Pinata.

2. **Token Minting**:
   - Mint additional tokens for an existing token address.

3. **Token Transfer**:
   - Transfer tokens to other wallet addresses.

4. **Token Swap**:
   - Swap SOL for USDC using the Jupiter Aggregator API.
   - Real-time quote fetching with slippage handling.

5. **Solana Faucet**:
   - Request SOL airdrops on the Solana Devnet.
   - Check wallet balance and send SOL to other addresses.

6. **Wallet Integration**:
   - Authenticate users via wallet signature.
   - Support for Solana wallets using `@solana/wallet-adapter`.

7. **Interactive UI**:
   - Built with React, TailwindCSS, and custom components.
   - Includes animations and visually appealing effects using Framer Motion.

## Tech Stack

- **Frontend**: React, TailwindCSS, Framer Motion
- **Blockchain**: Solana, `@solana/web3.js`, `@solana/spl-token`
- **Wallet Integration**: `@solana/wallet-adapter`
- **API Integration**: Jupiter Aggregator API for token swaps
- **File Storage**: Pinata for storing token metadata
- **Build Tool**: Vite

## Project Structure

- **`src/AuthProvider.jsx`**: Handles wallet authentication and JWT token management.
- **`src/App.jsx`**: Main application file with routing and wallet integration.
- **`src/components/TokenLaunch.jsx`**: Component for creating and minting tokens.
- **`src/components/Mint/Mint.jsx`**: Component for minting additional tokens.
- **`src/components/Send/Send.jsx`**: Component for transferring tokens.
- **`src/components/Swap/Swap.jsx`**: Component for swapping SOL to USDC.
- **`src/components/SolFaucet/SolFaucet.jsx`**: Component for requesting SOL airdrops and managing wallet balance.
- **`src/components/Header.jsx`**: Header with navigation and wallet connection options.
- **`src/components/Home/Home.jsx`**: Home page with an overview of the application.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Token-launchpad
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_RPC_DEVNET_URL=<Your Solana Devnet RPC URL>
   VITE_RPC_MAINET_URL=<Your Solana Mainnet RPC URL>
   VITE_PINATA_API_JWT=<Your Pinata API JWT>
   VITE_PINATA_GATEWAY=<Your Pinata Gateway>
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Usage

- **Token Creation**: Navigate to the "Token" page to create and mint your own tokens.
- **Token Minting**: Use the "Mint" page to mint additional tokens for an existing token address.
- **Token Transfer**: Use the "Send" page to transfer tokens to other wallet addresses.
- **Token Swap**: Use the "Swap" page to exchange SOL for USDC.
- **Airdrop Request**: Visit the "SolConnect" page to request SOL airdrops and manage your wallet balance.

## License

This project is licensed under the MIT License.
- **Wallet Integration**: @solana/wallet-adapter
- **API**: Jupiter Aggregator API for token swaps
- **File Storage**: Pinata for storing token metadata
- **Build Tool**: Vite

