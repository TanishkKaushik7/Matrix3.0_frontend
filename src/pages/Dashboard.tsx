import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  FileCheck, 
  AlertCircle, 
  Wallet,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

// Internal Components
import Sidebar from '../components/dashboard/Sidebar';
import MintForm from '../components/dashboard/MintForm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';

const Dashboard = () => {
  const { user } = useAuth();
  const { account, connectWallet, isWhitelisted, isLoading: isWeb3Loading } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');

  // If the institution is not yet approved by admin 
  if (user && !user.isApproved) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center p-6">
        <Card className="max-w-md text-center p-10 space-y-6">
          <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="text-yellow-500" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Approval Pending</h2>
            <p className="text-sm text-foreground-muted">
              Your institution is currently being verified by the BhoomiNet admin team. You will have access to minting tools once whitelisted.
            </p>
          </div>
          <Button variant="secondary" onClick={() => window.location.reload()}>Check Status</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050506] text-foreground flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        orgName={user?.name || 'Institution'} 
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Top Header Section */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-sm font-mono text-accent uppercase tracking-[0.3em] mb-1">Command Center</h2>
            <h1 className="text-3xl font-semibold text-white">Welcome, {user?.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            {!account ? (
              <Button 
                variant="primary" 
                onClick={connectWallet} 
                isLoading={isWeb3Loading}
                leftIcon={<Wallet size={18} />}
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-3 bg-white/3 border border-white/6 px-4 py-2 rounded-lg">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-foreground-subtle font-mono uppercase">Connected Wallet</span>
                  <span className="text-xs font-mono text-white">{account.slice(0, 6)}...{account.slice(-4)}</span>
                </div>
                <Badge variant={isWhitelisted ? "success" : "error"} dot>
                  {isWhitelisted ? "Whitelisted" : "Not Authorized"}
                </Badge>
              </div>
            )}
          </div>
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
              {/* Bento Grid Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Issued" value="1,284" icon={<FileCheck size={20}/>} trend="+12% this month" />
                <StatCard title="Total Revoked" value="12" icon={<AlertCircle size={20}/>} trend="0% change" />
                <StatCard title="Verified Queries" value="45.2k" icon={<Zap size={20}/>} trend="+24% this month" />
              </div>

              {/* Quick Actions / Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-accent" /> Protocol Health
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-foreground-muted">
                      Your on-chain hash registry is synchronized with Polygon Amoy. All certificates issued are tamper-proof and publicly verifiable[cite: 52, 90].
                    </p>
                    <div className="pt-4 border-t border-white/6 flex items-center justify-between">
                      <span className="text-xs text-foreground-subtle uppercase font-mono">Gas Balance (POL)</span>
                      <span className="text-sm font-semibold text-white">0.45 POL</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 group cursor-pointer hover:border-accent/40 transition-colors" onClick={() => setActiveTab('mint')}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">New Issuance</h3>
                      <p className="text-sm text-foreground-muted">Generate a new cryptographic proof for a student achievement[cite: 32, 92].</p>
                    </div>
                    <ArrowUpRight className="text-foreground-subtle group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  <div className="mt-8 flex gap-2">
                    <Badge variant="outline">IPFS Ready</Badge>
                    <Badge variant="outline">Polygon Amoy</Badge>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'mint' && (
            <motion.div 
              key="mint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MintForm />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// Helper Stat Card for Bento Grid
const StatCard = ({ title, value, icon, trend }: any) => (
  <Card className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/3 border border-white/6 rounded-lg text-accent">
        {icon}
      </div>
      <span className="text-[10px] font-mono text-green-500 uppercase tracking-tighter">{trend}</span>
    </div>
    <div className="space-y-1">
      <p className="text-xs text-foreground-subtle uppercase tracking-widest font-mono">{title}</p>
      <p className="text-3xl font-semibold text-white tracking-tight">{value}</p>
    </div>
  </Card>
);

export default Dashboard;