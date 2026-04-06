import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Fingerprint, 
  Database, 
  Cpu, 
  Globe 
} from 'lucide-react';

import VerifyBox from '../components/home/VerifyBox';

const VerifyPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#050506] relative overflow-hidden">
      
      {/* 1. Background Layers (The "Rice") */}
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      
      {/* Ambient Mesh Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5E6AD2]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5E6AD2]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 2. Top Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-10 left-10 z-50"
      >
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[#8A8F98] hover:text-white hover:bg-white/[0.08] transition-all text-xs font-medium group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          System Portal
        </Link>
      </motion.div>

      {/* 3. Main Content Container */}
      <div className="w-full max-w-[540px] relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10"
        >
          {/* Header Branding */}
          <div className="text-center space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[#5E6AD2]/30 bg-[#5E6AD2]/10 text-[#7C87E8] text-[10px] font-mono tracking-[0.2em] uppercase"
            >
              <ShieldCheck size={12} className="animate-pulse" /> 
              On-Chain Verification Node
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tight text-white italic">
                Trustless<span className="text-[#5E6AD2]">.</span>
              </h1>
              <p className="text-sm text-[#8A8F98] leading-relaxed max-w-[320px] mx-auto font-medium">
                Validate cryptographic proofs and institutional signatures directly on Polygon Amoy.
              </p>
            </div>
          </div>

          {/* The Verification Core Wrapper */}
          <div className="relative group">
            {/* Soft Outer Glow on Hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5E6AD2]/20 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
               <VerifyBox />
            </div>
          </div>

          {/* 4. Technical Status Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-2"
          >
            <StatusBadge icon={<Fingerprint size={12}/>} label="KECCAK-256" />
            <StatusBadge icon={<Database size={12}/>} label="IPFS/P2P" />
            <StatusBadge icon={<Globe size={12}/>} label="POLYGON" />
          </motion.div>
        </motion.div>

        {/* 5. Security Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="h-[1px] w-12 bg-white/10" />
          <p className="text-center text-[9px] text-[#8A8F98]/40 uppercase tracking-[0.3em] leading-relaxed max-w-[280px]">
            Privacy Protocol: All hashing is performed client-side. No sensitive data leaves your local environment.
          </p>
          <div className="flex gap-4 items-center opacity-20">
             <Cpu size={14} className="text-white" />
             <div className="w-1 h-1 rounded-full bg-white" />
             <ShieldCheck size={14} className="text-white" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/**
 * Reusable Mini Status Badge
 */
const StatusBadge = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[9px] font-mono text-[#5E6AD2] uppercase tracking-widest hover:bg-white/[0.05] hover:border-white/10 transition-colors">
    {icon}
    <span className="text-[#8A8F98]">{label}</span>
  </div>
);

export default VerifyPage;