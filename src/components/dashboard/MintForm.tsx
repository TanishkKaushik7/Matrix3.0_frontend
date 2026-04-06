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
  AlertCircle,
  X
} from 'lucide-react';

// Define the Props Interface to fix the TypeScript error
interface MintFormProps {
  onCancel?: () => void;
}

const MintForm: React.FC<MintFormProps> = ({ onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [step, setStep] = useState<'idle' | 'uploading' | 'signing' | 'success'>('idle');
  
  // Interactive Spotlight logic
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
    
    setStep('uploading');
    await new Promise(r => setTimeout(r, 1500));
    
    setStep('signing');
    await new Promise(r => setTimeout(r, 2000));
    
    setStep('success');
    setIsMinting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Dynamic Header with Cancel Action */}
      <div className="flex items-end justify-between border-b border-white/[0.06] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 rounded bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[10px] font-mono text-[#5E6AD2] uppercase tracking-widest">
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
        {/* Spotlight Overlay */}
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity: isFocused ? 1 : 0,
            background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(94,106,210,0.08), transparent 40%)`,
          }}
        />

        {/* Top Metallic Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/40 to-transparent" />

        <form onSubmit={handleMint} className="p-10 space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Metadata Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                  <Hash size={12} /> Student ID
                </label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. GBU-CS-2024-042"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-[#3A3A40]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                  <Plus size={12} /> Student Wallet
                </label>
                <input 
                  required
                  type="text"
                  placeholder="0x..."
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-[#3A3A40]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1 flex items-center gap-2">
                  <FileText size={12} /> Achievement Type
                </label>
                <input 
                  required
                  type="text"
                  placeholder="B.Tech Degree / Internship"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all placeholder:text-[#3A3A40]"
                />
              </div>
            </div>

            {/* Asset Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98] ml-1">
                Certificate Asset
              </label>
              <div className="h-full min-h-[220px] border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center group/upload hover:border-[#5E6AD2]/40 hover:bg-[#5E6AD2]/5 transition-all cursor-pointer relative overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="bg-white/[0.05] p-5 rounded-2xl mb-4 group-hover/upload:scale-110 group-hover/upload:bg-[#5E6AD2]/20 transition-all duration-500">
                  <Upload size={28} className="text-[#8A8F98] group-hover/upload:text-[#5E6AD2]" />
                </div>
                <p className="text-sm text-white font-medium">
                  {file ? file.name : "Drop certificate file"}
                </p>
                <p className="text-[10px] text-[#8A8F98] mt-2 uppercase tracking-widest">
                   PDF, PNG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8F98]">
                BhoomiNet Node: Operational
              </span>
            </div>

            <div className="flex items-center gap-4">
              {onCancel && (
                <button 
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 text-sm font-medium text-[#8A8F98] hover:text-white transition-colors"
                >
                  Discard
                </button>
              )}
              <button
                disabled={isMinting}
                className="px-8 py-3 bg-[#5E6AD2] hover:bg-[#6872D9] text-white text-sm font-semibold rounded-xl shadow-[0_0_30px_rgba(94,106,210,0.3)] disabled:opacity-50 transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                {isMinting ? "Processing..." : "Mint Certificate"} 
                <Zap size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </form>

        {/* Dynamic Progress Overlays */}
        <AnimatePresence>
          {isMinting && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050506]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-[#5E6AD2]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#5E6AD2] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(94,106,210,0.4)]" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                {step === 'uploading' ? 'Publishing to IPFS' : 'Signing Transaction'}
              </h3>
              <p className="text-sm text-[#8A8F98] max-w-xs leading-relaxed">
                {step === 'uploading' 
                  ? 'Establishing a decentralized document hash via IPFS protocol.' 
                  : 'Validating cryptographic keys on the Polygon Amoy registry.'}
              </p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#050506] z-[60] flex flex-col items-center justify-center p-10 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={44} className="text-emerald-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Asset Authenticated</h3>
              <p className="text-[#8A8F98] text-sm mb-10 max-w-sm leading-relaxed">
                The certificate hash is now immutable on the blockchain. 
                Transaction confirmed on the Polygon Amoy network.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('idle')}
                  className="px-8 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl text-sm font-medium text-white transition-all"
                >
                  Issue Another
                </button>
                <button className="px-8 py-3 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#5E6AD2] rounded-xl text-sm font-medium hover:bg-[#5E6AD2]/20 transition-all">
                  Explorer Link
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Permanence Disclaimer */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10">
        <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#8A8F98] leading-relaxed uppercase tracking-[0.05em]">
          Permanent Action Protocol: Once recorded on the blockchain registry, Keccak256 hashes are immutable. 
          Verification of student data is the responsibility of the issuer prior to signing.
        </p>
      </div>
    </div>
  );
};

export default MintForm;