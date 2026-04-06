import { useState } from 'react';
import { ethers } from 'ethers';

// [cite: 76, 77, 82]
const CONTRACT_ADDRESS = "0xYourContractAddress";
const CONTRACT_ABI = [
  "function verifyCertificate(bytes32 _hash) public view returns (bool, uint256, address, bool)"
];

interface VerificationResult {
  isValid: boolean;
  timestamp: number;
  issuer: string;
  isRevoked: boolean;
}

export const useVerify = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyCertificate = async (uid: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Initialize Provider (v6 syntax: ethers.JsonRpcProvider) [cite: 82]
      const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // 2. Recompute Hash (v6 syntax: ethers.keccak256 and ethers.toUtf8Bytes) [cite: 92]
      const certHash = uid.startsWith('0x') ? uid : ethers.keccak256(ethers.toUtf8Bytes(uid));

      // 3. Contract Read Call [cite: 45, 90]
      const [exists, timestamp, issuer, revoked] = await contract.verifyCertificate(certHash);

      if (!exists) {
        throw new Error("No record found for this Certificate ID."); // [cite: 49]
      }

      setResult({
        isValid: exists && !revoked,
        timestamp: Number(timestamp), // v6: Use Number() instead of .toNumber()
        issuer: issuer,
        isRevoked: revoked
      }); // [cite: 51]

    } catch (err: any) {
      setError(err.message || "Verification failed. Please check the UID.");
      console.error("Verification Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyCertificate,
    isLoading,
    result,
    error
  };
};