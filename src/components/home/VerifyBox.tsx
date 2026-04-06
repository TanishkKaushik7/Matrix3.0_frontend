import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  Loader2, 
  Fingerprint, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const VerifyBox = () => {
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  
  // Spotlight effect logic
  const boxRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    
    setStatus('verifying');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate BC latency
    
    setStatus(uid.toUpperCase().includes('BN') ? 'valid' : 'invalid');
  };

  return (
    <div className="w-full max-w-[480px]">
      <motion.div
        ref={boxRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group bg-[#0A0A0C]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2.5rem] p-10 overflow-hidden shadow-2xl"
      >
        {/* Top Metallic Highlight Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Dynamic Spotlight */}
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(94,106,210,0.1), transparent 40%)`,
          }}
        />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Trustless Verifier</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instantly validate credentials directly from the blockchain registry using Keccak-256 hashes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={18} />
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Certificate UID or Transaction Hash"
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#5E6AD2]/50 focus:bg-black/60 transition-all font-mono"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={status === 'verifying' || !uid}
                className="flex-1 bg-white text-black hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
              >
                {status === 'verifying' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Verify Now
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="w-16 bg-white/[0.03] border border-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-[0.95]"
                title="Scan QR Code"
              >
                <QrCode size={22} />
              </button>
            </div>
          </form>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {status === 'valid' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400 text-sm font-bold uppercase tracking-widest">
                    <ShieldCheck size={20} />
                    <span>Authentication Successful</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono uppercase tracking-[0.1em]">
                    <div className="space-y-1">
                      <p className="text-slate-500">Registry Status</p>
                      <p className="text-white">Confirmed</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500">Node Sync</p>
                      <p className="text-white">Polygon Amoy</p>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-emerald-500 text-black text-xs font-bold rounded-xl transition-all hover:bg-emerald-400 flex items-center justify-center gap-2">
                    Verify IPFS Payload <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'invalid' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                    <AlertTriangle className="text-red-500" size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-red-400 text-sm font-bold uppercase tracking-widest pt-2">Invalid Asset</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      No matching cryptographic proof found on-chain. This identifier may be forged or revoked.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Technical Footer */}
          <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
              <Fingerprint size={12} className="text-[#5E6AD2]" /> 
              Local SHA-256 Run
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.05]">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                Registry Live
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyBox;