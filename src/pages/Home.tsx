import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion'; 
import { ArrowRight, Lock, Search, Building } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  // 1. Parent Container Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  // 2. Normal Fade Up Variants
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // 3. TYPING EFFECT VARIANTS 
  const typingContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.2 },
    },
  };

  const typingLetter: Variants = {
    hidden: { opacity: 0, display: 'none' },
    visible: { 
      opacity: 1, display: 'inline-block',
      transition: { duration: 0.01 } 
    },
  };

  const renderTypingText = (text: string) => {
    return text.split('').map((char, index) => (
      <motion.span key={index} variants={typingLetter}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));
  };

  // Dummy Data for the Dashboard Mockup
  const mockStats = [
    { label: 'TOTAL ISSUED', value: '14,205' },
    { label: 'INSTITUTIONS', value: '84' },
    { label: 'VERIFIED', value: '89.2K' }
  ];

  const mockActivities = [
    { action: 'Minted B.Tech Degree', id: '#8924', time: 'Just now', color: 'bg-emerald-500' },
    { action: 'Verified Transcript', id: '0x4A...3f9', time: '2 mins ago', color: 'bg-[#5E6AD2]' },
    { action: 'New Issuer Registered', id: 'NODE-7', time: '1 hour ago', color: 'bg-purple-500' }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050506] pt-20 pb-12">
      
      {/* Background Layers */}
      <div className="absolute top-[10%] left-[5%] w-[700px] h-[700px] bg-white/[0.06] blur-[160px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#5E6AD2]/12 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-[#4F46E5]/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">

        {/* Left Column: Content */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 w-full max-w-[560px] space-y-8">
          
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.05] text-[10px] font-mono text-gray-400 uppercase tracking-widest backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] animate-pulse shadow-[0_0_8px_#5E6AD2]" />
            Polygon Amoy Testnet Live
          </motion.div>

          {/* HEADLINE ANIMATION */}
          <div className="space-y-4">
            <motion.h1 variants={typingContainer} className="text-5xl lg:text-[4.5rem] font-semibold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/60 text-transparent bg-clip-text">
                {renderTypingText("Immutable Proof")}
              </span>
              <br className="hidden md:block" />
              <span className="bg-gradient-to-b from-white via-white/90 to-white/60 text-transparent bg-clip-text">
                {renderTypingText("for ")}
              </span>
              <motion.span 
                initial={{ backgroundPosition: '0% 50%' }} animate={{ backgroundPosition: '100% 50%' }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-[#fce0a5] via-[#f8d681] to-[#e5a846] text-transparent bg-clip-text bg-[length:200%_auto] inline-block"
              >
                {renderTypingText("Credentials")}
              </motion.span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-400 text-base md:text-lg leading-relaxed max-w-[90%]">
              Provectus uses cryptographic verification to prevent academic fraud. Issue, store, and verify digital assets on the blockchain with absolute certainty.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-2 w-full max-w-[460px]">
            <div className="flex gap-3">
              <button onClick={() => navigate('/login')} className="flex-1 h-12 bg-[#f3b553] hover:bg-[#f18912] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(94,106,210,0.3)] active:scale-[0.97]">
                <Lock size={16} strokeWidth={2.5} /> Issuer Login
              </button>

              <button onClick={() => navigate('/verify')} className="flex-1 h-12 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] text-gray-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-sm active:scale-[0.97]">
                <Search size={16} strokeWidth={2} className="text-gray-400" /> Public Verify
              </button>
            </div>

            <button onClick={() => navigate('/signup')} className="w-full h-11 flex items-center justify-between px-4 rounded-xl border border-dashed border-white/[0.12] hover:border-[#5E6AD2]/50 hover:bg-[#5E6AD2]/[0.03] text-gray-500 hover:text-gray-300 transition-all text-sm group">
              <div className="flex items-center gap-2.5">
                <Building size={14} className="text-gray-600 group-hover:text-[#818CF8] transition-colors" />
                <span>New institution? Apply for access</span>
              </div>
              <ArrowRight size={14} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-8 pt-6 border-t border-white/[0.05] w-full max-w-[460px]">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
              <Lock size={14} className="text-[#ee9242]" /> IPFS Protocol
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Interactive Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, y: [0, -12, 0] }}
          transition={{ 
            duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1],
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="flex-1 w-full max-w-[580px] relative hidden lg:block perspective-1000"
        >
          {/* Main Card */}
          <div className="w-full aspect-[4/3] bg-[#0D0D12]/80 border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col backdrop-blur-2xl relative z-10 shadow-2xl">
            <div className="h-10 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between px-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/10 hover:bg-red-500/80 transition-colors" />
                <div className="w-2 h-2 rounded-full bg-white/10 hover:bg-yellow-500/80 transition-colors" />
                <div className="w-2 h-2 rounded-full bg-[#5E6AD2]/60 hover:bg-green-500/80 transition-colors" />
              </div>
              <div className="text-[9px] font-mono text-gray-500 tracking-tighter flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM_ONLINE
              </div>
            </div>
            
            {/* Mock Content Layout with REAL Dummy Data */}
            <div className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-200">Network Overview</h3>
                <span className="text-[10px] text-gray-500 font-mono">LIVE SYNC</span>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {mockStats.map((stat, i) => (
                  <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 flex flex-col justify-between hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-default group">
                    <div className="text-[9px] font-mono text-gray-500 tracking-wider group-hover:text-gray-400">{stat.label}</div>
                    <div className="text-xl font-semibold text-gray-100">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-3">Recent Transactions</h4>
                
                {mockActivities.map((activity, i) => (
                  <div key={i} className="h-14 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center px-4 justify-between hover:border-white/[0.1] hover:bg-white/[0.04] transition-all cursor-default group">
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.color} shadow-[0_0_8px_currentColor] opacity-80`} />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors">{activity.action}</span>
                        <span className="text-[10px] font-mono text-gray-500">{activity.id}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-500 bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05]">
                      {activity.time}
                    </div>
                    
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Deep Glow behind mockup */}
          <div className="absolute inset-0 bg-[#5E6AD2]/20 blur-[100px] -z-10 rounded-full scale-75 transform translate-y-10" />
        </motion.div>

      </div>
    </div>
  );
};

export default Home;