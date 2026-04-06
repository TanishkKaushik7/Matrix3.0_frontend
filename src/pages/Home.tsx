import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Search, Building } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-20 pb-12">

      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[5%] w-[700px] h-[700px] bg-white/[0.12] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-white/[0.07] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -right-1/4 w-[900px] h-[900px] bg-[#5E6AD2]/18 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-[#4F46E5]/8 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">

        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex-1 w-full max-w-[560px] space-y-8"
        >
          {/* Network Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.14] bg-white/[0.06] text-[10px] font-mono text-gray-300 uppercase tracking-widest backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] animate-pulse" />
            Polygon Amoy Testnet
          </div>

          {/* Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-[4.5rem] font-semibold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-b from-white via-gray-200 to-gray-400 text-transparent bg-clip-text">
                Immutable Proof
              </span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-b from-white via-gray-200 to-gray-400 text-transparent bg-clip-text">
                for{' '}
              </span>
              <span className="bg-gradient-to-br from-[#A5B4FC] via-[#818CF8] to-[#4F46E5] text-transparent bg-clip-text">
                Credentials
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-[90%]">
              BhoomiNet prevents academic fraud through cryptographic verification. Issue, store, and verify certificates seamlessly on the blockchain.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2 w-full max-w-[460px]">

            {/* Row 1: Primary + Secondary — slim, icon inline */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 h-11 bg-[#5E6AD2] hover:bg-[#6872D9] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Lock size={15} strokeWidth={2} />
                Issuer Login
              </button>

              <button
                onClick={() => navigate('/verify')}
                className="flex-1 h-11 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.07] hover:border-white/[0.18] text-gray-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
              >
                <Search size={15} strokeWidth={2} className="text-gray-400" />
                Public Verify
              </button>
            </div>

            {/* Row 2: Apply — slim dashed row */}
            <button
              onClick={() => navigate('/signup')}
              className="w-full h-11 flex items-center justify-between px-4 rounded-xl border border-dashed border-white/[0.14] hover:border-[#5E6AD2]/45 hover:bg-[#5E6AD2]/[0.05] text-gray-500 hover:text-gray-300 transition-all text-sm font-medium group"
            >
              <div className="flex items-center gap-2.5">
                <Building size={14} className="text-gray-600 group-hover:text-[#818CF8] transition-colors" />
                <span>New institution? Apply for access</span>
              </div>
              <ArrowRight size={13} className="opacity-35 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
            </button>

          </div>

          {/* Trust Marks */}
          <div className="flex items-center gap-6 pt-5 border-t border-white/[0.06] w-full max-w-[460px]">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <ShieldCheck size={12} className="text-[#5E6AD2]" /> ERC-721 Standard
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <Lock size={12} className="text-[#5E6AD2]" /> IPFS Backed
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="flex-1 w-full max-w-[580px] relative hidden lg:block"
        >
          <div className="w-full aspect-[4/3] bg-[#0D0D12]/90 border border-white/[0.09] rounded-2xl overflow-hidden flex flex-col backdrop-blur-xl relative z-10">

            {/* Window Top Bar */}
            <div className="h-10 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#5E6AD2]" />
              </div>
              <div className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.2em] border border-white/[0.06] rounded-full px-2 py-0.5">
                Institution Portal
              </div>
            </div>

            {/* Mockup Body */}
            <div className="flex-1 p-6 space-y-5">
              <div className="w-1/3 h-2.5 bg-white/[0.06] rounded-full" />

              <div className="grid grid-cols-3 gap-3">
                <div className="h-[88px] rounded-xl border border-white/[0.05] bg-white/[0.02] flex flex-col items-start justify-end p-3 gap-1.5">
                  <div className="w-8 h-1.5 bg-white/[0.12] rounded-full" />
                  <div className="w-5 h-1 bg-white/[0.06] rounded-full" />
                </div>
                <div className="h-[88px] rounded-xl border border-white/[0.05] bg-white/[0.02] flex flex-col items-start justify-end p-3 gap-1.5">
                  <div className="w-8 h-1.5 bg-white/[0.12] rounded-full" />
                  <div className="w-5 h-1 bg-white/[0.06] rounded-full" />
                </div>
                <div className="h-[88px] rounded-xl border border-[#5E6AD2]/35 bg-[#5E6AD2]/12 flex flex-col items-start justify-end p-3 gap-1.5 relative overflow-hidden">
                  <div className="w-8 h-1.5 bg-[#818CF8]/60 rounded-full relative z-10" />
                  <div className="w-5 h-1 bg-[#5E6AD2]/40 rounded-full relative z-10" />
                </div>
              </div>

              <div className="space-y-2">
                {[true, false, false].map((active, i) => (
                  <div
                    key={i}
                    className={`h-11 rounded-lg border flex items-center px-4 gap-3 ${
                      active
                        ? 'border-white/[0.06] bg-white/[0.03]'
                        : 'border-white/[0.03] bg-white/[0.015]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      i === 0 ? 'bg-emerald-500' : 'bg-white/[0.15]'
                    }`} />
                    <div className={`h-1.5 rounded-full bg-white/[0.08] ${
                      i === 0 ? 'w-36' : 'w-24'
                    }`} />
                    {i === 0 && (
                      <div className="ml-auto w-12 h-5 rounded-md bg-[#5E6AD2]/20 border border-[#5E6AD2]/30" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow behind mockup */}
          <div className="absolute inset-0 bg-[#5E6AD2]/15 blur-[80px] -z-10 rounded-full scale-90" />
        </motion.div>

      </div>
    </div>
  );
};

export default Home;