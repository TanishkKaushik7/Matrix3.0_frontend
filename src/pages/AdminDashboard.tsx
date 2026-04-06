import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Activity,
  ArrowRight,
  Globe,
  ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getIssuers, type Issuer } from '../services/adminApi';

// Reusable Stat Card Component
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  // 1. EXTRACT TOKEN FROM RAM
  const { user, token } = useAuth(); 
  
  // Note: Using 'any' here as a fallback in case your Issuer type interface 
  // hasn't been updated to match the 'college_name' JSON schema yet.
  const [issuers, setIssuers] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data on mount
  useEffect(() => {
    const fetchStats = async () => {
      // 2. SECURITY GUARD: Ensure token exists before fetching
      if (!token) {
        setError("Session expired. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        // 3. PASS TOKEN TO API
        const data = await getIssuers(token);
        setIssuers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load network stats.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]); // 4. Add token to dependency array

  // Calculate derived stats
  const pendingCount = issuers.filter(i => i.status === 'pending').length;
  const approvedCount = issuers.filter(i => i.status === 'approved').length;
  const rejectedCount = issuers.filter(i => i.status === 'rejected').length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || "Admin"}
          </h1>
          <p className="text-sm text-[#8A8F98]">
            Here is what's happening on the BhoomiNet protocol today.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-mono text-gray-300 uppercase tracking-widest flex items-center gap-2">
            <Globe size={12} className="text-[#5E6AD2]" />
            Polygon Amoy: Active
          </span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Applications" 
          value={isLoading ? "-" : issuers.length} 
          icon={<Users size={20} className="text-[#5E6AD2]" />} 
          colorClass="bg-[#5E6AD2]/10 border-[#5E6AD2]/20"
          delay={0.1}
        />
        <StatCard 
          title="Action Required" 
          value={isLoading ? "-" : pendingCount} 
          icon={<Clock size={20} className="text-amber-500" />} 
          colorClass="bg-amber-500/10 border-amber-500/20"
          trend={pendingCount > 0 ? `${pendingCount} New` : null}
          delay={0.2}
        />
        <StatCard 
          title="Verified Issuers" 
          value={isLoading ? "-" : approvedCount} 
          icon={<CheckCircle2 size={20} className="text-emerald-500" />} 
          colorClass="bg-emerald-500/10 border-emerald-500/20"
          delay={0.3}
        />
        <StatCard 
          title="Rejected / Suspended" 
          value={isLoading ? "-" : rejectedCount} 
          icon={<ShieldAlert size={20} className="text-red-400" />} 
          colorClass="bg-red-500/10 border-red-500/20"
          delay={0.4}
        />
      </div>

      {/* Quick Action / Recent Pending Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Col: Pending Requests Preview */}
        <div className="lg:col-span-2 bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-[#5E6AD2]" />
              <h2 className="text-base font-semibold text-white tracking-wide">Recent Applications</h2>
            </div>
            <button 
              onClick={() => navigate('/admin/requests')}
              className="text-[11px] font-mono uppercase tracking-widest text-[#5E6AD2] hover:text-[#6872D9] transition-colors flex items-center gap-1 group"
            >
              View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-[#8A8F98]">Loading data from network...</div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-red-400">{error}</div>
            ) : pendingCount === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 size={32} className="text-emerald-500/50 mb-3" />
                <p className="text-sm text-white">Inbox Zero</p>
                <p className="text-xs text-[#8A8F98]">No pending institution requests to review.</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/[0.04]">
                {issuers.filter(i => i.status === 'pending').slice(0, 4).map((issuer) => (
                  <li key={issuer.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                    <div className="flex flex-col">
                      {/* 5. UPDATED MAPPING TO MATCH JSON: issuer.college_name */}
                      <span className="text-sm font-medium text-white mb-0.5">{issuer.college_name || issuer.name}</span>
                      <span className="text-[11px] font-mono text-[#8A8F98]">{issuer.email}</span>
                    </div>
                    <button 
                      onClick={() => navigate('/admin/requests')}
                      className="px-4 py-1.5 rounded-lg border border-white/[0.08] text-xs font-medium text-[#EDEDEF] opacity-0 group-hover:opacity-100 transition-all hover:bg-white/[0.05]"
                    >
                      Review
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Col: System Health / Info */}
        <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)] flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={18} className="text-[#5E6AD2]" />
            <h2 className="text-base font-semibold text-white tracking-wide">System Security</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98]">API Status</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-sm text-white">Operational</p>
            </div>
            
            <div className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98]">Smart Contract</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-sm text-white font-mono truncate">0xAmoy...Deployed</p>
            </div>

            <div className="mt-auto pt-4 border-t border-white/[0.04]">
               <p className="text-[10px] text-[#8A8F98] leading-relaxed uppercase tracking-widest">
                 All admin actions are cryptographically signed and logged on-chain.
               </p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default AdminDashboard;