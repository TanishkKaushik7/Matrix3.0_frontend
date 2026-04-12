import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}
export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState(true); // Always true for now based on your previous setup

  const normalizeAddress = (address: string) => {
    try {
      return ethers.getAddress(address);
    } catch {
      return address;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const onAccountsChanged = (accounts: string[]) => {
      const normalized = accounts.map(normalizeAddress);
      setAvailableAccounts(normalized);
      setAccount(normalized[0] ?? null);
    };

    window.ethereum.on('accountsChanged', onAccountsChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', onAccountsChanged);
      }
    };
  }, []);

  const connectWallet = useCallback(async (forceAccountPrompt = false) => {
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

      // Force MetaMask to show the account picker when user explicitly wants to choose.
      if (forceAccountPrompt) {
        try {
          await provider.send('wallet_requestPermissions', [{ eth_accounts: {} }]);
        } catch (permissionErr: any) {
          if (permissionErr?.code === 4001) {
            throw permissionErr;
          }
        }
      }

      const grantedAccounts = (await provider.send('eth_requestAccounts', [])) as string[];
      const normalizedAccounts = grantedAccounts.map(normalizeAddress);

      if (normalizedAccounts.length === 0) {
        throw new Error('No MetaMask account is connected.');
      }

      setAvailableAccounts(normalizedAccounts);
      setAccount(normalizedAccounts[0]);
      setIsWhitelisted(true); // Placeholder for actual whitelist logic if needed later

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

  const selectAccount = useCallback(async (address: string) => {
    setError(null);

    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed.');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const authorized = (await provider.send('eth_accounts', [])) as string[];
      const normalizedAuthorized = authorized.map(normalizeAddress);
      const targetAddress = normalizeAddress(address);

      setAvailableAccounts(normalizedAuthorized);

      const hasAccess = normalizedAuthorized.some(
        (item) => item.toLowerCase() === targetAddress.toLowerCase()
      );

      if (!hasAccess) {
        throw new Error('Selected account is not authorized for this site. Click "Choose from MetaMask" first.');
      }

      const signer = await provider.getSigner(targetAddress);
      const signerAddress = normalizeAddress(await signer.getAddress());
      setAccount(signerAddress);
      setIsWhitelisted(true);
    } catch (err: any) {
      console.error('Account selection failed:', err);
      if (err.code === 4001) {
        setError('Account selection was rejected in MetaMask.');
      } else {
        setError(err.message || 'Failed to select MetaMask account.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setAvailableAccounts([]);
    setIsWhitelisted(false);
  }, []);

  return {
    account,
    availableAccounts,
    isWhitelisted,
    isLoading,
    error,
    connectWallet,
    selectAccount,
    disconnectWallet
  };
};