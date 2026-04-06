import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, QrCode, ShieldCheck, AlertTriangle, Loader2, Fingerprint, ExternalLink } from 'lucide-react';

const VerifyBox = () => {
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  
  // Mouse spotlight effect
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
    // Simulate recomputing keccak256(certID + studentAddr + timestamp) [cite: 92]
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Mock logic: Valid if UID contains "BN"
    setStatus(uid.toUpperCase().includes('BN') ? 'valid' : 'invalid');
  };

  return (
    <div className="w-full max-w-[440px]">
      <motion.div
        ref={boxRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group bg-[#050506] border border-white/[0.06] rounded-2xl p-8 overflow-hidden shadow-2xl"
      >
        {/* Interactive Spotlight Overlay */}
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(94,106,210,0.1), transparent 40%)`,
          }}
        />

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Public Verifier</h2>
            <p className="text-sm text-foreground-muted">
              Instantly verify certificate authenticity directly from the blockchain[cite: 46, 90].
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Enter Certificate UID or Hash"
                className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all font-mono"
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              <button
                type="submit"
                disabled={status === 'verifying' || !uid}
                className="col-span-4 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'verifying' ? (
                  <Loader2 size={18} className="animate-spin text-accent" />
                ) : (
                  "Verify Credentials"
                )}
              </button>
              
              <button
                type="button"
                className="col-span-1 bg-accent/10 border border-accent/20 text-accent rounded-lg flex items-center justify-center hover:bg-accent/20 transition-all active:scale-[0.98]"
                title="Scan QR Code"
              >
                <QrCode size={20} />
              </button>
            </div>
          </form>

          {/* Verification Results */}
          <AnimatePresence mode="wait">
            {status === 'valid' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-3"
              >
                <div className="flex items-center gap-2 text-green-500 text-sm font-semibold">
                  <ShieldCheck size={18} />
                  <span>Certificate Valid [cite: 49]</span>
                </div>
                <div className="text-[11px] text-foreground-muted space-y-1 font-mono uppercase tracking-tight">
                  <p>Issuer: Verified Institution [cite: 32]</p>
                  <p>On-Chain Hash: 0x71c...a2f [cite: 80]</p>
                </div>
                <button className="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 text-xs rounded-md transition-all flex items-center justify-center gap-2">
                  View PDF on IPFS <ExternalLink size={12} />
                </button>
              </motion.div>
            )}

            {status === 'invalid' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start gap-3"
              >
                <AlertTriangle className="text-red-500 shrink-0" size={18} />
                <div className="space-y-1">
                  <p className="text-red-500 text-sm font-semibold">Verification Failed [cite: 49]</p>
                  <p className="text-[11px] text-foreground-muted leading-relaxed uppercase tracking-tight">
                    No matching record found in the blockchain registry. This certificate may be forged[cite: 23].
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Metadata */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-foreground-subtle font-mono uppercase tracking-widest">
              <Fingerprint size={12} /> 256-bit Hash Read
            </div>
            <span className="text-[10px] text-accent font-semibold tracking-tighter uppercase">
              Trustless Proof [cite: 61]
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyBox;