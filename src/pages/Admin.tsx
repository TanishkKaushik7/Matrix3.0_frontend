import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Search,
  ExternalLink,
  Filter,
  LogOut, // <-- Added LogOut icon
} from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext'; // <-- Added useAuth import

const MOCK_ORGS = [
  { id: '1', name: 'Stanford University', email: 'registrar@stanford.edu', website: 'stanford.edu', status: 'pending', date: '2024-03-20' },
  { id: '2', name: 'MIT Tech', email: 'admin@mit.edu', website: 'mit.edu', status: 'approved', date: '2024-03-18' },
  { id: '3', name: 'Delhi University', email: 'verify@du.ac.in', website: 'du.ac.in', status: 'pending', date: '2024-03-21' },
  { id: '4', name: 'Oxford Institute', email: 'admin@ox.ac.uk', website: 'ox.ac.uk', status: 'pending', date: '2024-03-22' },
];

type Status = 'pending' | 'approved' | 'rejected';

const statusStyles: Record<Status, string> = {
  pending:  'bg-amber-500/10 text-amber-500 border-amber-500/20',
  approved: 'bg-emerald-500/[0.08] text-emerald-500 border-emerald-500/20',
  rejected: 'bg-red-500/[0.08] text-red-400 border-red-500/20',
};

const StatusBadge = ({ status }: { status: Status }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${statusStyles[status]}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status}
  </span>
);

const StatCard = ({ icon, label, value, iconBg }: any) => (
  <div className="bg-[#13131A] border border-[#252535] rounded-xl px-4 py-2.5 flex items-center gap-3">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-[#6E7080] mb-0.5">{label}</p>
      <p className="text-xl font-semibold leading-none text-[#F0EFFF]">{value}</p>
    </div>
  </div>
);

const Admin = () => {
  const { logout } = useAuth(); // <-- Extract logout function
  const [orgs, setOrgs] = useState(MOCK_ORGS);
  const [search, setSearch] = useState('');

  const handleStatus = (id: string, status: Status) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-16 pb-12 px-6 max-w-6xl mx-auto space-y-7">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-[#F0EFFF] tracking-tight">
            Admin Command Center
          </h1>
          <p className="text-sm text-[#6E7080] mt-1">
            Review and whitelist institutions for the BhoomiNet protocol.
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          {/* Sign Out Button */}
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6E7080] hover:text-[#E8E6FF] transition-colors group"
          >
            <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>

          {/* Stats */}
          <div className="flex gap-2.5">
            <StatCard
              icon={<Clock size={15} className="text-amber-500" />}
              label="Pending"
              value={orgs.filter(o => o.status === 'pending').length}
              iconBg="bg-amber-500/10"
            />
            <StatCard
              icon={<CheckCircle2 size={15} className="text-emerald-500" />}
              label="Approved"
              value={orgs.filter(o => o.status === 'approved').length}
              iconBg="bg-emerald-500/10"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#13131A] border border-[#252535] p-3 rounded-xl">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search institutions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={14} />}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A09EC0] bg-transparent border border-[#252535] rounded-lg hover:border-[#3A3860] hover:text-[#E8E6FF] hover:bg-[#1A1A24] transition-all">
            <Filter size={12} /> Filter
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-[#A09EC0] bg-transparent border border-[#252535] rounded-lg hover:border-[#3A3860] hover:text-[#E8E6FF] hover:bg-[#1A1A24] transition-all">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#13131A] border border-[#252535] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1E1E2C] bg-[#0D0D12]">
              {['Institution', 'Contact', 'Status', 'Applied', ''].map((h, i) => (
                <th
                  key={i}
                  className={`p-4 text-[10px] font-mono uppercase tracking-widest text-[#4A4A5C] font-normal ${i === 4 ? 'text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#181825]">
            <AnimatePresence>
              {filtered.map((org) => (
                <motion.tr
                  key={org.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-[#16161F] transition-colors"
                >
                  {/* Institution */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-medium text-[#E8E6FF]">{org.name}</span>
                      <a href={`https://${org.website}`} target="_blank" rel="noreferrer">
                        <ExternalLink size={11} className="text-[#4A4A5C] hover:text-[#8B82F6] transition-colors cursor-pointer" />
                      </a>
                    </div>
                    <span className="text-[11px] font-mono text-[#4A4A5C]">{org.website}</span>
                  </td>

                  {/* Contact */}
                  <td className="p-4">
                    <span className="text-xs font-mono text-[#6E7080]">{org.email}</span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <StatusBadge status={org.status as Status} />
                  </td>

                  {/* Date */}
                  <td className="p-4">
                    <span className="text-xs font-mono text-[#4A4A5C]">{org.date}</span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex justify-end gap-1.5">
                      {org.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatus(org.id, 'approved')}
                            className="px-3 py-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-lg hover:bg-emerald-500/[0.14] hover:border-emerald-500/35 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatus(org.id, 'rejected')}
                            className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-lg hover:bg-red-500/[0.14] hover:border-red-500/35 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {org.status === 'approved' && (
                        <button
                          onClick={() => handleStatus(org.id, 'pending')}
                          className="px-3 py-1.5 text-xs font-medium text-[#6E7080] border border-[#252535] rounded-lg hover:text-amber-500 hover:border-amber-500/25 transition-all"
                        >
                          Suspend
                        </button>
                      )}
                      {org.status === 'rejected' && (
                        <span className="text-[11px] font-mono text-[#4A4A5C]">Rejected</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#4A4A5C] uppercase tracking-[0.18em] pt-1">
        <ShieldCheck size={11} className="text-[#5E6AD2]" />
        Secure Admin Session &nbsp;•&nbsp; BhoomiNet Protocol
      </div>

    </div>
  );
};

export default Admin;