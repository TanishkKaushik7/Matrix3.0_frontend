import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  FileCheck, 
  AlertCircle, 
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Globe,
  Plus
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import Sidebar from '../components/dashboard/Sidebar';
import MintForm from '../components/dashboard/MintForm';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';

// Reusable Stat Card matching the Admin aesthetic
const StatCard = ({ title, value, icon, trend, colorClass, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)] flex flex-col justify-between group hover:bg-white/[0.02] transition-colors"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98] mb-1">{title}</p>
      <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { account, connectWallet, isWhitelisted, isLoading: isWeb3Loading } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');

  // 1. Premium "Approval Pending" State
  if (user && !user.isApproved) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="max-w-md w-full p-10 border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-xl relative overflow-hidden text-center">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            
           
            
            <h2 className="text-2xl font-semibold text-white mb-3">Verification Pending</h2>
            <p className="text-sm text-[#8A8F98] leading-relaxed mb-8">
              Your institution is currently being reviewed by the BhoomiNet governance team. 
              You'll receive full access to minting tools once whitelisted on-chain.
            </p>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-all"
            >
              Refresh Status
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050506] flex">
      {/* 2. Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        orgName={user?.name || 'Institution'} 
      />

      <main className="flex-1 ml-64 relative min-h-screen">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5E6AD2]/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-[0.3em] mb-1">Issuer Portal</h2>
              <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome, {user?.name}</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {!account ? (
                <button 
                  onClick={connectWallet}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#5E6AD2] hover:bg-[#6872D9] text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(94,106,210,0.3)]"
                >
                  <Wallet size={16} />
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center gap-4 bg-[#13131A] border border-white/[0.06] p-1.5 pl-4 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-[#8A8F98] uppercase tracking-wider">Connected</span>
                    <span className="text-xs font-mono text-white">{account.slice(0, 6)}...{account.slice(-4)}</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest border ${
                    isWhitelisted 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {isWhitelisted ? "Whitelisted" : "Not Authorized"}
                  </div>
                </div>
              )}
            </motion.div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* 3. Bento Grid Stats (Same as Admin) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <StatCard 
                    title="Total Issued" 
                    value="1,284" 
                    icon={<FileCheck size={20} className="text-[#5E6AD2]" />} 
                    colorClass="bg-[#5E6AD2]/10 border-[#5E6AD2]/20"
                    trend="+12% month"
                    delay={0.1}
                  />
                  <StatCard 
                    title="Verified Queries" 
                    value="45.2k" 
                    icon={<Zap size={20} className="text-amber-500" />} 
                    colorClass="bg-amber-500/10 border-amber-500/20"
                    trend="+5% week"
                    delay={0.2}
                  />
                  <StatCard 
                    title="Network Status" 
                    value="Active" 
                    icon={<Globe size={20} className="text-emerald-500" />} 
                    colorClass="bg-emerald-500/10 border-emerald-500/20"
                    delay={0.3}
                  />
                </div>

                {/* 4. Lower Cards Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Protocol Status (2/3 width) */}
                  <Card className="lg:col-span-2 p-8 bg-[#0A0A0C]/60 backdrop-blur-md border-white/[0.06] overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <ShieldCheck size={120} />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-[#5E6AD2]/10 flex items-center justify-center border border-[#5E6AD2]/20">
                        <Activity size={16} className="text-[#5E6AD2]" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">On-Chain Registry</h3>
                    </div>
                    
                    <p className="text-sm text-[#8A8F98] leading-relaxed max-w-xl mb-8">
                      Your institutional registry is synced with Polygon Amoy. All hashes are stored on the 
                      BhoomiNet protocol, providing immutable proof of student achievements.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8F98] block mb-1">Contract Status</span>
                        <span className="text-sm text-emerald-500 font-medium">Operational</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8F98] block mb-1">Gas Balance</span>
                        <span className="text-sm text-white font-medium font-mono">0.45 POL</span>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Mint Action (1/3 width) */}
                  <button 
                    onClick={() => setActiveTab('mint')}
                    className="p-8 rounded-2xl bg-gradient-to-br from-[#5E6AD2] to-indigo-700 text-left group relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute top-0 right-0 p-4 text-white/20 group-hover:text-white/40 transition-colors">
                      <ArrowUpRight size={48} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-12">
                      <Plus size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Issue New Certificate</h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Generate cryptographic proof for a student achievement instantly.
                    </p>
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'mint' && (
              <motion.div 
                key="mint"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <MintForm onCancel={() => setActiveTab('overview')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;