import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

// 1. Declare the global interface to fix the TypeScript error
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract configuration [cite: 76, 77]
const CONTRACT_ADDRESS = "0xYourContractAddress";
const CONTRACT_ABI = [
  "function issueCertificate(bytes32 _hash, address _student) public",
  "function revokeCertificate(bytes32 _hash) public",
  "function isWhitelisted(address _issuer) public view returns (bool)"
];

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Connect MetaMask Wallet 
   */
  const connectWallet = useCallback(async () => {
    // Check if ethereum exists on window
    if (!window.ethereum) {
      setError("MetaMask is not installed.");
      return;
    }

    setIsLoading(true);
    try {
      // ethers v6 uses BrowserProvider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      
      setAccount(address);

      // Check if this wallet is an authorized issuer 
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const whitelisted = await contract.isWhitelisted(address);
      setIsWhitelisted(whitelisted);

      if (!whitelisted) {
        setError("This wallet is not authorized to issue certificates."); 
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mint Certificate on Polygon [cite: 32, 50, 92]
   * Core logic: Store the hash on-chain [cite: 90, 92]
   */
  const mintCertificate = async (certHash: string, studentAddress: string) => {
    if (!account || !isWhitelisted || !window.ethereum) {
      setError("Unauthorized: Connect an authorized wallet first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Execute on-chain transaction [cite: 47]
      const tx = await contract.issueCertificate(certHash, studentAddress);
      
      // Wait for block confirmation for finality 
      await tx.wait(); 
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message || "Transaction failed.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    account,
    isWhitelisted,
    isLoading,
    error,
    connectWallet,
    mintCertificate
  };
};