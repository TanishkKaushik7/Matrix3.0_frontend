import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  Hash, Zap, FileText, CheckCircle2, AlertCircle, X, User, 
  Calendar, GraduationCap, Fingerprint, Loader2 
} from 'lucide-react';
import { createCertificate, linkCertificateToken } from '../../services/issuerApi';
import { useAuth } from '../../context/AuthContext';

const CONTRACT_ADDRESS = import.meta.env.VITE_CERTIFICATE_CONTRACT_ADDRESS || "0x2D65DF28ab23C04aaE131B8472E57B65863741c8";

const CONTRACT_ABI = [
  "function mintCertificate(string cid, bytes32 hash) public"
];

const TARGET_CHAIN_ID = 1337n; 
const TARGET_CHAIN_ID_HEX = '0x539';

const getTxExplorerUrl = (chainId: bigint, txHash: string): string | null => {
  if (chainId === 80002n) return `https://amoy.polygonscan.com/tx/${txHash}`;
  if (chainId === 137n) return `https://polygonscan.com/tx/${txHash}`;
  return null;
};

const getChainLabel = (chainId: bigint): string => {
  if (chainId === 1337n) return 'Ganache Local (1337)';
  if (chainId === 80002n) return 'Polygon Amoy';
  if (chainId === 137n) return 'Polygon Mainnet';
  return `Chain ${chainId.toString()}`;
};

interface MintFormProps {
  onCancel?: () => void;
}

const MintForm: React.FC<MintFormProps> = ({ onCancel }) => {
  const { token, user } = useAuth();

  const [rollNumber, setRollNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [courseProgram, setCourseProgram] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [cgpa, setCgpa] = useState('');

  // 1. UPDATED STATE: Now stores the certificate_id from the backend
  const [blockchainData, setBlockchainData] = useState<{ id: number, cid: string, hash: string } | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txExplorerUrl, setTxExplorerUrl] = useState<string | null>(null);
  const [txChainLabel, setTxChainLabel] = useState<string>('');

  const [step, setStep] = useState<'idle' | 'hashing' | 'ready_to_mint' | 'minting' | 'linking' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleGeneratePayload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    setStep('hashing'); 
    
    try {
      const payload = {
        roll_number: rollNumber,
        student_name: studentName,
        course_program: courseProgram,
        passing_year: parseInt(passingYear), 
        cgpa: parseFloat(cgpa)              
      };

      const result = await createCertificate(payload, token);
      
      // 2. SAVE THE ID: We need this for the link-token step!
      setBlockchainData({ 
        id: result.certificate_id, 
        cid: result.cid, 
        hash: result.hash 
      });
      
      setStep('ready_to_mint');

    } catch (err: any) {
      setError(err.message || "Failed to generate payload. Is the backend online?");
      setStep('idle');
    }
  };

  const handleBlockchainMint = async () => {
    setError(null);
    setStep('minting');
    setTxHash(null);
    setTxExplorerUrl(null);
    setTxChainLabel('');

    if (!token) {
      setError("Session expired. Please log in again.");
      setStep('idle');
      return;
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed!");

      // Use let instead of const so we can refresh them after a network switch
      let provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      let signer = await provider.getSigner();
      const connectedWallet = await signer.getAddress();

      if (user?.wallet_address && connectedWallet.toLowerCase() !== user.wallet_address.toLowerCase()) {
        throw new Error(`Wrong wallet connected. Please switch to your registered issuer wallet: ${user.wallet_address.slice(0,6)}...`);
      }

      const network = await provider.getNetwork();
      
      // --- AUTO SWITCH LOGIC ---
      if (network.chainId !== TARGET_CHAIN_ID) {
        try {
          // Attempt to automatically switch the user's MetaMask to Ganache (Chain ID 1337 is 0x539 in hex)
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: TARGET_CHAIN_ID_HEX }], 
          });
          
          // Re-initialize provider and signer after successful switch
          provider = new ethers.BrowserProvider(window.ethereum);
          signer = await provider.getSigner();
        } catch (switchError: any) {
          // If they reject the switch or the network isn't added
          throw new Error("Please switch your MetaMask to the Ganache Local Network (Chain ID 1337).");
        }
      }

      if (!blockchainData) throw new Error("Missing IPFS data.");

      if (!ethers.isAddress(CONTRACT_ADDRESS)) {
        throw new Error(`Invalid contract address in frontend config: ${CONTRACT_ADDRESS}`);
      }

      const deployedCode = await provider.getCode(CONTRACT_ADDRESS);
      if (deployedCode === '0x') {
        throw new Error(
          `No smart contract is deployed at ${CONTRACT_ADDRESS} on chain ${TARGET_CHAIN_ID}. Update VITE_CERTIFICATE_CONTRACT_ADDRESS or redeploy the contract to the selected network.`
        );
      }

      const activeNetwork = await provider.getNetwork();
      setTxChainLabel(getChainLabel(activeNetwork.chainId));

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.mintCertificate(
        blockchainData.cid, 
        blockchainData.hash 
      );

      setTxHash(tx.hash);
      setTxExplorerUrl(getTxExplorerUrl(activeNetwork.chainId, tx.hash));

      await tx.wait();
      
      // 3. NEW STEP: Blockchain was successful, now update the database!
      setStep('linking');
      
      await linkCertificateToken({
        certificate_id: blockchainData.id,
        token_id: tx.hash as string 
      }, token as string); 
      
      console.log("Certificate Linked Successfully!");
      setStep('success');

    } catch (err: any) {
      console.error(err);
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError("Transaction was rejected in MetaMask.");
        setStep('ready_to_mint'); 
      } else {
        setError(err.message || "Smart contract or database update failed.");
        setStep('ready_to_mint');
      }
    }
  };

  const resetForm = () => {
    setStep('idle');
    setRollNumber('');
    setStudentName('');
    setCourseProgram('');
    setPassingYear('');
    setCgpa('');
    setBlockchainData(null);
    setTxHash(null);
    setTxExplorerUrl(null);
    setTxChainLabel('');
  };

  const handleCopyTxHash = async () => {
    if (!txHash) return;
    try {
      await navigator.clipboard.writeText(txHash);
    } catch {
      setError('Unable to copy transaction hash. Please copy it manually from logs.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 relative">
      
      <div className="flex items-end justify-between border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[10px] font-mono text-[#d2ad5e] uppercase tracking-widest">
              Action Required
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Issue Certificate
          </h1>
          <p className="text-[#8A8F98] text-sm mt-1">
            Generate an immutable cryptographic proof on the Polygon network.
          </p>
        </div>
        
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-[#8A8F98] hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <X size={14} className="group-hover:rotate-90 transition-transform duration-300" />
            Cancel
          </button>
        )}
      </div>

      <motion.div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        className="relative group bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
      >
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity: isFocused ? 1 : 0,
            background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(94,106,210,0.08), transparent 40%)`,
          }}
        />

        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/40 to-transparent" />

        <form onSubmit={handleGeneratePayload} className="p-8 md:p-10 relative z-10">
          
          {error && step === 'idle' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                  <Hash size={12} className="text-[#d2ad5e]" /> Roll Number
                </label>
                <input required value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} type="text" placeholder="e.g. UNI123" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-slate-600 font-mono" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                  <User size={12} className="text-[#d2ad5e]" /> Student Name
                </label>
                <input required value={studentName} onChange={(e) => setStudentName(e.target.value)} type="text" placeholder="Akshit Singh" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-slate-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                <FileText size={12} className="text-[#d2ad5e]" /> Course Program
              </label>
              <input required value={courseProgram} onChange={(e) => setCourseProgram(e.target.value)} type="text" placeholder="Bachelor of Technology in Computer Science" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-slate-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                  <Calendar size={12} className="text-[#d2ad5e]" /> Passing Year
                </label>
                <input required value={passingYear} onChange={(e) => setPassingYear(e.target.value)} type="number" placeholder="2026" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-slate-600 font-mono" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                  <GraduationCap size={12} className="text-[#d2ad5e]" /> Cumulative GPA
                </label>
                <input required value={cgpa} onChange={(e) => setCgpa(e.target.value)} type="number" step="0.01" max="10" placeholder="8.74" className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-slate-600 font-mono" />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98]">
                Backend Node: Online
              </span>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 bg-[#d2ad5e] hover:bg-[#efae21] text-white text-sm font-semibold rounded-xl shadow-[0_0_30px_rgba(94,106,210,0.3)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Generate Payload <FileText size={16} />
            </button>
          </div>
        </form>

        {/* --- DYNAMIC UX OVERLAYS --- */}
        <AnimatePresence>
          
          {step === 'hashing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#050506]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
              <Loader2 size={48} className="text-[#5E6AD2] animate-spin mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">Generating Immutable Hash...</h3>
              <p className="text-sm text-[#8A8F98]">Structuring metadata and securing decentralized storage.</p>
            </motion.div>
          )}

          {step === 'ready_to_mint' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="absolute inset-0 bg-[#050506]/95 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(94,106,210,0.1)]">
                <CheckCircle2 size={44} className="text-[#5E6AD2]" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Ready to Mint</h3>
              <p className="text-[#8A8F98] text-sm mb-8 max-w-sm">
                Payload generated successfully. Please sign the transaction using your authorized issuer wallet to record it on Polygon.
              </p>
              
              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg max-w-sm text-balance">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setStep('idle')} className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white">Cancel</button>
                <button onClick={handleBlockchainMint} className="px-8 py-3 bg-[#5E6AD2] text-white font-bold rounded-xl shadow-[0_0_30px_rgba(94,106,210,0.4)] flex items-center gap-2 transition-transform active:scale-[0.98]">
                  Confirm on MetaMask <Zap size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'minting' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#050506]/95 backdrop-blur-md z-[70] flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Awaiting Blockchain Confirmation</h3>
              <p className="text-sm text-amber-500/80 animate-pulse">Please check your MetaMask popup and approve the transaction.</p>
            </motion.div>
          )}

          {/* NEW STATE: Syncing to database */}
          {step === 'linking' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#050506]/95 backdrop-blur-md z-[70] flex flex-col items-center justify-center p-6 text-center">
              <Loader2 size={48} className="text-emerald-500 animate-spin mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-2">Transaction Successful!</h3>
              <p className="text-sm text-emerald-500/80 animate-pulse">Syncing blockchain record with the database...</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-[#050506] z-[80] flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                <CheckCircle2 size={44} className="text-emerald-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Certificate Issued ✅</h3>
              <p className="text-slate-400 text-sm mb-10 max-w-md leading-relaxed">
                The transaction has been successfully mined on <span className="text-white">{txChainLabel || 'the selected network'}</span>. The certificate hash for student <span className="font-mono text-white">{rollNumber}</span> is now an immutable public record.
              </p>
              {txHash && (
                <p className="text-xs text-slate-500 mb-6 font-mono break-all max-w-xl">
                  Tx Hash: {txHash}
                </p>
              )}
              <div className="flex gap-4">
                <button onClick={resetForm} className="px-8 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl text-sm font-medium text-white transition-all">Issue Another</button>
                {txExplorerUrl ? (
                  <a href={txExplorerUrl} target="_blank" rel="noreferrer" className="px-8 py-3 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#5E6AD2] rounded-xl text-sm font-medium hover:bg-[#5E6AD2]/20 transition-all flex items-center gap-2">
                    <Fingerprint size={14} /> View on Explorer
                  </a>
                ) : (
                  <button onClick={handleCopyTxHash} type="button" className="px-8 py-3 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#5E6AD2] rounded-xl text-sm font-medium hover:bg-[#5E6AD2]/20 transition-all flex items-center gap-2">
                    <Fingerprint size={14} /> Copy Tx Hash
                  </button>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MintForm;