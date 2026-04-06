import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}
export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState(true); // Always true for now based on your previous setup

  const connectWallet = useCallback(async () => {
    setError(null);

    // 1. Check if window.ethereum exists (MetaMask or similar wallet is installed)
    if (typeof window === 'undefined' || !window.ethereum) {
      const message = "MetaMask is not installed. Redirecting to download page...";
      setError(message);
      console.warn(message);
      
      // 2. Redirect to official MetaMask download page
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsLoading(true);

    try {
      // 3. Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // This will open the MetaMask popup asking the user to connect
      await provider.send("eth_requestAccounts", []);
      
      // 4. Get the connected signer and their address
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setIsWhitelisted(true); // Placeholder for actual whitelist logic if needed later

      // Optional: Setup event listener for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          // User disconnected their wallet from the site
          setAccount(null);
        }
      });

    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      // Handle the case where the user clicks "Reject" in the MetaMask popup
      if (err.code === 4001) {
        setError("Connection request rejected by user.");
      } else {
        setError(err.message || "Failed to connect wallet.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setIsWhitelisted(false);
  }, []);

  return {
    account,
    isWhitelisted,
    isLoading,
    error,
    connectWallet,
    disconnectWallet
  };
};