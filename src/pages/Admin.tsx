import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink,
  Filter
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

// Mock data for the hackathon demonstration
const MOCK_ORGS = [
  { id: '1', name: 'Stanford University', email: 'registrar@stanford.edu', website: 'stanford.edu', status: 'pending', date: '2024-03-20' },
  { id: '2', name: 'MIT Tech', email: 'admin@mit.edu', website: 'mit.edu', status: 'approved', date: '2024-03-18' },
  { id: '3', name: 'Delhi University', email: 'verify@du.ac.in', website: 'du.ac.in', status: 'pending', date: '2024-03-21' },
];

const Admin = () => {
  const [orgs, setOrgs] = useState(MOCK_ORGS);
  const [search, setSearch] = useState('');

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setOrgs(prev => prev.map(org => 
      org.id === id ? { ...org, status: newStatus } : org
    ));
  };

  const filteredOrgs = orgs.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) || 
    org.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            Admin Command Center
          </h1>
          <p className="text-foreground-muted text-sm mt-1">
            Review and whitelist institutions for the BhoomiNet protocol.
          </p>
        </div>
        
        <div className="flex gap-4">
          <StatCard icon={<Clock size={16}/>} label="Pending" value={orgs.filter(o => o.status === 'pending').length} color="text-yellow-500" />
          <StatCard icon={<CheckCircle2 size={16}/>} label="Approved" value={orgs.filter(o => o.status === 'approved').length} color="text-green-500" />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
        <div className="w-full md:w-96">
          <Input 
            placeholder="Search institutions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-1.5 text-xs" leftIcon={<Filter size={14}/>}>Filter</Button>
          <Button variant="secondary" className="px-3 py-1.5 text-xs">Export CSV</Button>
        </div>
      </div>

      {/* Institutions Table */}
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-foreground-subtle">Institution</th>
              <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-foreground-subtle">Contact</th>
              <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-foreground-subtle">Status</th>
              <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-foreground-subtle">Applied Date</th>
              <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-foreground-subtle text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            <AnimatePresence>
              {filteredOrgs.map((org) => (
                <motion.tr 
                  key={org.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        {org.name}
                        <a href={`https://${org.website}`} target="_blank" rel="noreferrer">
                          <ExternalLink size={12} className="text-foreground-subtle hover:text-accent cursor-pointer" />
                        </a>
                      </span>
                      <span className="text-[10px] text-foreground-muted font-mono">{org.website}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground-muted font-mono">{org.email}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant={org.status === 'approved' ? 'success' : 'warning'} dot>
                      {org.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-foreground-muted font-mono">
                    {org.date}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {org.status === 'pending' && (
                        <>
                          <Button 
                            variant="primary" 
                            className="h-8 px-3 text-xs" 
                            onClick={() => handleStatusChange(org.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="danger" 
                            className="h-8 px-3 text-xs"
                            onClick={() => handleStatusChange(org.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {org.status === 'approved' && (
                        <Button variant="ghost" className="h-8 px-3 text-xs text-red-400">Suspend</Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </Card>

      {/* Security Footer */}
      <div className="flex items-center gap-2 justify-center text-[10px] text-foreground-subtle uppercase tracking-[0.2em]">
        <ShieldCheck size={12} className="text-accent" /> Secure Admin Session • BhoomiNet Protocol 
      </div>
    </div>
  );
};

// Helper Stat Component
const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 flex items-center gap-3">
    <div className={`${color} bg-white/[0.05] p-2 rounded-lg`}>{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] text-foreground-subtle uppercase font-mono tracking-tighter">{label}</span>
      <span className="text-lg font-semibold leading-none">{value}</span>
    </div>
  </div>
);

export default Admin;