import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  ShieldCheck, 
  Hash, 
  Globe, 
  Zap, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const MintForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [step, setStep] = useState<'idle' | 'uploading' | 'signing' | 'success'>('idle');
  
  // Spotlight effect for the card
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);
    
    // Step 1: Uploading to IPFS [cite: 32, 43]
    setStep('uploading');
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 2: Signing Transaction on Polygon [cite: 47, 82]
    setStep('signing');
    await new Promise(r => setTimeout(r, 2000));
    
    setStep('success');
    setIsMinting(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Form Header */}
      <div className="flex items-end justify-between border-b border-white/[0.06] pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            Issue Certificate
          </h1>
          <p className="text-foreground-muted text-sm mt-1">
            Mint a new tamper-proof asset on Polygon Amoy Testnet. 
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-foreground-subtle tracking-wider uppercase">
          <Globe size={12} className="text-accent" /> Network: Polygon Amoy
        </div>
      </div>

      <motion.div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        className="relative group bg-[#050506] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Interactive Spotlight Overlay */}
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity: isFocused ? 1 : 0,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(94,106,210,0.1), transparent 40%)`,
          }}
        />

        <form onSubmit={handleMint} className="p-8 space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Metadata */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-foreground-subtle flex items-center gap-2">
                  <Hash size={12} /> Student ID / UID {/* [cite: 41, 92] */}
                </label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. BN-2024-001"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-foreground-subtle flex items-center gap-2">
                  <Plus size={12} /> Student Wallet Address {/* [cite: 92] */}
                </label>
                <input 
                  required
                  type="text"
                  placeholder="0x..."
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-foreground-subtle flex items-center gap-2">
                  <FileText size={12} /> Achievement Name
                </label>
                <input 
                  required
                  type="text"
                  placeholder="B.Tech Computer Science"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent/50 outline-none transition-all"
                />
              </div>
            </div>

            {/* Right Column: File Upload */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-widest text-foreground-subtle">
                Certificate Asset (IPFS) {/* [cite: 32, 59] */}
              </label>
              <div className="h-[210px] border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02] flex flex-col items-center justify-center group/upload hover:border-accent/40 transition-colors cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="bg-white/[0.05] p-4 rounded-full mb-3 group-hover/upload:scale-110 transition-transform">
                  <Upload size={24} className="text-foreground-muted group-hover/upload:text-accent" />
                </div>
                <p className="text-xs text-foreground-muted font-medium">
                  {file ? file.name : "Drop certificate PDF/PNG"}
                </p>
                <p className="text-[10px] text-foreground-subtle mt-1 uppercase tracking-tighter">
                  Max Size: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3 text-foreground-subtle">
              <ShieldCheck size={18} className="text-accent" />
              <span className="text-[10px] uppercase tracking-widest font-medium">
                Verified Issuer Status: Active {/* [cite: 32] */}
              </span>
            </div>

            <button
              disabled={isMinting}
              className="px-8 py-3 bg-accent hover:bg-accent-bright text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(94,106,210,0.3)] disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"
            >
              {isMinting ? "Processing..." : "Mint on Polygon"} 
              <Zap size={16} fill="currentColor" />
            </button>
          </div>
        </form>

        {/* Progress Overlay */}
        <AnimatePresence>
          {isMinting && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050506]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-16 h-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {step === 'uploading' ? 'Uploading to IPFS...' : 'Signing Transaction...'} {/* [cite: 32, 47] */}
              </h3>
              <p className="text-sm text-foreground-muted max-w-xs">
                {step === 'uploading' 
                  ? 'Decentralizing document storage via Pinata.' 
                  : 'Confirm the request in your MetaMask wallet.'}
                {/* [cite: 36, 68] */}
              </p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#050506] z-[60] flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Certificate Minted! {/* [cite: 50] */}</h3>
              <p className="text-foreground-muted text-sm mb-8 max-w-sm">
                The transaction is confirmed on-chain. The student can now view their digital ownership in their wallet. {/* [cite: 25, 42] */}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('idle')}
                  className="px-6 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-lg text-sm transition-colors"
                >
                  Issue Another
                </button>
                <button className="px-6 py-2 bg-accent/10 border border-accent/20 text-accent rounded-lg text-sm transition-colors">
                  View on Explorer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Security Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
        <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-foreground-muted leading-relaxed uppercase tracking-tight">
          This action is permanent. Once the keccak256 hash is recorded on the blockchain registry, it cannot be edited—only revoked by authorized smart contract calls. {/* [cite: 56, 80, 90, 92] */}
        </p>
      </div>
    </div>
  );
};

export default MintForm;