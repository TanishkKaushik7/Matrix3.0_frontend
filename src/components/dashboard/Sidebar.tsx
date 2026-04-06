import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Search,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orgName: string;
}

const Sidebar = ({ activeTab, setActiveTab, orgName }: SidebarProps) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'mint', label: 'Issue Certificate', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050506] border-r border-white/[0.08] flex flex-col fixed left-0 top-0 z-50">
      
      {/* Branding Section */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-[#5E6AD2] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(94,106,210,0.4)]">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-white text-xl">BhoomiNet</span>
        </div>

        {/* Search Bar - Improved Visibility */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search Registry..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5E6AD2]/50 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                isActive 
                  ? 'text-white bg-white/[0.05] shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Icon 
                size={18} 
                className={`transition-colors duration-300 ${isActive ? 'text-[#5E6AD2]' : 'text-slate-500 group-hover:text-slate-300'}`} 
              />
              <span className="flex-1 text-left">{item.label}</span>
              
              {isActive && (
                <>
                  {/* Subtle Glow behind active item */}
                  <div className="absolute inset-0 bg-[#5E6AD2]/5 blur-md rounded-xl -z-10" />
                  {/* The Indicator Line */}
                  <motion.div 
                    layoutId="active-sidebar-line"
                    className="absolute right-0 w-1 h-5 bg-[#5E6AD2] rounded-l-full shadow-[0_0_10px_#5E6AD2]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Organization Footer */}
      <div className="p-6 mt-auto">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-4 relative overflow-hidden group">
          {/* Subtle metallic shine */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-2">Authenticated</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200 truncate pr-2">{orgName}</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all group border border-transparent hover:border-red-400/10"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </div>
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;