import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Fingerprint, Database } from 'lucide-react';

import VerifyBox from '../components/home/VerifyBox';

const VerifyPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-transparent">
      
      {/* Navigation Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-8 left-8"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors text-sm font-medium group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Portal
        </Link>
      </motion.div>

      <div className="w-full max-w-[500px] relative">
        {/* Centered Ambient Glow */}
        <div className="absolute -inset-10 bg-[#5E6AD2]/10 blur-[120px] opacity-40 -z-10 rounded-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Header Branding */}
          <div className="text-center space-y-3 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#5E6AD2]/20 bg-[#5E6AD2]/5 text-[#5E6AD2] text-[10px] font-mono tracking-widest uppercase"
            >
              <ShieldCheck size={12} /> Direct Blockchain Access
            </motion.div>
            
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Trustless Verifier
            </h1>
            <p className="text-sm text-[#8A8F98] leading-relaxed max-w-sm mx-auto">
              Enter a Certificate UID to recompute the cryptographic hash and verify its status on the Polygon network.
            </p>
          </div>

          {/* The Verification Core */}
          <VerifyBox />

          {/* Technical Metadata Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 grid grid-cols-2 gap-4 border-t border-white/[0.06]"
          >
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">
              <Fingerprint size={14} className="text-[#5E6AD2]" /> SHA-3 / Keccak
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest justify-end">
              <Database size={14} className="text-[#5E6AD2]" /> IPFS Indexed
            </div>
          </motion.div>
        </motion.div>

        {/* Security Disclaimer */}
        <p className="mt-12 text-center text-[10px] text-[#8A8F98]/50 uppercase tracking-[0.2em] leading-loose max-w-xs mx-auto">
          Verification is processed locally and on-chain. No data is stored on BhoomiNet servers during this check.
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;