import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Inbox, 
  ShieldCheck, 
  LogOut, 
  Hexagon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/requests', label: 'Requests', icon: Inbox },
  { path: '/admin/issuers', label: 'Verified Issuers', icon: ShieldCheck },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#0A0A0C]/90 backdrop-blur-xl border-r border-white/[0.06] flex flex-col z-50">
      
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E6AD2]/20 to-indigo-500/5 border border-[#5E6AD2]/30 flex items-center justify-center shadow-[inset_0_0_12px_rgba(94,106,210,0.2)]">
            <Hexagon size={16} className="text-[#5E6AD2] fill-[#5E6AD2]/20" />
          </div>
          <span className="text-sm font-semibold text-white tracking-wide">
            Provectus <span className="text-[#5E6AD2]">Admin</span>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'} // Ensures exact match for the base dashboard route
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive ? 'text-white' : 'text-[#8A8F98] hover:text-[#EDEDEF] hover:bg-white/[0.02]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Background Pill (Framer Motion) */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <item.icon 
                  size={18} 
                  className={isActive ? 'text-[#5E6AD2]' : 'text-[#8A8F98] group-hover:text-[#EDEDEF]'} 
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin Profile & Logout Footer */}
      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5E6AD2]/20 flex items-center justify-center text-[#5E6AD2] font-mono text-xs border border-[#5E6AD2]/30">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">{user?.name || "Admin"}</span>
              <span className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-widest">Superuser</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-[#8A8F98] hover:text-white hover:bg-white/5 rounded-md transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
      
    </aside>
  );
};

export default AdminSidebar;