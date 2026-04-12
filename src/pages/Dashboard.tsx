import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  FileCheck, 
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Globe,
  Plus,
  RefreshCcw,
  Mail,
  MapPin,
  Phone,
  Building
} from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import Sidebar from '../components/dashboard/Sidebar';
import MintForm from '../components/dashboard/MintForm';
import RegistryTable from '../components/dashboard/RegistryTable'; 
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';
import { linkWalletToBackend, getWalletStatus } from '../services/issuerApi';

// Reusable Stat Card Component - Redesigned to be smaller/tighter
const StatCard = ({ title, value, icon, trend, colorClass, delay, className = "" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay, duration: 0.4, ease: "easeOut" }} 
    className={`bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 shadow-lg flex flex-col justify-between group hover:bg-white/[0.02] transition-colors ${className}`}
  >
    <div className="flex items-start justify-between mb-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>{icon}</div>
      {trend && <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">{trend}</span>}
    </div>
    <div className="mt-2">
      <p className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98] mb-1">{title}</p>
      <h3 className="text-3xl font-semibold text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user, token, updateWalletStatus } = useAuth();
  const {
    account,
    availableAccounts,
    connectWallet,
    selectAccount,
    error: web3Error,
    isWhitelisted,
    isLoading: isWeb3Loading
  } = useWeb3();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [issuerProfile, setIssuerProfile] = useState<any>(null);
  const [totalIssued, setTotalIssued] = useState<number | string>("-");
  const [selectedWallet, setSelectedWallet] = useState('');

  const isWalletLinked = user?.wallet_connected || !!account;

  // Fetch Issuer Profile & Certificate Count
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (token) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          
          // 1. Fetch Profile
          const profileRes = await fetch(`${API_URL}/issuer/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const data = await profileRes.json();
            setIssuerProfile(data);
          }

          // 2. Fetch Issued Count
          const countRes = await fetch(`${API_URL}/issuer/issued-certificate-count`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (countRes.ok) {
            const countData = await countRes.json();
            setTotalIssued(countData.issued_certificates || 0);
          }
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
        }
      }
    };
    fetchDashboardData();
  }, [token]);

  // Force Backend Verification
  useEffect(() => {
    const forceCheckBackend = async () => {
      if (token && user && !user.wallet_connected) {
        try {
          const statusData = await getWalletStatus(token);
          if (statusData.wallet_connected) {
            updateWalletStatus(statusData.wallet_address);
          }
        } catch (err) {
          console.error("Failed to verify status with backend:", err);
        }
      }
    };
    forceCheckBackend();
  }, [token, user, updateWalletStatus]);

  // MetaMask Sync Logic
  useEffect(() => {
    const syncWallet = async () => {
      if (account && token && !user?.wallet_connected) {
        setIsSyncing(true);
        try {
          await linkWalletToBackend(account, token);
          updateWalletStatus(account);
        } catch (err) {
          console.error("Wallet sync failed:", err);
        } finally {
          setIsSyncing(false);
        }
      }
    };
    syncWallet();
  }, [account, token, user?.wallet_connected, updateWalletStatus]);

  useEffect(() => {
    if (availableAccounts.length === 0) {
      setSelectedWallet('');
      return;
    }

    const stillExists = availableAccounts.some(
      (item) => item.toLowerCase() === selectedWallet.toLowerCase()
    );

    if (!selectedWallet || !stillExists) {
      setSelectedWallet(availableAccounts[0]);
    }
  }, [availableAccounts, selectedWallet]);

  // Approval Check
  if (user && !user.isApproved) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <Card className="max-w-md w-full p-10 border-white/[0.08] bg-[#0A0A0C]/80 backdrop-blur-xl relative text-center">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <h2 className="text-2xl font-semibold text-white mb-3">Verification Pending</h2>
          <p className="text-sm text-[#8A8F98] leading-relaxed mb-8">
            Your institution is currently being reviewed by the Provectus governance team. 
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} orgName={issuerProfile?.college_name || user?.name || 'Institution'} />

      <main className="flex-1 ml-64 relative min-h-screen">
        
        {/* WALLET CONNECTION OVERLAY */}
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
                <div className="space-y-4">
                  <button 
                    onClick={() => connectWallet(true)}
                    className="w-full py-4 bg-[#5E6AD2] hover:bg-[#6872D9] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_-10px_rgba(94,106,210,0.5)] active:scale-[0.98]"
                  >
                    {isWeb3Loading ? <RefreshCcw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                    Choose from MetaMask
                  </button>

                  {availableAccounts.length > 0 && (
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-left space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#8A8F98] font-mono block">
                        Authorized Wallets
                      </label>
                      <select
                        value={selectedWallet}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                        className="w-full bg-[#0F0F12] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                      >
                        {availableAccounts.map((addr) => (
                          <option key={addr} value={addr}>
                            {`${addr.slice(0, 6)}...${addr.slice(-4)}`}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => selectedWallet && selectAccount(selectedWallet)}
                        disabled={isWeb3Loading || !selectedWallet}
                        className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                      >
                        Use Selected Wallet
                      </button>
                    </div>
                  )}

                  {web3Error && (
                    <p className="text-xs text-red-400 leading-relaxed text-left">
                      {web3Error}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DASHBOARD CONTENT */}
        <div className={`p-8 max-w-7xl mx-auto space-y-6 transition-all duration-1000 ${
          !isWalletLinked ? 'opacity-10 grayscale blur-2xl pointer-events-none' : 'opacity-100'
        }`}>
          
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5E6AD2]/5 blur-[150px] rounded-full pointer-events-none -z-10" />

          {/* Shared Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-[10px] font-mono text-[#d2a45e] uppercase tracking-[0.3em] mb-1">
                {activeTab === 'registry' ? 'Historical Records' : 'Issuer Portal'}
              </h2>
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {activeTab === 'registry' ? 'Institutional Registry' : `Welcome, ${issuerProfile?.college_name || user?.name || 'Institution'}`}
              </h1>
            </motion.div>

            {/* Smart Identity Badge */}
            <div className="flex items-center gap-4 bg-[#13131A] border border-white/[0.06] p-1.5 pl-4 rounded-xl shadow-lg">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-[#8A8F98] uppercase tracking-wider mb-0.5">
                  {isSyncing ? "Syncing..." : "Network Identity"}
                </span>
                <span className="text-xs font-mono text-white flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isWalletLinked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {user?.wallet_address 
                    ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` 
                    : account 
                      ? `${account.slice(0, 6)}...${account.slice(-4)}` 
                      : "Not Linked"}
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest border ${
                (issuerProfile?.status === 'approved' || isWhitelisted) ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {(issuerProfile?.status === 'approved' || isWhitelisted) ? "Verified" : (issuerProfile?.status || "Pending")}
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Row 1: Issuer Details & Total Issued (COMPACT) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Col: Issuer Details */}
                  <Card className="lg:col-span-2 p-6 bg-[#0A0A0C]/60 backdrop-blur-md border-white/[0.06] overflow-hidden relative flex flex-col justify-between">
                    <div className="absolute top-4 right-4 opacity-[0.03] pointer-events-none">
                      <Building size={100} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <ShieldCheck size={16} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white tracking-wide leading-none">Institution Profile</h3>
                          <p className="text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest mt-1">ID: {issuerProfile?.college_id || '---'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 relative z-10">
                        <div className="flex gap-2.5">
                          <Building className="text-[#8A8F98] shrink-0 mt-0.5" size={14} />
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A8F98] mb-0.5">Registered Name</p>
                            <p className="text-xs text-white font-medium">{issuerProfile?.college_name || 'Loading...'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2.5">
                          <MapPin className="text-[#8A8F98] shrink-0 mt-0.5" size={14} />
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A8F98] mb-0.5">Primary Address</p>
                            <p className="text-xs text-white font-medium truncate max-w-[200px]" title={issuerProfile?.college_address}>{issuerProfile?.college_address || 'Loading...'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2.5">
                          <Mail className="text-[#8A8F98] shrink-0 mt-0.5" size={14} />
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A8F98] mb-0.5">Contact Email</p>
                            <p className="text-xs text-white font-medium">{issuerProfile?.email || 'Loading...'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2.5">
                          <Phone className="text-[#8A8F98] shrink-0 mt-0.5" size={14} />
                          <div>
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A8F98] mb-0.5">Phone Number</p>
                            <p className="text-xs text-white font-medium">{issuerProfile?.phone_number || 'Loading...'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Right Col: Total Issued */}
                  <StatCard 
                    title="Total Certificates Issued" 
                    value={totalIssued} 
                    icon={<FileCheck size={20} className="text-[#ffffff]" />} 
                    colorClass="bg-[#5E6AD2]/10 border-[#5E6AD2]/20" 
                    delay={0.1}
                    className="h-full" 
                  />
                </div>

                {/* Row 2: On-Chain Registry & Issue Button */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <Card className="lg:col-span-2 p-6 bg-[#0A0A0C]/60 backdrop-blur-md border-white/[0.06] overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={100} /></div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Globe size={16} className="text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">On-Chain Registry Status</h3>
                    </div>
                    <p className="text-xs text-[#8A8F98] leading-relaxed max-w-xl mb-6">
                      Your institutional registry is actively synced with the Polygon Amoy testnet. All document hashes are permanently secured on the Provectus protocol.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A8F98] block mb-1.5">Contract Status</span>
                        <span className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operational
                        </span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A8F98] block mb-1.5">Gas Balance</span>
                        <span className="text-xs text-white font-medium font-mono">0.45 POL</span>
                      </div>
                    </div>
                  </Card>

                  <button 
                    onClick={() => setActiveTab('mint')}
                    className="p-6 rounded-2xl bg-gradient-to-br from-[rgb(239,167,91)] to-[rgb(241,144,46)] text-left group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[rgb(239,167,91)]/20 flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 p-4 text-white/20 group-hover:text-white/40 transition-colors">
                      <ArrowUpRight size={40} />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8">
                      <Plus size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">Issue New <br/>Certificate</h3>
                      <p className="text-xs text-white/90 leading-relaxed font-medium">Generate cryptographic proof instantly.</p>
                    </div>
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