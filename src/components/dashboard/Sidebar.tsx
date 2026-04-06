import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orgName: string;
}

const Sidebar = ({ activeTab, setActiveTab, orgName }: SidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'mint', label: 'Issue Certificate', icon: PlusCircle },
    { id: 'registry', label: 'Registry', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050506] border-r border-white/[0.06] flex flex-col fixed left-0 top-0 z-50">
      {/* Branding Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(94,106,210,0.4)]">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-semibold tracking-tight text-white text-lg">BhoomiNet</span>
        </div>

        {/* Search Shortcut */}
        <div className="relative group mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" size={14} />
          <input 
            type="text" 
            placeholder="Search hash..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-foreground-subtle hidden group-focus-within:block">
            /
          </kbd>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'text-white bg-white/[0.05]' 
                  : 'text-foreground-muted hover:text-foreground hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-accent' : 'group-hover:text-foreground'} />
              {item.label}
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-5 bg-accent rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Organization Footer */}
      <div className="p-4 mt-auto border-t border-white/[0.06]">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4">
          <p className="text-[10px] font-mono text-foreground-subtle uppercase tracking-widest mb-1">Authenticated As</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground truncate max-w-[140px]">{orgName}</span>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          </div>
        </div>

        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-red-400 hover:bg-red-400/5 transition-all group">
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span>Logout</span>
          </div>
          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;