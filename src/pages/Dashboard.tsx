import React, { useState, useEffect } from 'react';
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
  Plus,
  RefreshCcw,
  FileText,
  Search
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import Sidebar from '../components/dashboard/Sidebar';
import MintForm from '../components/dashboard/MintForm';
import RegistryTable from '../components/dashboard/RegistryTable'; 
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';
import { linkWalletToBackend, getWalletStatus } from '../services/issuerApi'; // <--- ADDED getWalletStatus HERE

// ... (StatCard component remains the same)
const StatCard = ({ title, value, icon, trend, colorClass, delay }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4, ease: "easeOut" }} className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)] flex flex-col justify-between group hover:bg-white/[0.02] transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>{icon}</div>
      {trend && <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">{trend}</span>}
    </div>
    <div>
      <p className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98] mb-1">{title}</p>
      <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user, token, updateWalletStatus } = useAuth();
  const { account, connectWallet, isWhitelisted, isLoading: isWeb3Loading } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * --- SMART GATEKEEPER LOGIC ---
   * We consider the wallet linked if:
   * 1. The backend confirmed it (`user.wallet_connected`) OR
   * 2. MetaMask is actively connected to the browser (`account`)
   */
  const isWalletLinked = user?.wallet_connected || !!account;

  // --- NEW: THE ULTIMATE TRUTH CHECK ---
  // If React thinks we aren't connected, double-check with the backend immediately
  useEffect(() => {
    const forceCheckBackend = async () => {
      if (token && user && !user.wallet_connected) {
        try {
          const statusData = await getWalletStatus(token);
          
          if (statusData.wallet_connected) {
            console.log("Backend confirmed wallet is already linked! Unlocking gate.");
            // Instantly update the Context. This forces isWalletLinked to true.
            updateWalletStatus(statusData.wallet_address);
          }
        } catch (err) {
          console.error("Failed to verify status with backend:", err);
        }
      }
    };
    forceCheckBackend();
  }, [token, user, updateWalletStatus]);


  // --- EXISTING: MetaMask Sync Logic ---
  useEffect(() => {
    const syncWallet = async () => {
      // Only sync if MetaMask is connected BUT the backend doesn't know about it yet
      if (account && token && !user?.wallet_connected) {
        setIsSyncing(true);
        try {
          await linkWalletToBackend(account, token);
          updateWalletStatus(account);
          console.log("Wallet successfully linked to backend.");
        } catch (err) {
          console.error("Wallet sync failed:", err);
        } finally {
          setIsSyncing(false);
        }
      }
    };
    syncWallet();
  }, [account, token, user?.wallet_connected, updateWalletStatus]);


  // Approval Check
  if (user && !user.isApproved) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <Card className="max-w-md w-full p-10 border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-xl relative text-center">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <h2 className="text-2xl font-semibold text-white mb-3">Verification Pending</h2>
          <p className="text-sm text-[#8A8F98] leading-relaxed mb-8">
            Your institution is currently being reviewed by the BhoomiNet governance team. 
          </p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white hover:bg-white/5 transition-all">
            Refresh Status
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050506] flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} orgName={user?.name || 'Institution'} />

      <main className="flex-1 ml-64 relative min-h-screen">
        
        {/* 1. WALLET CONNECTION OVERLAY */}
        <AnimatePresence>
          {!isWalletLinked && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] backdrop-blur-xl bg-black/60 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-md w-full bg-[#0A0A0C] border border-white/[0.08] rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#5E6AD2]/20 blur-[80px] rounded-full" />
                <div className="w-20 h-20 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[inset_0_0_20px_rgba(94,106,210,0.1)]">
                  <Wallet size={40} className="text-[#5E6AD2]" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">Wallet Required</h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-10">
                  Please connect your institutional MetaMask wallet to access the registry and minting tools.
                </p>
                <button 
                  onClick={connectWallet}
                  className="w-full py-4 bg-[#5E6AD2] hover:bg-[#6872D9] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_-10px_rgba(94,106,210,0.5)] active:scale-[0.98]"
                >
                  {isWeb3Loading ? <RefreshCcw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                  Connect MetaMask
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. DASHBOARD CONTENT */}
        <div className={`p-8 max-w-7xl mx-auto space-y-8 transition-all duration-1000 ${
          !isWalletLinked ? 'opacity-10 grayscale blur-2xl pointer-events-none' : 'opacity-100'
        }`}>
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5E6AD2]/5 blur-[150px] rounded-full pointer-events-none -z-10" />

          {/* Shared Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-[0.3em] mb-1">
                {activeTab === 'registry' ? 'Historical Records' : 'Issuer Portal'}
              </h2>
              <h1 className="text-3xl font-semibold text-white tracking-tight">
                {activeTab === 'registry' ? 'Institutional Registry' : `Welcome, ${user?.name}`}
              </h1>
            </motion.div>

            {/* Smart Identity Badge */}
            <div className="flex items-center gap-4 bg-[#13131A] border border-white/[0.06] p-1.5 pl-4 rounded-xl">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-[#8A8F98] uppercase tracking-wider">
                  {isSyncing ? "Syncing..." : "Identity"}
                </span>
                <span className="text-xs font-mono text-white">
                  {/* If backend knows the address, show it. Otherwise show active MetaMask account, or 'Not Linked' */}
                  {user?.wallet_address 
                    ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` 
                    : account 
                      ? `${account.slice(0, 6)}...${account.slice(-4)}` 
                      : "Not Linked"}
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest border ${
                isWhitelisted ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {isWhitelisted ? "Whitelisted" : "Not Authorized"}
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {/* ... Keep your existing StatCards and layout ... */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <StatCard title="Total Issued" value="1,284" icon={<FileCheck size={20} className="text-[#5E6AD2]" />} colorClass="bg-[#5E6AD2]/10 border-[#5E6AD2]/20" trend="+12% month" delay={0.1} />
                  <StatCard title="Verified Queries" value="45.2k" icon={<Zap size={20} className="text-amber-500" />} colorClass="bg-amber-500/10 border-amber-500/20" trend="+5% week" delay={0.2} />
                  <StatCard title="Network Status" value="Active" icon={<Globe size={20} className="text-emerald-500" />} colorClass="bg-emerald-500/10 border-emerald-500/20" delay={0.3} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 p-8 bg-[#0A0A0C]/60 backdrop-blur-md border-white/[0.06] overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck size={120} /></div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-[#5E6AD2]/10 flex items-center justify-center border border-[#5E6AD2]/20">
                        <Activity size={16} className="text-[#5E6AD2]" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">On-Chain Registry</h3>
                    </div>
                    <p className="text-sm text-[#8A8F98] leading-relaxed max-w-xl mb-8">
                      Your institutional registry is synced with Polygon Amoy. All hashes are stored on the BhoomiNet protocol.
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

                  <button 
                    onClick={() => setActiveTab('mint')}
                    className="p-8 rounded-2xl bg-gradient-to-br from-[#5E6AD2] to-indigo-700 text-left group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute top-0 right-0 p-4 text-white/20 group-hover:text-white/40"><ArrowUpRight size={48} /></div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-12"><Plus size={24} className="text-white" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Issue New Certificate</h3>
                    <p className="text-sm text-white/80 leading-relaxed">Generate cryptographic proof instantly.</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* REGISTRY TAB */}
            {activeTab === 'registry' && (
              <motion.div key="registry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <RegistryTable />
              </motion.div>
            )}

            {/* MINT TAB */}
            {activeTab === 'mint' && (
              <motion.div key="mint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto">
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