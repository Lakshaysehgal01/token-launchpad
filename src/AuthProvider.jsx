import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast, Toaster } from "sonner";

const AuthProvider = ({ children }) => {
  const { publicKey, connected, signMessage } = useWallet();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          "https://token-launchpad-backend.onrender.com/verify-token",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem("jwtToken");
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setAuthenticated(false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSignMessage = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    const message = `Sign this message to authenticate. Timestamp: ${Date.now()}`;
    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signature = await signMessage(encodedMessage);
      const res = await fetch(
        "https://token-launchpad-backend.onrender.com/auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            signature,
            publicKey: publicKey.toBase58(),
          }),
        }
      );
      const data = await res.json();
      if (data.jwtToken) {
        localStorage.setItem("jwtToken", data.jwtToken);
        toast.success("Authentication successfull");
        setAuthenticated(true);
      } else {
        toast.error("Authentication failed");
      }
    } catch (err) {
      console.error("Signing failed", err);
      toast.error("Failed to sign message");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4">
        <Toaster />
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-gray-500 animate-spin"></div>
        <p>To view Website you must be authenticated</p>
        <button
          onClick={handleSignMessage}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md transition-all duration-300 transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Authenticate
        </button>
      </div>
    );
  }

  return children;
};
export default AuthProvider;
