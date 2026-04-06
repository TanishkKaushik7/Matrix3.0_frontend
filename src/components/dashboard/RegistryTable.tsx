import React, { useState } from 'react';
import { Search, ExternalLink, ShieldCheck, FileText, Download, Filter } from 'lucide-react';
import Card from '../ui/Card';

const RegistryTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with API fetch later
  const certificates = [
    { id: 'GBU-CS-2024-001', name: 'Akshit Kumar', course: 'B.Tech CS', date: '2024-03-15', hash: '0x7a2b...4e9d' },
    { id: 'GBU-CS-2024-002', name: 'Tanishk Sharma', course: 'B.Tech CS', date: '2024-03-14', hash: '0x1f9e...2b8c' },
    { id: 'GBU-ME-2024-042', name: 'Rahul Varma', course: 'B.Tech ME', date: '2024-03-10', hash: '0x9d4c...1f2a' },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#5E6AD2] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Filter by name, ID, or hash..."
            className="w-full bg-[#0A0A0C]/60 border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#5E6AD2]/50 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-4 py-3 bg-[#0A0A0C]/60 border border-white/[0.08] rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2">
          <Filter size={16} />
          <span className="text-xs font-medium">Filters</span>
        </button>
      </div>

      {/* Glassmorphic Table */}
      <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Student ID</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Name</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Course</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Issue Date</th>
              <th className="p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {certificates.map((cert) => (
              <tr key={cert.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <span className="text-sm font-mono text-slate-300 group-hover:text-[#5E6AD2] transition-colors">{cert.id}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5E6AD2]/10 flex items-center justify-center border border-[#5E6AD2]/20">
                      <FileText size={14} className="text-[#5E6AD2]" />
                    </div>
                    <span className="text-sm font-medium text-white">{cert.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-slate-400">{cert.course}</span>
                </td>
                <td className="p-4">
                  <span className="text-xs font-mono text-slate-500">{cert.date}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all title='Download IPFS Asset'">
                      <Download size={14} />
                    </button>
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${cert.hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 text-[#5E6AD2] text-[10px] font-bold uppercase tracking-widest hover:bg-[#5E6AD2]/20 transition-all"
                    >
                      Explorer
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State / Pagination Placeholder */}
        <div className="p-4 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
          <p className="text-[10px] font-mono text-slate-500">Showing 3 of 1,284 certificates</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white opacity-50 cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white hover:bg-white/10 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryTable;